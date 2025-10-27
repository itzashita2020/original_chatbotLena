# Project Intake Form

**Purpose:** Fill this document BEFORE starting development to provide AI agents with essential context
**Status:** ✅ FILLED
**Migration Status:** [NOT MIGRATED] <!-- Will be set to "✅ COMPLETED (YYYY-MM-DD)" after /migrate-finalize -->
**Last Updated:** 2025-10-23
**Project Type:** Учебный

---

## 🎯 Project Overview

> **Важно:** Проектирование начинается с вопроса "**ЗАЧЕМ?**". Ответьте на три ключевых вопроса:

### 1. Ключевая идея (Elevator Pitch)
**Опишите суть приложения в ОДНОМ предложении:**

"Учебное веб-приложение AI чат-бота с уникальными возможностями организации истории диалогов, экспорта чатов в файлы и полнотекстового поиска по всем разговорам"

---

### 2. Проблема (The Problem)
**Какую конкретную проблему пользователя вы решаете?**

ChatGPT и аналогичные AI чат-боты не сохраняют удобную историю диалогов с возможностью организации, поиска и экспорта. Пользователям сложно:
- Находить прошлые разговоры через месяц
- Экспортировать важные диалоги для документации
- Организовать чаты по темам (работа, учеба, хобби)
- Быстро найти конкретный ответ AI из прошлых сессий

**Почему существующие решения не работают?**

- **ChatGPT:** История есть, но поиск плохой, нет категорий, экспорт неудобный
- **Claude:** Нет сохранения истории между сессиями
- **Другие AI боты:** Либо платные, либо без организации истории
- **Учебные проекты:** Обычно это просто копии ChatGPT без уникальных фич

---

### 3. Решение (The Solution)
**Как ИМЕННО ваше приложение решает эту проблему?**

Создаём AI чат-бот на базе GPT-4 с тремя уникальными фичами:

1. **База чатов** - полная история всех диалогов с автогенерацией заголовков
2. **Умная организация** - категории, теги, полнотекстовый поиск
3. **Экспорт** - скачивание чатов в JSON, Markdown, TXT для документации

**Какую уникальную ценность вы даете?**

✅ **Для студентов:** Сохранение учебных диалогов, экспорт для конспектов
✅ **Для разработчиков:** Организация технических вопросов по проектам
✅ **Для исследователей:** База знаний из AI диалогов с поиском
✅ **Для обучения:** Изучение модульной архитектуры, Full-Stack разработки

---

### 4. Целевая аудитория (Target Audience)
**Для КОГО вы создаете этот продукт?**

**Основная аудитория:** Студенты и начинающие разработчики 18-30 лет, изучающие современный стек веб-разработки (Next.js, TypeScript, AI интеграции)

**Вторичная аудитория:** Пользователи AI чат-ботов, которым нужна организация истории

**Их характеристики:**
- Возраст: 18-30 лет
- Профессия/род деятельности: Студенты IT, Junior разработчики, самообучающиеся
- Технологическая грамотность: Средняя-высокая
- Готовность платить: Бесплатно (учебный проект), возможна freemium модель в будущем

---

## 👥 User Personas (Портреты пользователей)

> **Цель:** "Очеловечить" пользователей для ИИ. Создайте 1-3 вымышленных персонажа - ваших идеальных пользователей.

### Persona 1: Алексей, 22 года - Студент CS

```
Имя: Алексей, 22 года
Роль: Студент Computer Science, 3 курс
Локация: Москва, живет в общежитии
Устройство: Ноутбук + смартфон
```

**Цели:**
- Использовать AI для помощи с домашними заданиями по программированию
- Сохранять учебные диалоги для подготовки к экзаменам
- Экспортировать ответы AI в конспекты
- Организовать вопросы по курсам (Алгоритмы, Базы данных, Веб-разработка)

**Проблемы (Pain Points):**
- ChatGPT не сохраняет историю удобно, через месяц не найти прошлый диалог
- Нужно копировать ответы вручную в заметки
- Нет возможности быстро найти "как я решал похожую задачу 2 недели назад?"
- Хочется организовать по предметам

**Поведение с технологиями:**
- Активный пользователь ChatGPT, GitHub, VS Code
- Предпочитает веб-приложения desktop приложениям
- Любит горячие клавиши и быстрый workflow
- Готов пробовать новые инструменты для повышения продуктивности

**Типичный User Flow:**
1. Спрашивает AI "Как реализовать binary search tree в TypeScript?"
2. Получает ответ, копирует код
3. Через неделю снова нужна похожая задача, но уже не помнит детали
4. **Проблема:** Не может быстро найти тот диалог в ChatGPT
5. **Решение в нашем приложении:** Поиск "binary search tree" → находит за секунду

---

### Persona 2: Мария, 26 лет - Junior Frontend Developer

```
Имя: Мария, 26 лет
Роль: Junior Frontend Developer (6 месяцев опыта)
Локация: Удаленная работа, Санкт-Петербург
Устройство: MacBook Pro
```

**Цели:**
- Использовать AI для помощи с отладкой кода и понимания сложных концепций
- Сохранять решения типичных проблем для будущих проектов
- Экспортировать AI объяснения в документацию команды
- Организовать чаты по проектам (Проект A, Проект B, Обучение React)

**Проблемы (Pain Points):**
- На работе часто задает AI одни и те же вопросы, не помня прошлые ответы
- Нужно делиться AI решениями с командой, но экспорт из ChatGPT неудобный
- Хочется отдельную категорию для рабочих и учебных вопросов
- Нет возможности быстро показать коллеге "вот это AI мне объяснил месяц назад"

**Поведение с технологиями:**
- Ежедневный пользователь ChatGPT (100+ запросов в месяц)
- Использует Notion для документации
- Любит организованность и систему
- Готова платить за инструменты, которые экономят время

**Типичный User Flow:**
1. Сталкивается с ошибкой "TypeError: Cannot read property of undefined"
2. Спрашивает AI как дебажить
3. Решает проблему
4. Через 2 месяца - похожая ошибка в другом проекте
5. **Проблема:** Тратит 30 минут на поиск решения заново
6. **Решение в нашем приложении:** Тег "debugging" → находит за 10 секунд

---

### Persona 3: Дмитрий, 19 лет - Самообучающийся разработчик

```
Имя: Дмитрий, 19 лет
Роль: Самостоятельно изучает веб-разработку (career switch)
Локация: Казань, работает курьером
Устройство: Старый ноутбук Windows
```

**Цели:**
- Учиться программированию с помощью AI (не может позволить платные курсы)
- Создать личную базу знаний из диалогов с AI
- Экспортировать туториалы от AI в PDF для чтения оффлайн
- Отслеживать свой прогресс через историю вопросов

**Проблемы (Pain Points):**
- Ограниченный бюджет (не может платить за ChatGPT Plus)
- Нестабильный интернет, нужен оффлайн доступ к важным ответам
- Хочет видеть свой прогресс "3 месяца назад спрашивал что такое JS, сейчас делаю React"
- Нет систематизации обучения

**Поведение с технологиями:**
- Начинающий пользователь, но быстро учится
- Использует бесплатные ресурсы (YouTube, freeCodeCamp, ChatGPT free tier)
- Предпочитает простые интерфейсы
- Мотивирован изменить карьеру

**Типичный User Flow:**
1. Проходит туториал по React
2. Задает AI 20 вопросов по ходу
3. Хочет сохранить весь диалог как "конспект по React hooks"
4. **Проблема:** ChatGPT не дает скачать в удобном формате
5. **Решение в нашем приложении:** "Export as Markdown" → читает оффлайн

---

## 🗺️ User Flows (Сценарии взаимодействия)

> **Цель:** Описать ПО ШАГАМ, как пользователь будет взаимодействовать с приложением для достижения своих целей.

### Ключевой сценарий 1: "Первый диалог с AI и его сохранение"

```
1. Пользователь открывает http://localhost:3000 в браузере
2. Видит экран входа с кнопкой "Login with GitHub"
3. Нажимает на кнопку, переходит на GitHub OAuth
4. Авторизуется в GitHub, возвращается в приложение
5. Видит главную страницу с пустым списком чатов слева и полем ввода справа
6. Вводит вопрос: "Как работает async/await в JavaScript?"
7. Нажимает Enter или кнопку "Send"
8. Видит своё сообщение в чате
9. Видит индикатор "AI typing..."
10. Получает streaming ответ от GPT-4 (текст появляется словами)
11. AI автоматически генерирует заголовок чата: "Async/Await в JavaScript"
12. Чат сохраняется в БД и появляется в списке слева
13. Может продолжить диалог или создать новый чат
```

**Результат:** Пользователь увидел, что история сохраняется автоматически (отличие от простого ChatGPT)

---

### Ключевой сценарий 2: "Поиск прошлого диалога"

```
1. Пользователь накопил 50+ чатов за месяц
2. Вспоминает "2 недели назад спрашивал про React hooks"
3. Использует поле поиска в sidebar: вводит "React hooks"
4. Система делает полнотекстовый поиск по всем сообщениям
5. Видит список чатов с подсвеченными совпадениями:
   - "React Hooks Объяснение" (14 дней назад)
   - "useState vs useEffect" (10 дней назад)
6. Нажимает на нужный чат
7. Открывается полная история того диалога
8. Находит нужный ответ AI за 10 секунд вместо 30 минут
```

**Результат:** Демонстрация ценности организованной истории и поиска

---

### Ключевой сценарий 3: "Экспорт чата для документации"

```
1. Пользователь завершил большой диалог с AI про "Архитектуру микросервисов"
2. Хочет сохранить это как документ для команды
3. Нажимает кнопку "Export" в хедере чата
4. Выбирает формат: "Markdown"
5. Система генерирует .md файл:
   # Архитектура микросервисов
   *Дата: 23.10.2025*

   **User:** Объясни принципы микросервисной архитектуры
   **AI:** Микросервисная архитектура - это...

   [полный диалог]
6. Браузер скачивает файл `chat-microservices-architecture.md`
7. Пользователь открывает в Notion/Obsidian/VS Code
8. Делится с командой или использует как конспект
```

**Результат:** Демонстрация уникальной фичи экспорта

---

### Ключевой сценарий 4: "Организация по категориям"

```
1. У пользователя 100+ чатов вперемешку (работа, учеба, хобби)
2. Открывает настройки чата
3. Добавляет категорию: "Study" и теги: ["React", "Frontend"]
4. Повторяет для других чатов
5. В sidebar появляются категории:
   📁 Study (45 чатов)
   📁 Work (30 чатов)
   📁 Personal (25 чатов)
6. Нажимает на "Study" → видит только учебные чаты
7. Фильтрует по тегу "React" → видит только React чаты
```

**Результат:** Демонстрация организационных возможностей

---

## 🛠️ Technology Stack

> **Важно:** Если вы НЕ разбираетесь в технологиях - не заполняйте этот раздел. Напишите в секции 5: "Предложи оптимальный стек сам" - и ИИ предложит лучшие варианты с обоснованием.

### 4. Frontend Framework
**Choose one and specify version if important:**

- [x] React (with Next.js / Vite / CRA)
- [ ] Vue.js (with Nuxt / Vite)
- [ ] Angular
- [ ] Svelte / SvelteKit
- [ ] Other: [УКАЗАТЬ]

**Selected:** React 18 + Next.js 14 (App Router)

**Почему:**
- Next.js 14 = современный стек с App Router (SSR, SSG, ISR из коробки)
- Отличный DX (Developer Experience) для обучения
- Встроенные API Routes (не нужен отдельный backend)
- Vercel deployment в 1 клик
- Огромное community и учебные материалы

---

### 5. Language
**TypeScript or JavaScript?**

- [x] TypeScript (recommended)
- [ ] JavaScript

**Selected:** TypeScript 5.x

**Почему:**
- Строгая типизация = меньше багов
- Автокомплит и IntelliSense в IDE
- Легче рефакторить код
- Стандарт индустрии для учебных целей
- Модульная архитектура требует типов для публичных API

---

### 6. Styling Solution

- [x] Tailwind CSS (recommended for speed)
- [ ] CSS Modules
- [ ] Styled Components / Emotion
- [ ] Plain CSS / SCSS
- [ ] Other: [УКАЗАТЬ]

**Selected:** Tailwind CSS 3.x + Radix UI

**Почему:**
- Tailwind = быстрая разработка UI
- Radix UI = готовые accessible компоненты (headless)
- Меньше кастомного CSS = проще поддержка
- Хорошо работает с модульной архитектурой

---

### 7. Backend / Database

**Choose backend approach:**

- [x] Supabase (recommended - auth + DB + real-time)
- [ ] Firebase
- [ ] Custom backend (Node.js / Python / Go)
- [ ] Serverless (AWS Lambda / Vercel Functions)
- [ ] Other: [УКАЗАТЬ]

**Selected:** Next.js API Routes + Supabase (PostgreSQL)

**Почему:**
- **API Routes:** Встроены в Next.js (не нужен отдельный сервер)
- **Supabase:** Auth + PostgreSQL + Row Level Security из коробки
- **Модульная архитектура:** Модули внутри Next.js, не микросервисы
- **Localhost first:** Всё работает на localhost:3000

**Database type:**
- [x] PostgreSQL (Supabase)
- [ ] MongoDB
- [ ] MySQL
- [ ] SQLite
- [ ] Other: [УКАЗАТЬ]

**Selected:** PostgreSQL через Supabase

**Почему:**
- Реляционная БД подходит для чатов (chat → messages связь)
- Row Level Security для безопасности
- Полнотекстовый поиск встроен (для search модуля)
- Бесплатный tier для учебного проекта

---

### 8. Authentication

**How will users log in?**

- [ ] Email/Password
- [x] OAuth (Google, GitHub, etc.)
- [ ] Magic Link (passwordless)
- [ ] Phone (SMS)
- [ ] No auth needed
- [ ] Other: [УКАЗАТЬ]

**Selected:** GitHub OAuth (единственный вариант для MVP)

**Почему:**
- Целевая аудитория = разработчики → все имеют GitHub
- Проще реализовать (не нужна email верификация)
- Supabase Auth поддерживает из коробки
- Безопасно (OAuth 2.0 стандарт)

**Auth provider:**
- [x] Supabase Auth
- [ ] Firebase Auth
- [ ] Auth0
- [ ] NextAuth.js
- [ ] Custom
- [ ] Other: [УКАЗАТЬ]

**Selected:** Supabase Auth

**Почему:**
- Интегрирован с Supabase DB
- Row Level Security работает с auth.users
- Не нужна дополнительная настройка

---

### 9. Hosting / Deployment

**Where will this be deployed?**

- [x] Vercel (recommended for Next.js)
- [ ] Netlify
- [ ] AWS
- [ ] Google Cloud
- [ ] Self-hosted
- [ ] Other: [УКАЗАТЬ]

**Selected:**
- **MVP:** localhost:3000 (обязательно!)
- **Production (опционально):** Vercel

**Почему:**
- **Localhost first:** Учебный проект должен работать локально
- **Vercel:** Если захочется задеплоить - GitHub integration в 1 клик
- **Бесплатный tier:** Достаточно для учебного проекта

---

### 10. Additional Technologies

**AI Integration:**
- OpenAI API (GPT-4)
- Server-Sent Events для streaming

**State Management:**
- Zustand (легковесный, проще Redux)

**Forms & Validation:**
- Zod (TypeScript-first валидация)
- React Hook Form (опционально)

**UI Components:**
- Radix UI (headless accessible components)
- React Hot Toast (уведомления)

**Development:**
- ESLint + Prettier
- Jest + React Testing Library
- Playwright для E2E (опционально)

---

## ✨ Core Features (MVP)

> **Важно:** Разделяйте функции на **уникальные** (ваша ценность) и **стандартные** (готовые сервисы).
>
> **Правило 99%:** Стандартные функции НИКОГДА не пишутся с нуля - используются готовые сервисы/библиотеки!

### 10a. Уникальные функции (Ваша ценность)

**Это то, что отличает ваше приложение от других. То, ради чего пользователь придет к вам.**

**Priority order (most important first):**

1. **База чатов с полной историей** - Сохранение всех диалогов с AI в БД (отличие от ChatGPT!)
2. **Автогенерация заголовков чатов** - AI сам создает название для каждого диалога
3. **Экспорт чатов** - Скачивание в JSON, Markdown, TXT форматах
4. **Полнотекстовый поиск** - Поиск по содержимому всех сообщений
5. **Организация чатов** - Категории, теги, фильтры
6. **Streaming ответы от GPT-4** - Ответы появляются словами (как в ChatGPT)

**Какую уникальную ценность дают эти функции?**

✅ **Для студентов:** Личная база знаний из AI диалогов для экзаменов
✅ **Для разработчиков:** Организация технических вопросов по проектам
✅ **Для всех:** Не теряется ценная информация из прошлых диалогов
✅ **Обучение:** Изучение Full-Stack разработки на реальном проекте

---

### 10b. Стандартные функции (Ready-to-use)

**Эти функции НЕ дают прямую ценность, но без них неудобно. Используем готовые сервисы!**

**Выберите нужные:**

#### Аутентификация и пользователи:
- [ ] Регистрация / Логин (email/password)
- [x] OAuth (Google, Facebook, Apple)
- [x] Профиль пользователя
- [ ] Восстановление пароля
- [x] Сервис: **Supabase Auth**

#### Платежи:
- [ ] Прием платежей (карты)
- [ ] Подписки
- [ ] Выставление счетов
- [ ] Сервис: [Не нужно для учебного проекта]

#### Уведомления:
- [ ] Email (транзакционные письма)
- [ ] SMS
- [ ] Push-уведомления
- [ ] Сервис: [Не нужно для MVP]

#### Хранилище:
- [ ] Загрузка файлов (фото, документы)
- [ ] Хранилище видео
- [ ] Сервис: [Не нужно - только текстовый чат]

#### Аналитика:
- [ ] Трекинг пользователей
- [ ] Аналитика поведения
- [ ] Сервис: [Vercel Analytics - опционально]

#### Коммуникация:
- [ ] Чат с поддержкой
- [ ] Система тикетов
- [ ] Сервис: [Не нужно]

#### Другое:
- [ ] Геолокация / Карты
- [x] Поиск
- [x] AI/ML функции
- [x] Сервис: **OpenAI API (GPT-4)**

**Выбранные стандартные функции:**

1. **Аутентификация** - Supabase Auth (GitHub OAuth)
2. **База данных** - Supabase PostgreSQL + Row Level Security
3. **AI интеграция** - OpenAI API (GPT-4)
4. **UI компоненты** - Radix UI (готовые accessible компоненты)
5. **Валидация** - Zod (TypeScript-first validation)
6. **State management** - Zustand (для чатов)

**Почему минимальный набор:**
- Учебный проект = фокус на уникальных фичах
- Не нужны платежи, email, файлы для MVP
- Supabase даёт auth + DB в одном месте

---

### 11. User Roles

**Does the app have different user types?**

- [x] No roles (all users equal)
- [ ] Yes, multiple roles

**Обоснование:**
- Для учебного проекта роли не нужны
- Все пользователи = обычные юзеры
- Нет админки, модерации, команд
- Простая модель: один пользователь = его чаты

---

## 📊 Data Structure

### 12. Main Entities (Database Tables)

**List main data models and their key fields:**

#### **Entity 1: profiles** (расширение auth.users от Supabase)
```typescript
{
  id: UUID,                    // PRIMARY KEY, REFERENCES auth.users
  username: string | null,     // GitHub username
  full_name: string | null,    // Полное имя
  avatar_url: string | null,   // Аватар из GitHub
  settings: JSONB,             // { theme: 'dark', model: 'gpt-4' }
  created_at: timestamp,
  updated_at: timestamp
}
```

#### **Entity 2: chats** 🔥 (КЛЮЧЕВАЯ ТАБЛИЦА)
```typescript
{
  id: UUID,                    // PRIMARY KEY
  user_id: UUID,               // FOREIGN KEY → profiles(id)
  title: string,               // "Async/Await в JavaScript" (авто-генерируется AI)
  category: string | null,     // "Study" | "Work" | "Personal"
  tags: string[],              // ["React", "TypeScript"]
  created_at: timestamp,
  updated_at: timestamp,
  last_message_at: timestamp | null
}
```

#### **Entity 3: messages** 🔥 (КЛЮЧЕВАЯ ТАБЛИЦА)
```typescript
{
  id: UUID,                    // PRIMARY KEY
  chat_id: UUID,               // FOREIGN KEY → chats(id)
  role: 'user' | 'assistant' | 'system',
  content: TEXT,               // Текст сообщения
  tokens_used: integer | null, // Для статистики
  model: string,               // 'gpt-4', 'gpt-3.5-turbo'
  created_at: timestamp
}
```

#### **Entity 4: usage_stats** (опционально для MVP)
```typescript
{
  id: UUID,
  user_id: UUID,               // FOREIGN KEY → profiles(id)
  date: DATE,
  messages_count: integer,     // Сколько сообщений за день
  tokens_used: integer,        // Сколько токенов потрачено
  chats_created: integer,      // Сколько чатов создано
  UNIQUE(user_id, date)
}
```

**Relationships:**
```
profiles (1) ──── (many) chats
chats (1) ──── (many) messages
profiles (1) ──── (many) usage_stats
```

**Indexes (для производительности):**
```sql
-- Для списка чатов пользователя
CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_chats_updated ON chats(updated_at DESC);

-- Для сообщений чата
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_created ON messages(created_at);

-- Для полнотекстового поиска
CREATE INDEX idx_messages_content_search
ON messages USING GIN(to_tsvector('english', content));
```

**Example:**
```
Users
  - id, email, name, avatar, role, created_at

Projects
  - id, title, description, owner_id, created_at

Tasks
  - id, title, description, project_id, assignee_id, due_date, status
```

**Your entities:**
```
[ОТВЕТИТЬ: Перечислить основные таблицы и их поля]

Entity 1: [Name]
  - [field1], [field2], [field3]...

Entity 2: [Name]
  - [field1], [field2], [field3]...

Entity 3: [Name]
  - [field1], [field2], [field3]...
```

---

### 13. Relationships

**How are entities connected?**

[ОТВЕТИТЬ: Например,
- "One User can own many Projects (1:N)"
- "One Project can have many Tasks (1:N)"
- "One Task belongs to one User (assignee) (N:1)"
- "Users and Projects - many-to-many (team members)"]

---

## 🔌 External Integrations

### 14. Third-Party Services

**Will the app integrate with external services?**

- [ ] Email service (SendGrid, Resend, Mailgun)
- [ ] Payment processing (Stripe, PayPal)
- [ ] File storage (AWS S3, Cloudinary)
- [ ] Analytics (Google Analytics, Plausible)
- [ ] AI/ML services (OpenAI, Anthropic)
- [ ] Other: [УКАЗАТЬ]

**Selected integrations:**
[ОТВЕТИТЬ: Список сервисов с кратким описанием зачем]

---

### 15. API Requirements

**Does the app need to expose an API?**

- [ ] No, frontend only
- [ ] Yes, REST API
- [ ] Yes, GraphQL
- [ ] Yes, WebSocket / Real-time

**If yes, describe:**
[ОТВЕТИТЬ: Например, "REST API для мобильного приложения в будущем"]

---

## 🎨 UI/UX Requirements

### 16. Design Reference

**Are there existing apps with similar UI?**

[ОТВЕТИТЬ: Например,
- "Linear.app - минималистичный, быстрый"
- "Notion - гибкий, модульный"
- "Slack - современный, дружелюбный"]

---

### 17. Design Assets Available?

**Do you have designs ready?**

- [ ] Yes, Figma/Sketch designs available
  - Link: [ВСТАВИТЬ ССЫЛКУ]
- [ ] Yes, screenshots/wireframes
  - Location: [УКАЗАТЬ ГДЕ]
- [ ] No, AI should propose basic UI
- [ ] No, will design as we go

**Selected:** [ОТВЕТИТЬ]

---

### 18. Responsive Requirements

**Mobile support needed?**

- [ ] Desktop only
- [ ] Responsive (mobile + desktop)
- [ ] Mobile-first
- [ ] Native mobile app planned later

**Selected:** [ОТВЕТИТЬ]

---

## 🔐 Security & Compliance

### 19. Security Requirements

**Any special security needs?**

- [ ] Standard web security (XSS, CSRF protection)
- [ ] GDPR compliance required
- [ ] HIPAA compliance (healthcare data)
- [ ] PCI compliance (payment data)
- [ ] Two-factor authentication (2FA)
- [ ] Other: [УКАЗАТЬ]

**Selected:** [ОТВЕТИТЬ]

---

### 20. Data Privacy

**Where should data be stored?**

- [ ] Any region (no restrictions)
- [ ] EU only (GDPR)
- [ ] US only
- [ ] Specific region: [УКАЗАТЬ]

**Selected:** [ОТВЕТИТЬ]

---

## 📈 Scale & Performance

### 21. Expected Scale

**How many users expected in first year?**

- [ ] < 100 users (prototype/MVP)
- [ ] 100-1,000 users (small app)
- [ ] 1,000-10,000 users (growing app)
- [ ] 10,000+ users (production scale)

**Selected:** [ОТВЕТИТЬ]

---

### 22. Performance Requirements

**Any critical performance needs?**

[ОТВЕТИТЬ: Например,
- "Page load < 2 seconds"
- "Real-time updates < 500ms delay"
- "Support 1000 concurrent users"]

---

## 💰 Budget & Timeline

### 23. Development Timeline

**Expected timeline for MVP?**

- [ ] 1-2 weeks (simple MVP)
- [ ] 1 month (standard MVP)
- [ ] 2-3 months (complex MVP)
- [ ] Other: [УКАЗАТЬ]

**Selected:** [ОТВЕТИТЬ]

---

### 24. Budget Constraints

**Any constraints on external services cost?**

[ОТВЕТИТЬ: Например, "Стараться использовать free tier сервисов, платные только если критично"]

---

## 🔄 Development Approach

> **Философия:** Модульная архитектура - ключ к быстрой и дешевой разработке с ИИ

### 25a. Модульная структура (ОБЯЗАТЕЛЬНО!)

**Почему модульная архитектура критична для работы с ИИ:**

📖 **ПОЛНАЯ ФИЛОСОФИЯ:** ARCHITECTURE.md → "Module Architecture" section

**Краткое объяснение:**
1. **Экономия токенов:** ИИ загружает только нужный модуль (100-200 строк), а не весь проект (1000+ строк)
2. **Простота:** Каждый модуль = отдельная задача = легко проверить
3. **Скорость:** Можно делать разные модули параллельно

**Принцип:** Приложение = набор маленьких LEGO-кубиков

📖 **Детали, примеры, диаграммы:** См. ARCHITECTURE.md → "Module Architecture"

**Ваш подход к модульности:**

- [ ] Да, хочу модульную структуру (рекомендовано!)
- [ ] Нет, хочу монолитную структуру (НЕ рекомендуется для работы с ИИ)

**Selected:** [ОТВЕТИТЬ: Модульная (recommended)]

**Как будем разрабатывать модули:**
[ОТВЕТИТЬ: Например, "По одному модулю за раз. См. ARCHITECTURE.md для типичной последовательности"]

---

### 25b. Development Style

**Preferred approach:**

- [ ] Start with complete architecture planning, then code
- [ ] Iterative - build feature by feature (рекомендовано для модульной структуры)
- [ ] Rapid prototyping - get working version fast, refine later

**Selected:** [ОТВЕТИТЬ]

**Как будем разрабатывать модули:**

[ОТВЕТИТЬ: Например, "По одному модулю за раз: сначала аутентификация, потом база данных, потом каждый экран отдельно. Каждый модуль тестируем перед переходом к следующему"]

---

### 26. Testing Requirements

**Testing strategy:**

- [ ] Manual testing only (dev environment)
- [ ] Unit tests for critical functions
- [ ] Integration tests
- [ ] E2E tests (Playwright, Cypress)
- [ ] No tests for MVP

**Selected:** [ОТВЕТИТЬ]

---

## 📚 Reference Materials

### 27. Similar Projects

**Are there similar projects for reference?**

[ОТВЕТИТЬ: Например, "У меня есть проект MainChatMemory по адресу /path/to/project - можно взять оттуда паттерны"]

---

### 28. Existing Codebase

**Starting from scratch or existing code?**

- [ ] From scratch (new project)
- [ ] Existing codebase to extend
  - Location: [УКАЗАТЬ ПУТЬ]
  - What needs to be added: [ОПИСАТЬ]

**Selected:** [ОТВЕТИТЬ]

---

## 🎯 Success Criteria

### 29. MVP Definition of Done

**What makes this MVP complete?**

[ОТВЕТИТЬ: Список критериев, например:
- [ ] User can register and log in
- [ ] User can create projects
- [ ] User can add tasks to projects
- [ ] User can invite team members
- [ ] Real-time updates work
- [ ] App deployed to production
- [ ] No critical bugs]

---

### 30. Post-MVP Plans

**What comes after MVP?**

[ОТВЕТИТЬ: Например,
- "Add mobile app (React Native)"
- "Add advanced analytics"
- "Add integrations with Slack, Telegram"]

---

## 📝 Additional Notes

### 31. Special Requirements or Constraints

**Anything else AI should know?**

[ОТВЕТИТЬ: Любые дополнительные требования, ограничения, пожелания]

---

## ✅ Completion Checklist

**Before starting development, ensure:**

- [ ] All sections marked with [ОТВЕТИТЬ] are filled
- [ ] Technology stack is clearly defined
- [ ] MVP features are prioritized
- [ ] Data structure is outlined
- [ ] Reference materials are provided (if any)
- [ ] This file is committed to git
- [ ] BACKLOG.md is updated with initial features
- [ ] ARCHITECTURE.md is updated with tech stack

---

## 🤖 Взаимодействие с ИИ-агентом

> **Важно:** После заполнения этого файла начинается диалог с ИИ для уточнения деталей

### Процесс работы с ИИ:

**Шаг 1: Загрузка контекста**
- ИИ читает этот файл (PROJECT_INTAKE.md)
- Анализирует ваше видение проекта
- Может задать уточняющие вопросы

**Шаг 2: Уточнение и дополнение**
- ИИ задает вопросы по непонятным моментам
- Предлагает улучшения
- Помогает заполнить пропущенные части

**Вопросы, которые может задать ИИ:**
```
- "Вы хотите использовать Supabase или Firebase для базы данных?"
- "Нужна ли real-time синхронизация данных?"
- "Какой бюджет на хостинг в месяц?"
- "Планируете ли мобильное приложение в будущем?"
```

**Ваши ответы:**
- Если НЕ знаете - так и скажите: "Не знаю, предложи лучший вариант"
- Если ВАЖНО - укажите: "Обязательно Supabase, уже есть опыт"
- Будьте конкретны, но не бойтесь признаваться в незнании

**Шаг 3: Подтверждение понимания**
- После уточнений попросите ИИ: **"Объясни, как ты понял задачу"**
- Проверьте его понимание
- Скорректируйте если нужно

**Шаг 4: План разработки**
- ИИ предлагает план: модули, последовательность, технологии
- Вы утверждаете или корректируете
- Начинается разработка по модулям

**Команды для ИИ на старте:**

```
1. "Прочитай PROJECT_INTAKE.md и задай все уточняющие вопросы"

2. "Предложи 2-3 варианта технологического стека с обоснованием"

3. "Составь план разработки по модулям с приоритетами"

4. "Объясни, как ты понял задачу и какую архитектуру предлагаешь"
```

---

## 🚀 Next Steps After Filling This Form

**Immediate actions:**

1. **Сохрани и закоммить этот файл** в git
   ```bash
   git add PROJECT_INTAKE.md
   git commit -m "docs: Fill PROJECT_INTAKE for [project name]"
   ```

2. **Загрузи ИИ-агенту** (Claude Code, Cursor, и т.д.)
   - Скажи: "Прочитай PROJECT_INTAKE.md и SECURITY.md"
   - Скажи: "Задай уточняющие вопросы"

3. **Диалог с ИИ** - отвечай на вопросы, уточняй детали

4. **Получи план** - попроси ИИ составить план разработки

5. **Начни с первого модуля** - обычно это аутентификация или база данных

**What AI will do next:**

1. Анализирует PROJECT_INTAKE.md
2. Задаст уточняющие вопросы
3. Предложит технологический стек (если вы не выбрали)
4. Составит план разработки по модулям
5. Предложит начать с первого модуля
6. Будет итеративно разрабатывать модуль за модулем

**Your role:**

- ✅ Отвечать на вопросы ИИ
- ✅ Проверять результат каждого модуля
- ✅ Давать обратную связь: "работает" или "нужно исправить"
- ✅ Корректировать курс по ходу
- ❌ НЕ пытаться написать код сам (если не разработчик)
- ❌ НЕ пропускать тестирование модулей

---

## 📋 Template Version

**Version:** 2.0 (Enriched with "Процесс.md" methodology)
**Last Updated:** 2025-01-11
**Maintained by:** AI Agent + Project Lead

**Changelog:**
- v2.0: Added User Personas, User Flows, unique/standard functions split, modular architecture emphasis, AI interaction guide
- v1.0: Initial template

---

*This intake form ensures AI agents have all necessary context to start development efficiently*
*Based on proven AI-assisted development methodology*
*Fill once per project, update as requirements evolve*
