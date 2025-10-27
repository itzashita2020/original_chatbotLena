/**
 * useDebounce Hook
 *
 * Debounces a value to reduce unnecessary operations.
 * Useful for search inputs, API calls, etc.
 *
 * Performance optimization to prevent excessive re-renders and API calls.
 */

import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up timeout to update debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up timeout if value changes before delay
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
