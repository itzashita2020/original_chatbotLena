/**
 * Search API Route
 *
 * GET /api/search?q=query&category=...&tags=...&favorite=...&limit=...
 *
 * Searches through chat titles and message content
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { SearchFilters } from '@/modules/search/types'
import type { Chat, Message } from '@/lib/supabase/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)

    // Get query parameter
    const query = searchParams.get('q') || searchParams.get('query') || ''

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        {
          results: [],
          total: 0,
          query: '',
        },
        { status: 200 }
      )
    }

    // Parse filters
    const filters: SearchFilters = {}

    const category = searchParams.get('category')
    if (category) {
      filters.category = category
    }

    const tagsParam = searchParams.get('tags')
    if (tagsParam) {
      filters.tags = tagsParam.split(',').map((tag) => tag.trim())
    }

    const favoriteParam = searchParams.get('favorite')
    if (favoriteParam) {
      filters.is_favorite = favoriteParam === 'true'
    }

    const dateFrom = searchParams.get('date_from')
    if (dateFrom) {
      filters.date_from = dateFrom
    }

    const dateTo = searchParams.get('date_to')
    if (dateTo) {
      filters.date_to = dateTo
    }

    // Parse limit
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : 50

    // Search in chats
    let chatQuery = supabase
      .from('chats')
      .select('*')
      .ilike('title', `%${query}%`)

    if (filters.category) {
      chatQuery = chatQuery.eq('category', filters.category)
    }
    if (filters.is_favorite !== undefined) {
      chatQuery = chatQuery.eq('is_favorite', filters.is_favorite)
    }
    if (filters.tags && filters.tags.length > 0) {
      chatQuery = chatQuery.contains('tags', filters.tags)
    }
    if (filters.date_from) {
      chatQuery = chatQuery.gte('created_at', filters.date_from)
    }
    if (filters.date_to) {
      chatQuery = chatQuery.lte('created_at', filters.date_to)
    }

    chatQuery = chatQuery.limit(limit)

    const { data: chats, error: chatsError } = await chatQuery

    if (chatsError) {
      console.error('Error searching chats:', chatsError)
    }

    // Search in messages
    let messageQuery = supabase
      .from('messages')
      .select('*, chats!inner(*)')
      .ilike('content', `%${query}%`)

    if (filters.category) {
      messageQuery = messageQuery.eq('chats.category', filters.category)
    }
    if (filters.is_favorite !== undefined) {
      messageQuery = messageQuery.eq('chats.is_favorite', filters.is_favorite)
    }
    if (filters.tags && filters.tags.length > 0) {
      messageQuery = messageQuery.contains('chats.tags', filters.tags)
    }
    if (filters.date_from) {
      messageQuery = messageQuery.gte('created_at', filters.date_from)
    }
    if (filters.date_to) {
      messageQuery = messageQuery.lte('created_at', filters.date_to)
    }

    messageQuery = messageQuery.limit(limit)

    const { data: messages, error: messagesError } = await messageQuery

    if (messagesError) {
      console.error('Error searching messages:', messagesError)
    }

    // Build results
    const results: any[] = []

    // Add chat results
    if (chats) {
      chats.forEach((chat) => {
        results.push({
          type: 'chat',
          chat: chat as Chat,
          highlight: highlightMatch(chat.title || '', query),
          score: calculateRelevance(chat.title || '', query),
        })
      })
    }

    // Add message results
    if (messages) {
      messages.forEach((item: any) => {
        results.push({
          type: 'message',
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
          highlight: highlightMatch(item.content || '', query),
          score: calculateRelevance(item.content || '', query),
        })
      })
    }

    // Sort by relevance
    results.sort((a, b) => (b.score || 0) - (a.score || 0))

    return NextResponse.json(
      {
        results: results.slice(0, limit),
        total: results.length,
        query: query,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Search error:', error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Search failed',
      },
      { status: 500 }
    )
  }
}

function highlightMatch(text: string, query: string): string {
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

function calculateRelevance(text: string, query: string): number {
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
 * Get search metadata (categories, tags)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    if (action === 'categories') {
      const { data, error } = await supabase
        .from('chats')
        .select('category')
        .not('category', 'is', null)

      if (error) {
        throw error
      }

      const categories = Array.from(
        new Set(data.map((chat) => chat.category).filter(Boolean))
      ) as string[]

      return NextResponse.json({ categories: categories.sort() }, { status: 200 })
    }

    if (action === 'tags') {
      const limit = body.limit || 10

      const { data, error } = await supabase
        .from('chats')
        .select('tags')
        .not('tags', 'is', null)

      if (error) {
        throw error
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
      const tags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([tag]) => tag)

      return NextResponse.json({ tags }, { status: 200 })
    }

    if (action === 'quick') {
      const query = body.query || ''
      const limit = body.limit || 10

      if (!query || query.trim().length === 0) {
        return NextResponse.json({ results: [] }, { status: 200 })
      }

      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .ilike('title', `%${query}%`)
        .limit(limit)

      if (error) {
        throw error
      }

      return NextResponse.json({ results: data || [] }, { status: 200 })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Search metadata error:', error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Operation failed',
      },
      { status: 500 }
    )
  }
}
