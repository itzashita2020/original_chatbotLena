# 📚 Documentation Index

**Last Updated:** 2025-10-23

> **Быстрая навигация по всей документации проекта**

---

## 🎯 Start Here (Новичкам)

**Если ты ВПЕРВЫЕ в проекте, читай В ЭТОМ ПОРЯДКЕ:**

1. **[README.md](README.md)** ⭐ - Обзор проекта, что это такое
2. **[PHASE_1_PREPARATION.md](PHASE_1_PREPARATION.md)** 🚀 - Подготовка к разработке (Supabase, OpenAI)
3. **[TODO.md](TODO.md)** ✅ - Что делать дальше (чеклист задач)

---

## 📋 Project-Specific Documentation

**Заполненные файлы для этого проекта:**

### Essential (читать обязательно)
| Файл | Назначение | Статус |
|------|------------|--------|
| **[README.md](README.md)** | Обзор проекта, Quick Start | ✅ Заполнен |
| **[PROJECT_INTAKE.md](PROJECT_INTAKE.md)** | Требования, User Personas, User Flows | ✅ Заполнен |
| **[TECHNICAL_SPECIFICATION.md](TECHNICAL_SPECIFICATION.md)** | Техническая спецификация v2.0 | ✅ Заполнен |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | Архитектура, Tech Stack, решения | ✅ Заполнен |
| **[BACKLOG.md](BACKLOG.md)** | План разработки (SINGLE SOURCE OF TRUTH) | ✅ Заполнен |
| **[PROJECT_SNAPSHOT.md](PROJECT_SNAPSHOT.md)** | Текущий статус проекта | ✅ Заполнен |
| **[TODO.md](TODO.md)** | Чеклист задач по фазам | ✅ Создан |
| **[PHASE_1_PREPARATION.md](PHASE_1_PREPARATION.md)** | Подготовка к Phase 1 | ✅ Создан |

### Reference (по необходимости)
| Файл | Назначение | Статус |
|------|------------|--------|
| **[SECURITY.md](SECURITY.md)** | Security guidelines (универсальный) | 📘 Template |
| **[WORKFLOW.md](WORKFLOW.md)** | Development workflow (универсальный) | 📘 Template |
| **[CLAUDE.md](CLAUDE.md)** | Контекст для AI-агентов | 📘 Framework |
| **[AGENTS.md](AGENTS.md)** | Инструкции для AI | 📘 Framework |

---

## 🤖 For AI Agents (Claude Code)

**При ПЕРВОМ запуске Claude Code читает автоматически:**
1. **[CLAUDE.md](CLAUDE.md)** - Загружается автоматически в контекст

**Затем AI должен прочитать:**
2. **[PROJECT_SNAPSHOT.md](PROJECT_SNAPSHOT.md)** - Быстрый обзор (Phase X, прогресс)
3. **[PROJECT_INTAKE.md](PROJECT_INTAKE.md)** - Требования проекта
4. **[BACKLOG.md](BACKLOG.md)** - Текущие задачи (SINGLE SOURCE OF TRUTH)
5. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Только нужный модуль (модульный фокус!)

**НЕ читать автоматически:**
- ❌ MIGRATION.md (только для миграции существующих проектов)
- ❌ PROCESS.md (только при завершении фазы)
- ❌ DEVELOPMENT_PLAN_TEMPLATE.md (только для планирования нового проекта)

---

## 📁 Templates & Framework Files

**Эти файлы НЕ нужно заполнять - они универсальные:**

| Файл | Назначение | Для кого |
|------|------------|----------|
| **[SECURITY.md](SECURITY.md)** | Security best practices | Все проекты |
| **[WORKFLOW.md](WORKFLOW.md)** | Sprint workflow | Все проекты |
| **[PROCESS.md](PROCESS.md)** | Процесс обновления метафайлов | AI при завершении Phase |
| **[DEVELOPMENT_PLAN_TEMPLATE.md](DEVELOPMENT_PLAN_TEMPLATE.md)** | Методология планирования | Новые проекты |
| **[PLAN_TEMPLATE.md](PLAN_TEMPLATE.md)** | Template для PLAN.md | Новые проекты |
| **[README-TEMPLATE.md](README-TEMPLATE.md)** | Template для README | Новые проекты |
| **[AGENTS.md](AGENTS.md)** | AI agent instructions | AI-агенты |
| **[CLAUDE.md](CLAUDE.md)** | Claude Code context | Claude Code |
| **[CACHING.md](CACHING.md)** | Prompt caching strategy | AI-агенты |
| **[MIGRATION.md](MIGRATION.md)** | Migration guide | Legacy projects |

---

## 🗺️ Quick Navigation by Task

### "Хочу начать разработку"
→ [PHASE_1_PREPARATION.md](PHASE_1_PREPARATION.md) - Подготовка окружения
→ [TODO.md](TODO.md) - Чеклист Phase 1
→ [BACKLOG.md](BACKLOG.md) - Детальный план

### "Хочу понять архитектуру"
→ [ARCHITECTURE.md](ARCHITECTURE.md) - Полное описание
→ [TECHNICAL_SPECIFICATION.md](TECHNICAL_SPECIFICATION.md) - Техническая спецификация

### "Хочу понять пользователей"
→ [PROJECT_INTAKE.md](PROJECT_INTAKE.md) - User Personas, User Flows

### "Где текущий статус?"
→ [PROJECT_SNAPSHOT.md](PROJECT_SNAPSHOT.md) - Быстрый обзор
→ [TODO.md](TODO.md) - Чеклист задач

### "Как работать с AI?"
→ [CLAUDE.md](CLAUDE.md) - Контекст для Claude Code
→ [AGENTS.md](AGENTS.md) - Инструкции для AI

### "Как обеспечить безопасность?"
→ [SECURITY.md](SECURITY.md) - Security guidelines

### "Как делать коммиты?"
→ [WORKFLOW.md](WORKFLOW.md) - Git workflow, commit templates

---

## 📊 Documentation Status

### ✅ Completed (Phase 0)
- [x] README.md
- [x] PROJECT_INTAKE.md
- [x] TECHNICAL_SPECIFICATION.md
- [x] ARCHITECTURE.md
- [x] BACKLOG.md
- [x] PROJECT_SNAPSHOT.md
- [x] TODO.md
- [x] PHASE_1_PREPARATION.md
- [x] DOCUMENTATION_INDEX.md (этот файл)

### 📘 Framework Files (не требуют изменений)
- [x] SECURITY.md
- [x] WORKFLOW.md
- [x] PROCESS.md
- [x] CLAUDE.md
- [x] AGENTS.md
- [x] CACHING.md
- [x] MIGRATION.md
- [x] DEVELOPMENT_PLAN_TEMPLATE.md
- [x] PLAN_TEMPLATE.md
- [x] README-TEMPLATE.md

### 🔄 Will be created during development
- [ ] .env.example (Phase 1.1)
- [ ] package.json (Phase 1.1)
- [ ] tsconfig.json (Phase 1.1)
- [ ] Database migration files (Phase 1.2)
- [ ] Module files (Phase 1.3+)

---

## 🎯 Current Phase

**Phase 0: Documentation** ✅ COMPLETED (2025-10-23)

**Next: Phase 1: Foundation** 📋 NOT STARTED
- **Preparation:** [PHASE_1_PREPARATION.md](PHASE_1_PREPARATION.md)
- **Tasks:** [TODO.md](TODO.md#-next-phase-1---foundation-week-1-2-41-hours)
- **Details:** [BACKLOG.md](BACKLOG.md#phase-1-foundation-week-1-2-41-hours)

---

## 💡 Tips

### Для разработчиков
- 📖 Начни с README.md
- 🚀 Подготовься через PHASE_1_PREPARATION.md
- ✅ Следуй TODO.md во время разработки
- 🔐 Проверяй SECURITY.md перед коммитом

### Для AI-агентов
- 🤖 CLAUDE.md загружается автоматически
- 📸 PROJECT_SNAPSHOT.md = быстрый контекст
- 🎯 Читай только нужный модуль из ARCHITECTURE.md
- 💰 Экономь токены - модульный фокус!

---

**Нужна помощь?** Все ответы в документации выше! 📚
