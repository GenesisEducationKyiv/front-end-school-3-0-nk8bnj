/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{js,ts,tsx}"],
    exclude: ["node_modules", "dist", ".next", "src/**/*.ct.test.{js,ts,tsx}", "src/**/*.integration.test.{js,ts,tsx}", "src/**/*.spec.{js,ts,tsx}"],
    reporters: [
      'default',
      ['junit', { outputFile: 'test-results/junit.xml' }],
      ['json', { outputFile: 'test-results/results.json' }],
      ['verbose', { outputFile: 'test-results/verbose.log' }]
    ],
    outputFile: 'test-results/output.log',
    projects: [{
      extends: true,
      plugins: [
        // The plugin will run tests for the stories defined in your Storybook config
        // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
        storybookTest({
          configDir: path.join(dirname, '.storybook')
        })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    }]
  },
  resolve: {
    alias: {
      "@": "/src"
    }
  }
});
