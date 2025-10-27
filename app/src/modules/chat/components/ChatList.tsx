/**
 * ChatList Component
 *
 * Displays sidebar list of all user's chats.
 * Sorted by last_message_at (most recent first).
 */

'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useChatStore } from '@/store/chatStore'
import { SearchBar, SearchResults as SearchResultsComponent } from '@/modules/search'
import type { SearchResultsType } from '@/modules/search'
import { CategoryFilter } from './CategoryFilter'
import { ChatListSkeleton } from '@/components/ui/LoadingSkeleton'
import { NoChatsEmptyState, NoFavoritesEmptyState, NoCategoryChatsEmptyState } from '@/components/ui/EmptyState'

export function ChatList() {
  const {
    chats,
    currentChat,
    isLoadingChats,
    loadChats,
    selectChat,
    createNewChat,
    updateChat,
    deleteChat
  } = useChatStore()

  const [searchResults, setSearchResults] = useState<SearchResultsType | null>(null)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  // Filter chats - memoized to prevent unnecessary recalculations
  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      if (selectedCategory && chat.category !== selectedCategory) return false
      if (showFavoritesOnly && !chat.is_favorite) return false
      return true
    })
  }, [chats, selectedCategory, showFavoritesOnly])

  // Load chats on mount
  useEffect(() => {
    loadChats()
  }, [loadChats])

  // Memoized handlers to prevent unnecessary re-renders
  const handleNewChat = useCallback(async () => {
    try {
      const newChat = await createNewChat('New Chat', selectedCategory || undefined)
      await selectChat(newChat.id)
      // Exit search mode when creating new chat
      setIsSearchMode(false)
      setSearchResults(null)
    } catch (error) {
      console.error('Failed to create chat:', error)
    }
  }, [createNewChat, selectChat, selectedCategory])

  const handleSearch = useCallback((results: SearchResultsType) => {
    setSearchResults(results)
    setIsSearchMode(true)
  }, [])

  const handleClearSearch = useCallback(() => {
    setSearchResults(null)
    setIsSearchMode(false)
  }, [])

  const handleSelectSearchResult = useCallback((chatId: string) => {
    selectChat(chatId)
    setSearchResults(null)
    setIsSearchMode(false)
  }, [selectChat])

  const handleStartEdit = useCallback((chatId: string, currentTitle: string) => {
    setEditingChatId(chatId)
    setEditingTitle(currentTitle)
  }, [])

  const handleSaveEdit = useCallback(async (chatId: string) => {
    if (editingTitle.trim() && editingTitle !== chats.find(c => c.id === chatId)?.title) {
      try {
        await updateChat(chatId, { title: editingTitle.trim() })
      } catch (error) {
        console.error('Failed to update chat:', error)
      }
    }
    setEditingChatId(null)
    setEditingTitle('')
  }, [editingTitle, chats, updateChat])

  const handleCancelEdit = useCallback(() => {
    setEditingChatId(null)
    setEditingTitle('')
  }, [])

  const handleToggleFavorite = useCallback(async (chatId: string, isFavorite: boolean) => {
    try {
      await updateChat(chatId, { is_favorite: !isFavorite })
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }, [updateChat])

  const handleDeleteChat = useCallback(async (chatId: string) => {
    if (confirm('Are you sure you want to delete this chat?')) {
      try {
        await deleteChat(chatId)
      } catch (error) {
        console.error('Failed to delete chat:', error)
      }
    }
  }, [deleteChat])

  if (isLoadingChats) {
    return (
      <aside
        className="w-full sm:w-80 md:w-64 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full"
        role="complementary"
        aria-label="Chat list sidebar"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <ChatListSkeleton count={8} />
      </aside>
    )
  }

  return (
    <aside
      className="w-full sm:w-80 md:w-64 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full"
      role="complementary"
      aria-label="Chat list sidebar"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={handleNewChat}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] touch-manipulation"
            aria-label="Create new chat"
          >
            + New Chat
          </button>
          <a
            href="/settings"
            className="p-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 active:bg-gray-400 dark:active:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            title="Settings"
            aria-label="Go to settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </a>
        </div>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search..."
          className="w-full"
        />

        {/* Filters */}
        {!isSearchMode && (
          <div className="space-y-2">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                showFavoritesOnly
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300'
                  : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-yellow-500'
              }`}
            >
              <svg className="w-4 h-4" fill={showFavoritesOnly ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              {showFavoritesOnly ? 'Show All' : 'Favorites Only'}
            </button>
          </div>
        )}
      </div>

      {/* Chat List / Search Results */}
      <div className="flex-1 overflow-y-auto p-2">
        {isSearchMode ? (
          /* Search Results */
          <SearchResultsComponent
            results={searchResults}
            onSelectChat={handleSelectSearchResult}
          />
        ) : (
          /* Normal Chat List */
          filteredChats.length === 0 ? (
            // Empty states
            chats.length === 0 ? (
              <NoChatsEmptyState onCreateChat={handleNewChat} />
            ) : showFavoritesOnly ? (
              <NoFavoritesEmptyState />
            ) : selectedCategory ? (
              <NoCategoryChatsEmptyState category={selectedCategory} />
            ) : (
              <div className="text-center text-gray-500 mt-8 px-4">
                <p className="text-sm">No chats match filters</p>
                <p className="text-xs mt-2">Try different filters</p>
              </div>
            )
          ) : (
            <nav role="navigation" aria-label="Chat list">
              <ul className="space-y-1" role="list">
                {filteredChats.map((chat) => (
                  <li key={chat.id} role="listitem">
                    <div
                      className={`rounded-lg transition-colors ${
                        currentChat?.id === chat.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
                          : 'hover:bg-gray-200 dark:hover:bg-gray-800 border border-transparent'
                      }`}
                    >
                      {editingChatId === chat.id ? (
                        // Edit mode
                        <div className="p-3 space-y-2">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(chat.id)
                              if (e.key === 'Escape') handleCancelEdit()
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(chat.id)}
                              className="flex-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex-1 px-2 py-1 text-xs bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Normal mode
                        <div className="flex items-center gap-2 p-3">
                          <button
                            onClick={() => selectChat(chat.id)}
                            className="flex-1 text-left min-w-0"
                            aria-label={`Select chat: ${chat.title}`}
                            aria-current={currentChat?.id === chat.id ? 'page' : undefined}
                          >
                            <div className="font-medium text-sm truncate text-gray-900 dark:text-gray-100">
                              {chat.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {chat.last_message_at
                                ? new Date(chat.last_message_at).toLocaleDateString()
                                : new Date(chat.created_at).toLocaleDateString()}
                            </div>
                          </button>
                          <div className="flex flex-col gap-1">
                            {/* Favorite button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleFavorite(chat.id, chat.is_favorite)
                              }}
                              className="p-1 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
                              title={chat.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <svg className="w-4 h-4" fill={chat.is_favorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                              </svg>
                            </button>
                            {/* Edit button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStartEdit(chat.id, chat.title)
                              }}
                              className="p-1 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
                              title="Edit chat name"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            {/* Delete button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteChat(chat.id)
                              }}
                              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded"
                              title="Delete chat"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
          )
        )}
      </div>
    </aside>
  )
}
