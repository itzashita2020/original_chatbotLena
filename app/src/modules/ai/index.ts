/**
 * AI Module - Public API
 *
 * OpenAI integration (GPT-4, streaming)
 */

// Services
export { OpenAIService } from './services/OpenAIService'

// Hooks (будут созданы в Phase 2)
// export { useAI } from './hooks/useAI'

// Types
export type {
  AIMessage,
  AICompletionParams,
  AICompletionResult,
  AIStreamChunk,
  AIModel,
} from './types'

export const AI_MODULE_VERSION = '1.0.0'
