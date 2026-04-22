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
import { signInWithGoogle, login, signup } from "./actions";

const mockedCreateClient = createClient as unknown as ReturnType<typeof vi.fn>;

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

describe("signInWithGoogle", () => {
  beforeEach(() => {
    resetNextMocks();
    mockedCreateClient.mockReset();
  });

  it("passes the 'origin' header through untouched when it already begins with http", async () => {
    const { headersMap } = getNextMockState();
    headersMap.set("origin", "http://localhost:3000");

    const client = makeSupabaseClient({
      auth: {
        signInWithOAuth: {
          data: { url: "https://accounts.google.com/oauth", provider: "google" },
          error: null,
        },
      },
    });
    mockedCreateClient.mockResolvedValue(client);

    await expect(signInWithGoogle()).rejects.toThrow(/NEXT_REDIRECT/);

    expect(client.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  });

  it("falls back to x-forwarded-host and prefixes https:// when the value lacks a scheme", async () => {
    const { headersMap } = getNextMockState();
    // No "origin" header set; only x-forwarded-host, and it starts without http.
    headersMap.set("x-forwarded-host", "nomadui.vercel.app");

    const client = makeSupabaseClient({
      auth: {
        signInWithOAuth: {
          data: { url: "https://accounts.google.com/oauth", provider: "google" },
          error: null,
        },
      },
    });
    mockedCreateClient.mockResolvedValue(client);

    await expect(signInWithGoogle()).rejects.toThrow(/NEXT_REDIRECT/);

    expect(client.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: "https://nomadui.vercel.app/auth/callback",
      },
    });
  });

  it("redirects to /login?error=... when signInWithOAuth returns an error", async () => {
    const { headersMap } = getNextMockState();
    headersMap.set("origin", "https://nomadui.vercel.app");

    const client = makeSupabaseClient({
      auth: {
        signInWithOAuth: {
          data: null,
          error: { message: "OAuth provider unavailable" },
        },
      },
    });
    mockedCreateClient.mockResolvedValue(client);

    await expect(signInWithGoogle()).rejects.toThrow(/NEXT_REDIRECT/);

    const { redirect } = getNextMockState();
    expect(redirect).toHaveBeenCalledTimes(1);
    const target = redirect.mock.calls[0][0] as string;
    expect(target.startsWith("/login?error=")).toBe(true);
    expect(decodeURIComponent(target.split("error=")[1])).toBe(
      "OAuth provider unavailable"
    );
  });

  it("redirects to data.url when signInWithOAuth succeeds", async () => {
    const { headersMap } = getNextMockState();
    headersMap.set("origin", "https://nomadui.vercel.app");

    const oauthUrl =
      "https://accounts.google.com/o/oauth2/auth?client_id=xyz";
    const client = makeSupabaseClient({
      auth: {
        signInWithOAuth: {
          data: { url: oauthUrl, provider: "google" },
          error: null,
        },
      },
    });
    mockedCreateClient.mockResolvedValue(client);

    await expect(signInWithGoogle()).rejects.toThrow(/NEXT_REDIRECT/);

    const { redirect } = getNextMockState();
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith(oauthUrl);
  });
});

describe("login", () => {
  beforeEach(() => {
    resetNextMocks();
    mockedCreateClient.mockReset();
  });

  it("revalidates the layout and redirects to '/' on success", async () => {
    const client = makeSupabaseClient({
      auth: { signInWithPassword: { data: { user: {} }, error: null } },
    });
    mockedCreateClient.mockResolvedValue(client);

    const fd = makeFormData({
      email: "user@example.com",
      password: "hunter2",
    });

    await expect(login(fd)).rejects.toThrow(/NEXT_REDIRECT/);

    expect(client.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "hunter2",
    });

    const { redirect, revalidatePath } = getNextMockState();
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("redirects to /login?error=... when credentials are invalid and skips revalidate", async () => {
    const client = makeSupabaseClient({
      auth: {
        signInWithPassword: {
          data: null,
          error: { message: "Invalid login credentials" },
        },
      },
    });
    mockedCreateClient.mockResolvedValue(client);

    const fd = makeFormData({
      email: "user@example.com",
      password: "wrong",
    });

    await expect(login(fd)).rejects.toThrow(/NEXT_REDIRECT/);

    const { redirect, revalidatePath } = getNextMockState();
    expect(redirect).toHaveBeenCalledTimes(1);
    const target = redirect.mock.calls[0][0] as string;
    expect(target.startsWith("/login?error=")).toBe(true);
    expect(decodeURIComponent(target.split("error=")[1])).toBe(
      "Invalid login credentials"
    );
    // On the error branch we never reach revalidate/redirect("/").
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});

describe("signup", () => {
  beforeEach(() => {
    resetNextMocks();
    mockedCreateClient.mockReset();
  });

  it("redirects to /register?message=... with the verification hint on success", async () => {
    const client = makeSupabaseClient({
      auth: { signUp: { data: { user: {} }, error: null } },
    });
    mockedCreateClient.mockResolvedValue(client);

    const fd = makeFormData({
      email: "new@example.com",
      password: "hunter2",
    });

    await expect(signup(fd)).rejects.toThrow(/NEXT_REDIRECT/);

    expect(client.auth.signUp).toHaveBeenCalledWith({
      email: "new@example.com",
      password: "hunter2",
    });

    const { redirect, revalidatePath } = getNextMockState();
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    expect(redirect).toHaveBeenCalledTimes(1);
    const target = redirect.mock.calls[0][0] as string;
    expect(target.startsWith("/register?message=")).toBe(true);
    expect(decodeURIComponent(target.split("message=")[1])).toBe(
      "이메일을 확인해주세요."
    );
  });

  it("redirects to /register?error=... when signUp fails", async () => {
    const client = makeSupabaseClient({
      auth: {
        signUp: {
          data: null,
          error: { message: "User already registered" },
        },
      },
    });
    mockedCreateClient.mockResolvedValue(client);

    const fd = makeFormData({
      email: "dup@example.com",
      password: "hunter2",
    });

    await expect(signup(fd)).rejects.toThrow(/NEXT_REDIRECT/);

    const { redirect, revalidatePath } = getNextMockState();
    expect(redirect).toHaveBeenCalledTimes(1);
    const target = redirect.mock.calls[0][0] as string;
    expect(target.startsWith("/register?error=")).toBe(true);
    expect(decodeURIComponent(target.split("error=")[1])).toBe(
      "User already registered"
    );
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
