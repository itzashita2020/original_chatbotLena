/**
 * User Service
 *
 * Управление пользовательскими настройками и профилем
 */

export interface UserSettings {
  theme?: 'light' | 'dark' | 'system'
  default_model?: string
  temperature?: number
  max_tokens?: number
}

export class UserService {
  /**
   * Получить настройки пользователя
   */
  static async getSettings(): Promise<UserSettings> {
    // Пока храним в localStorage, позже можно в БД
    if (typeof window === 'undefined') {
      return this.getDefaultSettings()
    }

    try {
      const stored = localStorage.getItem('user_settings')
      if (stored) {
        return { ...this.getDefaultSettings(), ...JSON.parse(stored) }
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }

    return this.getDefaultSettings()
  }

  /**
   * Сохранить настройки пользователя
   */
  static async saveSettings(settings: Partial<UserSettings>): Promise<void> {
    if (typeof window === 'undefined') return

    try {
      const current = await this.getSettings()
      const updated = { ...current, ...settings }
      localStorage.setItem('user_settings', JSON.stringify(updated))
    } catch (error) {
      console.error('Failed to save settings:', error)
      throw error
    }
  }

  /**
   * Получить дефолтные настройки
   */
  private static getDefaultSettings(): UserSettings {
    return {
      theme: 'system',
      default_model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 2000,
    }
  }

  /**
   * Очистить все настройки
   */
  static async clearSettings(): Promise<void> {
    if (typeof window === 'undefined') return
    localStorage.removeItem('user_settings')
  }
}
