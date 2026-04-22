import { vi } from "vitest";

/**
 * Shared next/* module stubs.
 *
 * Vitest hoists `vi.mock(...)` calls above ESM imports, so **importing a
 * factory statically and passing it to `vi.mock(name, factory)` throws
 * `Cannot access '__vi_import_0__' before initialization`**. Instead, wrap
 * the factory in an async import inside the vi.mock callback so the helper
 * is resolved at call time:
 *
 *   vi.mock("next/navigation", async () => {
 *     const { nextNavigationFactory } = await import(
 *       "../../../test/helpers/next-mocks"
 *     );
 *     return nextNavigationFactory();
 *   });
 *   vi.mock("next/cache", async () => {
 *     const { nextCacheFactory } = await import(
 *       "../../../test/helpers/next-mocks"
 *     );
 *     return nextCacheFactory();
 *   });
 *   vi.mock("next/headers", async () => {
 *     const { nextHeadersFactory } = await import(
 *       "../../../test/helpers/next-mocks"
 *     );
 *     return nextHeadersFactory();
 *   });
 *
 * Then in your tests read/clear the shared state through `getNextMockState`
 * and `resetNextMocks` (see below):
 *
 *   beforeEach(() => resetNextMocks());
 *   expect(getNextMockState().redirect).toHaveBeenCalledWith(
 *     "/login?error=..."
 *   );
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
