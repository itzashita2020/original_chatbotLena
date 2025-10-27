/**
 * Auth Callback Route
 *
 * Handles OAuth callback from Supabase
 * Exchanges code for session and redirects to home
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = createClient()

    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code for session:', error)
      // Redirect to login with error
      return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
    }
  }

  // Redirect to home page after successful auth
  return NextResponse.redirect(`${origin}/`)
}
