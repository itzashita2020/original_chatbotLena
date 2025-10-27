/**
 * OpenAIService - Integration with OpenAI API
 *
 * Handles all AI-related operations:
 * - Regular completions
 * - Streaming completions (Server-Sent Events)
 * - Token counting
 * - Error handling with retry logic
 */

import OpenAI from 'openai'
import type {
  AIMessage,
  AICompletionParams,
  AICompletionResult,
  AIModel
} from '../types'

export class OpenAIService {
  private static client: OpenAI | null = null

  /**
   * Initialize OpenAI client (lazy initialization)
   */
  private static getClient(): OpenAI {
    if (!this.client) {
      const apiKey = process.env.OPENAI_API_KEY

      if (!apiKey) {
        throw new Error('OPENAI_API_KEY is not set in environment variables')
      }

      this.client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: false // This service should only run on server
      })
    }

    return this.client
  }

  /**
   * Get regular completion from OpenAI (non-streaming)
   * Use this for simple requests where streaming is not needed
   */
  static async getCompletion(params: AICompletionParams): Promise<AICompletionResult> {
    const client = this.getClient()

    const {
      messages,
      model = 'gpt-4',
      temperature = 0.7,
      max_tokens = 1000,
      top_p = 1,
      frequency_penalty = 0,
      presence_penalty = 0
    } = params

    try {
      const response = await client.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens,
        top_p,
        frequency_penalty,
        presence_penalty
      })

      const choice = response.choices[0]
      const content = choice.message.content || ''
      const finishReason = choice.finish_reason

      return {
        content,
        model: response.model,
        tokens_used: response.usage?.total_tokens || 0,
        prompt_tokens: response.usage?.prompt_tokens || 0,
        completion_tokens: response.usage?.completion_tokens || 0,
        finish_reason: finishReason
      }
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw new Error(`OpenAI API Error: ${error.message} (${error.status})`)
      }
      throw error
    }
  }

  /**
   * Stream completion from OpenAI (Server-Sent Events)
   * Returns async generator that yields chunks as they arrive
   *
   * Usage:
   * ```ts
   * for await (const chunk of OpenAIService.streamCompletion(params)) {
   *   console.log(chunk.content)
   * }
   * ```
   */
  static async *streamCompletion(
    params: AICompletionParams
  ): AsyncGenerator<{ content: string; finish_reason?: string }> {
    const client = this.getClient()

    const {
      messages,
      model = 'gpt-4',
      temperature = 0.7,
      max_tokens = 1000,
      top_p = 1,
      frequency_penalty = 0,
      presence_penalty = 0
    } = params

    try {
      const stream = await client.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens,
        top_p,
        frequency_penalty,
        presence_penalty,
        stream: true
      })

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta
        const finishReason = chunk.choices[0]?.finish_reason

        if (delta?.content) {
          yield {
            content: delta.content,
            finish_reason: finishReason || undefined
          }
        }

        // Last chunk
        if (finishReason) {
          yield {
            content: '',
            finish_reason: finishReason
          }
        }
      }
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw new Error(`OpenAI API Error: ${error.message} (${error.status})`)
      }
      throw error
    }
  }

  /**
   * Convert chat history to OpenAI message format
   */
  static formatMessages(messages: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
  }>): AIMessage[] {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  }

  /**
   * Estimate token count for text
   * Rough approximation: ~4 characters per token for English
   * For accurate counting, use tiktoken library
   */
  static estimateTokens(text: string): number {
    // Simple heuristic: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4)
  }

  /**
   * Estimate total tokens for message array
   */
  static estimateMessagesTokens(messages: AIMessage[]): number {
    let total = 0
    for (const message of messages) {
      total += this.estimateTokens(message.content)
      total += 4 // Overhead for message formatting
    }
    return total
  }

  /**
   * Check if model is available
   */
  static isModelAvailable(model: string): boolean {
    const availableModels: AIModel[] = [
      'gpt-4',
      'gpt-4o',
      'gpt-4-turbo-preview',
      'gpt-3.5-turbo'
    ]
    return availableModels.includes(model as AIModel)
  }

  /**
   * Get model info (costs, context window, etc.)
   */
  static getModelInfo(model: AIModel): {
    maxTokens: number
    costPer1kPromptTokens: number
    costPer1kCompletionTokens: number
  } {
    const modelInfo = {
      'gpt-4': {
        maxTokens: 8192,
        costPer1kPromptTokens: 0.03,
        costPer1kCompletionTokens: 0.06
      },
      'gpt-4o': {
        maxTokens: 128000,
        costPer1kPromptTokens: 0.005,
        costPer1kCompletionTokens: 0.015
      },
      'gpt-4-turbo-preview': {
        maxTokens: 128000,
        costPer1kPromptTokens: 0.01,
        costPer1kCompletionTokens: 0.03
      },
      'gpt-3.5-turbo': {
        maxTokens: 16384,
        costPer1kPromptTokens: 0.0005,
        costPer1kCompletionTokens: 0.0015
      }
    }

    return modelInfo[model] || modelInfo['gpt-4']
  }

  /**
   * Calculate cost for completion
   */
  static calculateCost(
    model: AIModel,
    promptTokens: number,
    completionTokens: number
  ): number {
    const info = this.getModelInfo(model)
    const promptCost = (promptTokens / 1000) * info.costPer1kPromptTokens
    const completionCost = (completionTokens / 1000) * info.costPer1kCompletionTokens
    return promptCost + completionCost
  }

  /**
   * Retry logic for failed requests
   */
  static async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    delayMs = 1000
  ): Promise<T> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error

        // Don't retry on certain errors
        if (error instanceof OpenAI.APIError) {
          // Don't retry on auth errors or invalid requests
          if (error.status === 401 || error.status === 400) {
            throw error
          }
        }

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, attempt)))
        }
      }
    }

    throw lastError || new Error('Max retries exceeded')
  }
}
