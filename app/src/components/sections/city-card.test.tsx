import { describe, it, expect, beforeEach, vi } from "vitest";

const voteCityMock = vi.fn();
vi.mock("@/app/actions/city-vote", () => ({
  voteCity: (...args: unknown[]) => voteCityMock(...args),
}));

import { render, screen, waitFor } from "../../../test/helpers/render";
import {
  seoulWithWeather,
  busanWithWeather,
} from "../../../test/fixtures/cities";
import type { CityWithWeather } from "@/lib/database.types";
import { CityCard } from "./city-card";

// To observe `useOptimistic`'s mutated state the action must actually be
// pending — once it resolves React reverts to the canonical value. Tests
// that need to check the mid-flight count install a "hanging" promise with
// `voteCityMock.mockReturnValueOnce(new Promise(() => {}))`; the other
// tests keep the default `mockResolvedValue(undefined)` and assert on the
// dispatched call.

describe("<CityCard />", () => {
  beforeEach(() => {
    voteCityMock.mockReset();
    voteCityMock.mockResolvedValue(undefined);
  });

  it("renders the basic city info: name, english name, region, formatted cost, and rank", () => {
    render(<CityCard city={seoulWithWeather} />);

    expect(screen.getByText("서울")).toBeInTheDocument();
    expect(screen.getByText("(Seoul)")).toBeInTheDocument();
    expect(
      screen.getByText(`대한민국 · ${seoulWithWeather.region}`)
    ).toBeInTheDocument();
    // ₩ formatted using toLocaleString
    expect(screen.getByText("₩1,850,000/월")).toBeInTheDocument();
    // Rank badge
    expect(screen.getByText("#1")).toBeInTheDocument();
    // Internet speed
    expect(
      screen.getByText(`📶 ${seoulWithWeather.internet_speed}Mbps`)
    ).toBeInTheDocument();
  });

  it("renders weather temperature and AQI when city_weather is present", () => {
    render(<CityCard city={seoulWithWeather} />);

    // Seoul fixture: temp=9, emoji=☀️, aqi=72 (>50 => 😷)
    expect(screen.getByText(/☀️\s*9°C/)).toBeInTheDocument();
    expect(screen.getByText(/😷\s*AQI 72/)).toBeInTheDocument();
  });

  it("uses the 😊 face for AQI <= 50", () => {
    render(<CityCard city={busanWithWeather} />);
    // Busan fixture: aqi=45 -> 😊
    expect(screen.getByText(/😊\s*AQI 45/)).toBeInTheDocument();
  });

  it("hides weather info when city_weather is null", () => {
    const cityNoWeather: CityWithWeather = {
      ...seoulWithWeather,
      city_weather: null,
    };
    render(<CityCard city={cityNoWeather} />);

    expect(screen.queryByText(/°C/)).not.toBeInTheDocument();
    expect(screen.queryByText(/AQI/)).not.toBeInTheDocument();
  });

  it("hides the rank badge when rank is null", () => {
    const cityNoRank: CityWithWeather = {
      ...seoulWithWeather,
      rank: null,
    };
    render(<CityCard city={cityNoRank} />);

    // No #1, #2, etc. for rank badge
    expect(screen.queryByText(/^#\d+$/)).not.toBeInTheDocument();
    // Name should still render
    expect(screen.getByText("서울")).toBeInTheDocument();
  });

  it("applies active like styles to the 👍 button when initialVote='like'", () => {
    render(<CityCard city={seoulWithWeather} initialVote="like" />);

    const likeBtn = screen.getByRole("button", { name: "👍" });
    expect(likeBtn.className).toMatch(/text-blue-600/);
    expect(likeBtn.className).toMatch(/bg-blue-100/);

    // And the like count text uses the active color
    const likeCount = screen.getByText(String(seoulWithWeather.like_count));
    expect(likeCount.className).toMatch(/text-blue-600/);
  });

  it("applies active dislike styles to the 👎 button when initialVote='dislike'", () => {
    render(<CityCard city={seoulWithWeather} initialVote="dislike" />);

    const dislikeBtn = screen.getByRole("button", { name: "👎" });
    expect(dislikeBtn.className).toMatch(/text-red-600/);
    expect(dislikeBtn.className).toMatch(/bg-red-100/);

    const dislikeCount = screen.getByText(
      String(seoulWithWeather.dislike_count)
    );
    expect(dislikeCount.className).toMatch(/text-red-600/);
  });

  it("calls voteCity(cityId, 'like') when clicking 👍 with no prior vote", async () => {
    const { user } = render(
      <CityCard city={seoulWithWeather} initialVote="none" />
    );

    await user.click(screen.getByRole("button", { name: "👍" }));

    await waitFor(() => {
      expect(voteCityMock).toHaveBeenCalledTimes(1);
    });
    expect(voteCityMock).toHaveBeenCalledWith(seoulWithWeather.id, "like");
  });

  it("calls voteCity(cityId, 'clear') when clicking 👍 while already liked", async () => {
    const { user } = render(
      <CityCard city={seoulWithWeather} initialVote="like" />
    );

    await user.click(screen.getByRole("button", { name: "👍" }));

    await waitFor(() => {
      expect(voteCityMock).toHaveBeenCalledTimes(1);
    });
    expect(voteCityMock).toHaveBeenCalledWith(seoulWithWeather.id, "clear");
  });

  it("calls voteCity(cityId, 'like') when switching from dislike to like", async () => {
    const { user } = render(
      <CityCard city={seoulWithWeather} initialVote="dislike" />
    );

    await user.click(screen.getByRole("button", { name: "👍" }));

    await waitFor(() => {
      expect(voteCityMock).toHaveBeenCalledTimes(1);
    });
    expect(voteCityMock).toHaveBeenCalledWith(seoulWithWeather.id, "like");
  });

  it("calls voteCity(cityId, 'dislike') when clicking 👎 with no prior vote", async () => {
    const { user } = render(
      <CityCard city={seoulWithWeather} initialVote="none" />
    );

    await user.click(screen.getByRole("button", { name: "👎" }));

    await waitFor(() => {
      expect(voteCityMock).toHaveBeenCalledTimes(1);
    });
    expect(voteCityMock).toHaveBeenCalledWith(seoulWithWeather.id, "dislike");
  });

  it("calls voteCity(cityId, 'clear') when clicking 👎 while already disliked", async () => {
    const { user } = render(
      <CityCard city={seoulWithWeather} initialVote="dislike" />
    );

    await user.click(screen.getByRole("button", { name: "👎" }));

    await waitFor(() => {
      expect(voteCityMock).toHaveBeenCalledTimes(1);
    });
    expect(voteCityMock).toHaveBeenCalledWith(seoulWithWeather.id, "clear");
  });

  it("wraps the card in a <Link> to /city/[id] and preserves that href after vote interactions", async () => {
    const { user, container } = render(
      <CityCard city={seoulWithWeather} initialVote="none" />
    );

    const link = container.querySelector("a");
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe(`/city/${seoulWithWeather.id}`);

    // The button handlers call e.preventDefault() + e.stopPropagation() so
    // the Link's navigation should not be triggered. We can observe this
    // indirectly by confirming the anchor's href is still in place and the
    // element is still connected after a click.
    await user.click(screen.getByRole("button", { name: "👍" }));
    await waitFor(() => {
      expect(voteCityMock).toHaveBeenCalled();
    });
    expect(link?.getAttribute("href")).toBe(`/city/${seoulWithWeather.id}`);
    expect(link?.isConnected).toBe(true);
  });

  it("shows optimistic like count + active style while voteCity is pending (none → like)", async () => {
    voteCityMock.mockReturnValueOnce(new Promise<void>(() => {}));
    const { user } = render(
      <CityCard city={seoulWithWeather} initialVote="none" />
    );

    const expected = String(seoulWithWeather.like_count + 1);
    await user.click(screen.getByRole("button", { name: "👍" }));

    await waitFor(() => {
      expect(screen.getByText(expected)).toBeInTheDocument();
    });
    const likeBtn = screen.getByRole("button", { name: "👍" });
    expect(likeBtn.className).toMatch(/text-blue-600/);
  });

  it("optimistically decrements the like count when toggling off (like → clear)", async () => {
    voteCityMock.mockReturnValueOnce(new Promise<void>(() => {}));
    const { user } = render(
      <CityCard city={seoulWithWeather} initialVote="like" />
    );

    const expected = String(seoulWithWeather.like_count - 1);
    await user.click(screen.getByRole("button", { name: "👍" }));

    await waitFor(() => {
      expect(screen.getByText(expected)).toBeInTheDocument();
    });
    const likeBtn = screen.getByRole("button", { name: "👍" });
    expect(likeBtn.className).not.toMatch(/text-blue-600/);
  });

  it("optimistically swaps counts when switching from dislike to like", async () => {
    voteCityMock.mockReturnValueOnce(new Promise<void>(() => {}));
    const { user } = render(
      <CityCard city={seoulWithWeather} initialVote="dislike" />
    );

    await user.click(screen.getByRole("button", { name: "👍" }));

    await waitFor(() => {
      expect(
        screen.getByText(String(seoulWithWeather.like_count + 1))
      ).toBeInTheDocument();
      expect(
        screen.getByText(String(seoulWithWeather.dislike_count - 1))
      ).toBeInTheDocument();
    });
    const likeBtn = screen.getByRole("button", { name: "👍" });
    const dislikeBtn = screen.getByRole("button", { name: "👎" });
    expect(likeBtn.className).toMatch(/text-blue-600/);
    expect(dislikeBtn.className).not.toMatch(/text-red-600/);
  });

  it("renders the tag-like metadata: budget, area, environment (joined), and best_season (joined)", () => {
    render(<CityCard city={seoulWithWeather} />);

    expect(screen.getByText(seoulWithWeather.budget)).toBeInTheDocument();
    expect(screen.getByText(seoulWithWeather.area)).toBeInTheDocument();
    expect(
      screen.getByText(seoulWithWeather.environment.join(", "))
    ).toBeInTheDocument();
    expect(
      screen.getByText(seoulWithWeather.best_season.join(", "))
    ).toBeInTheDocument();
  });
});
