/**
 * ThemeScript Component
 *
 * Инициализирует тему ДО hydration чтобы избежать flash of unstyled content
 * Должен быть встроен в <head> как blocking script
 */

export function ThemeScript() {
  // Inline script that runs BEFORE React hydration
  const themeScript = `
    (function() {
      try {
        const THEME_KEY = 'app-theme';
        const stored = localStorage.getItem(THEME_KEY);
        const theme = (stored === 'light' || stored === 'dark' || stored === 'system') ? stored : 'system';

        let effectiveTheme;
        if (theme === 'system') {
          effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } else {
          effectiveTheme = theme;
        }

        document.documentElement.classList.add(effectiveTheme);
        document.documentElement.style.colorScheme = effectiveTheme;
      } catch (e) {
        console.error('Theme initialization error:', e);
      }
    })();
  `

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  )
}
