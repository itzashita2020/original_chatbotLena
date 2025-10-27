/**
 * ChatMessage Component
 *
 * Displays a single message (user or assistant).
 * Handles markdown rendering and styling based on role.
 *
 * Optimized with React.memo to prevent unnecessary re-renders.
 * Phase 4: Added Framer Motion animations
 */

'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { messageBubble } from '@/lib/animations'
import type { Message } from '../types'

interface ChatMessageProps {
  message: Message
}

function ChatMessageComponent({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'

  return (
    <motion.div
      className={`flex w-full mb-4 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
      variants={messageBubble}
      initial="hidden"
      animate="visible"
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
        }`}
      >
        {/* Role label */}
        <div className="text-xs font-semibold mb-1 opacity-70">
          {isUser ? 'You' : isAssistant ? 'AI Assistant' : 'System'}
        </div>

        {/* Message content */}
        <div className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </div>

        {/* Timestamp */}
        <div className="text-xs mt-2 opacity-60">
          {new Date(message.created_at).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  )
}

// Export memoized version to prevent re-renders when parent re-renders
export const ChatMessage = memo(ChatMessageComponent)
