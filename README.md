# 🤖 AI Chat Application

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai)

**Современное веб-приложение для общения с AI ассистентом на базе GPT-4**

[Демо](#) · [Документация](docs/) · [Сообщить об ошибке](../../issues)

</div>

---

## ✨ Особенности

### 🎯 Основные функции
- **💬 AI Чат с GPT-4** - Интеллектуальные диалоги с потоковой передачей ответов в реальном времени
- **🔐 Безопасная аутентификация** - Email/Password и GitHub OAuth через Supabase
- **💾 История диалогов** - Все разговоры сохраняются в PostgreSQL
- **📱 Адаптивный интерфейс** - Работает на desktop, tablet и mobile устройствах

### 🌟 Уникальные возможности
- **📥 Экспорт чатов** - Экспорт в **4 форматах**: PDF, JSON, Markdown, TXT
- **🔍 Полнотекстовый поиск** - Поиск по всем чатам с подсветкой совпадений
- **🏷️ Организация чатов** - Переименование, удаление, избранное, категории
- **📊 Статистика использования** - Отслеживание токенов, сообщений, стоимости
- **📎 Загрузка файлов** - Поддержка изображений и документов
- **🖼️ Мультимодальность** - Анализ изображений с GPT-4o

---

## 🚀 Быстрый старт

### Требования

- **Node.js** 18+ ([скачать](https://nodejs.org/))
- **Аккаунт Supabase** (бесплатный) - [supabase.com](https://supabase.com)
- **OpenAI API ключ** - [platform.openai.com](https://platform.openai.com)

### Установка

```bash
# 1. Клонировать репозиторий
git clone https://github.com/yourusername/ai-chat-app.git
cd ai-chat-app

# 2. Установить зависимости
cd app
npm install

# 3. Настроить переменные окружения
cp .env.example .env.local
# Заполните: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, OPENAI_API_KEY

# 4. Запустить приложение
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

### Настройка Supabase

Выполните SQL скрипт в Supabase SQL Editor для создания таблиц:

<details>
<summary>📋 Показать SQL скрипт</summary>

```sql
-- Создание таблиц
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_used INTEGER,
  model TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE message_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_message_attachments_message_id ON message_attachments(message_id);

-- Row Level Security
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

-- Политики доступа (только свои чаты)
CREATE POLICY "Users can manage own chats" ON chats
  USING (auth.uid() = user_id);
```

</details>

---

## 🛠️ Технологический стек

<table>
<tr>
<td width="50%" valign="top">

### Frontend
- **Next.js 14** - React фреймворк с App Router
- **TypeScript 5** - Типизированный JavaScript
- **Tailwind CSS** - Utility-first CSS
- **Radix UI** - Доступные UI компоненты
- **Framer Motion** - Анимации
- **Zustand** - State management

</td>
<td width="50%" valign="top">

### Backend & Инфраструктура
- **Supabase** - PostgreSQL + Auth + Storage
- **OpenAI API** - GPT-4, GPT-4o модели
- **Next.js API Routes** - Serverless endpoints
- **Server-Sent Events** - Streaming ответов
- **Vercel** - Hosting (опционально)

</td>
</tr>
</table>

---

## 📁 Структура проекта

```
app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API endpoints
│   │   │   ├── ai/stream/     # 🔥 AI streaming
│   │   │   ├── chats/         # CRUD чаты
│   │   │   ├── upload/        # Загрузка файлов
│   │   │   ├── export/        # Экспорт чатов
│   │   │   └── search/        # Поиск
│   │   ├── (auth)/            # Страницы аутентификации
│   │   └── (dashboard)/       # Главная страница с чатом
│   ├── components/            # React компоненты
│   ├── modules/               # 🎯 Бизнес-логика (6 модулей)
│   │   ├── ai/                # OpenAI сервис
│   │   ├── auth/              # Аутентификация
│   │   ├── chat/              # Чат сервисы
│   │   ├── export/            # Экспорт сервисы
│   │   ├── search/            # Поиск сервисы
│   │   └── user/              # Пользователь сервисы
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Утилиты
│   └── store/                 # Zustand stores
└── public/                    # Статические файлы
```

---

## 📚 Документация

Вся документация находится в папке [`docs/`](docs/):

- **[QUICKSTART.md](docs/QUICKSTART.md)** - Быстрый старт для новичков
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Архитектура и дизайн решения
- **[API.md](docs/API.md)** - Описание всех API endpoints
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Деплой на Vercel
- **[SECURITY.md](docs/SECURITY.md)** - Требования безопасности

---

## 🔌 API Endpoints

### Аутентификация
```
GET  /auth/callback          # OAuth callback
```

### Чаты
```
GET    /api/chats             # Получить все чаты
POST   /api/chats             # Создать чат
GET    /api/chats/[id]        # Получить чат
PUT    /api/chats/[id]        # Обновить чат
DELETE /api/chats/[id]        # Удалить чат
```

### AI & Сообщения
```
POST /api/ai/stream           # 🔥 Streaming ответ от AI
GET  /api/chats/[id]/messages # Получить сообщения чата
```

### Файлы и экспорт
```
POST /api/upload              # Загрузить файл
GET  /api/export/[id]         # Экспортировать чат (PDF/JSON/MD/TXT)
```

### Поиск
```
GET /api/search?q=query       # Поиск по чатам
```

---

## ⚙️ Переменные окружения

Создайте файл `app/.env.local`:

```env
# Supabase (https://app.supabase.com → Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI (https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-api-key

# GitHub OAuth (опционально)
# Настроить в: Supabase → Authentication → Providers → GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# App URL (для production)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## 🚢 Деплой

### Vercel (рекомендуется)

1. Push код на GitHub
2. Импортируйте проект в [Vercel](https://vercel.com)
3. Добавьте переменные окружения
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Другие платформы

Совместимо с: Netlify, Railway, Render, AWS Amplify

Подробнее: [DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 🧪 Тестирование

```bash
# Запуск тестов
npm test

# Тесты с coverage
npm run test:coverage

# Watch режим
npm run test:watch
```

---

## 🤝 Contributing

Вклад приветствуется! Пожалуйста:

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

---

## 📄 Лицензия

Распространяется под лицензией MIT. См. `LICENSE` для подробностей.

---

## 🙏 Благодарности

- [OpenAI](https://openai.com) - GPT-4 API
- [Supabase](https://supabase.com) - Backend инфраструктура
- [Vercel](https://vercel.com) - Next.js и хостинг
- [Radix UI](https://radix-ui.com) - UI компоненты
- [Tailwind CSS](https://tailwindcss.com) - CSS фреймворк

---

## 📞 Контакты

**Автор:** Ваше имя

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com
- Website: [yourwebsite.com](https://yourwebsite.com)

---

<div align="center">

**⭐ Поставьте звезду если проект был полезен!**

Made with ❤️ and 🤖 AI assistance

</div>
