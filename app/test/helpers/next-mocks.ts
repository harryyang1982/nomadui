import { vi } from "vitest";

/**
 * Shared next/* module stubs.
 *
 * Import and call `installNextMocks()` inside a `beforeEach` (or at the top of
 * a test file) when you need to observe/assert against redirects, path
 * revalidations, cookie jars, or header maps.
 *
 * Example:
 *   import { installNextMocks } from "@/../test/helpers/next-mocks";
 *
 *   const { redirect, revalidatePath, headersMap } = installNextMocks();
 *   redirect.mockClear();
 *   ...
 *   expect(redirect).toHaveBeenCalledWith("/login?error=...");
 */

interface InstalledMocks {
  redirect: ReturnType<typeof vi.fn>;
  revalidatePath: ReturnType<typeof vi.fn>;
  notFound: ReturnType<typeof vi.fn>;
  headersMap: Map<string, string>;
  cookieJar: Map<string, string>;
}

const state: InstalledMocks = {
  redirect: vi.fn((url: string) => {
    throw Object.assign(new Error(`NEXT_REDIRECT:${url}`), {
      digest: `NEXT_REDIRECT;replace;${url};307;`,
    });
  }),
  revalidatePath: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  headersMap: new Map<string, string>(),
  cookieJar: new Map<string, string>(),
};

/**
 * Call `vi.mock("next/navigation", ...)` / `vi.mock("next/cache", ...)` /
 * `vi.mock("next/headers", ...)` with this factory at the top of your test
 * file (vi.mock is hoisted so it must be at module scope).
 *
 * This helper returns the shared state so you can read/clear between tests.
 */
export function getNextMockState(): InstalledMocks {
  return state;
}

export function nextNavigationFactory() {
  return {
    redirect: state.redirect,
    notFound: state.notFound,
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => "/",
  };
}

export function nextCacheFactory() {
  return {
    revalidatePath: state.revalidatePath,
    revalidateTag: vi.fn(),
    unstable_noStore: vi.fn(),
  };
}

export function nextHeadersFactory() {
  const headersProxy = {
    get: (key: string) => state.headersMap.get(key.toLowerCase()) ?? null,
    has: (key: string) => state.headersMap.has(key.toLowerCase()),
    forEach: (cb: (value: string, key: string) => void) => {
      state.headersMap.forEach(cb);
    },
    entries: () => state.headersMap.entries(),
  };
  const cookiesProxy = {
    get: (name: string) => {
      const v = state.cookieJar.get(name);
      return v == null ? undefined : { name, value: v };
    },
    getAll: () =>
      Array.from(state.cookieJar.entries()).map(([name, value]) => ({
        name,
        value,
      })),
    has: (name: string) => state.cookieJar.has(name),
    set: (name: string, value: string) => {
      state.cookieJar.set(name, value);
    },
    delete: (name: string) => state.cookieJar.delete(name),
  };
  return {
    headers: async () => headersProxy,
    cookies: async () => cookiesProxy,
  };
}

export function resetNextMocks() {
  state.redirect.mockClear();
  state.revalidatePath.mockClear();
  state.notFound.mockClear();
  state.headersMap.clear();
  state.cookieJar.clear();
}
