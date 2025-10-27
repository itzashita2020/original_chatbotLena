/**
 * Toast Component Tests
 *
 * Tests for toast notification system
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider, useToast } from '../Toast'

// Test component that uses toast
function TestComponent() {
  const { showToast } = useToast()

  return (
    <div>
      <button onClick={() => showToast('Success message', 'success')}>
        Show Success
      </button>
      <button onClick={() => showToast('Error message', 'error')}>
        Show Error
      </button>
      <button onClick={() => showToast('Warning message', 'warning')}>
        Show Warning
      </button>
      <button onClick={() => showToast('Info message', 'info')}>
        Show Info
      </button>
    </div>
  )
}

describe('Toast', () => {
  beforeEach(() => {
    // Note: Not using fake timers because of conflicts with Framer Motion
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('ToastProvider', () => {
    it('should render children', () => {
      render(
        <ToastProvider>
          <div>Test content</div>
        </ToastProvider>
      )

      expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('should throw error when useToast is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(
          <div>
            <TestComponent />
          </div>
        )
      }).toThrow('useToast must be used within ToastProvider')

      consoleSpy.mockRestore()
    })
  })

  describe('showToast', () => {
    it('should display success toast', async () => {
      const user = userEvent.setup({ delay: null })

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await user.click(screen.getByText('Show Success'))

      expect(await screen.findByText('Success message')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toHaveClass('border-green-500')
    })

    it('should display error toast', async () => {
      const user = userEvent.setup({ delay: null })

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await user.click(screen.getByText('Show Error'))

      expect(await screen.findByText('Error message')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toHaveClass('border-red-500')
    })

    it('should display warning toast', async () => {
      const user = userEvent.setup({ delay: null })

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await user.click(screen.getByText('Show Warning'))

      expect(await screen.findByText('Warning message')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toHaveClass('border-yellow-500')
    })

    it('should display info toast', async () => {
      const user = userEvent.setup({ delay: null })

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await user.click(screen.getByText('Show Info'))

      expect(await screen.findByText('Info message')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toHaveClass('border-blue-500')
    })

    it('should auto-hide toast after duration', async () => {
      const user = userEvent.setup({ delay: null })

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await user.click(screen.getByText('Show Success'))

      expect(await screen.findByText('Success message')).toBeInTheDocument()

      // Wait for toast to auto-hide (default 3000ms)
      await waitFor(
        () => {
          expect(screen.queryByText('Success message')).not.toBeInTheDocument()
        },
        { timeout: 4000 }
      )
    })

    it('should allow manual close', async () => {
      const user = userEvent.setup({ delay: null })

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await user.click(screen.getByText('Show Success'))

      expect(await screen.findByText('Success message')).toBeInTheDocument()

      // Click close button
      const closeButton = screen.getByLabelText('Close notification')
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Success message')).not.toBeInTheDocument()
      })
    })

    it('should display multiple toasts', async () => {
      const user = userEvent.setup({ delay: null })

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await user.click(screen.getByText('Show Success'))
      await user.click(screen.getByText('Show Error'))

      expect(await screen.findByText('Success message')).toBeInTheDocument()
      expect(await screen.findByText('Error message')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      const user = userEvent.setup({ delay: null })

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await user.click(screen.getByText('Show Success'))

      const toast = await screen.findByRole('alert')
      expect(toast).toBeInTheDocument()

      // Check for notification region
      const region = screen.getByRole('region', { name: 'Notifications' })
      expect(region).toBeInTheDocument()
      expect(region).toHaveAttribute('aria-live', 'polite')
    })

    it('should have close button with aria-label', async () => {
      const user = userEvent.setup({ delay: null })

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      )

      await user.click(screen.getByText('Show Success'))

      const closeButton = await screen.findByLabelText('Close notification')
      expect(closeButton).toBeInTheDocument()
    })
  })
})
