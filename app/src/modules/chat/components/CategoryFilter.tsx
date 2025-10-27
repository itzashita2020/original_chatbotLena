'use client'

/**
 * CategoryFilter Component
 *
 * Фильтр чатов по категориям
 */

import { useState } from 'react'

interface CategoryFilterProps {
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  className?: string
}

const PREDEFINED_CATEGORIES = [
  'Technology',
  'Programming',
  'Business',
  'Education',
  'Personal',
  'Research',
  'Other',
]

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  className = '',
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`relative ${className}`}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm
          border transition-colors
          ${
            selectedCategory
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
          }
          hover:border-blue-500 dark:hover:border-blue-500
        `}
        aria-label="Filter by category"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
          </svg>
          <span className="font-medium">
            {selectedCategory || 'All Categories'}
          </span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Menu */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 max-h-64 overflow-y-auto">
            {/* All Categories Option */}
            <button
              onClick={() => {
                onCategoryChange(null)
                setIsOpen(false)
              }}
              className={`
                w-full text-left px-4 py-2 text-sm transition-colors
                ${
                  !selectedCategory
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              All Categories
            </button>

            <div className="border-t border-gray-200 dark:border-gray-700" />

            {/* Category Options */}
            {PREDEFINED_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => {
                  onCategoryChange(category)
                  setIsOpen(false)
                }}
                className={`
                  w-full text-left px-4 py-2 text-sm transition-colors
                  ${
                    selectedCategory === category
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
