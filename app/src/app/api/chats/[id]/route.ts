/**
 * API Route: /api/chats/[id]
 *
 * GET    - Get single chat with messages
 * PUT    - Update chat (title, category, tags, etc.)
 * DELETE - Delete chat
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ChatUpdate } from '@/modules/chat/types'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const supabase = createClient()
    const { id } = params

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch chat
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select('*')
      .eq('id', id)
      .single()

    if (chatError) {
      if (chatError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
      }
      throw new Error(`Failed to fetch chat: ${chatError.message}`)
    }

    // Fetch messages
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', id)
      .order('created_at', { ascending: true })

    if (messagesError) {
      throw new Error(`Failed to fetch messages: ${messagesError.message}`)
    }

    return NextResponse.json(
      {
        chat: {
          ...chat,
          messages: messages || [],
          messageCount: messages?.length || 0,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(`GET /api/chats/${params.id} error:`, error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch chat' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const supabase = createClient()
    const { id } = params

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, category, tags, is_favorite, metadata } = body

    const updateData: ChatUpdate = {}
    if (title !== undefined) updateData.title = title
    if (category !== undefined) updateData.category = category
    if (tags !== undefined) updateData.tags = tags
    if (is_favorite !== undefined) updateData.is_favorite = is_favorite
    if (metadata !== undefined) updateData.metadata = metadata

    const { data: chat, error } = await supabase
      .from('chats')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update chat: ${error.message}`)
    }

    return NextResponse.json({ chat }, { status: 200 })
  } catch (error) {
    console.error(`PUT /api/chats/${params.id} error:`, error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update chat' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const supabase = createClient()
    const { id } = params

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase.from('chats').delete().eq('id', id)

    if (error) {
      throw new Error(`Failed to delete chat: ${error.message}`)
    }

    return NextResponse.json(
      { success: true, message: 'Chat deleted' },
      { status: 200 }
    )
  } catch (error) {
    console.error(`DELETE /api/chats/${params.id} error:`, error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete chat' },
      { status: 500 }
    )
  }
}
