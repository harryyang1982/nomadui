// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { makeSupabaseClient } from "../../../../test/helpers/supabase-mock";
import { createClient } from "@/utils/supabase/server";
import { GET } from "./route";

const mockedCreateClient = createClient as unknown as ReturnType<typeof vi.fn>;

describe("GET /auth/confirm", () => {
  beforeEach(() => {
    mockedCreateClient.mockReset();
  });

  it("redirects to /auth/auth-code-error when token_hash and type are missing", async () => {
    const req = new NextRequest("http://localhost:3000/auth/confirm");

    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/auth/auth-code-error"
    );
    // verifyOtp should never run without token_hash/type.
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it("redirects to '/' when verifyOtp succeeds and `next` is not provided", async () => {
    const client = makeSupabaseClient({
      auth: { verifyOtp: { data: { user: { id: "u1" } }, error: null } },
    });
    mockedCreateClient.mockResolvedValue(client);

    const req = new NextRequest(
      "http://localhost:3000/auth/confirm?token_hash=abc&type=signup"
    );

    const res = await GET(req);

    expect(res.status).toBe(307);
    // Route swaps the pathname on a cloned nextUrl, so query params from the
    // incoming request are preserved on the redirect target. Assert on
    // origin+pathname only.
    const location = new URL(res.headers.get("location") ?? "");
    expect(location.origin).toBe("http://localhost:3000");
    expect(location.pathname).toBe("/");
    expect(client.auth.verifyOtp).toHaveBeenCalledTimes(1);
    expect(client.auth.verifyOtp).toHaveBeenCalledWith({
      type: "signup",
      token_hash: "abc",
    });
  });

  it("redirects to the supplied `next` path when verifyOtp succeeds", async () => {
    const client = makeSupabaseClient({
      auth: { verifyOtp: { data: { user: { id: "u1" } }, error: null } },
    });
    mockedCreateClient.mockResolvedValue(client);

    const req = new NextRequest(
      "http://localhost:3000/auth/confirm?token_hash=abc&type=magiclink&next=/profile"
    );

    const res = await GET(req);

    expect(res.status).toBe(307);
    const location = new URL(res.headers.get("location") ?? "");
    expect(location.origin).toBe("http://localhost:3000");
    expect(location.pathname).toBe("/profile");
    expect(client.auth.verifyOtp).toHaveBeenCalledWith({
      type: "magiclink",
      token_hash: "abc",
    });
  });

  it("redirects to /auth/auth-code-error when verifyOtp returns an error", async () => {
    const client = makeSupabaseClient({
      auth: {
        verifyOtp: { data: null, error: { message: "invalid token" } },
      },
    });
    mockedCreateClient.mockResolvedValue(client);

    const req = new NextRequest(
      "http://localhost:3000/auth/confirm?token_hash=bad&type=signup&next=/profile"
    );

    const res = await GET(req);

    expect(res.status).toBe(307);
    const location = new URL(res.headers.get("location") ?? "");
    expect(location.origin).toBe("http://localhost:3000");
    expect(location.pathname).toBe("/auth/auth-code-error");
    expect(client.auth.verifyOtp).toHaveBeenCalledWith({
      type: "signup",
      token_hash: "bad",
    });
  });
});
