/**
 * Export Module Types
 *
 * Public types for chat export functionality (UNIQUE FEATURE 🌟)
 */

import type { Chat, Message } from '@/lib/supabase/types'

export type ExportFormat = 'json' | 'markdown' | 'txt' | 'pdf'

export interface ExportOptions {
  format: ExportFormat
  includeMetadata?: boolean
  includeTimestamps?: boolean
}

export interface ExportData {
  chat: Chat
  messages: Message[]
  exported_at: string
  format: ExportFormat
}

export interface ExportResult {
  filename: string
  content: string
  size: number
  format: ExportFormat
}
