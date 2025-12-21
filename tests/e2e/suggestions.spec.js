import { test, expect } from '@playwright/test'

// E2E test: fill and submit the suggestions form
// Message should be "{timestamp} test message" and username should be "test"

test('submit suggestions form with timestamped message and username test', async ({ page, baseURL }) => {
  // Intercept the API call to avoid hitting the real Discord webhook from the server.
  // Fulfill with a minimal OK payload that the client expects.
  await page.route('**/api/discord', async route => {
    if (route.request().method() === 'POST') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true })
      })
    }
    return route.fallback()
  })

  // Go to suggestions page
  await page.goto('/suggestions')

  // Build the message with current timestamp
  const timestamp = new Date().toISOString()
  const message = `${timestamp} test message`

  // Fill message textarea
  await page.locator('textarea[name="message"]').fill(message)

  // Fill username input
  await page.locator('input[name="username"]').fill('test')

  // Submit the form
  await page.getByRole('button', { name: 'Submit' }).click()

  // Expect success dialog to appear
  await expect(page.getByText('Your message has been sent.')).toBeVisible()
  await expect(page.getByText('Thank you for your input.')).toBeVisible()
})
