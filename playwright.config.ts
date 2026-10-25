import { defineConfig, devices } from '@playwright/test';
import { env } from './src/utils/env';
import { CUSTOMER_STATE } from './src/utils/paths';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  // Be gentle with the public demo site.
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: isCI
    ? [['github'], ['html', { open: 'never' }], ['list']]
    : [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: env.baseUrl,
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: 'setup/*.setup.ts',
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: `${env.apiUrl}/` },
    },
    ...(['chromium', 'firefox', 'webkit'] as const).map((browser) => ({
      name: `e2e-${browser}`,
      testDir: './tests/e2e',
      dependencies: ['setup'],
      use: {
        ...devices[
          browser === 'chromium'
            ? 'Desktop Chrome'
            : browser === 'firefox'
              ? 'Desktop Firefox'
              : 'Desktop Safari'
        ],
        storageState: CUSTOMER_STATE,
      },
    })),
    {
      name: 'a11y',
      testDir: './tests/a11y',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
