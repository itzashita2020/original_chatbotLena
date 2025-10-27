/**
 * ResponsiveLayout Component Tests
 *
 * Tests for responsive layout with mobile sidebar management
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResponsiveLayout } from '../ResponsiveLayout'

describe('ResponsiveLayout', () => {
  // Store original window.innerWidth
  const originalInnerWidth = window.innerWidth

  beforeEach(() => {
    // Reset window size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  afterEach(() => {
    // Restore original window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    })
    vi.restoreAllMocks()
  })

  describe('Basic rendering', () => {
    it('should render sidebar and main content', () => {
      render(
        <ResponsiveLayout
          sidebar={<div>Sidebar content</div>}
          main={<div>Main content</div>}
        />
      )

      expect(screen.getByText('Sidebar content')).toBeInTheDocument()
      expect(screen.getByText('Main content')).toBeInTheDocument()
    })

    it('should wrap content in proper layout structure', () => {
      const { container } = render(
        <ResponsiveLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
        />
      )

      const layout = container.querySelector('.flex.h-screen.w-screen')
      expect(layout).toBeInTheDocument()
    })
  })

  describe('Desktop behavior', () => {
    it('should not show mobile menu button on desktop', async () => {
      // Set desktop width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })

      render(
        <ResponsiveLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
        />
      )

      // Wait for resize effect
      await waitFor(() => {
        const button = screen.queryByLabelText(/sidebar/)
        expect(button).not.toBeInTheDocument()
      })
    })

    it('should show sidebar by default on desktop', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })

      render(
        <ResponsiveLayout
          sidebar={<div>Sidebar content</div>}
          main={<div>Main</div>}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Sidebar content')).toBeVisible()
      })
    })
  })

  describe('Mobile behavior', () => {
    beforeEach(() => {
      // Set mobile width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375, // Mobile width
      })
    })

    it('should show mobile menu button on mobile', async () => {
      render(
        <ResponsiveLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
        />
      )

      await waitFor(() => {
        expect(screen.getByLabelText('Open sidebar')).toBeInTheDocument()
      })
    })

    it('should toggle sidebar when menu button is clicked', async () => {
      const user = userEvent.setup()

      render(
        <ResponsiveLayout
          sidebar={<div data-testid="sidebar">Sidebar</div>}
          main={<div>Main</div>}
        />
      )

      // Wait for mobile detection
      await waitFor(() => {
        expect(screen.getByLabelText('Open sidebar')).toBeInTheDocument()
      })

      const menuButton = screen.getByLabelText('Open sidebar')

      // Click to open
      await user.click(menuButton)

      await waitFor(() => {
        expect(screen.getByLabelText('Close sidebar')).toBeInTheDocument()
      })

      // Click to close
      await user.click(screen.getByLabelText('Close sidebar'))

      await waitFor(() => {
        expect(screen.getByLabelText('Open sidebar')).toBeInTheDocument()
      })
    })

    it('should show backdrop when sidebar is open', async () => {
      const user = userEvent.setup()

      const { container } = render(
        <ResponsiveLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
        />
      )

      await waitFor(() => {
        expect(screen.getByLabelText('Open sidebar')).toBeInTheDocument()
      })

      // Open sidebar
      await user.click(screen.getByLabelText('Open sidebar'))

      await waitFor(() => {
        const backdrop = container.querySelector('.bg-black\\/50')
        expect(backdrop).toBeInTheDocument()
      })
    })

    it('should close sidebar when backdrop is clicked', async () => {
      const user = userEvent.setup()

      const { container } = render(
        <ResponsiveLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
        />
      )

      await waitFor(() => {
        expect(screen.getByLabelText('Open sidebar')).toBeInTheDocument()
      })

      // Open sidebar
      await user.click(screen.getByLabelText('Open sidebar'))

      await waitFor(() => {
        expect(screen.getByLabelText('Close sidebar')).toBeInTheDocument()
      })

      // Click backdrop
      const backdrop = container.querySelector('.bg-black\\/50')
      if (backdrop) {
        await user.click(backdrop)
      }

      await waitFor(() => {
        expect(screen.getByLabelText('Open sidebar')).toBeInTheDocument()
      })
    })

    it('should close sidebar when Escape key is pressed', async () => {
      const user = userEvent.setup()

      render(
        <ResponsiveLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
        />
      )

      await waitFor(() => {
        expect(screen.getByLabelText('Open sidebar')).toBeInTheDocument()
      })

      // Open sidebar
      await user.click(screen.getByLabelText('Open sidebar'))

      await waitFor(() => {
        expect(screen.getByLabelText('Close sidebar')).toBeInTheDocument()
      })

      // Press Escape
      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.getByLabelText('Open sidebar')).toBeInTheDocument()
      })
    })

    it('should not close sidebar on Escape when already closed', async () => {
      const user = userEvent.setup()

      render(
        <ResponsiveLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
        />
      )

      await waitFor(() => {
        expect(screen.getByLabelText('Open sidebar')).toBeInTheDocument()
      })

      // Press Escape (sidebar is already closed)
      await user.keyboard('{Escape}')

      // Should still be closed
      await waitFor(() => {
        expect(screen.getByLabelText('Open sidebar')).toBeInTheDocument()
      })
    })
  })

  describe('Responsive behavior', () => {
    it('should update layout when window is resized from desktop to mobile', async () => {
      // Start with desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })

      const { rerender } = render(
        <ResponsiveLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
        />
      )

      // No mobile button initially
      await waitFor(() => {
        expect(screen.queryByLabelText(/sidebar/)).not.toBeInTheDocument()
      })

      // Resize to mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      // Trigger resize event
      window.dispatchEvent(new Event('resize'))

      // Should show mobile button
      await waitFor(() => {
        expect(screen.getByLabelText('Open sidebar')).toBeInTheDocument()
      })
    })

    it('should update layout when window is resized from mobile to desktop', async () => {
      // Start with mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(
        <ResponsiveLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
        />
      )

      // Mobile button should be present
      await waitFor(() => {
        expect(screen.getByLabelText('Open sidebar')).toBeInTheDocument()
      })

      // Resize to desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })

      // Trigger resize event
      window.dispatchEvent(new Event('resize'))

      // Mobile button should disappear
      await waitFor(() => {
        expect(screen.queryByLabelText(/sidebar/)).not.toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
    })

    it('should have proper ARIA labels on menu button', async () => {
      const user = userEvent.setup()

      render(
        <ResponsiveLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
        />
      )

      await waitFor(() => {
        const button = screen.getByLabelText('Open sidebar')
        expect(button).toBeInTheDocument()
      })

      const openButton = screen.getByLabelText('Open sidebar')
      expect(openButton).toHaveAttribute('aria-expanded', 'false')
      expect(openButton).toHaveAttribute('aria-controls', 'mobile-sidebar')

      await user.click(openButton)

      await waitFor(() => {
        const closeButton = screen.getByLabelText('Close sidebar')
        expect(closeButton).toHaveAttribute('aria-expanded', 'true')
      })
    })

    it('should have proper ID on sidebar for ARIA controls', () => {
      render(
        <ResponsiveLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
        />
      )

      const sidebar = document.getElementById('mobile-sidebar')
      expect(sidebar).toBeInTheDocument()
    })

    it('should have aria-hidden on backdrop', async () => {
      const user = userEvent.setup()

      const { container } = render(
        <ResponsiveLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
        />
      )

      await waitFor(() => {
        expect(screen.getByLabelText('Open sidebar')).toBeInTheDocument()
      })

      await user.click(screen.getByLabelText('Open sidebar'))

      await waitFor(() => {
        const backdrop = container.querySelector('.bg-black\\/50')
        expect(backdrop).toHaveAttribute('aria-hidden', 'true')
      })
    })

    it('should have aria-hidden on menu button icon', async () => {
      render(
        <ResponsiveLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
        />
      )

      await waitFor(() => {
        const button = screen.getByLabelText('Open sidebar')
        const icon = button.querySelector('svg')
        expect(icon).toHaveAttribute('aria-hidden', 'true')
      })
    })
  })

  describe('Cleanup', () => {
    it('should cleanup resize listener on unmount', async () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = render(
        <ResponsiveLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
        />
      )

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    })

    it('should cleanup keydown listener on unmount', async () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = render(
        <ResponsiveLayout
          sidebar={<div>Sidebar</div>}
          main={<div>Main</div>}
        />
      )

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })
  })
})
