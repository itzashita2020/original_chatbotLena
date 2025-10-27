/**
 * MessageService - CRUD operations for messages
 *
 * Handles all message-related database operations.
 * Messages belong to chats and are protected by RLS.
 */

import { createClient } from '@/lib/supabase/client'
import type { Json } from '@/lib/supabase/types'
import type { Message, MessageInsert } from '../types'

export class MessageService {
  /**
   * Get all messages for a chat
   * Ordered by created_at (oldest first, chronological order)
   */
  static async getMessages(chatId: string): Promise<Message[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`)
    }

    return data || []
  }

  /**
   * Save a message to database
   * Trigger will automatically update chat.last_message_at
   */
  static async saveMessage(params: {
    chat_id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    tokens_used?: number
    model?: string
    metadata?: Json
  }): Promise<Message> {
    const supabase = createClient()

    const messageData: MessageInsert = {
      chat_id: params.chat_id,
      role: params.role,
      content: params.content,
      tokens_used: params.tokens_used || null,
      model: params.model || null,
      metadata: params.metadata || null
    }

    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to save message: ${error.message}`)
    }

    return data
  }

  /**
   * Save multiple messages at once (bulk insert)
   * Useful for importing conversation history
   */
  static async saveMessages(messages: Array<{
    chat_id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    tokens_used?: number
    model?: string
    metadata?: Json
  }>): Promise<Message[]> {
    const supabase = createClient()

    const messageData: MessageInsert[] = messages.map(msg => ({
      chat_id: msg.chat_id,
      role: msg.role,
      content: msg.content,
      tokens_used: msg.tokens_used || null,
      model: msg.model || null,
      metadata: msg.metadata || null
    }))

    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()

    if (error) {
      throw new Error(`Failed to save messages: ${error.message}`)
    }

    return data || []
  }

  /**
   * Delete all messages in a chat
   * (Called before deleting chat, or for "clear history" feature)
   */
  static async deleteMessages(chatId: string): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('chat_id', chatId)

    if (error) {
      throw new Error(`Failed to delete messages: ${error.message}`)
    }
  }

  /**
   * Delete a single message
   */
  static async deleteMessage(messageId: string): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)

    if (error) {
      throw new Error(`Failed to delete message: ${error.message}`)
    }
  }

  /**
   * Get message count for a chat
   */
  static async getMessageCount(chatId: string): Promise<number> {
    const supabase = createClient()

    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('chat_id', chatId)

    if (error) {
      throw new Error(`Failed to get message count: ${error.message}`)
    }

    return count || 0
  }

  /**
   * Get total token usage for a chat
   */
  static async getChatTokenUsage(chatId: string): Promise<number> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('messages')
      .select('tokens_used')
      .eq('chat_id', chatId)

    if (error) {
      throw new Error(`Failed to get token usage: ${error.message}`)
    }

    // Sum up all tokens
    const totalTokens = (data || []).reduce((sum, msg) => {
      return sum + (msg.tokens_used || 0)
    }, 0)

    return totalTokens
  }

  /**
   * Search messages by content
   * Will use PostgreSQL full-text search in Phase 3
   */
  static async searchMessages(query: string): Promise<Message[]> {
    const supabase = createClient()

    // Simple ILIKE search for now
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .ilike('content', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      throw new Error(`Failed to search messages: ${error.message}`)
    }

    return data || []
  }
}
