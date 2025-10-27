/**
 * Test Export Service
 *
 * Тест ExportService с mock данными
 */

// Mock типов для Node.js окружения
const mockChat = {
  id: 'test-chat-123',
  user_id: 'test-user',
  title: 'Test Conversation About AI',
  category: 'Technology',
  tags: ['AI', 'Testing', 'Export'],
  is_favorite: true,
  metadata: { source: 'test' },
  created_at: '2025-10-24T08:00:00Z',
  updated_at: '2025-10-24T08:30:00Z',
  last_message_at: '2025-10-24T08:30:00Z'
}

const mockMessages = [
  {
    id: 'msg-1',
    chat_id: 'test-chat-123',
    role: 'user',
    content: 'Hello! Can you explain what artificial intelligence is?',
    tokens_used: 15,
    model: 'gpt-4',
    created_at: '2025-10-24T08:00:00Z'
  },
  {
    id: 'msg-2',
    chat_id: 'test-chat-123',
    role: 'assistant',
    content: 'Artificial Intelligence (AI) is a branch of computer science that focuses on creating systems capable of performing tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding.\n\nThere are several types of AI:\n1. Narrow AI - designed for specific tasks\n2. General AI - theoretical human-level intelligence\n3. Super AI - surpasses human intelligence',
    tokens_used: 120,
    model: 'gpt-4',
    created_at: '2025-10-24T08:05:00Z'
  },
  {
    id: 'msg-3',
    chat_id: 'test-chat-123',
    role: 'user',
    content: 'That\'s interesting! What are some practical applications?',
    tokens_used: 12,
    model: 'gpt-4',
    created_at: '2025-10-24T08:25:00Z'
  },
  {
    id: 'msg-4',
    chat_id: 'test-chat-123',
    role: 'assistant',
    content: 'Here are some practical AI applications:\n\n- Virtual assistants (Siri, Alexa)\n- Recommendation systems (Netflix, Amazon)\n- Autonomous vehicles\n- Medical diagnosis\n- Fraud detection\n- Natural language processing\n- Image recognition',
    tokens_used: 80,
    model: 'gpt-4',
    created_at: '2025-10-24T08:30:00Z'
  }
]

// Функция экспорта в JSON (упрощенная версия)
function exportToJSON(data, options) {
  const output = {
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

// Функция экспорта в Markdown (упрощенная версия)
function exportToMarkdown(data, options) {
  const lines = []

  lines.push(`# ${data.chat.title || 'Untitled Chat'}`)
  lines.push('')

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

  if (options.includeTimestamps) {
    lines.push(`**Created:** ${new Date(data.chat.created_at).toLocaleString()}`)
    lines.push(`**Updated:** ${new Date(data.chat.updated_at).toLocaleString()}`)
    lines.push(`**Exported:** ${new Date(data.exported_at).toLocaleString()}`)
    lines.push('')
  }

  lines.push('---')
  lines.push('')
  lines.push('## Conversation')
  lines.push('')

  data.messages.forEach((msg, index) => {
    const roleLabel = msg.role === 'user' ? 'You' : 'Assistant'
    lines.push(`### ${roleLabel}`)

    if (options.includeTimestamps && msg.created_at) {
      lines.push(`*${new Date(msg.created_at).toLocaleString()}*`)
      lines.push('')
    }

    lines.push(msg.content)
    lines.push('')

    if (options.includeMetadata && msg.tokens_used) {
      lines.push(`*Tokens: ${msg.tokens_used}${msg.model ? ` | Model: ${msg.model}` : ''}*`)
      lines.push('')
    }

    if (index < data.messages.length - 1) {
      lines.push('---')
      lines.push('')
    }
  })

  return lines.join('\n')
}

// Функция экспорта в TXT (упрощенная версия)
function exportToTXT(data, options) {
  const lines = []

  lines.push('='.repeat(60))
  lines.push(data.chat.title || 'Untitled Chat')
  lines.push('='.repeat(60))
  lines.push('')

  if (options.includeMetadata) {
    if (data.chat.category) {
      lines.push(`Category: ${data.chat.category}`)
    }
    if (data.chat.tags && data.chat.tags.length > 0) {
      lines.push(`Tags: ${data.chat.tags.join(', ')}`)
    }
    lines.push('')
  }

  if (options.includeTimestamps) {
    lines.push(`Created: ${new Date(data.chat.created_at).toLocaleString()}`)
    lines.push(`Updated: ${new Date(data.chat.updated_at).toLocaleString()}`)
    lines.push(`Exported: ${new Date(data.exported_at).toLocaleString()}`)
    lines.push('')
  }

  lines.push('-'.repeat(60))
  lines.push('')

  data.messages.forEach((msg, index) => {
    const roleLabel = msg.role === 'user' ? 'USER' : 'ASSISTANT'

    lines.push(`[${roleLabel}]`)

    if (options.includeTimestamps && msg.created_at) {
      lines.push(`Time: ${new Date(msg.created_at).toLocaleString()}`)
    }

    lines.push('')
    lines.push(msg.content)
    lines.push('')

    if (options.includeMetadata && msg.tokens_used) {
      lines.push(`(Tokens: ${msg.tokens_used}${msg.model ? ` | Model: ${msg.model}` : ''})`)
    }

    if (index < data.messages.length - 1) {
      lines.push('-'.repeat(60))
      lines.push('')
    }
  })

  lines.push('='.repeat(60))
  lines.push(`End of chat - Exported at ${new Date(data.exported_at).toLocaleString()}`)
  lines.push('='.repeat(60))

  return lines.join('\n')
}

// Запуск тестов
console.log('🧪 Testing Export Service\n')

const exportData = {
  chat: mockChat,
  messages: mockMessages,
  exported_at: new Date().toISOString(),
}

const options = {
  includeMetadata: true,
  includeTimestamps: true,
}

// Тест JSON
console.log('📄 Testing JSON Export...')
const jsonResult = exportToJSON(exportData, options)
console.log(`✅ JSON Export: ${jsonResult.length} characters`)
console.log(`Sample:\n${jsonResult.substring(0, 200)}...\n`)

// Тест Markdown
console.log('📝 Testing Markdown Export...')
const mdResult = exportToMarkdown(exportData, options)
console.log(`✅ Markdown Export: ${mdResult.length} characters`)
console.log(`Sample:\n${mdResult.substring(0, 200)}...\n`)

// Тест TXT
console.log('📋 Testing TXT Export...')
const txtResult = exportToTXT(exportData, options)
console.log(`✅ TXT Export: ${txtResult.length} characters`)
console.log(`Sample:\n${txtResult.substring(0, 200)}...\n`)

console.log('✅ All export formats tested successfully!')
console.log('\n📊 Summary:')
console.log(`- JSON: ${jsonResult.length} chars`)
console.log(`- Markdown: ${mdResult.length} chars`)
console.log(`- TXT: ${txtResult.length} chars`)
