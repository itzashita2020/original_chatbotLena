/**
 * Chat Module - Public API
 *
 * ⭐ CORE MODULE - Основная функциональность чата
 */

// Services
export { ChatService } from './services/ChatService'
export { MessageService } from './services/MessageService'

// Hooks
export { useStreamMessage } from './hooks/useStreamMessage'

// Components
export { ChatList } from './components/ChatList'
export { ChatWindow } from './components/ChatWindow'
export { ChatMessage } from './components/ChatMessage'
export { ChatInput } from './components/ChatInput'

// Types
export type {
  Chat,
  Message,
  ChatWithMessages,
  CreateChatParams,
  UpdateChatParams,
  SendMessageParams,
  MessageRole,
} from './types'

export const CHAT_MODULE_VERSION = '1.0.0'
