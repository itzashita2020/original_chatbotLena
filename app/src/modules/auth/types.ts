/**
 * Auth Module Types
 *
 * Public types for authentication
 */

import type { User as SupabaseUser, Session } from '@supabase/supabase-js'

export type User = SupabaseUser

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

export interface AuthError {
  message: string
  code?: string
}

export type AuthProvider = 'github' | 'google' | 'email'
