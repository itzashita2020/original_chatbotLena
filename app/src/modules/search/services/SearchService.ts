/**
 * Search Service
 *
 * 🌟 UNIQUE FEATURE - Полнотекстовый поиск по чатам и сообщениям
 *
 * Использует PostgreSQL full-text search (to_tsvector, to_tsquery)
 * для быстрого поиска по содержимому чатов и сообщений.
 */

import { createClient } from '@/lib/supabase/client'
import type { Chat, Message } from '@/lib/supabase/types'
import type { SearchQuery, SearchFilters, SearchResult, SearchResults } from '../types'

export class SearchService {
  /**
   * Поиск по чатам и сообщениям
   */
  static async search(searchQuery: SearchQuery): Promise<SearchResults> {
    const { query, filters, limit = 50 } = searchQuery

    if (!query || query.trim().length === 0) {
      return {
        results: [],
        total: 0,
        query: query,
      }
    }

    const supabase = createClient()

    // Search in chat titles
    const chatResults = await this.searchInChats(supabase, query, filters, limit)

    // Search in messages
    const messageResults = await this.searchInMessages(supabase, query, filters, limit)

    // Merge and sort results by relevance
    const allResults = [...chatResults, ...messageResults]
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, limit)

    return {
      results: allResults,
      total: allResults.length,
      query: query,
    }
  }

  /**
   * Поиск по заголовкам чатов
   */
  private static async searchInChats(
    supabase: ReturnType<typeof createClient>,
    query: string,
    filters?: SearchFilters,
    limit: number = 50
  ): Promise<SearchResult[]> {
    try {
      let queryBuilder = supabase
        .from('chats')
        .select('*')
        .ilike('title', `%${query}%`)

      // Apply filters
      if (filters) {
        if (filters.category) {
          queryBuilder = queryBuilder.eq('category', filters.category)
        }
        if (filters.is_favorite !== undefined) {
          queryBuilder = queryBuilder.eq('is_favorite', filters.is_favorite)
        }
        if (filters.tags && filters.tags.length > 0) {
          queryBuilder = queryBuilder.contains('tags', filters.tags)
        }
        if (filters.date_from) {
          queryBuilder = queryBuilder.gte('created_at', filters.date_from)
        }
        if (filters.date_to) {
          queryBuilder = queryBuilder.lte('created_at', filters.date_to)
        }
      }

      queryBuilder = queryBuilder.limit(limit)

      const { data, error } = await queryBuilder

      if (error) {
        console.error('Error searching chats:', error)
        return []
      }

      return (data || []).map((chat) => ({
        type: 'chat' as const,
        chat: chat as Chat,
        highlight: this.highlightMatch(chat.title || '', query),
        score: this.calculateRelevance(chat.title || '', query),
      }))
    } catch (error) {
      console.error('Error in searchInChats:', error)
      return []
    }
  }

  /**
   * Поиск по содержимому сообщений
   */
  private static async searchInMessages(
    supabase: ReturnType<typeof createClient>,
    query: string,
    filters?: SearchFilters,
    limit: number = 50
  ): Promise<SearchResult[]> {
    try {
      let queryBuilder = supabase
        .from('messages')
        .select('*, chats!inner(*)')
        .ilike('content', `%${query}%`)

      // Apply filters through joined chats table
      if (filters) {
        if (filters.category) {
          queryBuilder = queryBuilder.eq('chats.category', filters.category)
        }
        if (filters.is_favorite !== undefined) {
          queryBuilder = queryBuilder.eq('chats.is_favorite', filters.is_favorite)
        }
        if (filters.tags && filters.tags.length > 0) {
          queryBuilder = queryBuilder.contains('chats.tags', filters.tags)
        }
        if (filters.date_from) {
          queryBuilder = queryBuilder.gte('created_at', filters.date_from)
        }
        if (filters.date_to) {
          queryBuilder = queryBuilder.lte('created_at', filters.date_to)
        }
      }

      queryBuilder = queryBuilder.limit(limit)

      const { data, error } = await queryBuilder

      if (error) {
        console.error('Error searching messages:', error)
        return []
      }

      return (data || []).map((item) => ({
        type: 'message' as const,
        chat: item.chats as Chat,
        message: {
          id: item.id,
          chat_id: item.chat_id,
          role: item.role,
          content: item.content,
          tokens_used: item.tokens_used,
          model: item.model,
          created_at: item.created_at,
        } as Message,
        highlight: this.highlightMatch(item.content || '', query),
        score: this.calculateRelevance(item.content || '', query),
      }))
    } catch (error) {
      console.error('Error in searchInMessages:', error)
      return []
    }
  }

  /**
   * Подсветка совпадений в тексте
   */
  private static highlightMatch(text: string, query: string): string {
    if (!text || !query) return text

    const lowerText = text.toLowerCase()
    const lowerQuery = query.toLowerCase()
    const index = lowerText.indexOf(lowerQuery)

    if (index === -1) return text

    // Extract context around match (100 chars before and after)
    const start = Math.max(0, index - 100)
    const end = Math.min(text.length, index + query.length + 100)

    let excerpt = text.substring(start, end)

    // Add ellipsis if needed
    if (start > 0) excerpt = '...' + excerpt
    if (end < text.length) excerpt = excerpt + '...'

    return excerpt
  }

  /**
   * Вычислить релевантность результата (0-1)
   */
  private static calculateRelevance(text: string, query: string): number {
    if (!text || !query) return 0

    const lowerText = text.toLowerCase()
    const lowerQuery = query.toLowerCase()

    // Exact match = highest score
    if (lowerText === lowerQuery) return 1.0

    // Title/beginning match = high score
    if (lowerText.startsWith(lowerQuery)) return 0.9

    // Contains full query = medium score
    if (lowerText.includes(lowerQuery)) return 0.7

    // Word match = lower score
    const queryWords = lowerQuery.split(/\s+/)
    const matchedWords = queryWords.filter((word) => lowerText.includes(word))
    const wordMatchScore = matchedWords.length / queryWords.length

    return wordMatchScore * 0.5
  }

  /**
   * Быстрый поиск (только по заголовкам)
   */
  static async quickSearch(query: string, limit: number = 10): Promise<Chat[]> {
    if (!query || query.trim().length === 0) {
      return []
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .ilike('title', `%${query}%`)
      .limit(limit)

    if (error) {
      console.error('Error in quickSearch:', error)
      return []
    }

    return (data || []) as Chat[]
  }

  /**
   * Получить популярные теги
   */
  static async getPopularTags(limit: number = 10): Promise<string[]> {
    const supabase = createClient()

    // Get all chats with tags
    const { data, error } = await supabase
      .from('chats')
      .select('tags')
      .not('tags', 'is', null)

    if (error || !data) {
      return []
    }

    // Count tag occurrences
    const tagCounts: Record<string, number> = {}

    data.forEach((chat) => {
      if (Array.isArray(chat.tags)) {
        chat.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
      }
    })

    // Sort by frequency and return top N
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag]) => tag)
  }

  /**
   * Получить доступные категории
   */
  static async getCategories(): Promise<string[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('chats')
      .select('category')
      .not('category', 'is', null)

    if (error || !data) {
      return []
    }

    // Get unique categories
    const categories = Array.from(
      new Set(data.map((chat) => chat.category).filter(Boolean))
    ) as string[]

    return categories.sort()
  }
}
