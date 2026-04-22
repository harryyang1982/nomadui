import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("next/navigation", async () => {
  const { nextNavigationFactory } = await import(
    "../../../test/helpers/next-mocks"
  );
  return nextNavigationFactory();
});
vi.mock("next/cache", async () => {
  const { nextCacheFactory } = await import(
    "../../../test/helpers/next-mocks"
  );
  return nextCacheFactory();
});
vi.mock("next/headers", async () => {
  const { nextHeadersFactory } = await import(
    "../../../test/helpers/next-mocks"
  );
  return nextHeadersFactory();
});

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { getNextMockState, resetNextMocks } from "../../../test/helpers/next-mocks";
import {
  makeSupabaseClient,
  type AuthUser,
} from "../../../test/helpers/supabase-mock";
import { createClient } from "@/utils/supabase/server";
import { voteCity } from "./city-vote";

const mockedCreateClient = createClient as unknown as ReturnType<typeof vi.fn>;

const sampleUser: AuthUser = {
  id: "user-123",
  email: "tester@example.com",
};

describe("voteCity", () => {
  beforeEach(() => {
    resetNextMocks();
    mockedCreateClient.mockReset();
  });

  it("redirects unauthenticated users to /login with the expected error message", async () => {
    const client = makeSupabaseClient({ auth: { user: null } });
    mockedCreateClient.mockResolvedValue(client);

    await expect(voteCity("seoul", "like")).rejects.toThrow(/NEXT_REDIRECT/);

    const { redirect, revalidatePath } = getNextMockState();
    expect(redirect).toHaveBeenCalledTimes(1);
    const redirectArg = redirect.mock.calls[0][0] as string;
    expect(redirectArg).toContain("/login?error=");
    expect(decodeURIComponent(redirectArg.split("error=")[1])).toBe(
      "로그인 후 투표할 수 있어요."
    );
    // Should not have touched any DB table or revalidated anything.
    expect(client.from).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("upserts a +1 vote when direction is 'like'", async () => {
    const client = makeSupabaseClient({
      auth: { user: sampleUser },
      from: { city_votes: { upsert: { data: null, error: null } } },
    });
    mockedCreateClient.mockResolvedValue(client);

    await voteCity("seoul", "like");

    expect(client.from).toHaveBeenCalledWith("city_votes");
    const upsertCalls = client.calls.city_votes?.upsert ?? [];
    expect(upsertCalls).toHaveLength(1);
    const [payload, options] = upsertCalls[0];
    expect(payload).toEqual({
      city_id: "seoul",
      user_id: sampleUser.id,
      vote: 1,
    });
    expect(options).toEqual({ onConflict: "city_id,user_id" });
    // delete should not have been invoked.
    expect(client.calls.city_votes?.delete).toBeUndefined();
  });

  it("upserts a -1 vote when direction is 'dislike'", async () => {
    const client = makeSupabaseClient({
      auth: { user: sampleUser },
      from: { city_votes: { upsert: { data: null, error: null } } },
    });
    mockedCreateClient.mockResolvedValue(client);

    await voteCity("busan", "dislike");

    const upsertCalls = client.calls.city_votes?.upsert ?? [];
    expect(upsertCalls).toHaveLength(1);
    const [payload, options] = upsertCalls[0];
    expect(payload).toEqual({
      city_id: "busan",
      user_id: sampleUser.id,
      vote: -1,
    });
    expect(options).toEqual({ onConflict: "city_id,user_id" });
  });

  it("deletes the vote row filtered by city_id + user_id when direction is 'clear'", async () => {
    const client = makeSupabaseClient({
      auth: { user: sampleUser },
      from: { city_votes: { delete: { data: null, error: null } } },
    });
    mockedCreateClient.mockResolvedValue(client);

    await voteCity("jeju", "clear");

    expect(client.from).toHaveBeenCalledWith("city_votes");
    expect(client.calls.city_votes?.delete).toHaveLength(1);
    const eqCalls = client.calls.city_votes?.eq ?? [];
    expect(eqCalls).toEqual(
      expect.arrayContaining([
        ["city_id", "jeju"],
        ["user_id", sampleUser.id],
      ])
    );
    // upsert should not have been called.
    expect(client.calls.city_votes?.upsert).toBeUndefined();
  });

  it("revalidates both '/' and the city detail path after a successful write", async () => {
    const client = makeSupabaseClient({
      auth: { user: sampleUser },
      from: { city_votes: { upsert: { data: null, error: null } } },
    });
    mockedCreateClient.mockResolvedValue(client);

    await voteCity("gyeongju", "like");

    const { revalidatePath } = getNextMockState();
    expect(revalidatePath).toHaveBeenCalledTimes(2);
    expect(revalidatePath).toHaveBeenNthCalledWith(1, "/");
    expect(revalidatePath).toHaveBeenNthCalledWith(2, "/city/gyeongju");
  });

  it("also revalidates both paths when the 'clear' branch runs", async () => {
    const client = makeSupabaseClient({
      auth: { user: sampleUser },
      from: { city_votes: { delete: { data: null, error: null } } },
    });
    mockedCreateClient.mockResolvedValue(client);

    await voteCity("incheon", "clear");

    const { revalidatePath } = getNextMockState();
    expect(revalidatePath).toHaveBeenCalledTimes(2);
    expect(revalidatePath).toHaveBeenNthCalledWith(1, "/");
    expect(revalidatePath).toHaveBeenNthCalledWith(2, "/city/incheon");
  });
});
