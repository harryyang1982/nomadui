import { describe, it, expect } from "vitest";

// Removed once Phase 1 Round 1 lands real lib/* specs.
describe("smoke", () => {
  it("runs vitest with happy-dom + setup file wired", () => {
    expect(typeof window).toBe("object");
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBe("https://test.supabase.co");
  });
});
