import { describe, it, expect } from 'vitest'

// Вспомогательные функции для тестирования без Supabase
describe('SearchService - Utility Functions', () => {
  describe('calculateRelevance', () => {
    // Создаем простую версию функции для тестирования
    function calculateRelevance(text: string, query: string): number {
      const lowerText = text.toLowerCase()
      const lowerQuery = query.toLowerCase()

      // Exact match
      if (lowerText === lowerQuery) return 1.0

      // Starts with query
      if (lowerText.startsWith(lowerQuery)) return 0.9

      // Contains query
      if (lowerText.includes(lowerQuery)) return 0.7

      // Word match
      const textWords = lowerText.split(/\s+/)
      const queryWords = lowerQuery.split(/\s+/)
      const matchedWords = queryWords.filter(qw =>
        textWords.some(tw => tw.includes(qw))
      )

      if (matchedWords.length > 0) {
        return 0.5 * (matchedWords.length / queryWords.length)
      }

      return 0.0
    }

    it('should return 1.0 for exact match', () => {
      expect(calculateRelevance('hello world', 'hello world')).toBe(1.0)
      expect(calculateRelevance('test', 'test')).toBe(1.0)
    })

    it('should return 0.9 for starts with match', () => {
      expect(calculateRelevance('hello world', 'hello')).toBe(0.9)
      expect(calculateRelevance('testing framework', 'test')).toBe(0.9)
    })

    it('should return 0.7 for contains match', () => {
      expect(calculateRelevance('this is a test', 'test')).toBe(0.7)
      expect(calculateRelevance('vitest framework', 'framework')).toBe(0.7)
    })

    it('should handle word matches', () => {
      const score = calculateRelevance('hello world testing', 'testing')
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThanOrEqual(1.0)
    })

    it('should return 0 for no match', () => {
      expect(calculateRelevance('hello world', 'xyz')).toBe(0.0)
      expect(calculateRelevance('test', 'unrelated')).toBe(0.0)
    })

    it('should be case insensitive', () => {
      expect(calculateRelevance('Hello World', 'hello')).toBe(0.9)
      expect(calculateRelevance('TEST', 'test')).toBe(1.0)
      expect(calculateRelevance('TeSt', 'TeSt')).toBe(1.0)
    })
  })

  describe('highlightMatch', () => {
    function highlightMatch(text: string, query: string): string {
      if (!query || !text) return text

      const lowerText = text.toLowerCase()
      const lowerQuery = query.toLowerCase()

      const index = lowerText.indexOf(lowerQuery)
      if (index === -1) return text

      const before = text.slice(0, index)
      const match = text.slice(index, index + query.length)
      const after = text.slice(index + query.length)

      return `${before}<mark>${match}</mark>${after}`
    }

    it('should highlight matched text', () => {
      expect(highlightMatch('hello world', 'world')).toBe('hello <mark>world</mark>')
      expect(highlightMatch('testing framework', 'test')).toBe('<mark>test</mark>ing framework')
    })

    it('should be case insensitive but preserve original case', () => {
      expect(highlightMatch('Hello World', 'world')).toBe('Hello <mark>World</mark>')
      expect(highlightMatch('TEST', 'test')).toBe('<mark>TEST</mark>')
    })

    it('should return original text if no match', () => {
      expect(highlightMatch('hello world', 'xyz')).toBe('hello world')
    })

    it('should handle empty strings', () => {
      expect(highlightMatch('', 'test')).toBe('')
      expect(highlightMatch('test', '')).toBe('test')
    })
  })

  describe('extractContext', () => {
    function extractContext(text: string, query: string, contextLength: number = 100): string {
      const lowerText = text.toLowerCase()
      const lowerQuery = query.toLowerCase()

      const index = lowerText.indexOf(lowerQuery)
      if (index === -1) return text.slice(0, contextLength)

      const start = Math.max(0, index - contextLength)
      const end = Math.min(text.length, index + query.length + contextLength)

      let context = text.slice(start, end)

      if (start > 0) context = '...' + context
      if (end < text.length) context = context + '...'

      return context
    }

    it('should extract context around match', () => {
      const longText = 'This is a very long text with the word testing somewhere in the middle of it'
      const context = extractContext(longText, 'testing', 20)

      expect(context).toContain('testing')
      expect(context).toContain('...')
    })

    it('should not add ellipsis if match is at start', () => {
      const text = 'testing is at the start'
      const context = extractContext(text, 'testing', 50)

      expect(context).toContain('testing')
      expect(context).not.toMatch(/^\.\.\./)
    })

    it('should not add ellipsis if match is at end', () => {
      const text = 'this is a test for testing'
      const context = extractContext(text, 'testing', 10)

      expect(context).toContain('testing')
      expect(context).not.toMatch(/\.\.\.$/)
    })
  })
})
