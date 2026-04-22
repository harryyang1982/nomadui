import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import {
  makeSupabaseClient,
  type SupabaseClientMock,
} from "../../test/helpers/supabase-mock";
import {
  citiesWithWeather,
  seoulWithWeather,
} from "../../test/fixtures/cities";
import { reviews } from "../../test/fixtures/reviews";

// `queries.ts` has `import "server-only"` at the top, which throws when
// imported outside of a React server context. Stub it out so the module is
// loadable under Vitest.
vi.mock("server-only", () => ({}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/utils/supabase/server";
import {
  getCities,
  getCityById,
  getReviewsByCity,
  getRecentReviews,
  getPressQuotes,
  getCurrentUser,
} from "@/lib/queries";

const createClientMock = createClient as unknown as Mock;

function setClient(client: SupabaseClientMock) {
  createClientMock.mockResolvedValue(client);
}

beforeEach(() => {
  createClientMock.mockReset();
});

describe("getCities", () => {
  it("queries cities with weather, orders by rank, and uses default limit", async () => {
    const client = makeSupabaseClient({
      from: {
        cities: {
          select: { data: citiesWithWeather, error: null },
        },
      },
    });
    setClient(client);

    const result = await getCities();

    expect(result).toEqual(citiesWithWeather);
    expect(client.from).toHaveBeenCalledWith("cities");
    expect(client.calls.cities.select[0][0]).toBe("*, city_weather(*)");
    expect(client.calls.cities.order[0]).toEqual([
      "rank",
      { ascending: true, nullsFirst: false },
    ]);
    expect(client.calls.cities.limit[0]).toEqual([48]);
    expect(client.calls.cities.eq).toBeUndefined();
    expect(client.calls.cities.contains).toBeUndefined();
  });

  it("applies budget filter via .eq(budget, …)", async () => {
    const client = makeSupabaseClient({
      from: {
        cities: { select: { data: [seoulWithWeather], error: null } },
      },
    });
    setClient(client);

    await getCities({ budget: "200만원 이상" });

    expect(client.calls.cities.eq).toEqual([["budget", "200만원 이상"]]);
  });

  it("applies area filter via .eq(area, …)", async () => {
    const client = makeSupabaseClient({
      from: {
        cities: { select: { data: citiesWithWeather, error: null } },
      },
    });
    setClient(client);

    await getCities({ area: "수도권" });

    expect(client.calls.cities.eq).toEqual([["area", "수도권"]]);
  });

  it("applies environment filter via .contains(environment, [value])", async () => {
    const client = makeSupabaseClient({
      from: {
        cities: { select: { data: citiesWithWeather, error: null } },
      },
    });
    setClient(client);

    await getCities({ environment: "카페작업" });

    expect(client.calls.cities.contains).toEqual([
      ["environment", ["카페작업"]],
    ]);
  });

  it("applies bestSeason filter via .contains(best_season, [value])", async () => {
    const client = makeSupabaseClient({
      from: {
        cities: { select: { data: citiesWithWeather, error: null } },
      },
    });
    setClient(client);

    await getCities({ bestSeason: "가을" });

    expect(client.calls.cities.contains).toEqual([["best_season", ["가을"]]]);
  });

  it("composes every filter in order (budget, area, environment, bestSeason)", async () => {
    const client = makeSupabaseClient({
      from: {
        cities: { select: { data: [seoulWithWeather], error: null } },
      },
    });
    setClient(client);

    await getCities({
      budget: "200만원 이상",
      area: "수도권",
      environment: "카페작업",
      bestSeason: "봄",
    });

    expect(client.calls.cities.eq).toEqual([
      ["budget", "200만원 이상"],
      ["area", "수도권"],
    ]);
    expect(client.calls.cities.contains).toEqual([
      ["environment", ["카페작업"]],
      ["best_season", ["봄"]],
    ]);
  });

  it("forwards a custom limit", async () => {
    const client = makeSupabaseClient({
      from: {
        cities: { select: { data: citiesWithWeather, error: null } },
      },
    });
    setClient(client);

    await getCities({}, 12);

    expect(client.calls.cities.limit[0]).toEqual([12]);
  });

  it("returns an empty array when supabase returns null data", async () => {
    const client = makeSupabaseClient({
      from: {
        cities: { select: { data: null, error: null } },
      },
    });
    setClient(client);

    await expect(getCities()).resolves.toEqual([]);
  });

  it("throws when supabase returns an error", async () => {
    const client = makeSupabaseClient({
      from: {
        cities: {
          select: { data: null, error: { message: "boom", code: "42P01" } },
        },
      },
    });
    setClient(client);

    await expect(getCities()).rejects.toMatchObject({ message: "boom" });
  });
});

describe("getCityById", () => {
  it("returns the row for a given id via maybeSingle()", async () => {
    const client = makeSupabaseClient({
      from: {
        cities: {
          select: { data: [seoulWithWeather], error: null },
        },
      },
    });
    setClient(client);

    const result = await getCityById(seoulWithWeather.id);

    expect(result).toEqual(seoulWithWeather);
    expect(client.calls.cities.select[0][0]).toBe("*, city_weather(*)");
    expect(client.calls.cities.eq).toEqual([["id", seoulWithWeather.id]]);
    expect(client.calls.cities.maybeSingle).toEqual([[]]);
  });

  it("returns null when maybeSingle() yields no row", async () => {
    const client = makeSupabaseClient({
      from: {
        cities: {
          select: { data: [], error: null },
        },
      },
    });
    setClient(client);

    const result = await getCityById("missing-id");

    expect(result).toBeNull();
    expect(client.calls.cities.eq).toEqual([["id", "missing-id"]]);
  });

  it("throws when supabase returns an error", async () => {
    const client = makeSupabaseClient({
      from: {
        cities: {
          single: { data: null, error: { message: "nope" } },
          select: { data: null, error: { message: "nope" } },
        },
      },
    });
    setClient(client);

    await expect(getCityById("abc")).rejects.toMatchObject({ message: "nope" });
  });
});

describe("getReviewsByCity", () => {
  it("queries reviews with profiles join, filtered by city_id, ordered by created_at desc", async () => {
    const client = makeSupabaseClient({
      from: {
        reviews: { select: { data: reviews, error: null } },
      },
    });
    setClient(client);

    const result = await getReviewsByCity(
      "11111111-1111-1111-1111-000000000001"
    );

    expect(result).toEqual(reviews);
    expect(client.from).toHaveBeenCalledWith("reviews");
    expect(client.calls.reviews.select[0][0]).toBe(
      "*, profiles(username, avatar_url)"
    );
    expect(client.calls.reviews.eq).toEqual([
      ["city_id", "11111111-1111-1111-1111-000000000001"],
    ]);
    expect(client.calls.reviews.order[0]).toEqual([
      "created_at",
      { ascending: false },
    ]);
    expect(client.calls.reviews.limit[0]).toEqual([20]);
  });

  it("honors a custom limit", async () => {
    const client = makeSupabaseClient({
      from: {
        reviews: { select: { data: reviews, error: null } },
      },
    });
    setClient(client);

    await getReviewsByCity("city-x", 3);

    expect(client.calls.reviews.limit[0]).toEqual([3]);
  });
});

describe("getRecentReviews", () => {
  it("queries reviews with profiles + city join, ordered by created_at desc, default limit 6", async () => {
    const client = makeSupabaseClient({
      from: {
        reviews: { select: { data: reviews, error: null } },
      },
    });
    setClient(client);

    const result = await getRecentReviews();

    expect(result).toEqual(reviews);
    expect(client.calls.reviews.select[0][0]).toBe(
      "*, profiles(username, avatar_url), city:cities(name_ko)"
    );
    expect(client.calls.reviews.order[0]).toEqual([
      "created_at",
      { ascending: false },
    ]);
    expect(client.calls.reviews.limit[0]).toEqual([6]);
  });
});

describe("getPressQuotes", () => {
  it("queries press_quotes ordered by display_order ascending", async () => {
    const quotes = [
      {
        id: "pq-1",
        quote: "Korea's Nomad List",
        source: "KoreaHerald",
        display_order: 1,
        created_at: "2026-04-01T00:00:00.000Z",
      },
    ];
    const client = makeSupabaseClient({
      from: {
        press_quotes: { select: { data: quotes, error: null } },
      },
    });
    setClient(client);

    const result = await getPressQuotes();

    expect(result).toEqual(quotes);
    expect(client.from).toHaveBeenCalledWith("press_quotes");
    expect(client.calls.press_quotes.select[0][0]).toBe("*");
    expect(client.calls.press_quotes.order[0]).toEqual([
      "display_order",
      { ascending: true },
    ]);
  });

  it("returns an empty array when data is null", async () => {
    const client = makeSupabaseClient({
      from: {
        press_quotes: { select: { data: null, error: null } },
      },
    });
    setClient(client);

    await expect(getPressQuotes()).resolves.toEqual([]);
  });
});

describe("getCurrentUser", () => {
  it("returns whatever supabase.auth.getUser resolves with", async () => {
    const client = makeSupabaseClient({
      auth: {
        user: {
          id: "user-42",
          email: "user42@example.com",
          user_metadata: { avatar_url: "https://example.com/42.png" },
        },
      },
    });
    setClient(client);

    const user = await getCurrentUser();

    expect(user).toEqual({
      id: "user-42",
      email: "user42@example.com",
      user_metadata: { avatar_url: "https://example.com/42.png" },
    });
    expect(client.auth.getUser).toHaveBeenCalledTimes(1);
  });
});
