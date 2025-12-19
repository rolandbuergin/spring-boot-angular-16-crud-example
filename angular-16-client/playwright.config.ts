import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT || 4200;

export default defineConfig({
  testDir: './playwright',
  fullyParallel: true,
  timeout: 120000,
  expect: {
    timeout: 5000,
  },
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run start -- --host 0.0.0.0 --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
