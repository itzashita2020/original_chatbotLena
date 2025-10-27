/**
 * Export API Route
 *
 * GET /api/export/[chatId]?format=json|markdown|txt|pdf&includeMetadata=true&includeTimestamps=true
 *
 * Exports a chat conversation in the specified format
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ExportService } from '@/modules/export/services/ExportService'
import type { ExportFormat, ExportOptions } from '@/modules/export/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
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

    const { chatId } = params
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const format = (searchParams.get('format') || 'json') as ExportFormat
    const includeMetadata = searchParams.get('includeMetadata') !== 'false'
    const includeTimestamps = searchParams.get('includeTimestamps') !== 'false'

    // Validate format
    if (!['json', 'markdown', 'txt', 'pdf'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Allowed: json, markdown, txt, pdf' },
        { status: 400 }
      )
    }

    // Fetch chat data
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .single()

    if (chatError || !chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
    }

    // Fetch messages
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })

    if (messagesError) {
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Cannot export chat with no messages' }, { status: 400 })
    }

    // Export options
    const options: ExportOptions = {
      format,
      includeMetadata,
      includeTimestamps,
    }

    // Export chat
    const result = await ExportService.exportChat(chat, messages, options)

    // Return file as download
    const contentType = ExportService.getContentType(format)
    const headers = new Headers()
    headers.set('Content-Type', contentType)
    headers.set('Content-Disposition', `attachment; filename="${result.filename}"`)
    headers.set('Content-Length', result.size.toString())

    return new NextResponse(result.content, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('Export error:', error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: 'Failed to export chat' }, { status: 500 })
  }
}
