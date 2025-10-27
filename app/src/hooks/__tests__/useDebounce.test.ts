import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 500))
    expect(result.current).toBe('test')
  })

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 100 } }
    )

    expect(result.current).toBe('initial')

    // Update value
    rerender({ value: 'updated', delay: 100 })
    expect(result.current).toBe('initial') // Should still be initial

    // Wait for debounce
    await waitFor(() => {
      expect(result.current).toBe('updated')
    }, { timeout: 200 })
  })

  it('should reset timer on rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 'initial' } }
    )

    // Rapid changes
    rerender({ value: 'change1' })
    await new Promise(resolve => setTimeout(resolve, 20))

    rerender({ value: 'change2' })
    await new Promise(resolve => setTimeout(resolve, 20))

    rerender({ value: 'change3' })

    // Still initial value (debounce not finished)
    expect(result.current).toBe('initial')

    // Wait for debounce to complete
    await waitFor(() => {
      expect(result.current).toBe('change3')
    }, { timeout: 200 })
  })

  it('should handle different delay values', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 200 } }
    )

    rerender({ value: 'updated', delay: 200 })

    // Wait for debounce
    await waitFor(() => {
      expect(result.current).toBe('updated')
    }, { timeout: 300 })
  })

  it('should handle different value types', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 123 } }
    )

    expect(result.current).toBe(123)

    rerender({ value: 456 })

    // Wait for debounce
    await waitFor(() => {
      expect(result.current).toBe(456)
    }, { timeout: 200 })
  })

  it('should cleanup timeout on unmount', () => {
    const { unmount } = renderHook(() => useDebounce('test', 500))

    // Should not throw error on unmount
    expect(() => unmount()).not.toThrow()
  })
})
