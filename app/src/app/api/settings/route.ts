/**
 * API Route: /api/settings
 *
 * GET  - Get user settings (including API key status)
 * POST - Save/Update user settings
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    // Fetch user settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (settingsError && settingsError.code !== 'PGRST116') {
      throw new Error(`Failed to fetch settings: ${settingsError.message}`)
    }

    // Return settings with flag for API key presence (don't return actual key)
    return NextResponse.json(
      {
        settings: {
          hasApiKey: !!settings?.openai_api_key,
          created_at: settings?.created_at,
          updated_at: settings?.updated_at,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('GET /api/settings error:', error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

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
    const { openai_api_key } = body

    // Validate API key format (basic check)
    if (openai_api_key && !openai_api_key.startsWith('sk-')) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key format' },
        { status: 400 }
      )
    }

    // Check if settings already exist
    const { data: existingSettings } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (existingSettings) {
      // Update existing settings
      const { error: updateError } = await supabase
        .from('user_settings')
        .update({
          openai_api_key,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      if (updateError) {
        throw new Error(`Failed to update settings: ${updateError.message}`)
      }
    } else {
      // Insert new settings
      const { error: insertError } = await supabase
        .from('user_settings')
        .insert({
          user_id: user.id,
          openai_api_key,
        })

      if (insertError) {
        throw new Error(`Failed to create settings: ${insertError.message}`)
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Settings saved successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('POST /api/settings error:', error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save settings' },
      { status: 500 }
    )
  }
}
