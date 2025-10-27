# TODO - Projekt Lena1

**Last Updated:** 2025-10-23
**Current Phase:** Phase 0 ✅ → Ready for Phase 1

---

## ✅ Completed (Phase 0: Documentation)

### Architecture & Planning
- [x] Проанализировать исходное ТЗ (TECHNICAL_SPECIFICATION.md v1.0)
- [x] Выявить over-engineering (4 микросервиса → упростить)
- [x] Принять решение: модульный монолит вместо микросервисов
- [x] Спроектировать 6 модулей с Public API pattern

### Documentation
- [x] Обновить TECHNICAL_SPECIFICATION.md (v2.0, модульная архитектура)
- [x] Заполнить PROJECT_INTAKE.md (User Personas, User Flows, Tech Stack)
- [x] Создать детальный BACKLOG.md (4 фазы, ~219 часов)
- [x] Обновить PROJECT_SNAPSHOT.md (текущий статус)
- [x] Заполнить ARCHITECTURE.md (Tech Stack, решения, структура)
- [x] Создать README.md (описание проекта, Quick Start)

**Phase 0 Duration:** 1 день (2025-10-23)

---

## 📋 Next: Phase 1 - Foundation (Week 1-2, ~41 hours)

### 1.1 Project Initialization (~8 hours)
- [ ] Инициализировать Next.js 14 проект (App Router)
  ```bash
  npx create-next-app@latest projekt-lena1 --typescript --tailwind --app
  ```
- [ ] Настроить TypeScript strict mode
- [ ] Настроить ESLint + Prettier
- [ ] Создать `.env.example` с необходимыми переменными
- [ ] Настроить `.gitignore` (`.env.local`, `node_modules`, etc.)
- [ ] Создать базовую структуру папок (`src/modules/`, `src/components/`, etc.)

### 1.2 Supabase Setup (~6 hours)
- [ ] Создать Supabase проект (free tier)
- [ ] Настроить GitHub OAuth в Supabase Auth
- [ ] Установить `@supabase/supabase-js` и `@supabase/auth-helpers-nextjs`
- [ ] Создать Supabase clients (`src/lib/supabase/client.ts`, `server.ts`)
- [ ] Создать миграцию БД (`supabase/migrations/001_initial_schema.sql`)
  - Таблица `profiles`
  - Таблица `chats`
  - Таблица `messages`
  - Таблица `usage_stats`
- [ ] Применить миграцию и настроить Row Level Security (RLS)

### 1.3 Module Structure (~4 hours)
- [ ] Создать структуру для 6 модулей:
  - [ ] `src/modules/auth/` (index.ts, services/, hooks/, types.ts)
  - [ ] `src/modules/user/` (index.ts, services/, types.ts)
  - [ ] `src/modules/chat/` (index.ts, services/, components/, hooks/, types.ts)
  - [ ] `src/modules/ai/` (index.ts, services/, hooks/, types.ts)
  - [ ] `src/modules/export/` (index.ts, services/, components/, types.ts)
  - [ ] `src/modules/search/` (index.ts, services/, components/, types.ts)
- [ ] Настроить TypeScript path aliases в `tsconfig.json`
  ```json
  {
    "paths": {
      "@/*": ["./src/*"],
      "@/modules/*": ["./src/modules/*"]
    }
  }
  ```

### 1.4 Auth Module Implementation (~12 hours)
- [ ] Реализовать `AuthService.ts`
  - [ ] `signInWithGithub()` - инициировать OAuth flow
  - [ ] `signOut()` - выход из системы
  - [ ] `getSession()` - получить текущую сессию
  - [ ] `getUser()` - получить данные пользователя
- [ ] Создать `useAuth.ts` hook
  - [ ] `useAuth()` - возвращает `{ user, session, signIn, signOut, loading }`
- [ ] Создать типы в `auth/types.ts`
  - [ ] `User`, `Session`, `AuthState`
- [ ] Экспортировать Public API через `auth/index.ts`

### 1.5 Auth Pages & Routes (~6 hours)
- [ ] Создать `app/(auth)/login/page.tsx`
  - [ ] UI для кнопки "Sign in with GitHub"
  - [ ] Обработка клика → `signInWithGithub()`
- [ ] Создать `app/(auth)/callback/route.ts`
  - [ ] Обработка OAuth callback от GitHub
  - [ ] Redirect на dashboard после успешной авторизации
- [ ] Настроить redirect rules в `middleware.ts`
  - [ ] Защищённые роуты → редирект на `/login` если не авторизован

### 1.6 Basic UI Setup (~5 hours)
- [ ] Установить Radix UI primitives
  ```bash
  npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-avatar
  ```
- [ ] Создать UI компоненты в `src/components/ui/`:
  - [ ] `Button.tsx`
  - [ ] `Input.tsx`
  - [ ] `Dialog.tsx`
  - [ ] `Avatar.tsx`
- [ ] Настроить Tailwind config (`tailwind.config.ts`)
  - [ ] Добавить Radix UI plugins
  - [ ] Настроить цветовую палитру
- [ ] Создать `app/globals.css` с базовыми стилями

### 1.7 Layout Components (~4 hours)
- [ ] Создать `src/components/layout/Header.tsx`
  - [ ] Логотип
  - [ ] User avatar + dropdown menu
  - [ ] Sign out button
- [ ] Создать `src/components/layout/Sidebar.tsx`
  - [ ] Навигация (Chat, History, Settings)
  - [ ] Placeholder для списка чатов
- [ ] Создать `app/(dashboard)/layout.tsx`
  - [ ] Использовать Header + Sidebar
  - [ ] Protected layout (требует авторизации)

**Phase 1 Total:** ~41 час

---

## 🔜 Upcoming: Phase 2 - Core Chat (Week 3-4, ~62 hours)

### 2.1 Chat Service (~8 hours)
- [ ] Реализовать `ChatService.ts` (CRUD для чатов)
- [ ] Реализовать `MessageService.ts` (CRUD для сообщений)
- [ ] Создать `useChat.ts` hook

### 2.2 OpenAI Integration (~10 hours)
- [ ] Настроить OpenAI client
- [ ] Реализовать `OpenAIService.ts`
- [ ] Реализовать streaming API route
- [ ] Создать `useAI.ts` hook

### 2.3 Chat UI (~20 hours)
- [ ] `ChatInterface.tsx` - главный компонент
- [ ] `MessageList.tsx` - список сообщений
- [ ] `ChatInput.tsx` - ввод сообщений
- [ ] `MessageBubble.tsx` - отдельное сообщение

### 2.4 State Management (~8 hours)
- [ ] Настроить Zustand
- [ ] Создать `chatStore.ts`
- [ ] Интеграция с UI компонентами

### 2.5 Chat History (~10 hours)
- [ ] `app/(dashboard)/history/page.tsx`
- [ ] Список всех чатов пользователя
- [ ] Фильтрация и сортировка

### 2.6 Testing Phase 2 (~6 hours)
- [ ] Unit тесты для сервисов
- [ ] Integration тесты для chat flow

**Phase 2 Total:** ~62 часа

---

## 🔜 Upcoming: Phase 3 - Unique Features (Week 5-6, ~56 hours)

### 3.1 Export Module (~18 hours)
- [ ] `ExportService.ts` (JSON, Markdown, TXT)
- [ ] `ExportDialog.tsx` UI
- [ ] API route `/api/export`
- [ ] Download functionality

### 3.2 Search Module (~18 hours)
- [ ] `SearchService.ts` (full-text search)
- [ ] `SearchBar.tsx` UI
- [ ] API route `/api/search`
- [ ] Results display

### 3.3 Chat Organization (~14 hours)
- [ ] Categories & Tags
- [ ] Favorites
- [ ] Custom metadata
- [ ] UI для управления

### 3.4 Settings Page (~6 hours)
- [ ] User preferences
- [ ] Theme settings
- [ ] AI parameters

**Phase 3 Total:** ~56 часов

---

## 🔜 Upcoming: Phase 4 - Polish & Testing (Week 7-8, ~60 hours)

### 4.1 UI/UX Improvements (~20 hours)
- [ ] Responsive design
- [ ] Accessibility (ARIA labels)
- [ ] Loading states
- [ ] Error handling UI
- [ ] Animations (Framer Motion)

### 4.2 Testing (~25 hours)
- [ ] Unit tests (Vitest) - 70% coverage
- [ ] Integration tests (Testing Library)
- [ ] E2E tests (Playwright)

### 4.3 Performance (~10 hours)
- [ ] Code splitting
- [ ] Image optimization
- [ ] Lighthouse audit

### 4.4 Documentation (~5 hours)
- [ ] API documentation
- [ ] User guide
- [ ] Deployment guide

**Phase 4 Total:** ~60 часов

---

## 📊 Overall Statistics

**Total Estimated Time:** ~219 hours (7-8 weeks)

**Progress:**
- Phase 0: ✅ Completed (2025-10-23)
- Phase 1: 📋 Not Started (0/41 hours)
- Phase 2: 📋 Not Started (0/62 hours)
- Phase 3: 📋 Not Started (0/56 hours)
- Phase 4: 📋 Not Started (0/60 hours)

**Overall:** 0% (0/219 development hours)

---

## 🔗 Related Files

- **BACKLOG.md** - Детальный план с чеклистами (SINGLE SOURCE OF TRUTH)
- **PROJECT_SNAPSHOT.md** - Текущий статус проекта
- **ARCHITECTURE.md** - Архитектура и технические решения
- **PROJECT_INTAKE.md** - Требования и User Flows

---

*Этот файл синхронизирован с BACKLOG.md. При обновлении одного файла обновляй другой!*
