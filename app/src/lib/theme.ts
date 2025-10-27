/**
 * Theme Manager
 *
 * Управление темой приложения (light/dark/system)
 */

export type Theme = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'app-theme'

/**
 * Получить текущую тему из localStorage
 */
export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored
    }
  } catch (error) {
    console.error('Failed to get stored theme:', error)
  }

  return 'system'
}

/**
 * Сохранить тему в localStorage
 */
export function setStoredTheme(theme: Theme): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch (error) {
    console.error('Failed to store theme:', error)
  }
}

/**
 * Определить, использует ли система dark mode
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Применить тему к документу
 */
export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return

  const root = document.documentElement
  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme

  // Remove both classes first
  root.classList.remove('light', 'dark')

  // Add the effective theme class
  root.classList.add(effectiveTheme)

  // Set color-scheme for better browser defaults
  root.style.colorScheme = effectiveTheme
}

/**
 * Инициализировать тему при загрузке страницы
 */
export function initializeTheme(): void {
  const storedTheme = getStoredTheme()
  applyTheme(storedTheme)

  // Listen for system theme changes if using 'system' theme
  if (storedTheme === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (getStoredTheme() === 'system') {
        applyTheme('system')
      }
    })
  }
}
