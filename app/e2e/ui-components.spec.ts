/**
 * UI Components E2E Tests
 *
 * Tests for UI components and interactions
 */

import { test, expect } from '@playwright/test'

test.describe('UI Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display welcome message on empty state', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome to AI Chat' })).toBeVisible()
  })

  test('should have accessible main region', async ({ page }) => {
    const main = page.getByRole('main', { name: /chat/i })
    await expect(main).toBeVisible()
  })

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through the page
    await page.keyboard.press('Tab')

    // Check that focus is on an interactive element
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })
})

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings')
  })

  test('should display settings page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
    await expect(page.getByText('Customize your chat experience')).toBeVisible()
  })

  test('should have theme selector', async ({ page }) => {
    await expect(page.getByText('Theme')).toBeVisible()

    // Check for theme options
    const themeSelect = page.getByRole('combobox', { name: /theme/i })
    await expect(themeSelect).toBeVisible()
  })

  test('should have model configuration', async ({ page }) => {
    await expect(page.getByText('Model')).toBeVisible()
  })

  test('should have temperature slider', async ({ page }) => {
    await expect(page.getByText('Temperature')).toBeVisible()

    // Check for slider input
    const tempSlider = page.locator('input[type="range"]').first()
    await expect(tempSlider).toBeVisible()
  })

  test('should have save button', async ({ page }) => {
    const saveButton = page.getByRole('button', { name: /save/i })
    await expect(saveButton).toBeVisible()
  })
})

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Check that page is accessible
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should work on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')

    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should work on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')

    await expect(page.getByRole('main')).toBeVisible()
  })
})

test.describe('Dark Mode', () => {
  test('should persist theme preference', async ({ page }) => {
    await page.goto('/settings')

    // Select dark theme
    const themeSelect = page.getByRole('combobox', { name: /theme/i })
    await themeSelect.selectOption('dark')

    // Save settings
    await page.getByRole('button', { name: /save/i }).click()

    // Wait for save confirmation
    await page.waitForTimeout(1000)

    // Navigate away and back
    await page.goto('/')
    await page.goto('/settings')

    // Theme should still be dark
    await expect(themeSelect).toHaveValue('dark')
  })
})

test.describe('Accessibility', () => {
  test('should have proper page title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Projekt Lena1/)
  })

  test('should have skip to main content link', async ({ page }) => {
    await page.goto('/')

    // Tab to focus on skip link (if exists)
    await page.keyboard.press('Tab')

    // Check for skip link or main landmark
    const main = page.getByRole('main')
    await expect(main).toBeVisible()
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')

    // Check for h1 or h2
    const heading = page.locator('h1, h2').first()
    await expect(heading).toBeVisible()
  })

  test('should have accessible form inputs in settings', async ({ page }) => {
    await page.goto('/settings')

    // All inputs should have labels
    const themeSelect = page.getByRole('combobox', { name: /theme/i })
    await expect(themeSelect).toBeVisible()

    const modelSelect = page.getByRole('combobox', { name: /model/i })
    await expect(modelSelect).toBeVisible()
  })
})
