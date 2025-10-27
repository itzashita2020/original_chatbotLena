/**
 * ChatInput Component
 *
 * Input field for sending messages.
 * Supports Enter to send, Shift+Enter for new line.
 * Supports file attachments.
 *
 * Optimized with React.memo to prevent unnecessary re-renders.
 */

'use client'

import { useState, KeyboardEvent, FormEvent, memo, useRef } from 'react'

export interface AttachmentPreview {
  file: File
  preview: string
  type: string
}

interface ChatInputProps {
  onSend: (content: string, attachments?: File[]) => void
  disabled?: boolean
  placeholder?: string
}

function ChatInputComponent({
  onSend,
  disabled = false,
  placeholder = 'Type your message...'
}: ChatInputProps) {
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<AttachmentPreview[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if ((input.trim() || attachments.length > 0) && !disabled) {
      const files = attachments.map(att => att.file)
      onSend(input.trim(), files)
      setInput('')
      setAttachments([])
      // Clean up previews
      attachments.forEach(att => URL.revokeObjectURL(att.preview))
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter without Shift = submit
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    const newAttachments = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type,
    }))

    setAttachments(prev => [...prev, ...newAttachments])

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  const handleAttachClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 dark:border-gray-800 p-3 sm:p-4"
      role="form"
      aria-label="Message input form"
    >
      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700"
            >
              {attachment.type.startsWith('image/') ? (
                <img
                  src={attachment.preview}
                  alt={attachment.file.name}
                  className="h-20 w-20 object-cover"
                />
              ) : (
                <div className="h-20 w-20 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemoveAttachment(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove attachment"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 truncate">
                {attachment.file.name}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.txt,.md,.doc,.docx"
          multiple
          className="hidden"
          aria-label="File input"
        />

        {/* Attach button */}
        <button
          type="button"
          onClick={handleAttachClick}
          disabled={disabled}
          className="p-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400
                     hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed
                     min-h-[48px] min-w-[48px]"
          aria-label="Attach file"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          aria-label="Message input"
          aria-describedby="input-hint"
          aria-required="true"
          autoComplete="off"
          className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-800 px-3 py-3 sm:px-4 text-base sm:text-sm
                     text-gray-900 dark:text-gray-100
                     placeholder:text-gray-400 dark:placeholder:text-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     touch-manipulation"
          style={{
            minHeight: '48px',
            maxHeight: '200px'
          }}
        />
        <button
          type="submit"
          disabled={disabled || (!input.trim() && attachments.length === 0)}
          aria-label="Send message"
          aria-disabled={disabled || (!input.trim() && attachments.length === 0)}
          className="px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                     disabled:bg-gray-400 disabled:cursor-not-allowed
                     text-white rounded-lg font-medium transition-colors
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     min-h-[48px] min-w-[48px] touch-manipulation"
        >
          <span aria-hidden="true">Send</span>
          <span className="sr-only">Send message</span>
        </button>
      </div>
      <div
        id="input-hint"
        className="mt-2 text-xs text-gray-500 dark:text-gray-400"
        role="status"
        aria-live="polite"
      >
        Press Enter to send, Shift+Enter for new line. Attach images, PDFs, or documents.
      </div>
    </form>
  )
}

// Export memoized version
export const ChatInput = memo(ChatInputComponent)
