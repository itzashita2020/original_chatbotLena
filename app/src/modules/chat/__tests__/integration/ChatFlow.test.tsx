/**
 * Chat Flow Integration Tests
 *
 * Tests the complete chat flow including:
 * - ChatWindow + ChatInput interaction
 * - Message sending and display
 * - Chat metadata updates
 * - Export functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatWindow } from '../../components/ChatWindow'
import { useChatStore } from '@/store/chatStore'
import { useStreamMessage } from '../../hooks/useStreamMessage'
import type { Chat, Message } from '../../types'

// Mock the hooks and services
vi.mock('@/store/chatStore')
vi.mock('../../hooks/useStreamMessage')
vi.mock('../../services/ChatService')
vi.mock('@/modules/export/components/ExportButton', () => ({
  ExportButton: ({ chatId, chatTitle }: { chatId: string; chatTitle: string }) => (
    <button data-testid="export-button">Export {chatTitle}</button>
  ),
}))

describe('Chat Flow Integration', () => {
  const mockChat: Chat = {
    id: 'test-chat-1',
    title: 'Test Chat',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_message_at: new Date().toISOString(),
    user_id: 'user-1',
    category: null,
    tags: null,
    is_favorite: false,
    metadata: null,
  }

  const mockMessages: Message[] = [
    {
      id: 'msg-1',
      chat_id: 'test-chat-1',
      role: 'user',
      content: 'Hello',
      created_at: new Date().toISOString(),
      tokens_used: null,
      model: null,
      metadata: null,
    },
    {
      id: 'msg-2',
      chat_id: 'test-chat-1',
      role: 'assistant',
      content: 'Hi there!',
      created_at: new Date().toISOString(),
      tokens_used: null,
      model: null,
      metadata: null,
    },
  ]

  const mockStreamMessage = vi.fn()
  const mockLoadChats = vi.fn()

  beforeEach(() => {
    // Setup default mocks
    vi.mocked(useChatStore).mockReturnValue({
      currentChat: mockChat,
      messages: mockMessages,
      isLoadingMessages: false,
      loadChats: mockLoadChats,
      // Add other required store properties
      chats: [mockChat],
      isLoadingChats: false,
      setCurrentChat: vi.fn(),
      addMessage: vi.fn(),
      updateMessage: vi.fn(),
    } as any)

    vi.mocked(useStreamMessage).mockReturnValue({
      streamMessage: mockStreamMessage,
      isStreaming: false,
      error: null,
      abortStream: vi.fn(),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial render', () => {
    it('should render chat window with messages', () => {
      render(<ChatWindow />)

      expect(screen.getByText('Test Chat')).toBeInTheDocument()
      expect(screen.getByText('2 messages')).toBeInTheDocument()
      expect(screen.getByText('Hello')).toBeInTheDocument()
      expect(screen.getByText('Hi there!')).toBeInTheDocument()
    })

    it('should show welcome screen when no chat is selected', () => {
      vi.mocked(useChatStore).mockReturnValue({
        currentChat: null,
        messages: [],
        isLoadingMessages: false,
        loadChats: mockLoadChats,
        chats: [],
        isLoadingChats: false,
        setCurrentChat: vi.fn(),
        addMessage: vi.fn(),
        updateMessage: vi.fn(),
      } as any)

      render(<ChatWindow />)

      expect(screen.getByText('Welcome to AI Chat')).toBeInTheDocument()
      expect(screen.getByText('Select a chat or create a new one to start')).toBeInTheDocument()
    })

    it('should show loading state when messages are loading', () => {
      vi.mocked(useChatStore).mockReturnValue({
        currentChat: mockChat,
        messages: [],
        isLoadingMessages: true,
        loadChats: mockLoadChats,
        chats: [mockChat],
        isLoadingChats: false,
        setCurrentChat: vi.fn(),
        addMessage: vi.fn(),
        updateMessage: vi.fn(),
      } as any)

      render(<ChatWindow />)

      expect(screen.getByText('Loading messages...')).toBeInTheDocument()
    })
  })

  describe('Message input and sending', () => {
    it('should render chat input', () => {
      render(<ChatWindow />)

      expect(screen.getByLabelText('Message input')).toBeInTheDocument()
      expect(screen.getByLabelText('Send message')).toBeInTheDocument()
    })

    it('should send message when form is submitted', async () => {
      const user = userEvent.setup()

      render(<ChatWindow />)

      const input = screen.getByLabelText('Message input')
      const sendButton = screen.getByLabelText('Send message')

      // Type a message
      await user.type(input, 'Test message')
      expect(input).toHaveValue('Test message')

      // Send the message
      await user.click(sendButton)

      // Verify streamMessage was called
      expect(mockStreamMessage).toHaveBeenCalledWith('test-chat-1', 'Test message')

      // Input should be cleared after sending
      await waitFor(() => {
        expect(input).toHaveValue('')
      })
    })

    it('should send message on Enter key', async () => {
      const user = userEvent.setup()

      render(<ChatWindow />)

      const input = screen.getByLabelText('Message input')

      // Type and press Enter
      await user.type(input, 'Quick message{Enter}')

      expect(mockStreamMessage).toHaveBeenCalledWith('test-chat-1', 'Quick message')
    })

    it('should not send empty messages', async () => {
      const user = userEvent.setup()

      render(<ChatWindow />)

      const input = screen.getByLabelText('Message input')
      const sendButton = screen.getByLabelText('Send message')

      // Try to send empty message
      await user.click(sendButton)

      expect(mockStreamMessage).not.toHaveBeenCalled()

      // Try to send whitespace
      await user.type(input, '   ')
      await user.click(sendButton)

      expect(mockStreamMessage).not.toHaveBeenCalled()
    })

    it('should disable input when streaming', () => {
      vi.mocked(useStreamMessage).mockReturnValue({
        streamMessage: mockStreamMessage,
        isStreaming: true,
        error: null,
        abortStream: vi.fn(),
      })

      render(<ChatWindow />)

      const input = screen.getByLabelText('Message input')
      const sendButton = screen.getByLabelText('Send message')

      expect(input).toBeDisabled()
      expect(sendButton).toBeDisabled()
      expect(input).toHaveAttribute('placeholder', 'AI is responding...')
    })

    it('should show streaming indicator when AI is typing', () => {
      vi.mocked(useStreamMessage).mockReturnValue({
        streamMessage: mockStreamMessage,
        isStreaming: true,
        error: null,
        abortStream: vi.fn(),
      })

      render(<ChatWindow />)

      expect(screen.getByText('AI is typing...')).toBeInTheDocument()
    })
  })

  describe('Chat metadata', () => {
    it('should toggle metadata editor when button is clicked', async () => {
      const user = userEvent.setup()

      render(<ChatWindow />)

      // Metadata editor should not be visible initially
      expect(screen.queryByText('Category')).not.toBeInTheDocument()

      // Click toggle button
      const toggleButton = screen.getByLabelText('Toggle metadata editor')
      await user.click(toggleButton)

      // Metadata editor should be visible
      await waitFor(() => {
        expect(screen.getByText('Category')).toBeInTheDocument()
      })

      // Click again to hide
      await user.click(toggleButton)

      await waitFor(() => {
        expect(screen.queryByText('Category')).not.toBeInTheDocument()
      })
    })
  })

  describe('Export functionality', () => {
    it('should show export button when messages exist', () => {
      render(<ChatWindow />)

      expect(screen.getByTestId('export-button')).toBeInTheDocument()
      expect(screen.getByText('Export Test Chat')).toBeInTheDocument()
    })

    it('should not show export button when no messages', () => {
      vi.mocked(useChatStore).mockReturnValue({
        currentChat: mockChat,
        messages: [],
        isLoadingMessages: false,
        loadChats: mockLoadChats,
        chats: [mockChat],
        isLoadingChats: false,
        setCurrentChat: vi.fn(),
        addMessage: vi.fn(),
        updateMessage: vi.fn(),
      } as any)

      render(<ChatWindow />)

      expect(screen.queryByTestId('export-button')).not.toBeInTheDocument()
    })
  })

  describe('Empty state', () => {
    it('should show empty state when no messages', () => {
      vi.mocked(useChatStore).mockReturnValue({
        currentChat: mockChat,
        messages: [],
        isLoadingMessages: false,
        loadChats: mockLoadChats,
        chats: [mockChat],
        isLoadingChats: false,
        setCurrentChat: vi.fn(),
        addMessage: vi.fn(),
        updateMessage: vi.fn(),
      } as any)

      render(<ChatWindow />)

      // The NoMessagesEmptyState should be rendered
      expect(screen.getByText('Test Chat')).toBeInTheDocument()
      expect(screen.getByText('0 messages')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<ChatWindow />)

      expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Chat conversation')
      expect(screen.getByRole('log')).toHaveAttribute('aria-label', 'Chat messages')
      expect(screen.getByRole('log')).toHaveAttribute('aria-live', 'polite')
      expect(screen.getByRole('form')).toHaveAttribute('aria-label', 'Message input form')
    })

    it('should show loading state with aria-busy', () => {
      vi.mocked(useChatStore).mockReturnValue({
        currentChat: mockChat,
        messages: [],
        isLoadingMessages: true,
        loadChats: mockLoadChats,
        chats: [mockChat],
        isLoadingChats: false,
        setCurrentChat: vi.fn(),
        addMessage: vi.fn(),
        updateMessage: vi.fn(),
      } as any)

      render(<ChatWindow />)

      const main = screen.getByRole('main')
      expect(main).toHaveAttribute('aria-busy', 'true')
    })
  })

  describe('User flow scenarios', () => {
    it('should handle complete message exchange flow', async () => {
      const user = userEvent.setup()

      // Start with initial messages
      const { rerender } = render(<ChatWindow />)

      expect(screen.getByText('Hello')).toBeInTheDocument()
      expect(screen.getByText('Hi there!')).toBeInTheDocument()

      // User types and sends a message
      const input = screen.getByLabelText('Message input')
      await user.type(input, 'How are you?')
      await user.keyboard('{Enter}')

      expect(mockStreamMessage).toHaveBeenCalledWith('test-chat-1', 'How are you?')

      // Simulate streaming state
      vi.mocked(useStreamMessage).mockReturnValue({
        streamMessage: mockStreamMessage,
        isStreaming: true,
        error: null,
        abortStream: vi.fn(),
      })

      rerender(<ChatWindow />)

      // Input should be disabled during streaming
      expect(input).toBeDisabled()
      expect(screen.getByText('AI is typing...')).toBeInTheDocument()

      // Simulate message received
      const newMessages = [
        ...mockMessages,
        {
          id: 'msg-3',
          chat_id: 'test-chat-1',
          role: 'user',
          content: 'How are you?',
          created_at: new Date().toISOString(),
        },
        {
          id: 'msg-4',
          chat_id: 'test-chat-1',
          role: 'assistant',
          content: 'I am doing well, thank you!',
          created_at: new Date().toISOString(),
        },
      ]

      vi.mocked(useChatStore).mockReturnValue({
        currentChat: mockChat,
        messages: newMessages,
        isLoadingMessages: false,
        loadChats: mockLoadChats,
        chats: [mockChat],
        isLoadingChats: false,
        setCurrentChat: vi.fn(),
        addMessage: vi.fn(),
        updateMessage: vi.fn(),
      } as any)

      vi.mocked(useStreamMessage).mockReturnValue({
        streamMessage: mockStreamMessage,
        isStreaming: false,
        error: null,
        abortStream: vi.fn(),
      })

      rerender(<ChatWindow />)

      // New messages should be visible
      expect(screen.getByText('How are you?')).toBeInTheDocument()
      expect(screen.getByText('I am doing well, thank you!')).toBeInTheDocument()
      expect(screen.getByText('4 messages')).toBeInTheDocument()

      // Input should be enabled again
      expect(input).not.toBeDisabled()
    })

    it('should handle error during message sending', async () => {
      const user = userEvent.setup()
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Mock streamMessage to throw an error
      mockStreamMessage.mockRejectedValueOnce(new Error('Network error'))

      render(<ChatWindow />)

      const input = screen.getByLabelText('Message input')
      await user.type(input, 'Test message')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to send message:',
          expect.any(Error)
        )
      })

      consoleErrorSpy.mockRestore()
    })
  })
})
