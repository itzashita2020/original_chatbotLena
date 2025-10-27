/**
 * Theme Utilities Tests
 *
 * Tests for theme management functions
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  getStoredTheme,
  setStoredTheme,
  getSystemTheme,
  applyTheme,
  initializeTheme,
} from '../theme'

describe('Theme Utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()

    // Mock document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: {
        classList: {
          add: vi.fn(),
          remove: vi.fn(),
        },
        style: {},
      },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getStoredTheme', () => {
    it('should return "system" when no theme is stored', () => {
      expect(getStoredTheme()).toBe('system')
    })

    it('should return stored theme when valid', () => {
      localStorage.setItem('app-theme', 'dark')
      expect(getStoredTheme()).toBe('dark')
    })

    it('should return "system" for invalid stored value', () => {
      localStorage.setItem('app-theme', 'invalid')
      expect(getStoredTheme()).toBe('system')
    })

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const getItemSpy = vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('localStorage error')
      })

      expect(getStoredTheme()).toBe('system')
      expect(consoleSpy).toHaveBeenCalled()

      getItemSpy.mockRestore()
      consoleSpy.mockRestore()
    })
  })

  describe('setStoredTheme', () => {
    it('should store theme in localStorage', () => {
      setStoredTheme('dark')
      expect(localStorage.getItem('app-theme')).toBe('dark')
    })

    it('should store "light" theme', () => {
      setStoredTheme('light')
      expect(localStorage.getItem('app-theme')).toBe('light')
    })

    it('should store "system" theme', () => {
      setStoredTheme('system')
      expect(localStorage.getItem('app-theme')).toBe('system')
    })

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const setItemSpy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('localStorage error')
      })

      setStoredTheme('dark')
      expect(consoleSpy).toHaveBeenCalled()

      setItemSpy.mockRestore()
      consoleSpy.mockRestore()
    })
  })

  describe('getSystemTheme', () => {
    it('should return "dark" when system prefers dark', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      expect(getSystemTheme()).toBe('dark')
    })

    it('should return "light" when system prefers light', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      expect(getSystemTheme()).toBe('light')
    })
  })

  describe('applyTheme', () => {
    beforeEach(() => {
      // Mock matchMedia for system theme detection
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })
    })

    it('should apply dark theme to document', () => {
      applyTheme('dark')

      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('light', 'dark')
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark')
      expect(document.documentElement.style.colorScheme).toBe('dark')
    })

    it('should apply light theme to document', () => {
      applyTheme('light')

      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('light', 'dark')
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('light')
      expect(document.documentElement.style.colorScheme).toBe('light')
    })

    it('should apply system theme (light) when system is light', () => {
      applyTheme('system')

      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('light', 'dark')
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('light')
      expect(document.documentElement.style.colorScheme).toBe('light')
    })

    it('should apply system theme (dark) when system is dark', () => {
      // Mock system dark mode
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      applyTheme('system')

      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('light', 'dark')
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark')
      expect(document.documentElement.style.colorScheme).toBe('dark')
    })
  })

  describe('initializeTheme', () => {
    it('should initialize theme from localStorage', () => {
      localStorage.setItem('app-theme', 'dark')

      initializeTheme()

      expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark')
    })

    it('should initialize with system theme when nothing stored', () => {
      initializeTheme()

      // Should apply system theme (light by default in tests)
      expect(document.documentElement.classList.add).toHaveBeenCalled()
    })

    it('should add event listener for system theme changes', () => {
      const mockMatchMedia = vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      })

      localStorage.setItem('app-theme', 'system')

      initializeTheme()

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
    })
  })
})
