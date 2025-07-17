import { defineConfig, devices } from '@playwright/experimental-ct-react'
import path from 'path'

export default defineConfig({
  testDir: './src/components/__tests__',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    ctPort: 3100,
    ctTemplateDir: 'playwright',
    ctViteConfig: {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
        },
      },
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  build: {
    external: ['@/'],
  },
}) 