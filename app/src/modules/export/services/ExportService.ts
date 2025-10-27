/**
 * Export Service
 *
 * 🌟 UNIQUE FEATURE - Экспорт чатов в различные форматы
 *
 * Formats:
 * - JSON: Полная структура с метаданными
 * - Markdown: Читаемый формат для документации
 * - TXT: Простой текстовый формат
 */

import type { Chat, Message } from '@/lib/supabase/types'
import type { ExportFormat, ExportOptions, ExportData, ExportResult } from '../types'

export class ExportService {
  /**
   * Экспортировать чат в заданный формат
   */
  static async exportChat(
    chat: Chat,
    messages: Message[],
    options: ExportOptions
  ): Promise<ExportResult> {
    const exportData: ExportData = {
      chat,
      messages,
      exported_at: new Date().toISOString(),
      format: options.format,
    }

    let content: string
    let filename: string

    switch (options.format) {
      case 'json':
        content = this.exportToJSON(exportData, options)
        filename = this.generateFilename(chat, 'json')
        break
      case 'markdown':
        content = this.exportToMarkdown(exportData, options)
        filename = this.generateFilename(chat, 'md')
        break
      case 'txt':
        content = this.exportToTXT(exportData, options)
        filename = this.generateFilename(chat, 'txt')
        break
      case 'pdf':
        content = this.exportToPDF(exportData, options)
        filename = this.generateFilename(chat, 'html')
        break
      default:
        throw new Error(`Unsupported export format: ${options.format}`)
    }

    return {
      filename,
      content,
      size: new Blob([content]).size,
      format: options.format,
    }
  }

  /**
   * Экспорт в JSON формат
   */
  private static exportToJSON(data: ExportData, options: ExportOptions): string {
    const output: Record<string, unknown> = {
      chat: {
        id: data.chat.id,
        title: data.chat.title,
        ...(options.includeMetadata && {
          category: data.chat.category,
          tags: data.chat.tags,
          is_favorite: data.chat.is_favorite,
          metadata: data.chat.metadata,
        }),
        ...(options.includeTimestamps && {
          created_at: data.chat.created_at,
          updated_at: data.chat.updated_at,
        }),
      },
      messages: data.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        ...(options.includeMetadata && {
          tokens_used: msg.tokens_used,
          model: msg.model,
        }),
        ...(options.includeTimestamps && {
          created_at: msg.created_at,
        }),
      })),
      exported_at: data.exported_at,
    }

    return JSON.stringify(output, null, 2)
  }

  /**
   * Экспорт в Markdown формат
   */
  private static exportToMarkdown(data: ExportData, options: ExportOptions): string {
    const lines: string[] = []

    // Header
    lines.push(`# ${data.chat.title || 'Untitled Chat'}`)
    lines.push('')

    // Metadata section
    if (options.includeMetadata) {
      lines.push('## Metadata')
      lines.push('')
      if (data.chat.category) {
        lines.push(`**Category:** ${data.chat.category}`)
      }
      if (data.chat.tags && data.chat.tags.length > 0) {
        lines.push(`**Tags:** ${data.chat.tags.join(', ')}`)
      }
      if (data.chat.is_favorite) {
        lines.push('**Favorite:** ⭐ Yes')
      }
      lines.push('')
    }

    // Timestamps
    if (options.includeTimestamps) {
      lines.push(`**Created:** ${this.formatDate(data.chat.created_at)}`)
      lines.push(`**Updated:** ${this.formatDate(data.chat.updated_at)}`)
      lines.push(`**Exported:** ${this.formatDate(data.exported_at)}`)
      lines.push('')
    }

    lines.push('---')
    lines.push('')

    // Messages
    lines.push('## Conversation')
    lines.push('')

    data.messages.forEach((msg, index) => {
      const roleLabel = this.getRoleLabel(msg.role)
      lines.push(`### ${roleLabel}`)

      if (options.includeTimestamps && msg.created_at) {
        lines.push(`*${this.formatDate(msg.created_at)}*`)
        lines.push('')
      }

      lines.push(msg.content)
      lines.push('')

      if (options.includeMetadata && msg.tokens_used) {
        lines.push(`*Tokens: ${msg.tokens_used}${msg.model ? ` | Model: ${msg.model}` : ''}*`)
        lines.push('')
      }

      // Separator (except for last message)
      if (index < data.messages.length - 1) {
        lines.push('---')
        lines.push('')
      }
    })

    return lines.join('\n')
  }

  /**
   * Экспорт в TXT формат
   */
  private static exportToTXT(data: ExportData, options: ExportOptions): string {
    const lines: string[] = []

    // Header
    lines.push('=' .repeat(60))
    lines.push(data.chat.title || 'Untitled Chat')
    lines.push('='.repeat(60))
    lines.push('')

    // Metadata
    if (options.includeMetadata) {
      if (data.chat.category) {
        lines.push(`Category: ${data.chat.category}`)
      }
      if (data.chat.tags && data.chat.tags.length > 0) {
        lines.push(`Tags: ${data.chat.tags.join(', ')}`)
      }
      lines.push('')
    }

    // Timestamps
    if (options.includeTimestamps) {
      lines.push(`Created: ${this.formatDate(data.chat.created_at)}`)
      lines.push(`Updated: ${this.formatDate(data.chat.updated_at)}`)
      lines.push(`Exported: ${this.formatDate(data.exported_at)}`)
      lines.push('')
    }

    lines.push('-'.repeat(60))
    lines.push('')

    // Messages
    data.messages.forEach((msg, index) => {
      const roleLabel = this.getRoleLabel(msg.role).toUpperCase()

      lines.push(`[${roleLabel}]`)

      if (options.includeTimestamps && msg.created_at) {
        lines.push(`Time: ${this.formatDate(msg.created_at)}`)
      }

      lines.push('')
      lines.push(msg.content)
      lines.push('')

      if (options.includeMetadata && msg.tokens_used) {
        lines.push(`(Tokens: ${msg.tokens_used}${msg.model ? ` | Model: ${msg.model}` : ''})`)
      }

      // Separator
      if (index < data.messages.length - 1) {
        lines.push('-'.repeat(60))
        lines.push('')
      }
    })

    lines.push('='.repeat(60))
    lines.push(`End of chat - Exported at ${this.formatDate(data.exported_at)}`)
    lines.push('='.repeat(60))

    return lines.join('\n')
  }

  /**
   * Экспорт в PDF формат (HTML для печати в PDF)
   */
  private static exportToPDF(data: ExportData, options: ExportOptions): string {
    const lines: string[] = []

    // HTML structure with print-friendly CSS
    lines.push('<!DOCTYPE html>')
    lines.push('<html lang="en">')
    lines.push('<head>')
    lines.push('<meta charset="UTF-8">')
    lines.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">')
    lines.push(`<title>${this.escapeHtml(data.chat.title || 'Chat Export')}</title>`)
    lines.push('<style>')
    lines.push(`
      @page {
        margin: 2cm;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      h1 {
        color: #2563eb;
        border-bottom: 3px solid #2563eb;
        padding-bottom: 10px;
        margin-bottom: 30px;
      }
      h2 {
        color: #1e40af;
        margin-top: 30px;
        margin-bottom: 15px;
      }
      .metadata {
        background-color: #f3f4f6;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 30px;
      }
      .metadata p {
        margin: 5px 0;
      }
      .message {
        margin-bottom: 30px;
        padding: 15px;
        border-radius: 8px;
        page-break-inside: avoid;
      }
      .message.user {
        background-color: #eff6ff;
        border-left: 4px solid #2563eb;
      }
      .message.assistant {
        background-color: #f9fafb;
        border-left: 4px solid #6b7280;
      }
      .message.system {
        background-color: #fef3c7;
        border-left: 4px solid #f59e0b;
      }
      .message-role {
        font-weight: bold;
        color: #1f2937;
        margin-bottom: 8px;
        font-size: 14px;
        text-transform: uppercase;
      }
      .message-timestamp {
        font-size: 12px;
        color: #6b7280;
        margin-bottom: 8px;
      }
      .message-content {
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      .message-meta {
        font-size: 12px;
        color: #6b7280;
        margin-top: 10px;
        font-style: italic;
      }
      .footer {
        margin-top: 50px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
        text-align: center;
        color: #6b7280;
        font-size: 12px;
      }
      @media print {
        body {
          padding: 0;
        }
        .no-print {
          display: none;
        }
      }
    `)
    lines.push('</style>')
    lines.push('</head>')
    lines.push('<body>')

    // Header
    lines.push(`<h1>${this.escapeHtml(data.chat.title || 'Untitled Chat')}</h1>`)

    // Metadata section
    if (options.includeMetadata) {
      lines.push('<div class="metadata">')
      lines.push('<h2>Chat Information</h2>')
      if (data.chat.category) {
        lines.push(`<p><strong>Category:</strong> ${this.escapeHtml(data.chat.category)}</p>`)
      }
      if (data.chat.tags && data.chat.tags.length > 0) {
        lines.push(`<p><strong>Tags:</strong> ${data.chat.tags.map(t => this.escapeHtml(t)).join(', ')}</p>`)
      }
      if (data.chat.is_favorite) {
        lines.push('<p><strong>Favorite:</strong> ⭐ Yes</p>')
      }
      lines.push('</div>')
    }

    // Timestamps
    if (options.includeTimestamps) {
      lines.push('<div class="metadata">')
      lines.push(`<p><strong>Created:</strong> ${this.formatDate(data.chat.created_at)}</p>`)
      lines.push(`<p><strong>Last Updated:</strong> ${this.formatDate(data.chat.updated_at)}</p>`)
      lines.push(`<p><strong>Exported:</strong> ${this.formatDate(data.exported_at)}</p>`)
      lines.push('</div>')
    }

    // Messages
    lines.push('<h2>Conversation</h2>')

    data.messages.forEach((msg) => {
      const roleClass = msg.role.toLowerCase()
      const roleLabel = this.getRoleLabel(msg.role)

      lines.push(`<div class="message ${roleClass}">`)
      lines.push(`<div class="message-role">${this.escapeHtml(roleLabel)}</div>`)

      if (options.includeTimestamps && msg.created_at) {
        lines.push(`<div class="message-timestamp">${this.formatDate(msg.created_at)}</div>`)
      }

      lines.push(`<div class="message-content">${this.escapeHtml(msg.content)}</div>`)

      if (options.includeMetadata && msg.tokens_used) {
        lines.push(`<div class="message-meta">Tokens: ${msg.tokens_used}${msg.model ? ` | Model: ${this.escapeHtml(msg.model)}` : ''}</div>`)
      }

      lines.push('</div>')
    })

    // Footer
    lines.push('<div class="footer">')
    lines.push(`<p>Chat exported on ${this.formatDate(data.exported_at)}</p>`)
    lines.push('<p class="no-print"><button onclick="window.print()" style="padding: 10px 20px; background-color: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">Print to PDF</button></p>')
    lines.push('</div>')

    lines.push('</body>')
    lines.push('</html>')

    return lines.join('\n')
  }

  /**
   * Escape HTML special characters
   */
  private static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }
    return text.replace(/[&<>"']/g, (m) => map[m])
  }

  /**
   * Генерация имени файла
   */
  private static generateFilename(chat: Chat, extension: string): string {
    const title = chat.title || 'untitled-chat'
    const sanitized = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50) // Ограничение длины

    const date = new Date().toISOString().split('T')[0]
    const chatId = chat.id.substring(0, 8)

    return `${sanitized}-${date}-${chatId}.${extension}`
  }

  /**
   * Форматирование даты
   */
  private static formatDate(date: string | null | undefined): string {
    if (!date) return 'N/A'

    try {
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return date
    }
  }

  /**
   * Получить читаемый label для роли
   */
  private static getRoleLabel(role: string): string {
    switch (role) {
      case 'user':
        return 'You'
      case 'assistant':
        return 'Assistant'
      case 'system':
        return 'System'
      default:
        return role
    }
  }

  /**
   * Валидация экспортируемых данных
   */
  static validateExportData(chat: Chat, messages: Message[]): void {
    if (!chat || !chat.id) {
      throw new Error('Invalid chat data')
    }

    if (!Array.isArray(messages)) {
      throw new Error('Messages must be an array')
    }

    if (messages.length === 0) {
      throw new Error('Cannot export chat with no messages')
    }
  }

  /**
   * Получить Content-Type для формата
   */
  static getContentType(format: ExportFormat): string {
    switch (format) {
      case 'json':
        return 'application/json'
      case 'markdown':
        return 'text/markdown'
      case 'txt':
        return 'text/plain'
      case 'pdf':
        return 'text/html'
      default:
        return 'text/plain'
    }
  }

  /**
   * Создать blob для скачивания
   */
  static createDownloadBlob(content: string, format: ExportFormat): Blob {
    const contentType = this.getContentType(format)
    return new Blob([content], { type: `${contentType};charset=utf-8` })
  }
}
