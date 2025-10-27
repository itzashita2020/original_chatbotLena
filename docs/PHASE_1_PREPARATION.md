# 🚀 Phase 1 Preparation Checklist

**Created:** 2025-10-23
**Target Start Date:** [ЗАПОЛНИ - когда планируешь начать Phase 1]
**Estimated Duration:** Week 1-2 (~41 hours)

> **Цель:** Подготовить всё необходимое ДО начала Phase 1 (Foundation), чтобы не тратить время на настройку во время разработки.

---

## ✅ Prerequisites Check

### 1. Локальное окружение

#### Node.js & npm
- [ ] **Node.js 18+** установлен
  ```bash
  node --version  # Должно быть >= 18.0.0
  ```
  - ❌ Если нет: [Скачать Node.js](https://nodejs.org/) (выбрать LTS версию)
  - ✅ Рекомендую: Node.js 20.x LTS

- [ ] **npm** работает
  ```bash
  npm --version  # Должно быть >= 9.0.0
  ```

#### Git
- [ ] **Git** установлен и настроен
  ```bash
  git --version
  git config --global user.name   # Проверить имя
  git config --global user.email  # Проверить email
  ```
  - ❌ Если не настроено:
    ```bash
    git config --global user.name "Your Name"
    git config --global user.email "your.email@example.com"
    ```

#### Текстовый редактор
- [ ] **VS Code** (или аналог) установлен
  - Рекомендуемые расширения для VS Code:
    - [ ] ESLint
    - [ ] Prettier
    - [ ] Tailwind CSS IntelliSense
    - [ ] TypeScript and JavaScript Language Features

---

## 🔧 External Services Setup

### 2. Supabase Account & Project

#### Создание аккаунта
- [ ] **Создать аккаунт на Supabase**
  - Перейти: https://supabase.com
  - Нажать "Start your project"
  - Войти через GitHub (рекомендуется) или Email

#### Создание проекта
- [ ] **Создать новый Supabase проект**
  1. После входа нажать "New Project"
  2. Заполнить форму:
     - **Name:** `projekt-lena1` (или любое другое)
     - **Database Password:** [придумай сложный пароль и СОХРАНИ его!]
     - **Region:** Выбрать ближайший регион (Europe - для России)
     - **Pricing Plan:** Free (достаточно для учебного проекта)
  3. Нажать "Create new project"
  4. ⏳ Подождать ~2 минуты пока проект создаётся

#### Получение API ключей
- [ ] **Скопировать Supabase credentials**
  1. В Supabase Dashboard → Settings (шестерёнка) → API
  2. Скопировать и СОХРАНИТЬ:
     - **Project URL:** `https://[your-project-id].supabase.co`
     - **anon/public key:** `eyJhbGc...` (длинная строка)
     - **service_role key:** `eyJhbGc...` (НЕ использовать в клиенте!)

  📝 **Сохрани в безопасное место** (понадобятся для `.env.local`)

#### Настройка GitHub OAuth
- [ ] **Включить GitHub провайдера в Supabase**
  1. В Supabase Dashboard → Authentication → Providers
  2. Найти "GitHub" и нажать "Enable"
  3. Оставить пока пустым (настроим позже в Phase 1.5)

  💡 **Позже:** Нужно будет создать GitHub OAuth App и добавить Client ID/Secret

---

### 3. OpenAI Account & API Key

#### Создание аккаунта
- [ ] **Создать аккаунт на OpenAI**
  - Перейти: https://platform.openai.com
  - Нажать "Sign up"
  - Зарегистрироваться через Email или Google

#### Добавление платёжного метода
- [ ] **Добавить платёжную карту** (ОБЯЗАТЕЛЬНО для API)
  1. OpenAI Platform → Settings (вверху справа) → Billing
  2. Нажать "Add payment method"
  3. Добавить карту (будет списано $5+ минимум)

  💰 **Стоимость:**
  - GPT-4: ~$0.03 per 1K input tokens, ~$0.06 per 1K output tokens
  - GPT-3.5-turbo: дешевле в ~10 раз
  - 💡 Для учебного проекта: $10-20 хватит на несколько месяцев разработки

- [ ] **Установить лимит расходов** (защита от overspending)
  1. Billing → Usage limits
  2. Установить "Hard limit": $20 (или сколько готов потратить)
  3. Установить "Soft limit": $10 (предупреждение)

#### Создание API ключа
- [ ] **Создать API key**
  1. OpenAI Platform → API keys (слева в меню)
  2. Нажать "+ Create new secret key"
  3. Название: `projekt-lena1-dev`
  4. Нажать "Create secret key"
  5. **СКОПИРОВАТЬ КЛЮЧ И СОХРАНИТЬ!** (показывается только 1 раз!)
     - Формат: `sk-proj-...` (длинная строка)

  ⚠️ **ВАЖНО:** Ключ показывается ТОЛЬКО ОДИН РАЗ! Если потеряешь - придётся создавать новый.

---

### 4. GitHub OAuth App (опционально, можно сделать в Phase 1.5)

Это понадобится для GitHub авторизации в приложении.

- [ ] **Создать GitHub OAuth App** (можно пропустить сейчас)
  1. GitHub → Settings → Developer settings → OAuth Apps
  2. "New OAuth App"
  3. Заполнить:
     - **Application name:** Projekt Lena1 (Local Dev)
     - **Homepage URL:** `http://localhost:3000`
     - **Authorization callback URL:** `https://[your-supabase-project].supabase.co/auth/v1/callback`
  4. Получить Client ID и Client Secret
  5. Добавить в Supabase (Authentication → Providers → GitHub)

---

## 📝 Подготовка Environment Variables

### 5. Создать `.env.local` template

- [ ] **Подготовить файл с credentials** (НЕ коммитить!)

  Создай файл где-нибудь в безопасном месте (НЕ в git!) со следующим содержимым:

  ```bash
  # Supabase
  NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... [твой anon key]

  # OpenAI
  OPENAI_API_KEY=sk-proj-... [твой API key]

  # GitHub OAuth (заполнить позже)
  # GITHUB_CLIENT_ID=
  # GITHUB_CLIENT_SECRET=
  ```

  💾 **Сохрани этот файл** - он понадобится в Phase 1.1 для создания `.env.local`

---

## 💰 Бюджет и Cost Estimation

### 6. Оценка расходов

#### Supabase
- ✅ **Free tier:** Достаточно для учебного проекта
  - 500 MB Database
  - 1 GB File Storage
  - 2 GB Bandwidth
  - 50,000 Monthly Active Users

#### OpenAI
- 💵 **Примерные расходы на Phase 1-4:**
  - Development & Testing: ~$5-10
    - Примерно 100-200 запросов к GPT-4
    - Средний запрос: 500 tokens input + 1000 tokens output = ~$0.08
    - 150 запросов × $0.08 = ~$12

  - 💡 **Совет:** Используй GPT-3.5-turbo для разработки (дешевле в 10 раз), GPT-4 только для финальных тестов

#### Общий бюджет
- **Минимум:** $5 (только OpenAI, минимальный депозит)
- **Рекомендуется:** $10-20 (на 2-3 месяца разработки)
- **Максимум:** Установи Hard Limit на OpenAI!

---

## 📚 Learning Resources (опционально)

### 7. Изучить документацию (если не знаком)

- [ ] **Next.js 14 Basics** (если впервые)
  - Официальная документация: https://nextjs.org/docs
  - App Router tutorial: https://nextjs.org/learn
  - ⏱️ Время: 2-3 часа (базовый tutorial)

- [ ] **Supabase Quickstart**
  - Quickstart: https://supabase.com/docs/guides/getting-started
  - Auth guide: https://supabase.com/docs/guides/auth
  - ⏱️ Время: 1-2 часа

- [ ] **OpenAI API Docs**
  - Chat Completions: https://platform.openai.com/docs/guides/chat
  - Streaming: https://platform.openai.com/docs/api-reference/streaming
  - ⏱️ Время: 30 минут

---

## ✅ Final Checklist

**Перед началом Phase 1 убедись что:**

### Локальное окружение
- [ ] ✅ Node.js 18+ установлен
- [ ] ✅ Git настроен
- [ ] ✅ VS Code (или редактор) готов

### External Services
- [ ] ✅ Supabase проект создан
- [ ] ✅ Supabase API keys скопированы и сохранены
- [ ] ✅ OpenAI аккаунт создан
- [ ] ✅ OpenAI платёжный метод добавлен
- [ ] ✅ OpenAI API key создан и сохранён
- [ ] ✅ OpenAI Hard Limit установлен ($10-20)

### Environment Variables
- [ ] ✅ `.env.local` template подготовлен с credentials

### Budget
- [ ] ✅ Понимаю примерные расходы (~$10-20)
- [ ] ✅ Готов потратить эту сумму на обучение

---

## 🚀 Ready to Start!

Когда всё выше отмечено ✅, ты готов к **Phase 1: Foundation**!

**Следующий шаг:**
```bash
# Начать Phase 1 из TODO.md
# Первая задача: "1.1 Project Initialization"
```

**Полезные ссылки:**
- [TODO.md](TODO.md) - Детальный чеклист Phase 1
- [BACKLOG.md](BACKLOG.md) - Полный план разработки
- [ARCHITECTURE.md](ARCHITECTURE.md) - Техническая архитектура

---

## 📞 Support

**Проблемы при подготовке?**

1. **Supabase не создаётся:**
   - Проверь email подтверждение
   - Попробуй другой браузер (Chrome/Firefox)

2. **OpenAI не принимает карту:**
   - Нужна международная карта (Visa/Mastercard)
   - Попробуй виртуальную карту (например, Payoneer, Wise)

3. **Node.js не устанавливается:**
   - Скачай инсталлятор с https://nodejs.org
   - Выбери LTS версию
   - Перезагрузи компьютер после установки

4. **Другие вопросы:**
   - Проверь [CLAUDE.md](CLAUDE.md) для AI-агента
   - Проверь [README.md](README.md) для Quick Start

---

**Good luck! 🚀**

*После завершения Phase 1 вернись сюда и отметь этот файл как ✅ completed*
