/**
 * AI Module Types
 *
 * Public types for OpenAI integration
 */

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AICompletionParams {
  messages: AIMessage[]
  model?: AIModel
  temperature?: number
  max_tokens?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  stream?: boolean
}

export interface AICompletionResult {
  content: string
  tokens_used: number
  prompt_tokens: number
  completion_tokens: number
  model: string
  finish_reason: string
}

export interface AIStreamChunk {
  content: string
  done: boolean
}

export type AIModel = 'gpt-4' | 'gpt-4o' | 'gpt-4-turbo-preview' | 'gpt-3.5-turbo'
