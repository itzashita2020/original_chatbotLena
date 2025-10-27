'use client'

/**
 * ChatMetadataEditor Component
 *
 * Редактор метаданных чата: заголовок, категория, теги, избранное
 */

import { useState } from 'react'
import type { Chat } from '../types'

interface ChatMetadataEditorProps {
  chat: Chat
  onUpdate: (updates: Partial<Chat>) => Promise<void>
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

export function ChatMetadataEditor({
  chat,
  onUpdate,
  className = '',
}: ChatMetadataEditorProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(chat.title || '')
  const [isUpdating, setIsUpdating] = useState(false)

  // Handle title edit
  const handleTitleSave = async () => {
    if (!editedTitle.trim() || editedTitle === chat.title) {
      setIsEditingTitle(false)
      return
    }

    setIsUpdating(true)
    try {
      await onUpdate({ title: editedTitle.trim() })
      setIsEditingTitle(false)
    } catch (error) {
      console.error('Failed to update title:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave()
    } else if (e.key === 'Escape') {
      setEditedTitle(chat.title || '')
      setIsEditingTitle(false)
    }
  }

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    setIsUpdating(true)
    try {
      await onUpdate({ is_favorite: !chat.is_favorite })
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle category change
  const handleCategoryChange = async (category: string) => {
    if (category === chat.category) return

    setIsUpdating(true)
    try {
      await onUpdate({ category })
    } catch (error) {
      console.error('Failed to update category:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle tag add
  const handleTagAdd = async (tag: string) => {
    const trimmedTag = tag.trim()
    if (!trimmedTag || (chat.tags && chat.tags.includes(trimmedTag))) return

    const newTags = [...(chat.tags || []), trimmedTag]

    setIsUpdating(true)
    try {
      await onUpdate({ tags: newTags })
    } catch (error) {
      console.error('Failed to add tag:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle tag remove
  const handleTagRemove = async (tagToRemove: string) => {
    const newTags = (chat.tags || []).filter(tag => tag !== tagToRemove)

    setIsUpdating(true)
    try {
      await onUpdate({ tags: newTags })
    } catch (error) {
      console.error('Failed to remove tag:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Title Editor */}
      <div>
        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              onBlur={handleTitleSave}
              disabled={isUpdating}
              className="flex-1 px-2 py-1 text-lg font-bold bg-white dark:bg-gray-800 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h2
              onClick={() => setIsEditingTitle(true)}
              className="flex-1 text-xl font-bold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Click to edit title"
            >
              {chat.title || 'Untitled Chat'}
            </h2>

            {/* Favorite Button */}
            <button
              onClick={handleFavoriteToggle}
              disabled={isUpdating}
              className={`p-2 rounded-lg transition-colors ${
                chat.is_favorite
                  ? 'text-yellow-500 hover:text-yellow-600'
                  : 'text-gray-400 hover:text-yellow-500'
              }`}
              aria-label="Toggle favorite"
              title={chat.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg className="w-5 h-5" fill={chat.is_favorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Category Selector */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Category
        </label>
        <select
          value={chat.category || ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
          disabled={isUpdating}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">No category</option>
          {PREDEFINED_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {chat.tags && chat.tags.length > 0 ? (
            chat.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
              >
                {tag}
                <button
                  onClick={() => handleTagRemove(tag)}
                  disabled={isUpdating}
                  className="hover:text-blue-600 dark:hover:text-blue-300"
                  aria-label={`Remove tag ${tag}`}
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-400">No tags yet</span>
          )}
        </div>

        {/* Add Tag Input */}
        <TagInput onAdd={handleTagAdd} disabled={isUpdating} />
      </div>
    </div>
  )
}

/**
 * TagInput Component - для добавления новых тегов
 */
interface TagInputProps {
  onAdd: (tag: string) => void
  disabled?: boolean
}

function TagInput({ onAdd, disabled }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim())
      setInputValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Add tag..."
        className="flex-1 px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !inputValue.trim()}
        className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Add
      </button>
    </div>
  )
}
