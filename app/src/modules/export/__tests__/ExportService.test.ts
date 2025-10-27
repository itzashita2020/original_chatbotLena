import { describe, it, expect } from 'vitest'
import { ExportService } from '../services/ExportService'
import type { Chat, Message } from '@/modules/chat/types'

describe('ExportService', () => {
  const mockChat: Chat = {
    id: 'test-chat-123',
    user_id: 'user-456',
    title: 'Test Chat',
    category: 'Technology',
    tags: ['testing', 'vitest'],
    is_favorite: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T12:00:00Z',
    last_message_at: '2025-01-01T12:00:00Z',
    metadata: null,
  }

  const mockMessages: Message[] = [
    {
      id: 'msg-1',
      chat_id: 'test-chat-123',
      role: 'user',
      content: 'Hello, how are you?',
      tokens_used: 5,
      model: 'gpt-4',
      created_at: '2025-01-01T10:00:00Z',
      metadata: null,
    },
    {
      id: 'msg-2',
      chat_id: 'test-chat-123',
      role: 'assistant',
      content: "I'm doing well, thank you! How can I help you today?",
      tokens_used: 12,
      model: 'gpt-4',
      created_at: '2025-01-01T10:01:00Z',
      metadata: null,
    },
  ]

  describe('exportChat - JSON format', () => {
    it('should export chat to JSON format', async () => {
      const result = await ExportService.exportChat(mockChat, mockMessages, {
        format: 'json',
        includeMetadata: true,
      })

      expect(result.filename).toContain('.json')
      expect(result.filename).toContain('test-chat')
      expect(result.format).toBe('json')
      expect(result.content).toContain('"title": "Test Chat"')
      expect(result.content).toContain('"role": "user"')
      expect(result.content).toContain('"role": "assistant"')
    })

    it('should include metadata when requested', async () => {
      const result = await ExportService.exportChat(mockChat, mockMessages, {
        format: 'json',
        includeMetadata: true,
      })

      const parsed = JSON.parse(result.content)
      expect(parsed.chat.category).toBe('Technology')
      expect(parsed.chat.tags).toEqual(['testing', 'vitest'])
      expect(parsed.chat.is_favorite).toBe(true)
    })

    it('should exclude metadata when not requested', async () => {
      const result = await ExportService.exportChat(mockChat, mockMessages, {
        format: 'json',
        includeMetadata: false,
      })

      const parsed = JSON.parse(result.content)
      expect(parsed.metadata).toBeUndefined()
    })
  })

  describe('exportChat - Markdown format', () => {
    it('should export chat to Markdown format', async () => {
      const result = await ExportService.exportChat(mockChat, mockMessages, {
        format: 'markdown',
        includeMetadata: true,
      })

      expect(result.filename).toContain('.md')
      expect(result.filename).toContain('test-chat')
      expect(result.format).toBe('markdown')
      expect(result.content).toContain('# Test Chat')
      expect(result.content).toContain('### You')
      expect(result.content).toContain('### Assistant')
      expect(result.content).toContain('Hello, how are you?')
    })

    it('should include metadata section', async () => {
      const result = await ExportService.exportChat(mockChat, mockMessages, {
        format: 'markdown',
        includeMetadata: true,
      })

      expect(result.content).toContain('**Category:** Technology')
      expect(result.content).toContain('**Tags:** testing, vitest')
      expect(result.content).toContain('**Favorite:**')
      expect(result.content).toContain('Yes')
    })
  })

  describe('exportChat - TXT format', () => {
    it('should export chat to TXT format', async () => {
      const result = await ExportService.exportChat(mockChat, mockMessages, {
        format: 'txt',
        includeMetadata: true,
      })

      expect(result.filename).toContain('.txt')
      expect(result.filename).toContain('test-chat')
      expect(result.format).toBe('txt')
      expect(result.content).toContain('Test Chat')
      expect(result.content).toContain('[YOU]')
      expect(result.content).toContain('[ASSISTANT]')
      expect(result.content).toContain('Hello, how are you?')
    })
  })

  describe('Edge cases', () => {
    it('should handle chat with no messages', async () => {
      const result = await ExportService.exportChat(mockChat, [], {
        format: 'json',
        includeMetadata: true,
      })

      const parsed = JSON.parse(result.content)
      expect(parsed.messages).toEqual([])
    })

    it('should handle chat with long title', async () => {
      const longTitleChat = {
        ...mockChat,
        title: 'This is a very long chat title that exceeds normal length limits and should be handled properly',
      }

      const result = await ExportService.exportChat(longTitleChat, mockMessages, {
        format: 'json',
        includeMetadata: false,
      })

      expect(result.filename).toBeDefined()
      expect(result.filename.length).toBeLessThan(255) // Filename length limit
    })

    it('should handle special characters in title', async () => {
      const specialTitleChat = {
        ...mockChat,
        title: 'Test: Chat <with> "special" characters?',
      }

      const result = await ExportService.exportChat(specialTitleChat, mockMessages, {
        format: 'json',
        includeMetadata: false,
      })

      // Filename should sanitize special characters
      expect(result.filename).not.toMatch(/[<>:"/\\|?*]/)
    })
  })
})
