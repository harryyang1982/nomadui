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
import { makeSupabaseClient } from "../../../test/helpers/supabase-mock";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "./sign-out";

const mockedCreateClient = createClient as unknown as ReturnType<typeof vi.fn>;

describe("signOut", () => {
  beforeEach(() => {
    resetNextMocks();
    mockedCreateClient.mockReset();
  });

  it("calls supabase.auth.signOut exactly once", async () => {
    const client = makeSupabaseClient({
      auth: { signOut: { data: null, error: null } },
    });
    mockedCreateClient.mockResolvedValue(client);

    await expect(signOut()).rejects.toThrow(/NEXT_REDIRECT/);

    expect(client.auth.signOut).toHaveBeenCalledTimes(1);
  });

  it("revalidates '/' with the 'layout' option so nested layouts refresh", async () => {
    const client = makeSupabaseClient({
      auth: { signOut: { data: null, error: null } },
    });
    mockedCreateClient.mockResolvedValue(client);

    await expect(signOut()).rejects.toThrow(/NEXT_REDIRECT/);

    const { revalidatePath } = getNextMockState();
    expect(revalidatePath).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("redirects the user back to '/' after signing out", async () => {
    const client = makeSupabaseClient({
      auth: { signOut: { data: null, error: null } },
    });
    mockedCreateClient.mockResolvedValue(client);

    await expect(signOut()).rejects.toThrow(/NEXT_REDIRECT/);

    const { redirect } = getNextMockState();
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/");
  });
});
