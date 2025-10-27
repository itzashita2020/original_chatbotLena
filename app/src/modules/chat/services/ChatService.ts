/**
 * ChatService - CRUD operations for chats
 *
 * Handles all chat-related database operations using Supabase.
 * Uses RLS policies for security - user can only access their own chats.
 */

import { createClient } from '@/lib/supabase/client'
import type { Json } from '@/lib/supabase/types'
import type {
  Chat,
  ChatInsert,
  ChatUpdate,
  ChatWithMessages
} from '../types'

export class ChatService {
  /**
   * Get all chats for current user
   * Sorted by last_message_at (most recent first)
   */
  static async getChats(): Promise<Chat[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .order('last_message_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch chats: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get single chat by ID with all messages
   */
  static async getChat(chatId: string): Promise<ChatWithMessages | null> {
    const supabase = createClient()

    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .single()

    if (chatError) {
      if (chatError.code === 'PGRST116') {
        return null // Chat not found
      }
      throw new Error(`Failed to fetch chat: ${chatError.message}`)
    }

    // Fetch messages separately
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })

    if (messagesError) {
      throw new Error(`Failed to fetch messages: ${messagesError.message}`)
    }

    return {
      ...chat,
      messages: messages || [],
      messageCount: messages?.length || 0
    }
  }

  /**
   * Create new chat
   * If title is not provided, it will default to 'New Chat'
   * Title can be auto-generated later via OpenAI
   */
  static async createChat(params: {
    title?: string
    category?: string
    tags?: string[]
    metadata?: Json
  }): Promise<Chat> {
    const supabase = createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('User not authenticated')
    }

    const chatData: ChatInsert = {
      user_id: user.id,
      title: params.title || 'New Chat',
      category: params.category || null,
      tags: params.tags || null,
      is_favorite: false,
      metadata: params.metadata || null
    }

    const { data, error } = await supabase
      .from('chats')
      .insert(chatData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create chat: ${error.message}`)
    }

    return data
  }

  /**
   * Update chat (title, category, tags, favorite status, etc.)
   */
  static async updateChat(chatId: string, updates: {
    title?: string
    category?: string | null
    tags?: string[] | null
    is_favorite?: boolean
    metadata?: Json | null
  }): Promise<Chat> {
    const supabase = createClient()

    const chatUpdate: ChatUpdate = {
      ...updates
    }

    const { data, error } = await supabase
      .from('chats')
      .update(chatUpdate)
      .eq('id', chatId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update chat: ${error.message}`)
    }

    return data
  }

  /**
   * Delete chat (will cascade delete all messages)
   */
  static async deleteChat(chatId: string): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId)

    if (error) {
      throw new Error(`Failed to delete chat: ${error.message}`)
    }
  }

  /**
   * Auto-generate chat title from first user message using OpenAI
   * This will be called after first message is sent
   */
  static async generateTitle(chatId: string, firstMessage: string): Promise<string> {
    // TODO: Implement in Phase 2.2 after OpenAI service is ready
    // For now, use simple heuristic: first 3-5 words
    const words = firstMessage.trim().split(/\s+/).slice(0, 5)
    const title = words.join(' ')
    return title.length > 50 ? title.substring(0, 47) + '...' : title
  }

  /**
   * Search chats by title
   * Uses PostgreSQL full-text search
   */
  static async searchChats(query: string): Promise<Chat[]> {
    const supabase = createClient()

    // Simple ILIKE search for now
    // Will be enhanced with to_tsvector in Phase 3
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .ilike('title', `%${query}%`)
      .order('last_message_at', { ascending: false })
      .limit(20)

    if (error) {
      throw new Error(`Failed to search chats: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get chats by category
   */
  static async getChatsByCategory(category: string): Promise<Chat[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('category', category)
      .order('last_message_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch chats by category: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get favorite chats
   */
  static async getFavoriteChats(): Promise<Chat[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('is_favorite', true)
      .order('last_message_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch favorite chats: ${error.message}`)
    }

    return data || []
  }
}
