import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UserService, type UserSettings } from '../services/UserService'

describe('UserService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  describe('getSettings', () => {
    it('should return default settings if nothing is stored', async () => {
      const settings = await UserService.getSettings()

      expect(settings).toEqual({
        theme: 'system',
        default_model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 2000,
      })
    })

    it('should return stored settings if they exist', async () => {
      const customSettings: UserSettings = {
        theme: 'dark',
        default_model: 'gpt-3.5-turbo',
        temperature: 0.5,
        max_tokens: 1500,
      }

      localStorage.setItem('user_settings', JSON.stringify(customSettings))

      const settings = await UserService.getSettings()
      expect(settings).toEqual(customSettings)
    })

    it('should merge stored settings with defaults', async () => {
      const partialSettings = {
        theme: 'light',
      }

      localStorage.setItem('user_settings', JSON.stringify(partialSettings))

      const settings = await UserService.getSettings()
      expect(settings.theme).toBe('light')
      expect(settings.default_model).toBe('gpt-4') // default
      expect(settings.temperature).toBe(0.7) // default
    })

    it('should handle corrupted localStorage data', async () => {
      localStorage.setItem('user_settings', 'invalid json')

      const settings = await UserService.getSettings()

      // Should return defaults
      expect(settings).toEqual({
        theme: 'system',
        default_model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 2000,
      })
    })
  })

  describe('saveSettings', () => {
    it('should save settings to localStorage', async () => {
      await UserService.saveSettings({
        theme: 'dark',
        temperature: 0.9,
      })

      const stored = localStorage.getItem('user_settings')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed.theme).toBe('dark')
      expect(parsed.temperature).toBe(0.9)
    })

    it('should merge with existing settings', async () => {
      await UserService.saveSettings({
        theme: 'dark',
      })

      await UserService.saveSettings({
        temperature: 0.9,
      })

      const settings = await UserService.getSettings()
      expect(settings.theme).toBe('dark')
      expect(settings.temperature).toBe(0.9)
      expect(settings.default_model).toBe('gpt-4') // default preserved
    })

    it('should handle partial updates', async () => {
      await UserService.saveSettings({
        theme: 'light',
        default_model: 'gpt-4-turbo-preview',
      })

      const settings = await UserService.getSettings()
      expect(settings.theme).toBe('light')
      expect(settings.default_model).toBe('gpt-4-turbo-preview')
      expect(settings.temperature).toBe(0.7) // default
      expect(settings.max_tokens).toBe(2000) // default
    })
  })

  describe('clearSettings', () => {
    it('should remove settings from localStorage', async () => {
      await UserService.saveSettings({ theme: 'dark' })
      expect(localStorage.getItem('user_settings')).toBeTruthy()

      await UserService.clearSettings()
      expect(localStorage.getItem('user_settings')).toBeNull()
    })

    it('should return defaults after clearing', async () => {
      await UserService.saveSettings({ theme: 'dark', temperature: 0.9 })
      await UserService.clearSettings()

      const settings = await UserService.getSettings()
      expect(settings).toEqual({
        theme: 'system',
        default_model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 2000,
      })
    })
  })

  describe('Settings validation', () => {
    it('should accept valid theme values', async () => {
      await UserService.saveSettings({ theme: 'light' })
      let settings = await UserService.getSettings()
      expect(settings.theme).toBe('light')

      await UserService.saveSettings({ theme: 'dark' })
      settings = await UserService.getSettings()
      expect(settings.theme).toBe('dark')

      await UserService.saveSettings({ theme: 'system' })
      settings = await UserService.getSettings()
      expect(settings.theme).toBe('system')
    })

    it('should accept valid temperature range', async () => {
      await UserService.saveSettings({ temperature: 0.0 })
      let settings = await UserService.getSettings()
      expect(settings.temperature).toBe(0.0)

      await UserService.saveSettings({ temperature: 1.0 })
      settings = await UserService.getSettings()
      expect(settings.temperature).toBe(1.0)

      await UserService.saveSettings({ temperature: 2.0 })
      settings = await UserService.getSettings()
      expect(settings.temperature).toBe(2.0)
    })

    it('should accept valid max_tokens range', async () => {
      await UserService.saveSettings({ max_tokens: 100 })
      let settings = await UserService.getSettings()
      expect(settings.max_tokens).toBe(100)

      await UserService.saveSettings({ max_tokens: 4000 })
      settings = await UserService.getSettings()
      expect(settings.max_tokens).toBe(4000)
    })
  })
})
