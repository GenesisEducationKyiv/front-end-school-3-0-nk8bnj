import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{js,ts,tsx}"],
    exclude: [
      "node_modules",
      "dist",
      ".next",
      "src/**/*.ct.test.{js,ts,tsx}",
      "src/**/*.integration.test.{js,ts,tsx}",
      "src/**/*.spec.{js,ts,tsx}",
    ],
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
