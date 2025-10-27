/**
 * ChatWindow Component
 *
 * Main chat interface showing messages and input.
 * Handles streaming messages and auto-scroll.
 */

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useChatStore } from '@/store/chatStore'
import { useStreamMessage } from '../hooks/useStreamMessage'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { ExportButton } from '@/modules/export/components/ExportButton'
import { ChatMetadataEditor } from './ChatMetadataEditor'
import { ChatService } from '../services/ChatService'
import { NoMessagesEmptyState } from '@/components/ui/EmptyState'

export function ChatWindow() {
  const { currentChat, messages, isLoadingMessages, loadChats } = useChatStore()
  const { streamMessage, isStreaming } = useStreamMessage()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showMetadata, setShowMetadata] = useState(false)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Memoized handlers
  const handleSend = useCallback(async (content: string, attachments?: File[]) => {
    if (!currentChat) return

    try {
      // Upload attachments first if any
      const attachmentUrls: string[] = []

      if (attachments && attachments.length > 0) {
        // IMPORTANT: Create a real message first, so attachments can reference it
        // This is required for RLS policies to work
        const { MessageService } = await import('../services/MessageService')
        const userMessage = await MessageService.saveMessage({
          chat_id: currentChat.id,
          role: 'user',
          content,
          model: 'gpt-4'
        })

        console.log('📝 Created user message:', userMessage.id)

        // Add user message to UI immediately
        const { addMessage } = useChatStore.getState()
        addMessage(userMessage)

        // Now upload attachments with the real message ID
        for (const file of attachments) {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('messageId', userMessage.id)
          formData.append('chatId', currentChat.id)

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            attachmentUrls.push(data.attachment.url)
            console.log('📎 Uploaded file:', file.name, '→', data.attachment.url)
          } else {
            console.error('Failed to upload file:', file.name, response.status)
          }
        }

        console.log('📤 Sending to AI with attachments:', attachmentUrls)

        // Stream AI response with attachment URLs
        // Pass skipUserMessage = true because we already created the user message above
        await streamMessage(currentChat.id, content, attachmentUrls, 'gpt-4', true)
      } else {
        // No attachments - use normal flow
        await streamMessage(currentChat.id, content, attachmentUrls)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }, [currentChat, streamMessage])

  const handleMetadataUpdate = useCallback(async (updates: { title?: string; category?: string | null; tags?: string[] | null; is_favorite?: boolean }) => {
    if (!currentChat) return

    try {
      await ChatService.updateChat(currentChat.id, updates)
      // Reload chats to reflect changes
      await loadChats()
    } catch (error) {
      console.error('Failed to update chat metadata:', error)
      throw error
    }
  }, [currentChat, loadChats])

  if (!currentChat) {
    return (
      <main
        className="flex-1 flex items-center justify-center bg-white dark:bg-gray-950"
        role="main"
        aria-label="Main chat area"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome to AI Chat
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Select a chat or create a new one to start
          </p>
        </div>
      </main>
    )
  }

  if (isLoadingMessages) {
    return (
      <main
        className="flex-1 flex items-center justify-center bg-white dark:bg-gray-950"
        role="main"
        aria-label="Main chat area"
        aria-busy="true"
      >
        <div className="animate-pulse text-gray-500" role="status">
          Loading messages...
        </div>
      </main>
    )
  }

  return (
    <main
      className="flex-1 flex flex-col bg-white dark:bg-gray-950 h-full"
      role="main"
      aria-label="Chat conversation"
    >
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMetadata(!showMetadata)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle metadata editor"
              title={showMetadata ? 'Hide details' : 'Show details'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMetadata ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                )}
              </svg>
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {currentChat.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {messages.length} messages
              </p>
            </div>
          </div>

          {/* Export Button */}
          {messages.length > 0 && (
            <ExportButton
              chatId={currentChat.id}
              chatTitle={currentChat.title || 'chat'}
            />
          )}
        </div>

        {/* Metadata Editor */}
        {showMetadata && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
            <ChatMetadataEditor
              chat={currentChat}
              onUpdate={handleMetadataUpdate}
            />
          </div>
        )}
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.length === 0 ? (
          <NoMessagesEmptyState />
        ) : (
          <div>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Streaming indicator */}
            {isStreaming && (
              <div className="flex justify-start mb-4" role="status" aria-live="polite">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1" aria-hidden="true">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">AI is typing...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        disabled={isStreaming}
        placeholder={isStreaming ? 'AI is responding...' : 'Type your message...'}
      />
    </main>
  )
}
