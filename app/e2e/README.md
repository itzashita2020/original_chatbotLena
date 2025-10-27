# E2E Testing с Playwright

## Установка

E2E тесты уже настроены в проекте. Для запуска нужны:

```bash
# Установить зависимости (уже сделано)
npm install

# Установить браузеры Playwright (уже сделано)
npx playwright install chromium
```

## Запуск тестов

### Основные команды

```bash
# Запуск всех E2E тестов (headless mode)
npm run test:e2e

# Запуск с UI interface
npm run test:e2e:ui

# Запуск с видимым браузером (headed mode)
npm run test:e2e:headed

# Запуск конкретного теста
npx playwright test e2e/basic-navigation.spec.ts

# Запуск с debugging
npx playwright test --debug
```

## Требования

Для запуска E2E тестов необходимо:

1. **Dev server должен быть доступен на http://localhost:3000**
   - Playwright автоматически запускает `npm run dev` перед тестами
   - Или можно запустить вручную: `npm run dev`

2. **База данных должна быть настроена**
   - Supabase URL и API keys в `.env.local`
   - Тестовая база данных (рекомендуется отдельная для тестов)

3. **Переменные окружения**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

## Структура тестов

- `e2e/basic-navigation.spec.ts` - Базовая навигация
- `e2e/ui-components.spec.ts` - Тесты UI компонентов и accessibility

## Отчеты

После запуска тестов:

```bash
# Открыть HTML отчет
npx playwright show-report
```

## Debug

Если тесты падают:

1. Проверить, что dev server запущен
2. Проверить browser logs в терминале
3. Использовать `--headed` mode для визуального debugging
4. Использовать `--debug` для step-by-step debugging

## CI/CD

Для CI/CD окружения тесты настроены автоматически:
- Retries: 2 (только на CI)
- Workers: 1 (только на CI)
- Screenshots: только при падении
- Traces: только при retry

## Расширение тестов

Для добавления новых тестов:

1. Создать файл `e2e/your-test.spec.ts`
2. Использовать Playwright API:
   ```typescript
   import { test, expect } from '@playwright/test'

   test('your test', async ({ page }) => {
     await page.goto('/')
     // ... тест
   })
   ```

## Полезные ссылки

- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Locators](https://playwright.dev/docs/locators)
- [Assertions](https://playwright.dev/docs/test-assertions)
