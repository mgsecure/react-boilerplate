import { test, expect } from '@playwright/test'
import dayjs from 'dayjs'

// E2E test: fill and submit the suggestions form against the real Discord API
// Message should be "{timestamp} test message" and username should be "test"

test('submit suggestions form (real Discord API) with timestamped message and username test', async ({ page }) => {
  // IMPORTANT: Do not intercept /api/discord here. This test hits the real server webhook.

  // Go to suggestions page
  await page.goto('/suggestions')

  // Build the message with current timestamp
  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const message = `${timestamp} test message`

  // Fill message textarea
  await page.locator('textarea[name="message"]').fill(message)

  // Fill username input (server routes "test" to the dev-safe webhook)
  await page.locator('input[name="username"]').fill('test')

  // Submit the form
  await page.getByRole('button', { name: 'Submit' }).click()

  // Expect success dialog to appear
  await expect(page.getByText('Your message has been sent.')).toBeVisible()
  await expect(page.getByText('Thank you for your input.')).toBeVisible()
})
