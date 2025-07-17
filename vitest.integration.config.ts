import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.integration.test.{js,ts,tsx}'],
    exclude: ['node_modules', 'dist', '.next'],
    reporters: [
      'default',
      ['junit', { outputFile: 'test-results/integration-junit.xml' }],
      ['json', { outputFile: 'test-results/integration-results.json' }],
      ['verbose', { outputFile: 'test-results/integration-verbose.log' }]
    ],
    outputFile: 'test-results/integration-output.log',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
}) 
