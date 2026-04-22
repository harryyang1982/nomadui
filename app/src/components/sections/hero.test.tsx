import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "../../../test/helpers/render";
import { Hero } from "./hero";

describe("Hero (non-authenticated / default)", () => {
  it("renders the email input, 무료로 시작하기 CTA, and login hint", () => {
    render(<Hero />);

    // Email input with the expected placeholder.
    const email = screen.getByPlaceholderText("이메일을 입력하세요...");
    expect(email).toBeInTheDocument();
    expect(email).toHaveAttribute("type", "email");

    // CTA button.
    expect(
      screen.getByRole("button", { name: /무료로 시작하기/ }),
    ).toBeInTheDocument();

    // Hint copy shown only in the non-authenticated branch.
    expect(
      screen.getByText("이미 계정이 있으시면 로그인됩니다"),
    ).toBeInTheDocument();
  });
});

describe("Hero (authenticated)", () => {
  it("hides the email CTA block when isAuthenticated is true", () => {
    render(<Hero isAuthenticated />);

    expect(
      screen.queryByPlaceholderText("이메일을 입력하세요..."),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /무료로 시작하기/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("이미 계정이 있으시면 로그인됩니다"),
    ).not.toBeInTheDocument();
  });
});

describe("Hero (shared chrome)", () => {
  it("always renders the community badge (independent of auth state)", () => {
    const { unmount } = render(<Hero />);
    expect(
      screen.getByText(/#1 한국 디지털 노마드 커뮤니티 Since 2026/),
    ).toBeInTheDocument();
    unmount();

    render(<Hero isAuthenticated />);
    expect(
      screen.getByText(/#1 한국 디지털 노마드 커뮤니티 Since 2026/),
    ).toBeInTheDocument();
  });

  it("always renders the member avatar strip with the +2k badge", () => {
    const { unmount } = render(<Hero />);
    expect(screen.getByText("+2k")).toBeInTheDocument();
    unmount();

    render(<Hero isAuthenticated />);
    expect(screen.getByText("+2k")).toBeInTheDocument();
  });
});
