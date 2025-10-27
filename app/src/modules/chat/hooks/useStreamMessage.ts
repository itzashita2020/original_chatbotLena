/**
 * useStreamMessage Hook
 *
 * Hook for streaming AI messages using Server-Sent Events (SSE).
 * Provides real-time streaming of AI responses word-by-word.
 */

'use client'

import { useState, useCallback } from 'react'
import { useChatStore } from '@/store/chatStore'
import { MessageService } from '../services/MessageService'

interface UseStreamMessageReturn {
  streamMessage: (chatId: string, content: string, attachmentUrls?: string[], model?: string, skipUserMessage?: boolean) => Promise<void>
  isStreaming: boolean
  error: string | null
  abortStream: () => void
}

export function useStreamMessage(): UseStreamMessageReturn {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [abortController, setAbortController] = useState<AbortController | null>(null)

  const addMessage = useChatStore((state) => state.addMessage)

  const streamMessage = useCallback(
    async (chatId: string, content: string, attachmentUrls: string[] = [], model = 'gpt-4', skipUserMessage = false) => {
      setIsStreaming(true)
      setError(null)

      // Create abort controller for cancellation
      const controller = new AbortController()
      setAbortController(controller)

      try {
        // 1. Add user message immediately to UI (skip if already created with attachments)
        if (!skipUserMessage) {
          const userMessage = await MessageService.saveMessage({
            chat_id: chatId,
            role: 'user',
            content,
            model
          })
          addMessage(userMessage)
        }

        // 2. Create placeholder for assistant message
        const tempAssistantMessage = {
          id: 'temp-' + Date.now(),
          chat_id: chatId,
          role: 'assistant' as const,
          content: '',
          created_at: new Date().toISOString(),
          tokens_used: null,
          model: null,
          metadata: null
        }
        addMessage(tempAssistantMessage)

        // 3. Start streaming
        const response = await fetch('/api/ai/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId, content, attachmentUrls, model, skipUserMessage }),
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error('Failed to stream message')
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          throw new Error('Response body is null')
        }

        let accumulatedContent = ''

        // Read stream chunks
        while (true) {
          const { done, value } = await reader.read()

          if (done) break

          // Decode chunk
          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6))

              if (data.type === 'chunk') {
                // Accumulate content
                accumulatedContent += data.content

                // Update message in store
                useChatStore.setState((state) => ({
                  messages: state.messages.map((msg) =>
                    msg.id === tempAssistantMessage.id
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                }))
              } else if (data.type === 'done') {
                // Stream complete - the message is already saved on server
                // Just update the temp message with final data
                useChatStore.setState((state) => ({
                  messages: state.messages.map((msg) =>
                    msg.id === tempAssistantMessage.id
                      ? {
                          ...msg,
                          content: accumulatedContent,
                          tokens_used: data.tokens_used
                        }
                      : msg
                  )
                }))
              } else if (data.type === 'error') {
                throw new Error(data.error)
              }
            }
          }
        }

        setIsStreaming(false)
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            setError('Stream aborted')
          } else {
            setError(err.message)
          }
        } else {
          setError('Unknown error occurred')
        }
        setIsStreaming(false)
      } finally {
        setAbortController(null)
      }
    },
    [addMessage]
  )

  const abortStream = useCallback(() => {
    if (abortController) {
      abortController.abort()
    }
  }, [abortController])

  return {
    streamMessage,
    isStreaming,
    error,
    abortStream
  }
}
