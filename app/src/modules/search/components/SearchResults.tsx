'use client'

/**
 * SearchResults Component
 *
 * Отображает результаты поиска с подсветкой совпадений
 */

import type { SearchResults as SearchResultsType, SearchResult } from '../types'
import { NoSearchResultsEmptyState } from '@/components/ui/EmptyState'

interface SearchResultsProps {
  results: SearchResultsType | null
  onSelectChat: (chatId: string) => void
  className?: string
}

export function SearchResults({
  results,
  onSelectChat,
  className = '',
}: SearchResultsProps) {
  if (!results) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">
          Start typing to search...
        </p>
      </div>
    )
  }

  if (results.results.length === 0) {
    return (
      <div className={className}>
        <NoSearchResultsEmptyState query={results.query} />
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Results Header */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Found {results.total} result{results.total !== 1 ? 's' : ''} for &quot;
          {results.query}&quot;
        </p>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {results.results.map((result, index) => (
          <SearchResultItem
            key={`${result.type}-${result.chat.id}-${index}`}
            result={result}
            onSelect={() => onSelectChat(result.chat.id)}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Individual Search Result Item
 */
interface SearchResultItemProps {
  result: SearchResult
  onSelect: () => void
}

function SearchResultItem({ result, onSelect }: SearchResultItemProps) {
  const formatDate = (date: string | null | undefined) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <button
      onClick={onSelect}
      className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      {/* Chat Title */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {result.chat.title || 'Untitled Chat'}
          </h3>
          {result.chat.category && (
            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
              {result.chat.category}
            </span>
          )}
        </div>

        {/* Result Type Badge */}
        <span
          className={`text-xs px-2 py-1 rounded ${
            result.type === 'chat'
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
          }`}
        >
          {result.type === 'chat' ? 'Title' : 'Message'}
        </span>
      </div>

      {/* Match Highlight */}
      {result.highlight && (
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
          {result.highlight}
        </p>
      )}

      {/* Metadata */}
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
        {result.message && (
          <>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              {result.message.role === 'user' ? 'You' : 'Assistant'}
            </span>
          </>
        )}

        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
          {formatDate(result.message?.created_at || result.chat.created_at)}
        </span>

        {result.chat.is_favorite && (
          <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
            ⭐ Favorite
          </span>
        )}

        {result.chat.tags && result.chat.tags.length > 0 && (
          <span className="flex items-center gap-1">
            🏷️ {result.chat.tags.slice(0, 2).join(', ')}
            {result.chat.tags.length > 2 && ` +${result.chat.tags.length - 2}`}
          </span>
        )}
      </div>
    </button>
  )
}
