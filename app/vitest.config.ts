import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    // Vite 7+ resolves tsconfig `paths` natively; no plugin needed.
    tsconfigPaths: true,
    alias: {
      // `server-only` is Next.js' RSC-guard marker. Point it at an empty
      // stub so modules that `import "server-only"` (lib/queries.ts,
      // lib/current-user.ts, app/actions/*) can be loaded under Vitest.
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
