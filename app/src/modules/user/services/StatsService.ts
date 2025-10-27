/**
 * Stats Service
 *
 * Статистика использования (чаты, сообщения, токены)
 */

import { createClient } from '@/lib/supabase/client'

export interface UsageStats {
  total_chats: number
  total_messages: number
  total_tokens: number
  favorite_chats: number
  chats_by_category: Record<string, number>
  messages_by_role: {
    user: number
    assistant: number
    system: number
  }
  most_used_model: string | null
  total_cost_estimate: number
}

export class StatsService {
  /**
   * Получить общую статистику пользователя
   */
  static async getUsageStats(): Promise<UsageStats> {
    const supabase = createClient()

    try {
      // Get all chats
      const { data: chats, error: chatsError } = await supabase
        .from('chats')
        .select('*')

      if (chatsError) throw chatsError

      // Get all messages
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')

      if (messagesError) throw messagesError

      // Calculate stats
      const totalChats = chats?.length || 0
      const totalMessages = messages?.length || 0
      const favoriteChats = chats?.filter(c => c.is_favorite).length || 0

      // Tokens
      const totalTokens = messages?.reduce((sum, msg) => sum + (msg.tokens_used || 0), 0) || 0

      // Chats by category
      const chatsByCategory: Record<string, number> = {}
      chats?.forEach(chat => {
        const cat = chat.category || 'Uncategorized'
        chatsByCategory[cat] = (chatsByCategory[cat] || 0) + 1
      })

      // Messages by role
      const messagesByRole = {
        user: messages?.filter(m => m.role === 'user').length || 0,
        assistant: messages?.filter(m => m.role === 'assistant').length || 0,
        system: messages?.filter(m => m.role === 'system').length || 0,
      }

      // Most used model
      const modelCounts: Record<string, number> = {}
      messages?.forEach(msg => {
        if (msg.model) {
          modelCounts[msg.model] = (modelCounts[msg.model] || 0) + 1
        }
      })
      const mostUsedModel = Object.keys(modelCounts).length > 0
        ? Object.entries(modelCounts).sort((a, b) => b[1] - a[1])[0][0]
        : null

      // Cost estimate (примерный расчет)
      const totalCostEstimate = this.estimateCost(totalTokens, mostUsedModel)

      return {
        total_chats: totalChats,
        total_messages: totalMessages,
        total_tokens: totalTokens,
        favorite_chats: favoriteChats,
        chats_by_category: chatsByCategory,
        messages_by_role: messagesByRole,
        most_used_model: mostUsedModel,
        total_cost_estimate: totalCostEstimate,
      }
    } catch (error) {
      console.error('Failed to get usage stats:', error)
      throw error
    }
  }

  /**
   * Оценить стоимость на основе токенов
   */
  private static estimateCost(tokens: number, model: string | null): number {
    // Примерные цены за 1K tokens (input + output average)
    const prices: Record<string, number> = {
      'gpt-4': 0.06, // $0.03 input + $0.06 output / 2
      'gpt-4-turbo-preview': 0.02,
      'gpt-3.5-turbo': 0.002,
    }

    const pricePerK = prices[model || 'gpt-4'] || 0.06
    return (tokens / 1000) * pricePerK
  }

  /**
   * Получить статистику за период
   */
  static async getStatsForPeriod(days: number): Promise<{ chats: number; messages: number; tokens: number }> {
    const supabase = createClient()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    try {
      // Chats created in period
      const { data: chats } = await supabase
        .from('chats')
        .select('id')
        .gte('created_at', startDate.toISOString())

      // Messages created in period
      const { data: messages } = await supabase
        .from('messages')
        .select('tokens_used')
        .gte('created_at', startDate.toISOString())

      const totalTokens = messages?.reduce((sum, msg) => sum + (msg.tokens_used || 0), 0) || 0

      return {
        chats: chats?.length || 0,
        messages: messages?.length || 0,
        tokens: totalTokens,
      }
    } catch (error) {
      console.error('Failed to get period stats:', error)
      return { chats: 0, messages: 0, tokens: 0 }
    }
  }
}
