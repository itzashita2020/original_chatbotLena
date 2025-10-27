# 🚀 Quick Start Guide

## Запустить проект

```bash
cd app
npm run dev
```

Откроется на: **http://localhost:3000**

---

## Что должно работать ✅

### 1. Создать чат
- Кнопка "**+ New Chat**" в sidebar
- Чат появляется в списке

### 2. Отправить сообщение
- Ввести текст в поле внизу
- Нажать **Enter** (или кнопку "Send")
- Сообщение отправляется AI

### 3. Получить ответ AI
- Появляется "**AI is typing...**"
- Слова появляются **по одному** (streaming)
- Сообщение сохраняется в БД

### 4. Переключаться между чатами
- Кликнуть на чат в sidebar
- Загружаются сообщения
- Активный чат подсвечивается синим

---

## 🐛 Если не работает

### Ошибка: "User not authenticated"
**Причина:** RLS включен, но user не авторизован

**Решение 1:** Отключить RLS временно
```sql
-- Выполнить в Supabase SQL Editor
ALTER TABLE chats DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
```

**Решение 2:** Создать fake user (advanced)

---

### Ошибка: OpenAI API error
**Причина:** Неправильный или истекший API key

**Решение:** Проверить `.env.local`
```bash
# app/.env.local
OPENAI_API_KEY=sk-proj-...
```

---

### Ошибка: Build failed
**Решение:**
```bash
cd app
rm -rf .next node_modules
npm install
npm run build
```

---

## 📊 Проверить работу

### TypeScript
```bash
cd app
npm run typecheck
# Должно быть 0 ошибок
```

### Build
```bash
cd app
npm run build
# Должен пройти успешно
```

### ESLint
```bash
cd app
npm run lint
# 2 warnings - нормально
```

---

## 🔍 Debug

### Посмотреть данные в БД
1. Зайти в **Supabase Dashboard**
2. Table Editor → **chats**
3. Table Editor → **messages**

### Посмотреть API requests
1. Open **DevTools** (F12)
2. Network tab
3. Фильтр: **Fetch/XHR**
4. Смотреть запросы к `/api/chats`, `/api/ai/stream`

### Посмотреть ошибки
1. **Terminal** - серверные ошибки
2. **Browser Console** - клиентские ошибки

---

## 📝 Команды

```bash
# Запуск
npm run dev          # Development server

# Проверки
npm run typecheck    # TypeScript
npm run build        # Production build
npm run lint         # ESLint

# База данных (Supabase Dashboard)
SELECT * FROM chats ORDER BY created_at DESC;
SELECT * FROM messages WHERE chat_id = 'xxx';
```

---

## 🎯 Продолжить разработку

**Следующее:** Phase 3 - Export Module

```bash
# Попросить Claude Code:
"Начни Phase 3.1 - Export Module.
Создай ExportService для экспорта чатов в JSON, Markdown и TXT.
Смотри детали в BACKLOG.md."
```

**Документация:**
- `docs/PROJECT_SNAPSHOT.md` - текущее состояние
- `docs/RESUME_SESSION.md` - инструкция для продолжения
- `docs/BACKLOG.md` - план Phase 3

---

**Проект на 50% готов! Удачи! 🚀**
