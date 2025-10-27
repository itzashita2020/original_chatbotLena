/**
 * API Route: /api/chats/[id]/messages
 *
 * GET  - Get all messages for a chat
 * POST - Send message and get AI response (with streaming)
 */

import { NextRequest, NextResponse } from 'next/server'
import { MessageService } from '@/modules/chat'
import { OpenAIService } from '@/modules/ai'
import { createClient } from '@/lib/supabase/server'

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
    const { id: chatId } = params
    const messages = await MessageService.getMessages(chatId)

    return NextResponse.json({ messages }, { status: 200 })
  } catch (error) {
    console.error(`GET /api/chats/${params.id}/messages error:`, error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: chatId } = params
    const body = await request.json()
    const { content, model = 'gpt-4' } = body

    // Get user and their API key
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's personal API key
    const { data: userSettings, error: settingsError } = await supabase
      .from('user_settings')
      .select('openai_api_key')
      .eq('user_id', user.id)
      .single()

    if (settingsError || !userSettings?.openai_api_key) {
      return NextResponse.json(
        {
          error: 'OpenAI API key not configured',
          message: 'Please add your OpenAI API key in Settings to use the chat.'
        },
        { status: 403 }
      )
    }

    const userApiKey = userSettings.openai_api_key

    // 1. Save user message
    const userMessage = await MessageService.saveMessage({
      chat_id: chatId,
      role: 'user',
      content,
      model
    })

    // 2. Get all previous messages for context
    const allMessages = await MessageService.getMessages(chatId)

    // 3. Format messages for OpenAI
    const openAIMessages = OpenAIService.formatMessages(
      allMessages.map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content
      }))
    )

    // 4. Get AI completion with user's API key
    const aiResponse = await OpenAIService.getCompletion({
      messages: openAIMessages,
      model,
      apiKey: userApiKey
    })

    // 5. Save AI response
    const assistantMessage = await MessageService.saveMessage({
      chat_id: chatId,
      role: 'assistant',
      content: aiResponse.content,
      tokens_used: aiResponse.tokens_used,
      model: aiResponse.model
    })

    return NextResponse.json({
      userMessage,
      assistantMessage,
      tokens_used: aiResponse.tokens_used
    }, { status: 201 })
  } catch (error) {
    console.error(`POST /api/chats/${params.id}/messages error:`, error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send message' },
      { status: 500 }
    )
  }
}
