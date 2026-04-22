// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { makeSupabaseClient } from "../../../../test/helpers/supabase-mock";
import { createClient } from "@/utils/supabase/server";
import { GET } from "./route";

const mockedCreateClient = createClient as unknown as ReturnType<typeof vi.fn>;

describe("GET /auth/callback", () => {
  beforeEach(() => {
    mockedCreateClient.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("redirects to /login?error=oauth_failed when the code query param is missing", async () => {
    const req = new NextRequest("http://localhost:3000/auth/callback");

    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/login?error=oauth_failed"
    );
    // No supabase client should be constructed when there is no code.
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it("redirects to `origin + next` in development regardless of x-forwarded-host", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const client = makeSupabaseClient({
      auth: { exchangeCodeForSession: { data: { session: {} }, error: null } },
    });
    mockedCreateClient.mockResolvedValue(client);

    const req = new NextRequest(
      "http://localhost:3000/auth/callback?code=abc&next=/dashboard",
      { headers: { "x-forwarded-host": "nomadui.app" } }
    );

    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/dashboard"
    );
    expect(client.auth.exchangeCodeForSession).toHaveBeenCalledTimes(1);
    expect(client.auth.exchangeCodeForSession).toHaveBeenCalledWith("abc");
  });

  it("redirects to `https://<forwarded-host><next>` in production when x-forwarded-host is present", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const client = makeSupabaseClient({
      auth: { exchangeCodeForSession: { data: { session: {} }, error: null } },
    });
    mockedCreateClient.mockResolvedValue(client);

    const req = new NextRequest(
      "http://localhost:3000/auth/callback?code=abc&next=/dashboard",
      { headers: { "x-forwarded-host": "nomadui.app" } }
    );

    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "https://nomadui.app/dashboard"
    );
  });

  it("redirects to `origin + next` in production when x-forwarded-host is absent", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const client = makeSupabaseClient({
      auth: { exchangeCodeForSession: { data: { session: {} }, error: null } },
    });
    mockedCreateClient.mockResolvedValue(client);

    const req = new NextRequest(
      "https://konomad.app/auth/callback?code=abc&next=/dashboard"
    );

    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "https://konomad.app/dashboard"
    );
  });

  it("redirects to /login?error=oauth_failed when exchangeCodeForSession returns an error", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const client = makeSupabaseClient({
      auth: {
        exchangeCodeForSession: {
          data: null,
          error: { message: "bad code" },
        },
      },
    });
    mockedCreateClient.mockResolvedValue(client);

    const req = new NextRequest(
      "http://localhost:3000/auth/callback?code=bad&next=/dashboard"
    );

    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/login?error=oauth_failed"
    );
    expect(client.auth.exchangeCodeForSession).toHaveBeenCalledWith("bad");
  });

  it("defaults `next` to '/' when the query param is omitted", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const client = makeSupabaseClient({
      auth: { exchangeCodeForSession: { data: { session: {} }, error: null } },
    });
    mockedCreateClient.mockResolvedValue(client);

    const req = new NextRequest(
      "http://localhost:3000/auth/callback?code=abc"
    );

    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/");
  });
});
