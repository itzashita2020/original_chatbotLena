/**
 * Search Module Types
 *
 * Public types for full-text search functionality (UNIQUE FEATURE 🌟)
 */

import type { Chat, Message } from '@/lib/supabase/types'

export interface SearchQuery {
  query: string
  filters?: SearchFilters
  limit?: number
}

export interface SearchFilters {
  category?: string
  tags?: string[]
  is_favorite?: boolean
  date_from?: string
  date_to?: string
}

export interface SearchResult {
  type: 'chat' | 'message'
  chat: Chat
  message?: Message
  highlight?: string
  score?: number
}

export interface SearchResults {
  results: SearchResult[]
  total: number
  query: string
}
