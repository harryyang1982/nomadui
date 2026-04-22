import { vi, type Mock } from "vitest";

/**
 * Chainable Postgrest builder stub. Every filter/modifier method on
 * PostgrestQueryBuilder/PostgrestFilterBuilder returns `this` (the same
 * builder), so we build one proxy that returns itself for unknown keys and
 * resolves to the queued result when awaited, called as `.single()`, or
 * passed to `Promise.resolve`.
 *
 * Usage:
 *   const supabase = makeSupabaseClient({
 *     from: {
 *       cities: { select: { data: cityRows, error: null } },
 *       city_votes: { select: { data: [], error: null } },
 *     },
 *   });
 *
 *   vi.mock("@/utils/supabase/server", () => ({
 *     createClient: vi.fn().mockResolvedValue(supabase),
 *   }));
 */

export interface QueryResult<T = unknown> {
  data: T | null;
  error: { message: string; code?: string } | null;
  count?: number | null;
  status?: number;
  statusText?: string;
}

type TableStubs = Partial<{
  select: QueryResult | (() => QueryResult);
  insert: QueryResult | (() => QueryResult);
  upsert: QueryResult | (() => QueryResult);
  update: QueryResult | (() => QueryResult);
  delete: QueryResult | (() => QueryResult);
  /** Overrides for `.single()` / `.maybeSingle()` (defaults to `select[0]`) */
  single: QueryResult | (() => QueryResult);
}>;

export interface FromConfig {
  [tableName: string]: TableStubs;
}

export interface AuthUser {
  id: string;
  email: string | null;
  user_metadata?: Record<string, unknown>;
}

export interface AuthConfig {
  user?: AuthUser | null;
  session?: unknown;
  getUserError?: { message: string } | null;
  signInWithOAuth?: QueryResult<{ url: string; provider: string }>;
  signInWithPassword?: QueryResult;
  signUp?: QueryResult;
  signOut?: QueryResult;
  exchangeCodeForSession?: QueryResult;
  verifyOtp?: QueryResult;
}

export interface SupabaseClientMock {
  from: Mock;
  auth: {
    getUser: Mock;
    signInWithOAuth: Mock;
    signInWithPassword: Mock;
    signUp: Mock;
    signOut: Mock;
    exchangeCodeForSession: Mock;
    verifyOtp: Mock;
    role?: Mock;
  };
  /** Recorded calls per-table per-method for assertions. */
  calls: Record<string, Record<string, unknown[][]>>;
  /** Convenience: last `.select()` argument passed to a given table. */
  lastSelect(table: string): unknown | undefined;
  /** Convenience: last `.insert()` / `.upsert()` payload. */
  lastWrite(table: string): unknown | undefined;
}

function resolveResult(
  stub: TableStubs[keyof TableStubs] | undefined,
  fallback: QueryResult = { data: null, error: null }
): QueryResult {
  if (!stub) return fallback;
  return typeof stub === "function" ? stub() : stub;
}

/** Build a chainable builder whose every method returns itself. */
function buildBuilder(
  table: string,
  stubs: TableStubs | undefined,
  record: (method: string, args: unknown[]) => void
): unknown {
  let activeMethod: keyof TableStubs = "select";

  const target = {
    then(
      onFulfilled?: (value: QueryResult) => unknown,
      onRejected?: (reason: unknown) => unknown
    ) {
      const result = resolveResult(stubs?.[activeMethod]);
      return Promise.resolve(result).then(onFulfilled, onRejected);
    },
    catch(onRejected: (reason: unknown) => unknown) {
      return Promise.resolve(resolveResult(stubs?.[activeMethod])).catch(
        onRejected
      );
    },
  };

  const handler: ProxyHandler<typeof target> = {
    get(_t, prop: string | symbol) {
      if (prop === "then") return target.then;
      if (prop === "catch") return target.catch;
      if (prop === "finally") return undefined;
      if (typeof prop !== "string") return undefined;

      // Writing methods switch which stub `then` resolves with.
      if (
        prop === "select" ||
        prop === "insert" ||
        prop === "upsert" ||
        prop === "update" ||
        prop === "delete"
      ) {
        return (...args: unknown[]) => {
          activeMethod = prop as keyof TableStubs;
          record(prop, args);
          return proxy;
        };
      }

      if (prop === "single" || prop === "maybeSingle") {
        return () => {
          record(prop, []);
          const override = stubs?.single;
          if (override) {
            return Promise.resolve(resolveResult(override));
          }
          const current = resolveResult(stubs?.[activeMethod]);
          const single =
            Array.isArray(current.data) && current.data.length > 0
              ? { ...current, data: current.data[0] }
              : prop === "maybeSingle"
              ? { ...current, data: null }
              : current;
          return Promise.resolve(single);
        };
      }

      // Default: any other method (eq/gt/lt/order/limit/contains/in/is/…)
      // just records and returns the proxy.
      return (...args: unknown[]) => {
        record(prop, args);
        return proxy;
      };
    },
  };

  const proxy: unknown = new Proxy(target, handler);
  // Tag builder with table name for debugging.
  Object.defineProperty(proxy, "__table", { value: table });
  return proxy;
}

export function makeSupabaseClient(config: {
  from?: FromConfig;
  auth?: AuthConfig;
} = {}): SupabaseClientMock {
  const calls: SupabaseClientMock["calls"] = {};

  const record = (table: string, method: string, args: unknown[]) => {
    calls[table] ??= {};
    calls[table][method] ??= [];
    calls[table][method].push(args);
  };

  const from = vi.fn((table: string) => {
    calls[table] ??= {};
    return buildBuilder(table, config.from?.[table], (method, args) =>
      record(table, method, args)
    );
  });

  const auth = {
    getUser: vi.fn(async () => ({
      data: {
        user: config.auth?.user ?? null,
      },
      error: config.auth?.getUserError ?? null,
    })),
    signInWithOAuth: vi.fn(async () =>
      resolveResult(config.auth?.signInWithOAuth) as QueryResult<{
        url: string;
        provider: string;
      }>
    ),
    signInWithPassword: vi.fn(async () =>
      resolveResult(config.auth?.signInWithPassword)
    ),
    signUp: vi.fn(async () => resolveResult(config.auth?.signUp)),
    signOut: vi.fn(async () => resolveResult(config.auth?.signOut)),
    exchangeCodeForSession: vi.fn(async () =>
      resolveResult(config.auth?.exchangeCodeForSession)
    ),
    verifyOtp: vi.fn(async () => resolveResult(config.auth?.verifyOtp)),
  };

  return {
    from,
    auth,
    calls,
    lastSelect(table) {
      return calls[table]?.select?.at(-1)?.[0];
    },
    lastWrite(table) {
      return (
        calls[table]?.insert?.at(-1)?.[0] ??
        calls[table]?.upsert?.at(-1)?.[0] ??
        calls[table]?.update?.at(-1)?.[0]
      );
    },
  };
}
