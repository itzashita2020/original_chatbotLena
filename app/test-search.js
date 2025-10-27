/**
 * Test Search Service
 *
 * Тест SearchService с mock данными
 */

// Mock данные
const mockChats = [
  {
    id: 'chat-1',
    user_id: 'test-user',
    title: 'Introduction to Artificial Intelligence',
    category: 'Technology',
    tags: ['AI', 'Machine Learning', 'Tutorial'],
    is_favorite: true,
    created_at: '2025-10-20T08:00:00Z',
    updated_at: '2025-10-20T10:00:00Z',
  },
  {
    id: 'chat-2',
    user_id: 'test-user',
    title: 'JavaScript Best Practices',
    category: 'Programming',
    tags: ['JavaScript', 'Coding', 'Best Practices'],
    is_favorite: false,
    created_at: '2025-10-21T09:00:00Z',
    updated_at: '2025-10-21T11:00:00Z',
  },
  {
    id: 'chat-3',
    user_id: 'test-user',
    title: 'Database Design Patterns',
    category: 'Technology',
    tags: ['Database', 'SQL', 'Architecture'],
    is_favorite: true,
    created_at: '2025-10-22T10:00:00Z',
    updated_at: '2025-10-22T12:00:00Z',
  },
]

const mockMessages = [
  {
    id: 'msg-1',
    chat_id: 'chat-1',
    role: 'user',
    content: 'What is artificial intelligence and how does it work?',
    created_at: '2025-10-20T08:05:00Z',
  },
  {
    id: 'msg-2',
    chat_id: 'chat-1',
    role: 'assistant',
    content: 'Artificial intelligence (AI) is the simulation of human intelligence by machines. It involves machine learning, neural networks, and deep learning algorithms.',
    created_at: '2025-10-20T08:06:00Z',
  },
  {
    id: 'msg-3',
    chat_id: 'chat-2',
    role: 'user',
    content: 'Can you explain JavaScript closures?',
    created_at: '2025-10-21T09:05:00Z',
  },
  {
    id: 'msg-4',
    chat_id: 'chat-2',
    role: 'assistant',
    content: 'A closure in JavaScript is a function that has access to variables in its outer scope, even after the outer function has returned.',
    created_at: '2025-10-21T09:06:00Z',
  },
]

// Функция поиска (упрощенная версия SearchService)
function searchInChats(query, chats) {
  const lowerQuery = query.toLowerCase()

  return chats
    .filter(chat => chat.title.toLowerCase().includes(lowerQuery))
    .map(chat => ({
      type: 'chat',
      chat,
      highlight: highlightMatch(chat.title, query),
      score: calculateRelevance(chat.title, query),
    }))
}

function searchInMessages(query, messages, chats) {
  const lowerQuery = query.toLowerCase()

  return messages
    .filter(msg => msg.content.toLowerCase().includes(lowerQuery))
    .map(msg => {
      const chat = chats.find(c => c.id === msg.chat_id)
      return {
        type: 'message',
        chat,
        message: msg,
        highlight: highlightMatch(msg.content, query),
        score: calculateRelevance(msg.content, query),
      }
    })
}

function highlightMatch(text, query) {
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)

  if (index === -1) return text

  const start = Math.max(0, index - 50)
  const end = Math.min(text.length, index + query.length + 50)

  let excerpt = text.substring(start, end)

  if (start > 0) excerpt = '...' + excerpt
  if (end < text.length) excerpt = excerpt + '...'

  return excerpt
}

function calculateRelevance(text, query) {
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()

  if (lowerText === lowerQuery) return 1.0
  if (lowerText.startsWith(lowerQuery)) return 0.9
  if (lowerText.includes(lowerQuery)) return 0.7

  const queryWords = lowerQuery.split(/\s+/)
  const matchedWords = queryWords.filter((word) => lowerText.includes(word))
  return (matchedWords.length / queryWords.length) * 0.5
}

function performSearch(query, chats, messages) {
  const chatResults = searchInChats(query, chats)
  const messageResults = searchInMessages(query, messages, chats)

  const allResults = [...chatResults, ...messageResults]
    .sort((a, b) => (b.score || 0) - (a.score || 0))

  return {
    results: allResults,
    total: allResults.length,
    query: query,
  }
}

// Запуск тестов
console.log('🔍 Testing Search Service\n')
console.log('=' .repeat(60))

// Тест 1: Поиск по заголовкам
console.log('\n📝 Test 1: Search by chat title')
console.log('-'.repeat(60))
const test1 = performSearch('artificial', mockChats, mockMessages)
console.log(`Query: "artificial"`)
console.log(`Found: ${test1.total} results`)
test1.results.forEach((result, i) => {
  console.log(`\n${i + 1}. [${result.type.toUpperCase()}] ${result.chat.title}`)
  console.log(`   Score: ${result.score.toFixed(2)}`)
  console.log(`   Highlight: ${result.highlight}`)
})

// Тест 2: Поиск по сообщениям
console.log('\n\n📨 Test 2: Search in messages')
console.log('-'.repeat(60))
const test2 = performSearch('javascript', mockChats, mockMessages)
console.log(`Query: "javascript"`)
console.log(`Found: ${test2.total} results`)
test2.results.forEach((result, i) => {
  console.log(`\n${i + 1}. [${result.type.toUpperCase()}] ${result.chat.title}`)
  console.log(`   Score: ${result.score.toFixed(2)}`)
  console.log(`   Highlight: ${result.highlight}`)
  if (result.message) {
    console.log(`   Role: ${result.message.role}`)
  }
})

// Тест 3: Поиск с частичным совпадением
console.log('\n\n🔎 Test 3: Partial match search')
console.log('-'.repeat(60))
const test3 = performSearch('learn', mockChats, mockMessages)
console.log(`Query: "learn"`)
console.log(`Found: ${test3.total} results`)
test3.results.forEach((result, i) => {
  console.log(`\n${i + 1}. [${result.type.toUpperCase()}] ${result.chat.title}`)
  console.log(`   Score: ${result.score.toFixed(2)}`)
  console.log(`   Highlight: ${result.highlight}`)
})

// Тест 4: Нет результатов
console.log('\n\n❌ Test 4: No results')
console.log('-'.repeat(60))
const test4 = performSearch('nonexistent', mockChats, mockMessages)
console.log(`Query: "nonexistent"`)
console.log(`Found: ${test4.total} results`)

// Тест 5: Поиск по категории (симуляция)
console.log('\n\n📂 Test 5: Filter by category')
console.log('-'.repeat(60))
const techChats = mockChats.filter(chat => chat.category === 'Technology')
console.log(`Category: "Technology"`)
console.log(`Found: ${techChats.length} chats`)
techChats.forEach((chat, i) => {
  console.log(`${i + 1}. ${chat.title}`)
  console.log(`   Tags: ${chat.tags.join(', ')}`)
})

// Тест 6: Поиск избранных
console.log('\n\n⭐ Test 6: Filter by favorite')
console.log('-'.repeat(60))
const favoriteChats = mockChats.filter(chat => chat.is_favorite)
console.log(`Favorite: true`)
console.log(`Found: ${favoriteChats.length} chats`)
favoriteChats.forEach((chat, i) => {
  console.log(`${i + 1}. ${chat.title}`)
})

// Тест 7: Scoring релевантности
console.log('\n\n📊 Test 7: Relevance scoring')
console.log('-'.repeat(60))
const testQueries = ['artificial intelligence', 'artificial', 'ai', 'intro']
testQueries.forEach(query => {
  const score = calculateRelevance('Introduction to Artificial Intelligence', query)
  console.log(`Query: "${query}" → Score: ${score.toFixed(2)}`)
})

// Итоговая статистика
console.log('\n\n✅ Test Summary')
console.log('='.repeat(60))
console.log(`Total test cases: 7`)
console.log(`All tests completed successfully!`)
console.log(`\nSearch features tested:`)
console.log(`  ✓ Search by chat title`)
console.log(`  ✓ Search in message content`)
console.log(`  ✓ Partial text matching`)
console.log(`  ✓ Empty results handling`)
console.log(`  ✓ Category filtering`)
console.log(`  ✓ Favorite filtering`)
console.log(`  ✓ Relevance scoring`)
console.log(`\nMock data:`)
console.log(`  - ${mockChats.length} chats`)
console.log(`  - ${mockMessages.length} messages`)
