/**
 * API Route: /api/chats
 *
 * GET  - Get all chats for current user
 * POST - Create new chat
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ChatInsert } from '@/modules/chat/types'

export async function GET() {
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

    // Fetch chats
    const { data: chats, error } = await supabase
      .from('chats')
      .select('*')
      .order('last_message_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch chats: ${error.message}`)
    }

    return NextResponse.json({ chats: chats || [] }, { status: 200 })
  } catch (error) {
    console.error('GET /api/chats error:', error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch chats' },
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
    const { title, category, tags, metadata } = body

    const chatData: ChatInsert = {
      user_id: user.id,
      title: title || 'New Chat',
      category: category || null,
      tags: tags || null,
      is_favorite: false,
      metadata: metadata || null,
    }

    const { data: chat, error } = await supabase
      .from('chats')
      .insert(chatData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create chat: ${error.message}`)
    }

    return NextResponse.json({ chat }, { status: 201 })
  } catch (error) {
    console.error('POST /api/chats error:', error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create chat' },
      { status: 500 }
    )
  }
}
