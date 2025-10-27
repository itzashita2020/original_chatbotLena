/**
 * Chat Store - Global state management for chats
 *
 * Uses Zustand for lightweight state management.
 * Manages:
 * - List of chats
 * - Current selected chat
 * - Messages in current chat
 * - Loading states
 */

'use client'

import { create } from 'zustand'
import type { Chat, Message, ChatWithMessages } from '@/modules/chat'

interface ChatState {
  // Data
  chats: Chat[]
  currentChat: ChatWithMessages | null
  messages: Message[]

  // UI State
  isLoadingChats: boolean
  isLoadingMessages: boolean
  isSendingMessage: boolean
  error: string | null

  // Actions
  setChats: (chats: Chat[]) => void
  setCurrentChat: (chat: ChatWithMessages | null) => void
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  updateMessage: (messageId: string, content: string) => void

  setLoadingChats: (loading: boolean) => void
  setLoadingMessages: (loading: boolean) => void
  setSendingMessage: (sending: boolean) => void
  setError: (error: string | null) => void

  // Composite actions
  selectChat: (chatId: string) => Promise<void>
  sendMessage: (chatId: string, content: string) => Promise<void>
  createNewChat: (title?: string, category?: string) => Promise<Chat>
  updateChat: (chatId: string, updates: { title?: string; category?: string | null; is_favorite?: boolean }) => Promise<void>
  deleteChat: (chatId: string) => Promise<void>
  loadChats: () => Promise<void>
}

export const useChatStore = create<ChatState>((set) => ({
  // Initial state
  chats: [],
  currentChat: null,
  messages: [],
  isLoadingChats: false,
  isLoadingMessages: false,
  isSendingMessage: false,
  error: null,

  // Simple setters
  setChats: (chats) => set({ chats }),
  setCurrentChat: (chat) => set({ currentChat: chat, messages: chat?.messages || [] }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (messageId, content) => set((state) => ({
    messages: state.messages.map(msg =>
      msg.id === messageId ? { ...msg, content } : msg
    )
  })),

  setLoadingChats: (loading) => set({ isLoadingChats: loading }),
  setLoadingMessages: (loading) => set({ isLoadingMessages: loading }),
  setSendingMessage: (sending) => set({ isSendingMessage: sending }),
  setError: (error) => set({ error }),

  // Load all chats
  loadChats: async () => {
    set({ isLoadingChats: true, error: null })

    try {
      const response = await fetch('/api/chats')

      if (!response.ok) {
        throw new Error('Failed to load chats')
      }

      const data = await response.json()
      set({ chats: data.chats, isLoadingChats: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load chats',
        isLoadingChats: false
      })
    }
  },

  // Select and load a chat
  selectChat: async (chatId: string) => {
    set({ isLoadingMessages: true, error: null })

    try {
      const response = await fetch(`/api/chats/${chatId}`)

      if (!response.ok) {
        throw new Error('Failed to load chat')
      }

      const data = await response.json()
      set({
        currentChat: data.chat,
        messages: data.chat.messages || [],
        isLoadingMessages: false
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load chat',
        isLoadingMessages: false
      })
    }
  },

  // Send message (non-streaming version)
  sendMessage: async (chatId: string, content: string) => {
    set({ isSendingMessage: true, error: null })

    try {
      const response = await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      // Add both user and assistant messages
      set((state) => ({
        messages: [
          ...state.messages,
          data.userMessage,
          data.assistantMessage
        ],
        isSendingMessage: false
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to send message',
        isSendingMessage: false
      })
    }
  },

  // Create new chat
  createNewChat: async (title?: string, category?: string) => {
    set({ error: null })

    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || 'New Chat',
          category: category || null
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create chat')
      }

      const data = await response.json()
      const newChat = data.chat

      // Add to chats list
      set((state) => ({
        chats: [newChat, ...state.chats]
      }))

      return newChat
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create chat'
      set({ error: errorMessage })
      throw new Error(errorMessage)
    }
  },

  // Update chat
  updateChat: async (chatId: string, updates: { title?: string; category?: string | null; is_favorite?: boolean }) => {
    set({ error: null })

    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update chat')
      }

      const data = await response.json()
      const updatedChat = data.chat

      // Update in chats list
      set((state) => ({
        chats: state.chats.map(chat =>
          chat.id === chatId ? { ...chat, ...updatedChat } : chat
        ),
        currentChat: state.currentChat?.id === chatId
          ? { ...state.currentChat, ...updatedChat }
          : state.currentChat
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update chat'
      })
      throw error
    }
  },

  // Delete chat
  deleteChat: async (chatId: string) => {
    set({ error: null })

    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete chat')
      }

      // Remove from chats list
      set((state) => ({
        chats: state.chats.filter(chat => chat.id !== chatId),
        currentChat: state.currentChat?.id === chatId ? null : state.currentChat,
        messages: state.currentChat?.id === chatId ? [] : state.messages
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete chat'
      })
    }
  }
}))
