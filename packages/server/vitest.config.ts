import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    // Allow native modules to be loaded properly
    deps: {
      optimizer: {
        ssr: {
          include: ["better-sqlite3"],
        },
      },
    },
    // Increase timeout for integration tests
    testTimeout: 30000,
  },
});
