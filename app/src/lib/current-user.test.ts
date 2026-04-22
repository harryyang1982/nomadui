import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import {
  makeSupabaseClient,
  type SupabaseClientMock,
} from "../../test/helpers/supabase-mock";
import { authUser, profileRow } from "../../test/fixtures/profiles";

// `current-user.ts` imports `"server-only"`, which throws when imported
// outside of a React server context. Stub it so the module is loadable
// under Vitest.
vi.mock("server-only", () => ({}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/utils/supabase/server";
import { getNavbarUser } from "@/lib/current-user";

const createClientMock = createClient as unknown as Mock;

function setClient(client: SupabaseClientMock) {
  createClientMock.mockResolvedValue(client);
}

beforeEach(() => {
  createClientMock.mockReset();
});

describe("getNavbarUser", () => {
  it("returns null when no auth user is signed in", async () => {
    const client = makeSupabaseClient({ auth: { user: null } });
    setClient(client);

    const result = await getNavbarUser();

    expect(result).toBeNull();
    expect(client.auth.getUser).toHaveBeenCalledTimes(1);
    // Should short-circuit before touching the profiles table.
    expect(client.from).not.toHaveBeenCalled();
  });

  it("returns username and avatar_url from the profile row", async () => {
    const client = makeSupabaseClient({
      auth: { user: authUser },
      from: {
        profiles: {
          select: { data: [profileRow], error: null },
        },
      },
    });
    setClient(client);

    const result = await getNavbarUser();

    expect(result).toEqual({
      email: authUser.email,
      username: profileRow.username,
      avatar_url: profileRow.avatar_url,
    });
    expect(client.from).toHaveBeenCalledWith("profiles");
    expect(client.calls.profiles.select[0][0]).toBe("username, avatar_url");
    expect(client.calls.profiles.eq).toEqual([["id", authUser.id]]);
    expect(client.calls.profiles.maybeSingle).toEqual([[]]);
  });

  it("falls back to user_metadata.avatar_url when the profile is missing", async () => {
    const client = makeSupabaseClient({
      auth: { user: authUser },
      from: {
        profiles: {
          // maybeSingle will see an empty array and return { data: null }
          select: { data: [], error: null },
        },
      },
    });
    setClient(client);

    const result = await getNavbarUser();

    expect(result).toEqual({
      email: authUser.email,
      username: null,
      avatar_url: authUser.user_metadata?.avatar_url,
    });
  });

  it("returns avatar_url = null when neither the profile nor user_metadata has one", async () => {
    const client = makeSupabaseClient({
      auth: {
        user: { id: "user-2", email: "no-avatar@example.com" },
      },
      from: {
        profiles: {
          select: { data: [], error: null },
        },
      },
    });
    setClient(client);

    const result = await getNavbarUser();

    expect(result).toEqual({
      email: "no-avatar@example.com",
      username: null,
      avatar_url: null,
    });
  });

  it("preserves the user's email on the returned NavbarUser", async () => {
    const client = makeSupabaseClient({
      auth: {
        user: {
          id: "user-3",
          email: "email-preserved@example.com",
          user_metadata: {},
        },
      },
      from: {
        profiles: {
          select: {
            data: [
              {
                ...profileRow,
                id: "user-3",
                username: "preserved",
                avatar_url: "https://example.com/preserved.png",
              },
            ],
            error: null,
          },
        },
      },
    });
    setClient(client);

    const result = await getNavbarUser();

    expect(result?.email).toBe("email-preserved@example.com");
    expect(result?.username).toBe("preserved");
    expect(result?.avatar_url).toBe("https://example.com/preserved.png");
  });

  it("prefers the profile avatar_url over user_metadata.avatar_url", async () => {
    const client = makeSupabaseClient({
      auth: {
        user: {
          id: authUser.id,
          email: authUser.email,
          user_metadata: { avatar_url: "https://example.com/from-oauth.png" },
        },
      },
      from: {
        profiles: {
          select: {
            data: [
              {
                ...profileRow,
                avatar_url: "https://example.com/from-profile.png",
              },
            ],
            error: null,
          },
        },
      },
    });
    setClient(client);

    const result = await getNavbarUser();

    expect(result?.avatar_url).toBe("https://example.com/from-profile.png");
  });

  it("returns null email when the auth user's email is missing", async () => {
    const client = makeSupabaseClient({
      auth: {
        user: { id: "user-4", email: null, user_metadata: {} },
      },
      from: {
        profiles: {
          select: { data: [], error: null },
        },
      },
    });
    setClient(client);

    const result = await getNavbarUser();

    expect(result).toEqual({
      email: null,
      username: null,
      avatar_url: null,
    });
  });
});
