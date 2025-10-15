import {test, expect} from '@playwright/test'

// Basic E2E smoke tests covering client and server

test('pages render and server health endpoint responds', async ({page, request, baseURL}) => {
    // Call the server API health endpoint directly
    const res = await request.get('http://localhost:4000/api/health')
    expect(res.ok()).toBeTruthy()
    const json = await res.json()
    expect(json).toEqual({ok: true})

    // Visit the app homepage served by Vite preview
    await page.goto('/')
    await expect(page.getByText('Lockpickers United')).toBeVisible()

    // Visit the app homepage served by Vite preview
    await page.goto('/suggestions')
    await expect(page.getByText('Suggestion / Feedback')).toBeVisible()

})
