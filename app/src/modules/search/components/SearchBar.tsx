'use client'

/**
 * SearchBar Component
 *
 * 🌟 UNIQUE FEATURE - Строка поиска с debounced search
 *
 * Features:
 * - Real-time search с debounce (300ms)
 * - Клавиатурная навигация (Esc для очистки)
 * - Loading состояние
 * - Подсказки (shortcuts)
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type { SearchResults } from '../types'

interface SearchBarProps {
  onSearch: (results: SearchResults) => void
  onClear?: () => void
  placeholder?: string
  debounceMs?: number
  className?: string
}

export function SearchBar({
  onSearch,
  onClear,
  placeholder = 'Search chats and messages...',
  debounceMs = 300,
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout>()
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced search function
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery || searchQuery.trim().length === 0) {
        onClear?.()
        return
      }

      setIsSearching(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          q: searchQuery.trim(),
          limit: '50',
        })

        const response = await fetch(`/api/search?${params.toString()}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Search failed')
        }

        const results: SearchResults = await response.json()
        onSearch(results)
      } catch (err) {
        console.error('Search error:', err)
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setIsSearching(false)
      }
    },
    [onSearch, onClear]
  )

  // Handle input change with debounce
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer
    if (newQuery.trim().length > 0) {
      debounceTimerRef.current = setTimeout(() => {
        performSearch(newQuery)
      }, debounceMs)
    } else {
      onClear?.()
    }
  }

  // Handle clear
  const handleClear = () => {
    setQuery('')
    setError(null)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    onClear?.()
    inputRef.current?.focus()
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear()
    } else if (e.key === 'Enter') {
      // Immediate search on Enter
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      performSearch(query)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // Focus shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  return (
    <div className={`relative ${className}`} role="search">
      {/* Search Input */}
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-24 py-3 rounded-lg border
            border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors
          `}
          aria-label="Search chats and messages"
          aria-describedby="search-hint"
          aria-busy={isSearching}
          autoComplete="off"
        />

        {/* Loading Spinner / Clear Button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isSearching && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
          )}

          {query && !isSearching && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Keyboard Shortcut Hint */}
          {!query && !isSearching && (
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">
                ⌘K
              </kbd>
            </div>
          )}
        </div>
      </div>

      {/* Search Hint for Screen Readers */}
      <div id="search-hint" className="sr-only">
        Press Cmd or Ctrl + K to focus search. Press Escape to clear. Press Enter to search immediately.
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
    </div>
  )
}
