# Localhost Setup Guide - GitHub OAuth

**Цель**: Запустить приложение на localhost:3000 с полной авторизацией через GitHub

**Время**: ~30 минут

**Prerequisite**: Node.js 18+, Git, браузер

---

## 📋 Что мы настроим

1. ✅ Supabase проект (база данных + auth)
2. ✅ GitHub OAuth App
3. ✅ OpenAI API key
4. ✅ .env.local файл
5. ✅ Запуск на localhost:3000

---

## 🚀 Step 1: Создать Supabase проект (5 минут)

### 1.1 Регистрация на Supabase

1. Открой [supabase.com](https://supabase.com)
2. Нажми "Start your project"
3. Войди через GitHub (или создай аккаунт)

### 1.2 Создать новый проект

1. Нажми "New Project"
2. Заполни:
   - **Name**: `projekt-lena1-dev` (или любое имя)
   - **Database Password**: придумай надёжный пароль (сохрани его!)
   - **Region**: выбери ближайший к тебе регион (например, West EU (London))
   - **Pricing Plan**: Free (достаточно для разработки)
3. Нажми "Create new project"
4. Подожди 1-2 минуты пока создаётся проект

### 1.3 Получить API credentials

После создания проекта:

1. Перейди: **Settings** (значок шестерёнки) → **API**
2. Скопируй эти значения (понадобятся позже):
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

**ВАЖНО**: Держи эту вкладку открытой, ещё вернёмся!

---

## 🗄️ Step 2: Создать таблицы в базе данных (5 минут)

### 2.1 Открыть SQL Editor

1. В Supabase Dashboard перейди: **SQL Editor** (слева)
2. Нажми "New query"

### 2.2 Выполнить миграцию

Скопируй и вставь этот SQL:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (user data)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  settings jsonb default '{
    "theme": "system",
    "language": "en",
    "model": "gpt-4",
    "temperature": 0.7,
    "max_tokens": 2000
  }'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chats table
create table if not exists public.chats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  category text,
  tags text[],
  is_favorite boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages table
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  chat_id uuid references public.chats(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Usage stats table
create table if not exists public.usage_stats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  messages_sent integer default 0,
  tokens_used integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

-- Indexes for performance
create index if not exists idx_chats_user_id on public.chats(user_id);
create index if not exists idx_chats_created_at on public.chats(created_at desc);
create index if not exists idx_messages_chat_id on public.messages(chat_id);
create index if not exists idx_messages_created_at on public.messages(created_at);
create index if not exists idx_usage_stats_user_date on public.usage_stats(user_id, date);

-- Full-text search index for messages
create index if not exists idx_messages_content_search
  on public.messages using gin(to_tsvector('english', content));

-- RLS (Row Level Security) policies
alter table public.profiles enable row level security;
alter table public.chats enable row level security;
alter table public.messages enable row level security;
alter table public.usage_stats enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Chats policies
create policy "Users can view own chats"
  on public.chats for select
  using (auth.uid() = user_id);

create policy "Users can create own chats"
  on public.chats for insert
  with check (auth.uid() = user_id);

create policy "Users can update own chats"
  on public.chats for update
  using (auth.uid() = user_id);

create policy "Users can delete own chats"
  on public.chats for delete
  using (auth.uid() = user_id);

-- Messages policies
create policy "Users can view messages in own chats"
  on public.messages for select
  using (
    exists (
      select 1 from public.chats
      where chats.id = messages.chat_id
      and chats.user_id = auth.uid()
    )
  );

create policy "Users can create messages in own chats"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.chats
      where chats.id = messages.chat_id
      and chats.user_id = auth.uid()
    )
  );

create policy "Users can delete messages in own chats"
  on public.messages for delete
  using (
    exists (
      select 1 from public.chats
      where chats.id = messages.chat_id
      and chats.user_id = auth.uid()
    )
  );

-- Usage stats policies
create policy "Users can view own usage stats"
  on public.usage_stats for select
  using (auth.uid() = user_id);

create policy "Users can insert own usage stats"
  on public.usage_stats for insert
  with check (auth.uid() = user_id);

create policy "Users can update own usage stats"
  on public.usage_stats for update
  using (auth.uid() = user_id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger set_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at
  before update on public.chats
  for each row execute procedure public.handle_updated_at();
```

3. Нажми **Run** (или Ctrl+Enter)
4. Должно появиться: "Success. No rows returned"

✅ База данных готова!

---

## 🔐 Step 3: Настроить GitHub OAuth (10 минут)

### 3.1 Создать GitHub OAuth App

1. Открой [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Нажми "New OAuth App"
3. Заполни форму:
   ```
   Application name: Projekt Lena1 Dev
   Homepage URL: http://localhost:3000
   Authorization callback URL: https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
   ```

   **ВАЖНО**: Замени `YOUR-PROJECT-REF` на свой!
   - Найди в Supabase: Settings → API → Project URL
   - Например: `https://abcdefghijklmn.supabase.co`
   - Callback URL будет: `https://abcdefghijklmn.supabase.co/auth/v1/callback`

4. Нажми "Register application"

### 3.2 Получить Client ID и Client Secret

После создания приложения:

1. Скопируй **Client ID** (выглядит как: `Iv1.abc123def456`)
2. Нажми "Generate a new client secret"
3. Скопируй **Client Secret** (выглядит длинная строка, показывается один раз!)

**ВАЖНО**: Сохрани Client Secret! Больше не покажут!

### 3.3 Настроить GitHub Provider в Supabase

1. В Supabase Dashboard: **Authentication** → **Providers**
2. Найди "GitHub" в списке
3. Включи toggle "Enable Sign in with GitHub"
4. Вставь:
   - **Client ID** (из GitHub OAuth App)
   - **Client Secret** (из GitHub OAuth App)
5. Нажми "Save"

✅ GitHub OAuth настроен!

---

## 🤖 Step 4: Получить OpenAI API Key (5 минут)

### 4.1 Создать OpenAI аккаунт

1. Открой [platform.openai.com](https://platform.openai.com)
2. Войди или создай аккаунт
3. Добавь платёжный метод (требуется для API)

### 4.2 Создать API Key

1. Перейди: [API Keys](https://platform.openai.com/api-keys)
2. Нажми "Create new secret key"
3. Name: `projekt-lena1-dev`
4. Permissions: All (или только read если хочешь ограничить)
5. Нажми "Create secret key"
6. **Скопируй ключ!** (выглядит как: `sk-proj-...`)

**ВАЖНО**: Ключ показывается один раз!

✅ OpenAI API key готов!

---

## ⚙️ Step 5: Настроить .env.local (2 минуты)

### 5.1 Создать .env.local файл

В папке `app/` создай файл `.env.local`:

```bash
cd app
cp .env.example .env.local
```

### 5.2 Заполнить переменные

Открой `app/.env.local` и замени значения:

```bash
# ==================================
# REQUIRED - Supabase
# ==================================
# Из Supabase: Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ==================================
# REQUIRED - OpenAI
# ==================================
# Из platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx

# ==================================
# LOCAL DEVELOPMENT
# ==================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Проверь**:
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - должен начинаться с `https://` и заканчиваться на `.supabase.co`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - длинная строка (JWT token)
- ✅ `OPENAI_API_KEY` - начинается с `sk-proj-`

### 5.3 Проверить .gitignore

Убедись, что `.env.local` в `.gitignore`:

```bash
# В корне проекта
cat .gitignore | grep ".env.local"
```

Должно вывести: `.env.local` или `*.env.local`

✅ Environment variables настроены!

---

## 🚀 Step 6: Запустить приложение (3 минуты)

### 6.1 Установить зависимости

```bash
cd app
npm install
```

### 6.2 Запустить dev server

```bash
npm run dev
```

Должен вывести:
```
> projekt-lena1-app@0.1.0 dev
> next dev

   ▲ Next.js 14.2.0
   - Local:        http://localhost:3000
   - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.3s
```

### 6.3 Открыть в браузере

Открой: [http://localhost:3000](http://localhost:3000)

Должна загрузиться главная страница!

✅ Приложение запущено!

---

## 🔐 Step 7: Проверить авторизацию (5 минут)

### 7.1 Проверка без авторизации

1. Открой [http://localhost:3000](http://localhost:3000)
2. Должен увидеть:
   - "Welcome to AI Chat"
   - "Select a chat or create a new one to start"

### 7.2 Тест авторизации (если есть login страница)

**ПРИМЕЧАНИЕ**: Auth UI может быть не реализован в текущей версии. Проверим:

```bash
# Проверить есть ли login page
ls app/src/app/\(auth\)/login/
```

Если папки нет - значит auth UI в Phase 1.5 (не сделан ещё).

**Временное решение**: Используем Supabase Auth Helper напрямую

### 7.3 Тестовый пользователь (через Supabase)

1. В Supabase Dashboard: **Authentication** → **Users**
2. Нажми "Add user" → "Create new user"
3. Email: `test@example.com`
4. Password: `testpassword123`
5. Auto Confirm User: ✅ (включить!)
6. Нажми "Create user"

### 7.4 Проверка в консоли браузера

Открой DevTools (F12) → Console и выполни:

```javascript
// Проверить Supabase подключение
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

// Проверить можно ли подключиться
fetch('https://your-project.supabase.co/rest/v1/')
  .then(r => console.log('Supabase reachable:', r.ok))
```

Должно вывести: `Supabase reachable: true`

---

## ✅ Checklist - Всё работает?

Проверь что всё настроено:

### База данных
- [ ] Supabase проект создан
- [ ] SQL миграция выполнена (4 таблицы: profiles, chats, messages, usage_stats)
- [ ] RLS policies включены

### GitHub OAuth
- [ ] GitHub OAuth App создан
- [ ] Callback URL правильный (`https://YOUR-PROJECT.supabase.co/auth/v1/callback`)
- [ ] Client ID и Secret добавлены в Supabase
- [ ] GitHub Provider включен в Supabase

### OpenAI
- [ ] OpenAI аккаунт создан
- [ ] API Key создан
- [ ] Платёжный метод добавлен

### Local Environment
- [ ] `.env.local` создан
- [ ] Все 3 переменные заполнены (Supabase URL, Supabase Key, OpenAI Key)
- [ ] `.env.local` в `.gitignore`

### App Running
- [ ] `npm install` выполнен
- [ ] `npm run dev` запущен
- [ ] `localhost:3000` открывается
- [ ] Нет ошибок в консоли браузера
- [ ] Нет ошибок в терминале

---

## 🐛 Troubleshooting

### Problem: npm install fails

**Error**: `npm ERR! code ENOENT`

**Solution**:
```bash
# Убедись что в правильной папке
cd app

# Проверь что package.json существует
ls package.json

# Попробуй снова
npm install
```

### Problem: Port 3000 уже занят

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Найти процесс на порту 3000
# Windows:
netstat -ano | findstr :3000

# Убить процесс
taskkill /PID <PID> /F

# Или использовать другой порт
npm run dev -- -p 3001
```

### Problem: Supabase connection fails

**Error**: В консоли: `Failed to fetch` или `Network error`

**Solution**:
1. Проверь `.env.local`:
   - URL должен начинаться с `https://`
   - URL должен заканчиваться на `.supabase.co`
   - Anon key должен быть длинная строка (JWT)

2. Проверь что Supabase проект активен:
   - Открой Supabase Dashboard
   - Project должен быть "Active" (зелёный)

3. Перезапусти dev server:
   ```bash
   # Ctrl+C чтобы остановить
   npm run dev
   ```

### Problem: GitHub OAuth не работает

**Error**: При клике "Login with GitHub" ничего не происходит

**Solution**:
1. Проверь Callback URL в GitHub OAuth App:
   - Должен быть: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
   - НЕ `http://localhost:3000/...`

2. Проверь что GitHub Provider включен в Supabase:
   - Authentication → Providers → GitHub → Enable ✅

3. Проверь Client ID и Secret:
   - Должны быть из GitHub OAuth App
   - Secret показывается один раз - если потерял, создай новый

### Problem: OpenAI API не работает

**Error**: `401 Unauthorized` или `Insufficient quota`

**Solution**:
1. Проверь API Key:
   - Должен начинаться с `sk-proj-`
   - Создан в [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

2. Проверь баланс:
   - Открой [platform.openai.com/account/billing](https://platform.openai.com/account/billing)
   - Должен быть credit balance > $0

3. Проверь платёжный метод:
   - Добавь credit card в Billing

---

## 🎉 Готово!

Если всё работает:
- ✅ Приложение запущено на localhost:3000
- ✅ Supabase подключен
- ✅ GitHub OAuth настроен
- ✅ OpenAI API готов к использованию

**Следующие шаги**:
1. Протестируй создание чата
2. Отправь сообщение AI
3. Проверь что всё сохраняется в Supabase

**Если что-то не работает**:
- Проверь [Troubleshooting](#troubleshooting)
- Посмотри ошибки в консоли браузера (F12)
- Посмотри ошибки в терминале где запущен `npm run dev`

---

## 📝 Дополнительно

### Полезные команды

```bash
# Остановить dev server
Ctrl+C

# Очистить кэш и перезапустить
rm -rf .next
npm run dev

# Проверить TypeScript
npm run typecheck

# Запустить тесты
npm test

# Build production
npm run build
```

### Supabase Dashboard

Полезные разделы:
- **Table Editor** - просмотр данных в таблицах
- **Authentication → Users** - список пользователей
- **SQL Editor** - выполнить SQL запросы
- **Logs** - логи API requests

### Next Steps

После успешного запуска на localhost:
1. Создать login page (если нет)
2. Протестировать весь user flow
3. Добавить тесты
4. Задеплоить на Vercel (Phase 5.1)

---

**Setup Status: READY FOR LOCALHOST** ✅
**Next: Test the application!** 🚀
