# Project Architecture

**Project:** Projekt Lena1 (AI Chat Bot с историей и экспортом)
**Version:** 2.0.0 (Modular Monolith)
**Last Updated:** 2025-10-23

---

> **🏗️ Authoritative Source:** This is the SINGLE SOURCE OF TRUTH for:
> - WHY we chose specific technologies (technology choices, design principles)
> - HOW the system is structured (modules, layers, components)
> - Modularity philosophy and patterns
> - Design principles and architecture patterns
>
> **⚠️ NOT for operational checklists:**
> ❌ Don't store detailed implementation tasks here (→ BACKLOG.md)
> ❌ Don't store sprint checklists here (→ BACKLOG.md)
> ❌ Don't store "Phase 1: do X, Y, Z" task lists here (→ BACKLOG.md)
>
> **This file = Reference (WHY & HOW)**
> **BACKLOG.md = Action Plan (WHAT to do now)**
>
> Other files (CLAUDE.md, PROJECT_INTAKE.md) link here, don't duplicate.

## 📊 Technology Stack

### Frontend
**Modular Monolith на Next.js 14**
```
- Framework: Next.js 14 (App Router) + React 18
- Language: TypeScript 5.x (strict mode)
- Build Tool: Next.js built-in (Turbopack для dev)
- State Management: Zustand 4.x (легковесный, быстрый)
- UI/CSS: Tailwind CSS 3.x + Radix UI (компоненты)
- Icons: Lucide React (современные, tree-shakeable)
- Routing: Next.js App Router (file-based routing)
```

**Почему Next.js?**
- ✅ Full-stack framework (frontend + API routes в одном месте)
- ✅ File-based routing (простая структура)
- ✅ Server Components (оптимизация производительности)
- ✅ Built-in API routes (не нужен отдельный backend)
- ✅ Отличный DX (developer experience)

**Почему Zustand?**
- ✅ Легковесный (1 KB gzipped vs Redux 9 KB)
- ✅ Простой API (меньше boilerplate)
- ✅ TypeScript-friendly из коробки
- ✅ DevTools support
- ✅ Подходит для учебного проекта

### Backend & Infrastructure
**Supabase + Next.js API Routes**
```
- Database: PostgreSQL via Supabase (managed, free tier)
- Authentication: Supabase Auth (GitHub OAuth)
- API Type: REST (Next.js API Routes) + Server Actions
- Real-time: Supabase Real-time (WebSockets, опционально)
- AI Integration: OpenAI API (GPT-4, streaming responses)
- Hosting: localhost:3000 (MVP) → Vercel (production)
```

**Почему Supabase?**
- ✅ Бесплатный tier (идеально для учебного проекта)
- ✅ PostgreSQL (полноценная реляционная БД)
- ✅ Встроенная аутентификация (GitHub OAuth из коробки)
- ✅ Row Level Security (безопасность на уровне БД)
- ✅ Простая настройка (не нужен Docker, K8s)

**Почему OpenAI GPT-4?**
- ✅ Streaming API (real-time ответы)
- ✅ Хорошая документация
- ✅ Надёжный сервис

### Key Dependencies
```json
{
  "next": "^14.x - Full-stack React framework",
  "react": "^18.x - UI library",
  "typescript": "^5.x - Type safety",
  "@supabase/supabase-js": "^2.x - Database + Auth client",
  "@supabase/auth-helpers-nextjs": "^0.8.x - Next.js Auth integration",
  "openai": "^4.x - GPT-4 integration",
  "zustand": "^4.x - State management",
  "@radix-ui/react-*": "latest - Accessible UI primitives",
  "tailwindcss": "^3.x - Utility-first CSS",
  "zod": "^3.x - Schema validation",
  "lucide-react": "latest - Icon library",
  "vitest": "^1.x - Unit testing",
  "@testing-library/react": "^14.x - Component testing",
  "playwright": "^1.x - E2E testing"
}
```

---

## 🗂️ Project Structure

**Modular Monolith - 6 независимых модулей внутри одного Next.js приложения**

```
projekt-lena1/
│
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/page.tsx        # Login page (GitHub OAuth)
│   │   └── callback/route.ts     # OAuth callback handler
│   │
│   ├── (dashboard)/              # Protected route group
│   │   ├── layout.tsx            # Dashboard layout (with sidebar)
│   │   ├── page.tsx              # Main chat interface (/)
│   │   ├── settings/page.tsx     # User settings
│   │   └── history/page.tsx      # Chat history browser
│   │
│   ├── api/                      # API Routes
│   │   ├── chat/route.ts         # POST /api/chat (streaming)
│   │   ├── export/route.ts       # POST /api/export (JSON/MD/TXT)
│   │   └── search/route.ts       # GET /api/search?q=...
│   │
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles (Tailwind)
│   └── error.tsx                 # Error boundary
│
├── src/
│   ├── modules/                  # 🎯 МОДУЛЬНАЯ АРХИТЕКТУРА
│   │   │
│   │   ├── auth/                 # Auth Module
│   │   │   ├── index.ts          # Public API (exports only)
│   │   │   ├── services/
│   │   │   │   └── AuthService.ts
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── chat/                 # Chat Module ⭐ CORE
│   │   │   ├── index.ts
│   │   │   ├── services/
│   │   │   │   └── ChatService.ts
│   │   │   ├── components/
│   │   │   │   ├── ChatInterface.tsx
│   │   │   │   ├── MessageList.tsx
│   │   │   │   └── ChatInput.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useChat.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── ai/                   # AI Module
│   │   │   ├── index.ts
│   │   │   ├── services/
│   │   │   │   └── OpenAIService.ts
│   │   │   ├── hooks/
│   │   │   │   └── useAI.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── export/               # Export Module 🌟 UNIQUE
│   │   │   ├── index.ts
│   │   │   ├── services/
│   │   │   │   └── ExportService.ts
│   │   │   ├── components/
│   │   │   │   └── ExportDialog.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── search/               # Search Module 🌟 UNIQUE
│   │   │   ├── index.ts
│   │   │   ├── services/
│   │   │   │   └── SearchService.ts
│   │   │   ├── components/
│   │   │   │   └── SearchBar.tsx
│   │   │   └── types.ts
│   │   │
│   │   └── user/                 # User Module
│   │       ├── index.ts
│   │       ├── services/
│   │       │   └── UserService.ts
│   │       └── types.ts
│   │
│   ├── components/               # Shared components
│   │   ├── ui/                   # Radix UI wrappers
│   │   │   ├── Button.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── shared/
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorMessage.tsx
│   │
│   ├── lib/                      # Utilities & clients
│   │   ├── supabase/
│   │   │   ├── client.ts         # Supabase client (browser)
│   │   │   └── server.ts         # Supabase server client
│   │   ├── openai.ts             # OpenAI client config
│   │   └── utils.ts              # Helper functions
│   │
│   └── store/                    # Zustand stores
│       ├── chatStore.ts          # Chat state (messages, current chat)
│       └── types.ts              # Store types
│
├── supabase/                     # Database
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── tests/                        # Testing
│   ├── unit/                     # Vitest unit tests
│   ├── integration/              # Integration tests
│   └── e2e/                      # Playwright E2E tests
│
├── .env.example                  # Environment template
├── .env.local                    # Local environment (gitignored)
├── .gitignore
├── package.json
├── tsconfig.json                 # TypeScript config (strict mode)
├── next.config.js                # Next.js config
├── tailwind.config.ts            # Tailwind + Radix config
└── vitest.config.ts              # Vitest config
```

**Ключевые принципы структуры:**

1. **Модульность через Public API**
   - Каждый модуль экспортирует только через `index.ts`
   - Другие модули импортируют ТОЛЬКО из `@/modules/[name]`
   - Внутренняя реализация скрыта

2. **Изоляция изменений**
   - Изменения в одном модуле НЕ требуют переписывать другие
   - Экономия токенов при работе с AI-агентами

3. **Clear Separation of Concerns**
   - `app/` = роуты и страницы (Next.js convention)
   - `src/modules/` = бизнес-логика (изолированные модули)
   - `src/components/` = shared UI (переиспользуемые компоненты)
   - `src/lib/` = утилиты и клиенты (Supabase, OpenAI)
   - `src/store/` = глобальное состояние (Zustand)

---

## 🏗️ Core Architecture Decisions

### 1. Modular Monolith вместо Микросервисов

**Decision:** Использовать модульный монолит (6 модулей внутри одного Next.js приложения)

**Reasoning:**
- ✅ **Учебный проект** - не нужна сложность микросервисов
- ✅ **Экономия токенов AI** - можно изменять один модуль без переписывания всего приложения
- ✅ **Простота деплоя** - один процесс на localhost:3000, не нужен Docker/K8s
- ✅ **Проще дебажить** - все в одном процессе, не нужен distributed tracing
- ✅ **Меньше overhead** - нет межсервисной коммуникации, RabbitMQ, API Gateway

**Alternatives considered:**
- ❌ **Микросервисы** (4 сервиса: auth, chat, ai, history) - Over-engineering для учебного проекта
- ❌ **Plain Monolith** - Нет изоляции модулей → при изменениях приходится переписывать всё → сжигание токенов
- ❌ **Frontend + отдельный Backend** - Дублирование TypeScript types, больше кода

**Implementation:**
```typescript
// Public API каждого модуля (src/modules/*/index.ts)
// Пример: src/modules/chat/index.ts

export { ChatService } from './services/ChatService'
export { useChat } from './hooks/useChat'
export type { Chat, Message } from './types'

// Импорт в других модулях ТОЛЬКО через Public API:
import { ChatService, useChat } from '@/modules/chat'
// ❌ НЕ import { ChatService } from '@/modules/chat/services/ChatService'
```

### 2. Public API Pattern для модулей

**Decision:** Каждый модуль экспортирует только через `index.ts` (Public API)

**Reasoning:**
- ✅ **Изоляция изменений** - можно менять внутреннюю реализацию без влияния на другие модули
- ✅ **Экономия токенов** - AI-агенту не нужно переписывать зависимые модули при изменении одного
- ✅ **Clear API** - явная граница между модулями
- ✅ **Проще рефакторинг** - внутри модуля можно менять что угодно

**Alternatives considered:**
- ❌ **Прямые импорты** (import from `@/modules/chat/services/...`) - Тесная связанность, cascade changes

**Implementation:**
```typescript
// ✅ Правильно (через Public API):
import { ChatService } from '@/modules/chat'

// ❌ Неправильно (обход Public API):
import { ChatService } from '@/modules/chat/services/ChatService'

// TypeScript path alias (tsconfig.json):
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/modules/*": ["./src/modules/*"]
    }
  }
}
```

### 3. Supabase вместо самописного Backend

**Decision:** Использовать Supabase (PostgreSQL + Auth + Real-time) вместо Node.js/Express backend

**Reasoning:**
- ✅ **Бесплатный tier** - идеально для учебного проекта
- ✅ **Меньше кода** - не нужно писать auth logic, SQL queries обёрнуты в client SDK
- ✅ **Row Level Security** - безопасность на уровне БД, не в коде
- ✅ **PostgreSQL** - полноценная реляционная БД (не NoSQL limitations)
- ✅ **TypeScript types** - автогенерация types из schema

**Alternatives considered:**
- ❌ **Prisma + PostgreSQL** - Нужен отдельный сервер БД, больше настройки
- ❌ **Firebase** - NoSQL (less suitable для реляционных данных), vendor lock-in
- ❌ **MongoDB + Express** - Нужно писать всю auth logic вручную

### 4. Zustand вместо Redux/Context

**Decision:** Использовать Zustand для state management

**Reasoning:**
- ✅ **Легковесный** - 1 KB vs Redux 9 KB
- ✅ **Простой API** - меньше boilerplate, меньше кода
- ✅ **TypeScript-first** - отличная типизация из коробки
- ✅ **Не требует Provider** - работает вне React tree
- ✅ **Подходит для учебного проекта** - легко освоить

**Alternatives considered:**
- ❌ **Redux Toolkit** - Слишком много boilerplate для учебного проекта
- ❌ **Context API** - Performance issues при частых updates (chat messages)
- ❌ **Jotai/Recoil** - Atomic state слишком гранулярный для этого проекта

**Implementation:**
```typescript
// src/store/chatStore.ts
import { create } from 'zustand'

interface ChatStore {
  messages: Message[]
  addMessage: (message: Message) => void
  currentChatId: string | null
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  currentChatId: null,
}))
```

### 5. Streaming API для AI ответов

**Decision:** Использовать OpenAI Streaming API для real-time ответов

**Reasoning:**
- ✅ **Лучший UX** - пользователь видит ответ по мере генерации (как в ChatGPT)
- ✅ **Не блокирует UI** - не нужно ждать полного ответа (GPT-4 может генерировать 10-30 секунд)
- ✅ **Прогресс индикация** - пользователь видит что запрос обрабатывается

**Alternatives considered:**
- ❌ **Non-streaming** - Долгое ожидание, плохой UX, непонятно завис ли запрос

**Implementation:**
```typescript
// app/api/chat/route.ts (Next.js API Route)
import { OpenAIStream, StreamingTextResponse } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,  // ← Streaming enabled
    messages,
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
```

---

### Template для новых решений:

```markdown
### N. [Название решения]

**Decision:** [Краткое описание решения]
**Reasoning:**
- ✅ [Преимущество 1]
- ✅ [Преимущество 2]

**Alternatives considered:**
- ❌ [Отвергнутая альтернатива] - [причина]

**Data structure/Implementation:**
[Код или структура данных]
```

---

## 🔧 Key Services & Components

### [Сервис/Компонент #1]
**Purpose:** [Назначение]
**Location:** `[путь к файлу]`

**Key methods/features:**
```typescript
- method1() → описание
- method2() → описание
- feature1 → описание
```

**Architectural features:**
- [Особенность 1]
- [Особенность 2]

**Example usage:**
```typescript
// Пример использования
```

---

### Template для документирования сервисов:

```markdown
### [Service Name]
**Purpose:** [Что делает]
**Location:** `[file path]`

**Key methods:**
- method() → [описание]

**Features:**
- [Особенность]

**Example:**
[код]
```

---

## 📡 Data Flow & Integration Patterns

### 1. [User Flow #1 - например "User Login"]
```
User Action →
├── Step 1
├── Step 2
├── Step 3
└── Final Result
```

**Detailed flow:**
1. [Шаг 1 детально]
2. [Шаг 2 детально]
3. [Шаг 3 детально]

### 2. [User Flow #2]
```
[Диаграмма потока]
```

---

### Template для документирования потоков:

```markdown
### N. [Flow Name]
[ASCII диаграмма]

**Detailed:**
1. [Шаг]
2. [Шаг]
```

---

## 🎯 Development Standards

### Code Organization
- [ЗАПОЛНИТЬ: стандарты организации кода]
- **1 component = 1 file** (если применимо)
- **Services in lib/** for reusability
- **TypeScript strict mode** - no `any` (except justified exceptions)
- **Naming:** [соглашения по именованию]

### Database Patterns
[ЗАПОЛНИТЬ: если есть база данных]
- **Primary Keys:** [UUID/Auto-increment/etc]
- **Relationships:** [как организованы связи]
- **Migrations:** [как применяются миграции]
- **Security:** [RLS/Permissions/etc]

### Error Handling
- **Try/catch** in async functions
- **User-friendly** error messages (на русском/английском)
- **Console logging** for debugging
- **Fallback states** in UI

### Performance Optimizations
- [ЗАПОЛНИТЬ: специфичные для проекта оптимизации]
- **[Оптимизация 1]**
- **[Оптимизация 2]**
- **[Оптимизация 3]**

---

## 🧩 Module Architecture

> **Философия:** Модульная архитектура - основа эффективной разработки с ИИ-агентами

### Зачем нужна модульность?

**Критические преимущества для работы с ИИ:**

1. **Экономия токенов и денег**
   - ИИ загружает только нужный модуль (100-200 строк)
   - Вместо всего проекта (1000+ строк)
   - Запросы выполняются быстрее и дешевле

2. **Простота разработки и тестирования**
   - Каждый модуль = отдельная задача
   - Легко проверить работу модуля изолированно
   - ИИ лучше понимает узкие задачи

3. **Параллельная работа**
   - Можно разрабатывать разные модули одновременно
   - Ускоряет итерацию

4. **Управляемость проекта**
   - Легко найти и исправить ошибки
   - Понятная структура для команды
   - Простое добавление новых функций

### Принцип модульности

**Приложение = Набор маленьких кубиков (LEGO)**

```
┌─────────────────────────────────────────────┐
│           Приложение                        │
├─────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │   Auth   │  │ Database │  │   API    │ │
│  │  Module  │  │  Module  │  │  Module  │ │
│  └──────────┘  └──────────┘  └──────────┘ │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Screen  │  │  Screen  │  │  Screen  │ │
│  │    1     │  │    2     │  │    3     │ │
│  └──────────┘  └──────────┘  └──────────┘ │
│                                             │
│  ┌──────────┐  ┌──────────┐                │
│  │ Business │  │ Business │                │
│  │  Logic 1 │  │  Logic 2 │                │
│  └──────────┘  └──────────┘                │
└─────────────────────────────────────────────┘
```

Каждый модуль:
- Решает **одну узкую задачу**
- Имеет **чёткий вход и выход**
- Работает как **"черный ящик"** для других модулей
- Может быть **протестирован отдельно**

---

### Типичные модули проекта

[ЗАПОЛНИТЬ по мере разработки, но вот типичная структура:]

#### 1. Модуль аутентификации
**Purpose:** Регистрация, вход, восстановление пароля
**Location:** `src/lib/auth/` или `src/features/auth/`
**Независимость:** Полностью самостоятельный, не зависит от бизнес-логики
**Интеграция:** Через Auth Provider или Context

**Компоненты:**
- LoginForm
- RegisterForm
- PasswordResetForm
- AuthProvider

---

#### 2. Модуль базы данных
**Purpose:** Работа с базой данных
**Location:** `src/lib/db/` или `src/lib/supabase/`
**Независимость:** Изолированная работа с БД
**Интеграция:** Через клиент (Supabase/Firebase/Prisma)

**Функции:**
- Подключение к БД
- CRUD операции
- Queries и mutations

---

#### 3. Модули экранов/страниц
**Purpose:** Отдельный экран = отдельный модуль
**Location:** `src/pages/` или `src/app/`
**Независимость:** Каждая страница независима

**Примеры:**
- HomePage
- DashboardPage
- SettingsPage
- ProfilePage

---

#### 4. Модули бизнес-логики
**Purpose:** Уникальная логика вашего приложения
**Location:** `src/features/` или `src/lib/business/`

**Примеры:**
- PaymentProcessor
- BookingSystem
- RatingCalculator
- NotificationManager

---

#### 5. Backend/API модуль
**Purpose:** Связь между фронтендом и базой данных
**Location:** `src/app/api/` или `src/lib/api/`
**Независимость:** Самостоятельный слой между UI и DB

**Функции:**
- API routes/endpoints
- Business logic на сервере
- Валидация данных

---

### Процесс разработки по модулям

**Последовательность (рекомендуется):**

1. **База данных** → Схема, таблицы, связи
2. **Аутентификация** → Регистрация, вход
3. **Backend/API** → Эндпоинты для работы с данными
4. **Экраны по одному** → HomePage → Dashboard → Settings...
5. **Бизнес-логика** → Уникальные функции вашего приложения

**Правило:** Один модуль → Тестирование → Следующий модуль

---

### Пример модуля (Документация)

### [Module Name - например "User Authentication"]
**Purpose:** [Что делает модуль]

**Location:** `[путь к файлам модуля]`

**Components:**
- `Component1.tsx` - [описание]
- `Component2.tsx` - [описание]
- `service.ts` - [логика модуля]

**Dependencies:**
- [Внешние зависимости: библиотеки, сервисы]

**Integration with other modules:**
- [Как этот модуль взаимодействует с другими]

**Input/Output:**
```typescript
// Вход
interface ModuleInput {
  // ...
}

// Выход
interface ModuleOutput {
  // ...
}
```

**Example usage:**
```typescript
// Пример использования модуля
import { useAuth } from './auth-module';

const { user, login, logout } = useAuth();
```

**Testing:**
- [Как тестируется модуль]

---

### Ваши модули проекта

[ЗАПОЛНИТЬ по мере разработки - добавляйте каждый модуль сюда]

#### Module 1: [Name]
[Документация]

#### Module 2: [Name]
[Документация]

---

## 🗄️ Database Schema

[ЗАПОЛНИТЬ: структура базы данных]

### Tables Overview
```
[table_name_1]
├── id: uuid (PK)
├── field1: type
└── field2: type

[table_name_2]
├── id: uuid (PK)
└── foreign_key: uuid (FK → table_name_1)
```

### Relationships
- [Описание связей между таблицами]

### Indexes
- [Какие индексы созданы и зачем]

### Security
- [RLS policies или другие меры безопасности]

---

## 🔐 Security Architecture

[ЗАПОЛНИТЬ: меры безопасности]

### Authentication
- **Method:** [OAuth/JWT/Session/etc]
- **Provider:** [Auth0/Supabase/Custom/etc]
- **Flow:** [Описание процесса аутентификации]

### Authorization
- **Model:** [RBAC/ABAC/Custom/etc]
- **Implementation:** [Как проверяются права доступа]

### Data Protection
- **At Rest:** [Шифрование данных]
- **In Transit:** [HTTPS/TLS]
- **API Keys:** [Как хранятся]
- **Sensitive Data:** [Как обрабатываются]

### Security Headers
```javascript
// Пример настройки security headers
```

---

## 🚀 Deployment Architecture

[ЗАПОЛНИТЬ: архитектура деплоя]

### Environments
- **Development:** [localhost/dev server]
- **Staging:** [URL/описание]
- **Production:** [URL/описание]

### CI/CD Pipeline
```
[Описание процесса деплоя]
Code → Tests → Build → Deploy
```

### Environment Variables
```env
# Required
VAR_NAME=description

# Optional
OPTIONAL_VAR=description
```

---

## 📊 State Management Architecture

[ЗАПОЛНИТЬ: как организовано управление состоянием]

### Global State
```typescript
// Структура глобального состояния
interface AppState {
  [ЗАПОЛНИТЬ]
}
```

### Local State
[Когда использовать локальное состояние]

### State Update Patterns
```typescript
// Примеры паттернов обновления состояния
```

---

## 🔄 Evolution & Migration Strategy

### Approach to Changes
1. **Document decision** in this file
2. **Database changes** → Create migration script
3. **Backward compatibility** when possible
4. **Feature flags** for experimental functionality

### Migration Pattern
```
Planning → Implementation → Testing → Documentation → Deployment
    ↓           ↓              ↓           ↓            ↓
ARCHITECTURE  Code+Tests    Manual QA   Update docs   Git push
```

### Version History
- **[VERSION]** - [DATE] - [Changes summary]
- [Добавляйте по мере развития]

---

## 🧪 Module Testing - Изолированное тестирование

> **Зачем:** Каждый модуль должен работать независимо от остальных. Это экономит время и токены при разработке с AI.

### Принцип модульного тестирования:

**❌ Плохо:**
```
Тестирую весь проект сразу →
Непонятно где ошибка →
AI загружает весь код →
Долго, дорого
```

**✅ Хорошо:**
```
Тестирую один модуль →
Ошибка локализована →
AI видит только 1 модуль →
Быстро, дёшево
```

### Как тестировать модуль изолированно:

#### Шаг 1: Создать тестовую страницу

```typescript
// src/test/[ModuleName]Test.tsx
import { [ModuleName] } from '../modules/[module-name]/[ModuleName]';

function [ModuleName]Test() {
  return (
    <div className="p-8">
      <h1>Testing: [ModuleName]</h1>
      <[ModuleName] />
    </div>
  );
}

export default [ModuleName]Test;
```

#### Шаг 2: Временно подключить в App

```typescript
// src/App.tsx (временно)
import [ModuleName]Test from './test/[ModuleName]Test';

function App() {
  return <[ModuleName]Test />;
}
```

#### Шаг 3: Проверить функциональность

**Чеклист для тестирования модуля:**
- [ ] Модуль отображается без ошибок
- [ ] Основной функционал работает
- [ ] Edge cases обработаны
- [ ] Error states показываются правильно
- [ ] Loading states работают
- [ ] UI responsive (если применимо)

#### Шаг 4: Вернуть App к исходному виду

После тестирования:
- Восстановить `App.tsx`
- Удалить test файл или оставить для документации
- Сделать commit с результатами

### Критерии готовности модуля:

Модуль считается **готовым** когда:

#### Базовые критерии:
- [ ] Все файлы модуля созданы (component, hook, types)
- [ ] Код компилируется без ошибок TypeScript
- [ ] Нет ESLint warnings (или обоснованы)
- [ ] Модуль протестирован изолированно

#### Функциональные критерии:
- [ ] Основной функционал реализован
- [ ] Edge cases обработаны
- [ ] Error handling добавлен
- [ ] Loading states реализованы
- [ ] Валидация данных работает

#### Документация:
- [ ] Интерфейс модуля задокументирован
- [ ] Зависимости указаны
- [ ] Примеры использования есть (если нужно)

#### Мета-файлы:
- [ ] BACKLOG.md — задачи отмечены ✅
- [ ] PROJECT_SNAPSHOT.md — модуль добавлен
- [ ] PROCESS.md — чеклист выполнен

### Граф зависимостей модулей:

**Важно:** Разрабатывай модули в правильном порядке!

```
Независимые модули (сначала):
├─ UI Components (Button, Input, etc.)
├─ Utility Modules (encryption, validation)
└─ API Clients (без UI)

Зависимые модули (потом):
├─ Feature Modules
│   └─ depends on: UI Components, Utilities
└─ Integration Modules
    └─ depends on: Feature Modules
```

**Как определить порядок:**
1. Нарисуй граф зависимостей
2. Начни с модулей без входящих стрелок
3. Переходи к следующему уровню только после готовности предыдущего

### Экономия токенов через модульное тестирование:

**Пример:** Проект с 5 модулями

**Без изоляции:**
```
Тестируешь весь проект:
→ AI читает все 5 модулей (2000 строк)
→ ~8000 токенов × 3 итерации = 24k токенов
→ Стоимость: ~$0.24
```

**С изоляцией:**
```
Тестируешь каждый модуль отдельно:
→ AI читает 1 модуль (400 строк)
→ ~1500 токенов × 3 итерации × 5 модулей = 22.5k токенов
→ НО! Меньше итераций (быстрее находишь баги)
→ Реально: ~1500 × 2 × 5 = 15k токенов
→ Стоимость: ~$0.15

Экономия: ~40%! + Быстрее разработка!
```

### Template для документирования тестов:

```markdown
## Тестирование [Module Name]

### Тест 1: [Название функциональности]
- **Действие:** [что делаем]
- **Ожидаемый результат:** [что должно произойти]
- **Статус:** [x] Passed / [ ] Failed
- **Баги:** [если найдены]

### Тест 2: [Edge case]
- **Действие:** [что делаем]
- **Ожидаемый результат:** [что должно произойти]
- **Статус:** [x] Passed / [ ] Failed

### Итог:
- ✅ Модуль готов к интеграции
- ⏸️ Требуются доработки: [список]
```

---

## 📚 Related Documentation

- **BACKLOG.md** - Current implementation status and roadmap
- **PROJECT_SNAPSHOT.md** - Current project state snapshot
- **PROCESS.md** - Documentation update process after each phase
- **DEVELOPMENT_PLAN_TEMPLATE.md** - Planning methodology
- **AGENTS.md** - AI assistant working instructions
- **WORKFLOW.md** - Development processes and sprint workflow
- **README.md** - User-facing project information

---

## 📝 Architecture Decision Records (ADR)

[Опционально: для документирования важных архитектурных решений]

### ADR-001: [Decision Title]
**Date:** [DATE]
**Status:** [Accepted/Deprecated/Superseded]
**Context:** [Почему нужно было принять решение]
**Decision:** [Что решили]
**Consequences:** [К чему это привело]

---

## 🎨 Design Patterns Used

[ЗАПОЛНИТЬ: какие паттерны проектирования используются]

- **[Pattern Name]** - [Где используется и зачем]
- Примеры:
  - **Repository Pattern** - в `lib/repositories/`
  - **Factory Pattern** - в `lib/factories/`
  - **Observer Pattern** - в state management

---

## 📝 Notes for Customization

Когда заполняете этот файл для конкретного проекта:

1. **Замените все [ЗАПОЛНИТЬ]** на актуальную информацию
2. **Удалите секции** которые не применимы к вашему проекту
3. **Добавьте новые секции** специфичные для вашего проекта
4. **Обновляйте документ** при каждом архитектурном изменении
5. **Используйте диаграммы** где нужно (Mermaid/ASCII)
6. **Удалите эту секцию** после первичного заполнения

---

*This document maintained in current state for effective development*
*Last updated: [DATE]*
