/**
 * Supabase Client for Browser (Client Components)
 *
 * Use this in:
 * - Client Components (with 'use client')
 * - React hooks
 * - Browser-side code
 *
 * @example
 * import { createClient } from '@/lib/supabase/client'
 *
 * const supabase = createClient()
 * const { data, error } = await supabase.from('chats').select()
 */

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
