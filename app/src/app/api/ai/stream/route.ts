/**
 * API Route: /api/ai/stream
 *
 * POST - Stream AI completion using Server-Sent Events (SSE)
 *
 * This endpoint streams AI responses word-by-word as they're generated,
 * providing a better UX than waiting for the full response.
 */

import { NextRequest } from 'next/server'
import { OpenAIService } from '@/modules/ai'
import { createClient } from '@/lib/supabase/server'
import type { MessageInsert } from '@/modules/chat/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get current user for authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body = await request.json()
    const { chatId, content, attachmentUrls = [], model = 'gpt-4', skipUserMessage = false } = body

    console.log('🔍 AI Stream Request:', {
      chatId,
      content: content.substring(0, 50),
      attachmentUrls,
      model,
      skipUserMessage
    })

    // Detect if we have images attached
    const hasImages = attachmentUrls.some((url: string) =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
    )

    console.log('🖼️ Has images:', hasImages, 'URLs:', attachmentUrls)

    // Use gpt-4o for images OR documents (gpt-4o has 128k context vs gpt-4's 8k)
    // This prevents context length errors when loading large documents
    const hasDocuments = attachmentUrls.some((url: string) =>
      /\.(pdf|doc|docx|txt|md)$/i.test(url)
    )

    let finalModel = model
    if (hasImages) {
      finalModel = 'gpt-4o' // Images require multimodal model
      console.log('🤖 Using model: gpt-4o (multimodal - images)')
    } else if (hasDocuments || model === 'gpt-4') {
      // Use gpt-4o for documents to avoid context length errors
      // gpt-4o has 128k tokens vs gpt-4's 8k tokens
      finalModel = 'gpt-4o'
      console.log('🤖 Using model: gpt-4o (large context for documents)')
    } else {
      console.log('🤖 Using model:', finalModel)
    }

    // 1. Save user message (skip if already created with attachments)
    if (!skipUserMessage) {
      const userMessageData: MessageInsert = {
        chat_id: chatId,
        role: 'user',
        content,
        tokens_used: null,
        model: finalModel,
        metadata: null
      }

      const { error: saveUserError } = await supabase
        .from('messages')
        .insert(userMessageData)

      if (saveUserError) {
        throw new Error(`Failed to save user message: ${saveUserError.message}`)
      }
    } else {
      console.log('⏭️ Skipping user message creation (already created with attachments)')
    }

    // 2. Get conversation history
    const { data: messages, error: fetchError } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })

    if (fetchError) {
      throw new Error(`Failed to fetch messages: ${fetchError.message}`)
    }

    // 3. Load attachments for the last user message (if any)
    const documentTexts: string[] = []
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'user') {
        const { data: attachments, error: attachmentError } = await supabase
          .from('message_attachments')
          .select('*')
          .eq('message_id', lastMessage.id)

        if (!attachmentError && attachments && attachments.length > 0) {
          console.log('📎 Found attachments for message:', attachments.length)

          // Extract text from non-image attachments
          for (const attachment of attachments) {
            if (!attachment.file_type.startsWith('image/')) {
              const extractedText = attachment.metadata?.extracted_text
              if (extractedText) {
                documentTexts.push(`--- Content of ${attachment.file_name} ---\n${extractedText}\n--- End of ${attachment.file_name} ---`)
                console.log(`📄 Loaded text from ${attachment.file_name}: ${extractedText.length} chars`)
              }
            }
          }
        }
      }
    }

    // Format messages for OpenAI
    let openAIMessages: any[]

    if (hasImages && attachmentUrls.length > 0) {
      // For vision: format all messages except the last one as text
      const historyMessages = messages.slice(0, -1).map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content
      }))

      // Format the last message with images
      const imageUrls = attachmentUrls.filter((url: string) =>
        /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
      )

      // Combine user's message with document texts
      let userText = content
      if (documentTexts.length > 0) {
        userText = `${content}\n\n${documentTexts.join('\n\n')}`
      }

      const visionContent: any[] = [
        { type: 'text', text: userText }
      ]

      // Add all image URLs
      for (const imageUrl of imageUrls) {
        visionContent.push({
          type: 'image_url',
          image_url: { url: imageUrl }
        })
      }

      openAIMessages = [
        ...OpenAIService.formatMessages(historyMessages),
        {
          role: 'user',
          content: visionContent
        }
      ]
    } else {
      // Regular text messages (with optional document texts)
      const formattedMessages = messages.map((msg, index) => {
        // For the last user message, append document texts
        if (index === messages.length - 1 && msg.role === 'user' && documentTexts.length > 0) {
          return {
            role: msg.role as 'user' | 'assistant' | 'system',
            content: `${msg.content}\n\n${documentTexts.join('\n\n')}`
          }
        }
        return {
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content
        }
      })

      openAIMessages = OpenAIService.formatMessages(formattedMessages)
    }

    // 3. Create streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullContent = ''
          let tokensUsed = 0

          // Stream chunks from OpenAI
          for await (const chunk of OpenAIService.streamCompletion({
            messages: openAIMessages,
            model: finalModel
          })) {
            if (chunk.content) {
              fullContent += chunk.content

              // Send chunk to client
              const data = JSON.stringify({
                type: 'chunk',
                content: chunk.content
              })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }

            // Last chunk with finish reason
            if (chunk.finish_reason) {
              // Estimate tokens (we don't get usage in streaming mode)
              tokensUsed = OpenAIService.estimateTokens(fullContent)

              // Save assistant message
              const assistantMessageData: MessageInsert = {
                chat_id: chatId,
                role: 'assistant',
                content: fullContent,
                tokens_used: tokensUsed,
                model: finalModel,
                metadata: null
              }

              const { error: saveAssistantError } = await supabase
                .from('messages')
                .insert(assistantMessageData)

              if (saveAssistantError) {
                throw new Error(`Failed to save assistant message: ${saveAssistantError.message}`)
              }

              // Send completion event
              const doneData = JSON.stringify({
                type: 'done',
                tokens_used: tokensUsed,
                finish_reason: chunk.finish_reason
              })
              controller.enqueue(encoder.encode(`data: ${doneData}\n\n`))
            }
          }

          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)

          // Send error event
          const errorData = JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })
  } catch (error) {
    console.error('POST /api/ai/stream error:', error)

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to stream completion' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
