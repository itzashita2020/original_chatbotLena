/**
 * Database Types
 *
 * TypeScript types generated from Supabase schema
 * Based on: supabase/migrations/20251023_initial_schema.sql
 *
 * To regenerate (after schema changes):
 * npx supabase gen types typescript --project-id [your-project-id] > src/lib/supabase/types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          user_id: string
          title: string
          category: string | null
          tags: string[] | null
          is_favorite: boolean
          metadata: Json | null
          created_at: string
          updated_at: string
          last_message_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          category?: string | null
          tags?: string[] | null
          is_favorite?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
          last_message_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          category?: string | null
          tags?: string[] | null
          is_favorite?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
          last_message_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          tokens_used: number | null
          model: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          tokens_used?: number | null
          model?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          tokens_used?: number | null
          model?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      usage_stats: {
        Row: {
          id: string
          user_id: string
          total_messages: number
          total_tokens: number
          total_chats: number
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_messages?: number
          total_tokens?: number
          total_chats?: number
          date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_messages?: number
          total_tokens?: number
          total_chats?: number
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
      message_attachments: {
        Row: {
          id: string
          message_id: string
          file_name: string
          file_type: string
          file_size: number
          storage_path: string
          thumbnail_url: string | null
          width: number | null
          height: number | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          file_name: string
          file_type: string
          file_size: number
          storage_path: string
          thumbnail_url?: string | null
          width?: number | null
          height?: number | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          file_name?: string
          file_type?: string
          file_size?: number
          storage_path?: string
          thumbnail_url?: string | null
          width?: number | null
          height?: number | null
          metadata?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Chat = Database['public']['Tables']['chats']['Row']
export type ChatInsert = Database['public']['Tables']['chats']['Insert']
export type ChatUpdate = Database['public']['Tables']['chats']['Update']

export type Message = Database['public']['Tables']['messages']['Row']
export type MessageInsert = Database['public']['Tables']['messages']['Insert']
export type MessageUpdate = Database['public']['Tables']['messages']['Update']

export type UsageStats = Database['public']['Tables']['usage_stats']['Row']
export type UsageStatsInsert = Database['public']['Tables']['usage_stats']['Insert']
export type UsageStatsUpdate = Database['public']['Tables']['usage_stats']['Update']

export type MessageAttachment = Database['public']['Tables']['message_attachments']['Row']
export type MessageAttachmentInsert = Database['public']['Tables']['message_attachments']['Insert']
export type MessageAttachmentUpdate = Database['public']['Tables']['message_attachments']['Update']

// Utility type for Supabase client with our database
export type TypedSupabaseClient = ReturnType<typeof import('./client').createClient>
