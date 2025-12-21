// @ts-check
import {defineConfig, devices} from '@playwright/test'

export default defineConfig({
    // Default UI E2E tests live under tests/e2e
    testDir: 'tests/e2e',
    outputDir: 'tests-results',
    timeout: 30_000,
    expect: {timeout: 5_000},
    fullyParallel: true,
    retries: 0,
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry'
    },
    webServer: [
        {
            command: 'yarn workspace @starter/server start:dev',
            port: 4000,
            reuseExistingServer: true,
            env: {NODE_ENV: 'development'}
        },
        {
            command: 'yarn workspace @starter/client preview --port 3000',
            port: 3000,
            reuseExistingServer: true
        }
    ],
    projects: [
        // Browser UI projects use the default testDir: tests/e2e
        {
            name: 'chromium',
            use: {...devices['Desktop Chrome']}
        },
        {
            name: 'firefox',
            testIgnore: ['**/suggestionsAPI.spec.js'],
            use: {...devices['Desktop Firefox']}
        },
        {
            name: 'webkit',
            testIgnore: ['**/suggestionsAPI.spec.js'],
            use: {...devices['Desktop Safari']}
        },
        // Server API Playwright tests under server/tests matching *.e2e.{js,ts}
        {
            name: 'server-e2e',
            testDir: 'server/tests',
            testMatch: ['**/*.e2e.{js,ts}'],
            use: {
                // Point APIRequestContext to the API server by default
                baseURL: 'http://localhost:4000'
            }
        }
    ]
})
