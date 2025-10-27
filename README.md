# 🤖 AI Chat Application

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai)

**Современное веб-приложение для общения с AI ассистентом на базе GPT-4/GPT-4o**

[English Version](README_EN.md) · [Демо](#) · [Документация](docs/) · [Сообщить об ошибке](../../issues)

</div>

---

## ✨ Особенности

### 🎯 Основные функции
- **💬 AI Чат с GPT-4/4o** - Интеллектуальные диалоги с потоковой передачей ответов в реальном времени (Server-Sent Events)
- **🔐 Безопасная аутентификация** - Email/Password и GitHub OAuth через Supabase Auth
- **💾 История диалогов** - Все разговоры сохраняются в PostgreSQL с Row Level Security
- **📱 Адаптивный интерфейс** - Полностью responsive дизайн для desktop, tablet и mobile
- **🔒 Личные API ключи** - Каждый пользователь использует свой OpenAI API ключ (безопасно, без общих затрат)

### 🌟 Уникальные возможности

#### 📎 Загрузка файлов (6 форматов)
- **🖼️ Изображения** - PNG, JPG, GIF, WebP (анализ через GPT-4o Vision)
- **📄 Документы** - PDF, DOCX (извлечение текста)
- **📊 Данные** - CSV, JSON (парсинг и анализ)
- **📝 Текст** - TXT, Markdown, HTML
- **🔍 OCR** - Автоматическое распознавание текста на сканах через Tesseract.js

#### 📥 Экспорт чатов (4 формата)
- **📕 PDF** - Красиво оформленный документ с метаданными
- **💾 JSON** - Полный дамп чата со всеми данными
- **📝 Markdown** - Универсальный текстовый формат
- **📄 TXT** - Простой текстовый файл

#### 🔍 Поиск и организация
- **Полнотекстовый поиск** - По всем чатам с подсветкой совпадений
- **Переименование чатов** - Удобное управление историей
- **Удаление чатов** - С каскадным удалением сообщений
- **📊 Статистика** - Отслеживание токенов, сообщений, стоимости

---

## 🚀 Быстрый старт

### Требования

- **Node.js** 18+ ([скачать](https://nodejs.org/))
- **Аккаунт Supabase** (бесплатный план) - [supabase.com](https://supabase.com)
- **OpenAI API ключ** - [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### Установка

```bash
# 1. Клонировать репозиторий
git clone https://github.com/itzashita2020/ai-chat-app.git
cd ai-chat-app

# 2. Установить зависимости
cd app
npm install

# 3. Настроить переменные окружения
cp .env.example .env.local
# Заполните ТОЛЬКО Supabase credentials
# OpenAI API ключ НЕ НУЖЕН (каждый пользователь добавляет свой через Settings)

# 4. Запустить приложение
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

### Настройка Supabase

#### 1. Создайте проект в Supabase
1. Зайдите на [app.supabase.com](https://app.supabase.com)
2. Создайте новый проект
3. Скопируйте `Project URL` и `anon public` ключ

#### 2. Выполните миграции базы данных

Откройте **SQL Editor** в Supabase и выполните все скрипты из папки `supabase/migrations/`:

<details>
<summary>📋 Показать SQL миграции</summary>

**1. Основные таблицы** (`supabase/migrations/20241027_initial_schema.sql`):
```sql
-- Таблица чатов
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Chat',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица сообщений
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

-- Таблица вложений
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

-- Индексы для производительности
CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_chats_updated_at ON chats(updated_at DESC);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_message_attachments_message_id ON message_attachments(message_id);

-- Row Level Security
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

-- Политики доступа (пользователи видят только свои данные)
CREATE POLICY "Users can view own chats" ON chats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats" ON chats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats" ON chats
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages in own chats" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in own chats" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view attachments in own chats" ON message_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN chats c ON c.id = m.chat_id
      WHERE m.id = message_attachments.message_id
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert attachments in own chats" ON message_attachments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN chats c ON c.id = m.chat_id
      WHERE m.id = message_attachments.message_id
      AND c.user_id = auth.uid()
    )
  );
```

**2. Настройки пользователей** (`supabase/migrations/20251027_user_settings.sql`):
```sql
-- Таблица настроек пользователя (личные API ключи)
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  openai_api_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индекс для быстрого поиска
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Политики доступа
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);
```

</details>

#### 3. Настройте Storage (для загрузки файлов)

1. Перейдите в **Storage** → **Create Bucket**
2. Создайте bucket с именем `chat-attachments`
3. Настройте политики доступа:

```sql
-- Разрешить пользователям загружать файлы в свою папку
CREATE POLICY "Users can upload own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'chat-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Разрешить пользователям читать свои файлы
CREATE POLICY "Users can view own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'chat-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

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
- **React Markdown** - Рендеринг markdown
- **Zustand** - State management

</td>
<td width="50%" valign="top">

### Backend & Инфраструктура
- **Supabase** - PostgreSQL + Auth + Storage + RLS
- **OpenAI API** - GPT-4, GPT-4o (vision) модели
- **Next.js API Routes** - Serverless endpoints
- **Server-Sent Events** - Streaming ответов в реальном времени
- **pdf2json** - Парсинг PDF
- **mammoth** - Парсинг DOCX
- **Tesseract.js** - OCR для сканов

</td>
</tr>
</table>

---

## 📁 Структура проекта

```
Projekt_Lena1/
├── app/                           # Next.js приложение
│   ├── src/
│   │   ├── app/                   # App Router
│   │   │   ├── api/               # API endpoints
│   │   │   │   ├── ai/stream/     # 🔥 AI streaming (SSE)
│   │   │   │   ├── chats/         # CRUD чатов
│   │   │   │   ├── upload/        # Загрузка файлов (6 форматов)
│   │   │   │   ├── export/        # Экспорт (PDF/JSON/MD/TXT)
│   │   │   │   ├── search/        # Полнотекстовый поиск
│   │   │   │   └── settings/      # Настройки пользователя
│   │   │   ├── (auth)/            # Страницы аутентификации
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   └── (dashboard)/       # Главная страница
│   │   │       └── settings/      # Страница настроек
│   │   ├── components/            # React компоненты
│   │   │   ├── ui/                # Переиспользуемые UI компоненты
│   │   │   └── layout/            # Layout компоненты
│   │   ├── modules/               # 🎯 Модульная архитектура
│   │   │   ├── ai/                # OpenAI интеграция
│   │   │   ├── auth/              # Аутентификация
│   │   │   ├── chat/              # Чат сервисы и компоненты
│   │   │   ├── export/            # Экспорт в 4 форматах
│   │   │   ├── search/            # Поиск по чатам
│   │   │   └── upload/            # Загрузка файлов
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── lib/                   # Утилиты и конфиги
│   │   │   └── supabase/          # Supabase клиенты
│   │   └── store/                 # Zustand stores
│   └── public/                    # Статические файлы
├── supabase/
│   └── migrations/                # SQL миграции
│       ├── 20241027_initial_schema.sql
│       └── 20251027_user_settings.sql
└── docs/                          # Документация
    ├── QUICKSTART.md
    ├── ARCHITECTURE.md
    ├── API.md
    └── DEPLOYMENT.md
```

---

## 🔌 API Endpoints

### Аутентификация
```
GET  /auth/callback          # OAuth callback
```

### Чаты
```
GET    /api/chats             # Получить все чаты пользователя
POST   /api/chats             # Создать новый чат
GET    /api/chats/[id]        # Получить чат по ID
PUT    /api/chats/[id]        # Обновить чат (переименовать)
DELETE /api/chats/[id]        # Удалить чат
GET    /api/chats/[id]/messages # Получить все сообщения чата
```

### AI & Сообщения
```
POST /api/ai/stream           # 🔥 Streaming ответ от AI (SSE)
                              # Поддерживает: текст, изображения, документы
                              # Автоматический выбор модели (gpt-4o для vision)
```

### Файлы
```
POST /api/upload              # Загрузить файл
                              # Поддерживаемые форматы:
                              # - Изображения: PNG, JPG, GIF, WebP
                              # - Документы: PDF, DOCX
                              # - Данные: CSV, JSON
                              # - Текст: TXT, MD, HTML
                              # Автоматический OCR для сканов
```

### Экспорт
```
GET  /api/export/[id]?format=pdf   # Экспорт чата в PDF
GET  /api/export/[id]?format=json  # Экспорт чата в JSON
GET  /api/export/[id]?format=md    # Экспорт чата в Markdown
GET  /api/export/[id]?format=txt   # Экспорт чата в TXT
```

### Поиск
```
GET /api/search?q=query       # Полнотекстовый поиск по всем чатам
```

### Настройки
```
GET  /api/settings            # Получить настройки пользователя
POST /api/settings            # Сохранить OpenAI API ключ
```

---

## ⚙️ Переменные окружения

Создайте файл `app/.env.local`:

```env
# Supabase Configuration
# Get these from: https://app.supabase.com → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI API Key - НЕ ТРЕБУЕТСЯ!
# Каждый пользователь вводит свой личный API ключ через Settings
# Это безопаснее и не расходует ваши средства
# OPENAI_API_KEY=

# GitHub OAuth (опционально)
# Настройте в: Supabase → Authentication → Providers → GitHub
# GITHUB_CLIENT_ID=your-github-client-id
# GITHUB_CLIENT_SECRET=your-github-client-secret

# App URL (для production на Vercel)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

---

## 🎨 Использование

### 1. Регистрация и вход
1. Откройте приложение
2. Зарегистрируйтесь через Email/Password или GitHub
3. Подтвердите email (если используете email регистрацию)

### 2. Добавление OpenAI API ключа
⚠️ **Важно!** Без API ключа чат не будет работать.

1. Кликните на аватар в правом верхнем углу
2. Выберите **Settings**
3. Вставьте свой OpenAI API ключ (начинается с `sk-...`)
4. Нажмите **Save Settings**

Где взять API ключ: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### 3. Использование чата
- **Новый чат**: Кнопка "+ New Chat" в боковой панели
- **Отправка сообщения**: Введите текст и нажмите Enter или кнопку отправки
- **Загрузка файлов**: Кнопка 📎 - поддерживаются изображения, PDF, DOCX, CSV и другие
- **Переименование**: Клик на название чата
- **Экспорт**: Кнопка экспорта в заголовке чата (выбор формата)
- **Поиск**: Кнопка 🔍 для поиска по всем чатам

### 4. Работа с изображениями
1. Загрузите изображение через 📎
2. Задайте вопрос об изображении
3. GPT-4o Vision проанализирует и ответит

Поддерживается: распознавание объектов, чтение текста на изображениях, анализ графиков, описание сцен.

---

## 🚢 Деплой на Vercel

### Автоматический деплой

1. Push код на GitHub
2. Импортируйте проект в [Vercel](https://vercel.com)
3. Установите **Root Directory**: `app`
4. Добавьте переменные окружения (только Supabase!)
5. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Переменные окружения в Vercel

Добавьте в **Settings → Environment Variables**:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

⚠️ **НЕ добавляйте** `OPENAI_API_KEY` - пользователи используют свои личные ключи!

### Настройка домена в Supabase

После деплоя добавьте Vercel домен в Supabase:
1. **Authentication → URL Configuration**
2. Добавьте в **Redirect URLs**: `https://your-app.vercel.app/auth/callback`

---

## 🔒 Безопасность

### Row Level Security (RLS)
Все данные изолированы на уровне базы данных. Пользователи видят только свои чаты и сообщения.

### API ключи
- OpenAI API ключи хранятся зашифрованными в Supabase
- Никакие ключи не передаются на frontend
- Каждый пользователь использует только свой ключ

### Аутентификация
- JWT токены с автоматическим refresh
- Защита от CSRF
- Email верификация (опционально)

---

## 📊 Производительность

- **Streaming ответы** - Пользователь видит ответ моментально (SSE)
- **Оптимизация запросов** - Индексы в PostgreSQL
- **Lazy loading** - Загрузка чатов по требованию
- **CDN** - Статические файлы через Vercel Edge Network

---

## 🧪 Разработка

### Запуск в dev режиме
```bash
cd app
npm run dev
```

### Сборка для production
```bash
npm run build
npm start
```

### Линтинг
```bash
npm run lint
```

---

## 🤝 Contributing

Вклад приветствуется! Для больших изменений сначала откройте issue для обсуждения.

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

- [OpenAI](https://openai.com) - GPT-4 и GPT-4o API
- [Supabase](https://supabase.com) - Backend платформа
- [Vercel](https://vercel.com) - Next.js фреймворк и хостинг
- [Radix UI](https://radix-ui.com) - Доступные UI компоненты
- [Tailwind CSS](https://tailwindcss.com) - CSS фреймворк
- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR движок

---

## 📞 Контакты

Если у вас есть вопросы или предложения:

- Откройте [Issue](../../issues)
- Создайте [Pull Request](../../pulls)

---

<div align="center">

**⭐ Поставьте звезду если проект был полезен!**

Made with ❤️ by Alena Artamonava

</div>
