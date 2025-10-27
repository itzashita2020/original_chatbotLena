/**
 * Basic Navigation E2E Tests
 *
 * Tests basic page navigation and UI rendering
 */

import { test, expect } from '@playwright/test'

test.describe('Basic Navigation', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/')

    // Check that the page loads
    await expect(page).toHaveTitle(/Projekt Lena1/)

    // Check for welcome message (no chat selected)
    await expect(page.getByText('Welcome to AI Chat')).toBeVisible()
    await expect(page.getByText('Select a chat or create a new one to start')).toBeVisible()
  })

  test('should navigate to settings page', async ({ page }) => {
    await page.goto('/')

    // Navigate to settings
    await page.goto('/settings')

    // Check settings page content
    await expect(page.getByText('Settings')).toBeVisible()
    await expect(page.getByText('Customize your chat experience')).toBeVisible()
  })

  test('should have responsive layout', async ({ page }) => {
    await page.goto('/')

    // Check that main layout elements are present
    const main = page.locator('main[role="main"]')
    await expect(main).toBeVisible()
  })

  test('should show dark mode toggle in settings', async ({ page }) => {
    await page.goto('/settings')

    // Check for theme selector
    await expect(page.getByText('Theme')).toBeVisible()
  })
})
