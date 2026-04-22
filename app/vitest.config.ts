import { defineConfig } from "vitest/config";
import path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      // TODO(test-setup): `server-only` is Next.js' client-component guard. Under
      // Vitest we need to alias it to an empty stub so modules that `import
      // "server-only"` (lib/queries.ts, lib/current-user.ts, app/actions/*)
      // can load. Remove this alias once the setup branch adds a shared stub.
      "server-only": path.resolve(__dirname, "./test/stubs/server-only.ts"),
    },
  },
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "tests-e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/lib/**/*.ts",
        "src/app/actions/**/*.ts",
        "src/app/login/actions.ts",
        "src/app/auth/**/route.ts",
        "src/components/sections/**/*.tsx",
      ],
      exclude: [
        "src/lib/database.types.ts",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
      ],
    },
  },
});
