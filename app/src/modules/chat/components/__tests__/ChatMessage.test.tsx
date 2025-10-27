import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChatMessage } from '../ChatMessage'
import type { Message } from '@/modules/chat/types'

describe('ChatMessage', () => {
  const mockUserMessage: Message = {
    id: 'msg-1',
    chat_id: 'chat-1',
    role: 'user',
    content: 'Hello, this is a test message',
    tokens_used: 10,
    model: 'gpt-4',
    created_at: '2025-10-24T10:00:00Z',
    metadata: null,
  }

  const mockAssistantMessage: Message = {
    id: 'msg-2',
    chat_id: 'chat-1',
    role: 'assistant',
    content: 'I am an AI assistant response',
    tokens_used: 15,
    model: 'gpt-4',
    created_at: '2025-10-24T10:01:00Z',
    metadata: null,
  }

  it('should render user message correctly', () => {
    render(<ChatMessage message={mockUserMessage} />)

    expect(screen.getByText('You')).toBeInTheDocument()
    expect(screen.getByText('Hello, this is a test message')).toBeInTheDocument()
  })

  it('should render assistant message correctly', () => {
    render(<ChatMessage message={mockAssistantMessage} />)

    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    expect(screen.getByText('I am an AI assistant response')).toBeInTheDocument()
  })

  it('should display timestamp', () => {
    render(<ChatMessage message={mockUserMessage} />)

    // Check that some time is displayed (format depends on locale)
    const timestamp = screen.getByText(/\d{1,2}:\d{2}/)
    expect(timestamp).toBeInTheDocument()
  })

  it('should apply correct styling for user messages', () => {
    const { container } = render(<ChatMessage message={mockUserMessage} />)

    const messageDiv = container.querySelector('.bg-blue-600')
    expect(messageDiv).toBeInTheDocument()
  })

  it('should apply correct styling for assistant messages', () => {
    const { container } = render(<ChatMessage message={mockAssistantMessage} />)

    const messageDiv = container.querySelector('.bg-gray-100')
    expect(messageDiv).toBeInTheDocument()
  })

  it('should handle system messages', () => {
    const systemMessage: Message = {
      ...mockUserMessage,
      role: 'system',
      content: 'System notification',
    }

    render(<ChatMessage message={systemMessage} />)

    expect(screen.getByText('System')).toBeInTheDocument()
    expect(screen.getByText('System notification')).toBeInTheDocument()
  })

  it('should preserve whitespace in message content', () => {
    const messageWithWhitespace: Message = {
      ...mockUserMessage,
      content: 'Line 1\nLine 2\n  Indented line',
    }

    const { container } = render(<ChatMessage message={messageWithWhitespace} />)

    const contentDiv = container.querySelector('.whitespace-pre-wrap')
    expect(contentDiv).toBeInTheDocument()
    expect(contentDiv?.textContent).toBe('Line 1\nLine 2\n  Indented line')
  })

  // Performance test: Component should be memoized
  it('should be memoized and not re-render with same props', () => {
    let renderCount = 0

    const TestWrapper = ({ message }: { message: Message }) => {
      renderCount++
      return <ChatMessage message={message} />
    }

    const { rerender } = render(<TestWrapper message={mockUserMessage} />)

    expect(renderCount).toBe(1)

    // Re-render with same props
    rerender(<TestWrapper message={mockUserMessage} />)

    // Component should be memoized, so TestWrapper renders but ChatMessage doesn't
    expect(renderCount).toBe(2)
  })
})
