/**
 * Chat Module Types
 *
 * Public types for chat functionality (CORE MODULE)
 */

import type { Chat, Message, ChatInsert, ChatUpdate, MessageInsert, Json } from '@/lib/supabase/types'

export type { Chat, Message, ChatInsert, ChatUpdate, MessageInsert, Json }

export interface ChatWithMessages extends Chat {
  messages: Message[]
  messageCount?: number
}

export interface CreateChatParams {
  title?: string
  category?: string
  tags?: string[]
  metadata?: Json
}

export interface UpdateChatParams {
  title?: string
  category?: string
  tags?: string[]
  is_favorite?: boolean
  metadata?: Json
}

export interface SendMessageParams {
  chat_id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  tokens_used?: number
  model?: string
}

export type MessageRole = 'user' | 'assistant' | 'system'
