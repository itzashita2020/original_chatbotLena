/**
 * User Module Types
 *
 * Public types for user profiles and settings
 */

import type { Profile } from '@/lib/supabase/types'

export type { Profile }

export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'ru'
  aiModel: 'gpt-4' | 'gpt-3.5-turbo'
  temperature: number // 0-2
  maxTokens: number
}

export interface ProfileUpdate {
  display_name?: string
  avatar_url?: string
}
