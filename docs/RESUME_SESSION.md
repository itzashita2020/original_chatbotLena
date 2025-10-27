# 🔄 Инструкция для продолжения работы

**Дата создания:** 2025-10-23
**Последняя сессия:** Phase 2 ЗАВЕРШЕНА ✅

---

## 📊 Текущее состояние проекта

### ✅ Что готово (50% проекта)

**Phase 0 + Phase 1 + Phase 2 полностью завершены!**

- ✅ Next.js 14 проект настроен
- ✅ Supabase подключен (БД миграция применена)
- ✅ **ChatService + MessageService** - 15 методов для работы с чатами и сообщениями
- ✅ **OpenAIService** - интеграция с GPT-4 + streaming
- ✅ **6 API Routes** для чатов + 1 для AI streaming (SSE)
- ✅ **Zustand store** - глобальное состояние
- ✅ **4 React компонента** - полноценный чат UI
- ✅ **TypeScript 0 ошибок, Build успешный**

### ⏳ Что осталось (50% проекта)

**Phase 3: Unique Features (~56 часов)**
- Export Module (JSON/Markdown/TXT)
- Search Module (полнотекстовый поиск)
- Chat Organization (категории, теги)
- User Module (Settings, статистика)

**Phase 4: Polish & Testing (~60 часов)**
- UI/UX улучшения
- Error handling
- Тестирование
- Документация

---

## 🚀 Как продолжить работу вечером

### 1. Запустить проект

```bash
cd app
npm run dev
```

Откроется на http://localhost:3000

### 2. Проверить что работает

**Чат должен работать БЕЗ авторизации!**

Попробуйте:
1. ✅ Создать новый чат (кнопка "New Chat")
2. ✅ Отправить сообщение AI
3. ✅ Увидеть streaming ответ (слова появляются по одному)
4. ✅ Создать несколько чатов
5. ✅ Переключаться между чатами в sidebar

### 3. Если что-то не работает

**Проблема: Ошибки Supabase RLS**
- **Причина:** User не авторизован, а RLS требует auth.uid()
- **Решение:** Нужно временно отключить RLS или создать fake user

**Как временно отключить RLS:**
```sql
-- Выполнить в Supabase SQL Editor
ALTER TABLE chats DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
```

**Проблема: OpenAI API ошибка**
- **Проверить:** `.env.local` содержит правильный OPENAI_API_KEY
- **Решение:** Обновить ключ если истек

### 4. Начать Phase 3

Когда всё работает, начинайте с **Phase 3.1: Export Module**

```bash
# Создать структуру модуля
mkdir -p app/src/modules/export/services
mkdir -p app/src/modules/export/components

# Создать файлы (см. BACKLOG.md для деталей)
# 1. ExportService.ts - экспорт в разные форматы
# 2. API route /api/export/[chatId]
# 3. ExportButton.tsx component
```

**Или попросить Claude Code:**
```
"Начни Phase 3.1 - Export Module.
Создай ExportService для экспорта чатов в JSON, Markdown и TXT."
```

---

## 📁 Важные файлы для контекста

Перед началом Claude Code должен прочитать:

1. **PROJECT_SNAPSHOT.md** - текущее состояние (ЭТО ОБНОВЛЕНО!)
2. **BACKLOG.md** - детальный план Phase 3
3. **ARCHITECTURE.md** - архитектура модулей

---

## 🧪 Тестирование

### Ручное тестирование (Priority 1)

1. **Создание чата:**
   - Кнопка "New Chat" работает
   - Чат появляется в sidebar

2. **Отправка сообщения:**
   - Можно ввести текст
   - Enter отправляет сообщение
   - Shift+Enter - новая строка

3. **AI ответ:**
   - Появляется "AI is typing..."
   - Слова появляются по одному (streaming)
   - Сообщение сохраняется в БД

4. **Переключение чатов:**
   - Клик на чат в sidebar
   - Загружаются сообщения
   - Выделяется активный чат

### E2E тестирование (Priority 2)

После Phase 3 написать Playwright тесты.

---

## 🐛 Известные проблемы

### 1. Auth отключена (temporary)
- **Статус:** Работаем БЕЗ авторизации пока
- **План:** Вернуться к auth в Phase 4 или после MVP
- **Workaround:** RLS может блокировать запросы, отключить временно

### 2. ESLint warnings (minor)
```
./src/lib/supabase/server.ts
36:20  Warning: 'error' is defined but never used
45:20  Warning: 'error' is defined but never used
```
- **Статус:** Не критично, можно исправить позже
- **План:** Почистить unused variables в Phase 4

---

## 💡 Подсказки для Claude Code

### Эффективные промпты:

✅ **Хорошо:**
```
"Продолжи Phase 3. Начни с Export Module.
Создай ExportService с методами для экспорта в JSON, Markdown и TXT.
Смотри детали в BACKLOG.md Phase 3.1."
```

✅ **Хорошо:**
```
"Проверь что чат работает. Запусти npm run dev
и посмотри что происходит на localhost:3000."
```

❌ **Плохо:**
```
"Сделай что-нибудь"
```

### Контекст для AI:

При старте новой сессии Claude Code прочитает `PROJECT_SNAPSHOT.md` автоматически (см. `CLAUDE.md` → Cold Start Protocol).

Если нужно напомнить контекст:
```
"Прочитай PROJECT_SNAPSHOT.md и скажи на каком этапе проект."
```

---

## 📚 Полезные команды

```bash
# Разработка
cd app
npm run dev              # Запустить dev server
npm run build            # Собрать проект
npm run typecheck        # Проверить типы
npm run lint             # Проверить ESLint

# База данных
# Зайти в Supabase Dashboard → SQL Editor
# Выполнить запросы для просмотра данных:
SELECT * FROM chats ORDER BY created_at DESC LIMIT 10;
SELECT * FROM messages WHERE chat_id = 'xxx';

# Git (когда будете коммитить)
git status
git add .
git commit -m "feat: complete Phase 3.1 - Export Module"
```

---

## 🎯 Цель на вечер

**Реализовать Phase 3.1 (Export Module)** (~16 часов → можно за вечер сделать частично)

**Минимум:**
- ✅ ExportService с методом exportToJSON()
- ✅ API route GET /api/export/[chatId]?format=json
- ✅ Проверить что экспорт работает (скачивается файл)

**Оптимально:**
- ✅ Все 3 формата (JSON, Markdown, TXT)
- ✅ ExportButton component в UI
- ✅ Dropdown для выбора формата

**Максимум:**
- ✅ Export all chats
- ✅ Красивое форматирование Markdown
- ✅ Тесты для ExportService

---

## 📞 Нужна помощь?

1. Прочитай `PROJECT_SNAPSHOT.md` - там весь контекст
2. Прочитай `BACKLOG.md` - там детальный план задач
3. Попроси Claude Code:
   ```
   "Объясни текущую архитектуру проекта"
   "Как работает streaming в OpenAIService?"
   "Покажи пример использования ChatService"
   ```

---

**Удачи! Проект на 50% готов, осталось 50%! 🚀**
