import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Reset DOM + any module-level mocks between tests
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Stable defaults for env-driven code paths (overridden per-test when needed)
process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??= "test-anon-key";
