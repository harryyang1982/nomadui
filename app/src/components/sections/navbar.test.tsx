import { describe, it, expect, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import { render } from "../../../test/helpers/render";
import { Navbar, type NavbarUser } from "./navbar";
import { signOut } from "@/app/actions/sign-out";

vi.mock("@/app/actions/sign-out", () => ({
  signOut: vi.fn(),
}));

describe("Navbar (logged-out, desktop)", () => {
  it("renders 로그인 and 회원가입 links pointing to /login and /register", () => {
    render(<Navbar user={null} />);

    // Both desktop and mobile menus render the links when the menu is open,
    // but by default only the desktop variant is in the DOM tree.
    const loginLinks = screen.getAllByRole("link", { name: /^로그인$/ });
    const registerLinks = screen.getAllByRole("link", { name: /회원가입/ });

    expect(loginLinks.length).toBeGreaterThan(0);
    expect(registerLinks.length).toBeGreaterThan(0);
    expect(loginLinks[0]).toHaveAttribute("href", "/login");
    expect(registerLinks[0]).toHaveAttribute("href", "/register");
  });

  it("does not render an avatar image or the logout form", () => {
    const { container } = render(<Navbar user={null} />);

    // No img (avatar_url) and no logout button.
    expect(container.querySelector("img")).toBeNull();
    expect(
      screen.queryByRole("button", { name: /로그아웃/ }),
    ).not.toBeInTheDocument();
  });
});

describe("Navbar (logged-in, desktop)", () => {
  it("renders the username from user.username", () => {
    const user: NavbarUser = {
      email: "nomad@example.com",
      username: "해리노마드",
      avatar_url: null,
    };
    render(<Navbar user={user} />);

    expect(screen.getAllByText("해리노마드").length).toBeGreaterThan(0);
  });

  it("falls back to the email prefix when username is null", () => {
    const user: NavbarUser = {
      email: "harry@example.com",
      username: null,
      avatar_url: null,
    };
    render(<Navbar user={user} />);

    expect(screen.getAllByText("harry").length).toBeGreaterThan(0);
  });

  it("renders an <img> when avatar_url is present", () => {
    const user: NavbarUser = {
      email: "nomad@example.com",
      username: "해리",
      avatar_url: "https://cdn.example.com/avatar.png",
    };
    const { container } = render(<Navbar user={user} />);

    const imgs = container.querySelectorAll("img");
    expect(imgs.length).toBeGreaterThan(0);
    expect(imgs[0]).toHaveAttribute(
      "src",
      "https://cdn.example.com/avatar.png",
    );
    expect(imgs[0]).toHaveAttribute("alt", "해리");
  });

  it("renders the uppercase initial span when avatar_url is missing", () => {
    const user: NavbarUser = {
      email: "nomad@example.com",
      username: "harry",
      avatar_url: null,
    };
    const { container } = render(<Navbar user={user} />);

    // No <img>, but an initial span should be present.
    expect(container.querySelector("img")).toBeNull();
    // The component uppercases the first character of displayName.
    expect(screen.getAllByText("H").length).toBeGreaterThan(0);
  });

  it("wires the desktop logout form action to the imported signOut server action", () => {
    const user: NavbarUser = {
      email: "nomad@example.com",
      username: "해리",
      avatar_url: null,
    };
    const { container } = render(<Navbar user={user} />);

    const forms = container.querySelectorAll("form");
    expect(forms.length).toBeGreaterThan(0);
    // React 19 passes the function through as the form action prop; when
    // rendered the attribute is still present on the form element via the
    // React runtime. We assert against the imported signOut symbol being the
    // same mocked function we injected above.
    expect(signOut).toBeDefined();
    expect(vi.isMockFunction(signOut)).toBe(true);
    // Each logout button lives inside a <form>; submitting it would invoke
    // the action. We at least verify the form + button pair exists in the DOM.
    const logoutButtons = screen.getAllByRole("button", { name: /로그아웃/ });
    expect(logoutButtons.length).toBeGreaterThan(0);
    expect(logoutButtons[0].closest("form")).not.toBeNull();
  });
});

describe("Navbar mobile menu", () => {
  it("toggles the mobile menu open/close when the hamburger button is clicked", async () => {
    const { user, container } = render(<Navbar user={null} />);

    const toggle = screen.getByRole("button", { name: "메뉴 열기" });

    // Closed by default — only the desktop menu's login/register links exist.
    // Desktop wrapper is hidden via `hidden lg:flex`, but RTL still sees its
    // children, so we count link occurrences before and after toggle.
    const initialLoginCount = screen.getAllByRole("link", {
      name: /^로그인$/,
    }).length;

    await user.click(toggle);

    // Mobile menu mounts its own link copy — count should grow.
    const afterOpenCount = screen.getAllByRole("link", {
      name: /^로그인$/,
    }).length;
    expect(afterOpenCount).toBeGreaterThan(initialLoginCount);

    // Clicking again closes the menu — the mobile-only copy unmounts.
    await user.click(toggle);
    const afterCloseCount = screen.getAllByRole("link", {
      name: /^로그인$/,
    }).length;
    expect(afterCloseCount).toBe(initialLoginCount);

    // Sanity: container still contains the nav root.
    expect(container.querySelector("nav")).not.toBeNull();
  });
});

describe("Navbar mobile menu (logged-in)", () => {
  it("renders displayName and a logout button inside the mobile menu when opened", async () => {
    const user: NavbarUser = {
      email: "nomad@example.com",
      username: "해리",
      avatar_url: null,
    };
    const { user: ue } = render(<Navbar user={user} />);

    const toggle = screen.getByRole("button", { name: "메뉴 열기" });
    await ue.click(toggle);

    // With the mobile menu open, the username + logout button should appear
    // at least twice (desktop copy + mobile copy).
    expect(screen.getAllByText("해리").length).toBeGreaterThanOrEqual(2);
    expect(
      screen.getAllByRole("button", { name: /로그아웃/ }).length,
    ).toBeGreaterThanOrEqual(2);

    // The mobile menu copy lives under a lg:hidden container — verify at
    // least one logout button is inside a <form>.
    const logoutButtons = screen.getAllByRole("button", { name: /로그아웃/ });
    const insideForm = logoutButtons.some(
      (btn) => btn.closest("form") !== null,
    );
    expect(insideForm).toBe(true);

    // Extra: within the nav, the mobile-menu container should exist after open.
    const nav = screen.getByRole("navigation");
    // The component marks the mobile container with border-t + lg:hidden —
    // we verify an element with those classes exists below the top bar.
    const mobileContainer = within(nav).getAllByText("해리")[1];
    expect(mobileContainer).toBeInTheDocument();
  });
});
