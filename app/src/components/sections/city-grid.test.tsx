import { describe, it, expect, beforeEach, vi } from "vitest";

const voteCityMock = vi.fn();
vi.mock("@/app/actions/city-vote", () => ({
  voteCity: (...args: unknown[]) => voteCityMock(...args),
}));

import { render, screen, within } from "../../../test/helpers/render";
import {
  seoulWithWeather,
  busanWithWeather,
  gangneungWithWeather,
  citiesWithWeather,
} from "../../../test/fixtures/cities";
import { CityGrid } from "./city-grid";

describe("<CityGrid />", () => {
  beforeEach(() => {
    voteCityMock.mockReset();
    voteCityMock.mockResolvedValue(undefined);
  });

  it("always renders the '도시 리스트' heading", () => {
    render(<CityGrid cities={[]} />);
    expect(
      screen.getByRole("heading", { name: "도시 리스트" })
    ).toBeInTheDocument();
  });

  it("renders the empty-state message when cities is an empty array", () => {
    render(<CityGrid cities={[]} />);

    expect(
      screen.getByText(/조건에 맞는 도시가 없어요/)
    ).toBeInTheDocument();
    // "더 많은 도시 보기" should NOT be rendered in empty state
    expect(
      screen.queryByRole("button", { name: /더 많은 도시 보기/ })
    ).not.toBeInTheDocument();
  });

  it("renders one CityCard per city (identified by its Link href)", () => {
    const { container } = render(<CityGrid cities={citiesWithWeather} />);

    // Each card is wrapped in an <a href="/city/{id}">.
    const cityLinks = container.querySelectorAll('a[href^="/city/"]');
    expect(cityLinks).toHaveLength(citiesWithWeather.length);

    // Sanity: the rendered names appear
    expect(screen.getByText("서울")).toBeInTheDocument();
    expect(screen.getByText("부산")).toBeInTheDocument();
    expect(screen.getByText("강릉")).toBeInTheDocument();
  });

  it("renders the '더 많은 도시 보기' load-more button when there are cities", () => {
    render(<CityGrid cities={citiesWithWeather} />);

    expect(
      screen.getByRole("button", { name: /더 많은 도시 보기/ })
    ).toBeInTheDocument();
  });

  it("passes userVotes through to each CityCard so the initial vote state is reflected", () => {
    const userVotes: Record<string, "like" | "dislike"> = {
      [seoulWithWeather.id]: "like",
      [busanWithWeather.id]: "dislike",
      // gangneung left out -> defaults to "none"
    };

    const { container } = render(
      <CityGrid cities={citiesWithWeather} userVotes={userVotes} />
    );

    const seoulLink = container.querySelector(
      `a[href="/city/${seoulWithWeather.id}"]`
    ) as HTMLElement | null;
    const busanLink = container.querySelector(
      `a[href="/city/${busanWithWeather.id}"]`
    ) as HTMLElement | null;
    const gangneungLink = container.querySelector(
      `a[href="/city/${gangneungWithWeather.id}"]`
    ) as HTMLElement | null;

    expect(seoulLink).not.toBeNull();
    expect(busanLink).not.toBeNull();
    expect(gangneungLink).not.toBeNull();

    // Seoul card -> like active styling on 👍
    const seoulLike = within(seoulLink!).getByRole("button", { name: "👍" });
    expect(seoulLike.className).toMatch(/text-blue-600/);
    expect(seoulLike.className).toMatch(/bg-blue-100/);

    // Busan card -> dislike active styling on 👎
    const busanDislike = within(busanLink!).getByRole("button", {
      name: "👎",
    });
    expect(busanDislike.className).toMatch(/text-red-600/);
    expect(busanDislike.className).toMatch(/bg-red-100/);

    // Gangneung card -> neither button should be in active color
    const gangneungLike = within(gangneungLink!).getByRole("button", {
      name: "👍",
    });
    const gangneungDislike = within(gangneungLink!).getByRole("button", {
      name: "👎",
    });
    expect(gangneungLike.className).not.toMatch(/bg-blue-100/);
    expect(gangneungDislike.className).not.toMatch(/bg-red-100/);
  });
});
