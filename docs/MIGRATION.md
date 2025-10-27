# Гайд по миграции на Claude Code Starter framework

> Полное руководство по миграции существующих проектов с legacy мета-документацией на Claude Code Starter framework v1.0

---

## 📖 Содержание

1. [Когда нужна миграция](#когда-нужна-миграция)
2. [Обзор процесса](#обзор-процесса)
3. [Подготовка к миграции](#подготовка-к-миграции)
4. [Этап 1: Анализ и перенос](#этап-1-анализ-и-перенос)
5. [Пауза для проверки](#пауза-для-проверки)
6. [Этап 2: Финализация](#этап-2-финализация)
7. [Примеры миграции](#примеры-миграции)
8. [Решение проблем](#решение-проблем)
9. [FAQ](#faq)

---

## Когда нужна миграция

### У вас уже есть проект с мета-документацией

Вы НЕ начинаете с нуля, а имеете:
- Существующую кодовую базу
- Разрозненные мета-файлы (README, docs, notes, TODO, etc)
- Возможно, устаревшую или неполную документацию
- Желание структурировать всё в единый фреймворк

### Признаки что нужна миграция

✅ **Мигрируйте если:**
- У вас есть проект с legacy документацией
- Документация в разных местах (docs/, notes/, корень проекта)
- Нет единого источника истины
- Хотите использовать Claude Code Starter framework
- Нужна структура для работы с AI агентами

❌ **НЕ мигрируйте если:**
- Начинаете новый проект с нуля (просто скопируйте шаблоны)
- У вас нет никакой документации (создайте с нуля)
- Проект очень маленький (проще написать документацию заново)

---

## Обзор процесса

### Двухэтапный процесс с паузой

```
ЭТАП 1: Анализ и перенос
├── Сканирование legacy файлов
├── Анализ содержимого
├── Обнаружение конфликтов
├── Миграция информации в Init/
├── Архивирование legacy файлов
├── Создание MIGRATION_REPORT.md
└── Создание CONFLICTS.md (если есть)

⏸️ ПАУЗА ДЛЯ ПРОВЕРКИ
├── Читаете MIGRATION_REPORT.md
├── Разрешаете конфликты
├── Проверяете Init/ файлы
├── Заполняете пробелы
└── Принимаете решение о финализации

ЭТАП 2: Финализация
├── Финальные проверки
├── Архивирование отчетов
├── Обновление CLAUDE.md
├── Обновление BACKLOG.md
├── Создание git commit
└── ✅ Миграция завершена
```

### Почему два этапа?

**Безопасность и контроль:**
- Этап 1 собирает информацию, но не делает необратимых действий
- Пауза дает время проверить результат
- Вы можете исправить ошибки до финализации
- Этап 2 завершает процесс только после вашего подтверждения

---

## Подготовка к миграции

### ⚠️ КРИТИЧНО: Предварительные требования

**Перед запуском `/migrate` ОБЯЗАТЕЛЬНО выполните эти шаги:**

#### 1. Скопируйте фреймворк в ваш проект

Миграция требует наличия шаблонов фреймворка и slash-команд в вашем проекте.

```bash
# Перейдите в ваш проект
cd /path/to/your/project

# Скопируйте Init/ со всеми шаблонами
cp -r /path/to/claude-code-starter/Init .

# Скопируйте slash-команды (КРИТИЧНО!)
mkdir -p .claude/commands
cp /path/to/claude-code-starter/Init/.claude/commands/*.md .claude/commands/
```

**Что это даёт:**
- ✅ `Init/` - шаблоны фреймворка (CLAUDE.md, PROJECT_INTAKE.md, etc.)
- ✅ `.claude/commands/` - slash-команды (/migrate, /migrate-finalize, etc.)

**⚠️ Без этих файлов миграция не запустится!**

#### 2. Проверьте что всё на месте

```bash
# Проверьте наличие Init/
ls Init/

# Проверьте наличие slash-команд
ls .claude/commands/migrate.md
```

Должны увидеть:
- ✅ `Init/CLAUDE.md`, `PROJECT_INTAKE.md`, `SECURITY.md`, etc.
- ✅ `.claude/commands/migrate.md`, `migrate-finalize.md`, etc.

---

### Шаг 1: Сделайте бэкап (рекомендуется)

```bash
# Создайте git commit перед миграцией
git add .
git commit -m "Pre-migration snapshot"

# Или создайте бэкап вручную
tar -czf backup-before-migration.tar.gz .
```

### Шаг 2: Подготовьте проект

**Убедитесь что:**
- [ ] Проект в git (рекомендуется)
- [ ] Все изменения закоммичены
- [ ] У вас есть доступ к истории проекта
- [ ] Вы знаете где находятся важные документы

### Шаг 3: (Опционально) Создайте .migrationignore

**Если в проекте есть файлы, которые НЕ должны мигрироваться:**

Справочные статьи, записи встреч, исследовательские документы, временные заметки - все это НЕ является мета-документацией проекта и должно быть исключено из миграции.

**Создайте `.migrationignore` в корне проекта:**

```bash
# Скопируйте пример и отредактируйте
cp Init/.migrationignore.example .migrationignore

# Или создайте вручную
nano .migrationignore
```

**Что исключать:**
- ✅ Справочные статьи (docs/articles/, docs/references/)
- ✅ Записи встреч (notes/meeting-*.md)
- ✅ Временные заметки (notes/temp*.md, notes/scratch*.md)
- ✅ Исследования (research/, experiments/)
- ✅ Старые версии (old/, archive/, deprecated/)
- ✅ Бинарные файлы (*.pdf, *.docx)

**Что НЕ исключать:**
- ❌ Документацию вашего проекта (README.md, architecture.md)
- ❌ Требования к проекту
- ❌ TODO списки и backlog
- ❌ Security документацию
- ❌ Workflow и процессы

**Примечание:** Если `.migrationignore` не создан, AI предложит создать его автоматически на основе анализа файлов при запуске `/migrate`.

**Пример .migrationignore:**
```
# Reference articles
docs/articles/
docs/references/

# Meeting notes
notes/meeting-*.md

# Research
research/

# Old/archived
old/
docs/deprecated/

# Binary files
*.pdf
*.docx
```

См. `Init/.migrationignore.example` для полного примера с комментариями.

### Шаг 4: Перезапустите Claude Code для загрузки команд

```bash
# В корне вашего проекта
claude
```

**⚠️ ВАЖНО:** После первого запуска Claude Code необходимо перезапустить для загрузки slash-команд:

```bash
exit
claude
```

Slash-команды (`/migrate`, `/migrate-finalize`, etc.) станут доступны только после перезапуска.

---

## Этап 1: Анализ и перенос

### Запуск миграции

```bash
/migrate
```

Эта команда автоматически:
1. Найдет все legacy мета-файлы
2. Проанализирует их содержимое
3. Создаст mapping между legacy и фреймворком
4. Перенесет информацию в Init/ файлы
5. Архивирует legacy файлы
6. Создаст MIGRATION_REPORT.md
7. Создаст CONFLICTS.md (если есть конфликты)
8. ⏸️ Остановится для вашей проверки

### Что происходит автоматически

#### 1. Сканирование

AI найдет файлы типа:
- `README.md`, `DOCS.md`, `NOTES.md` в корне
- Папки `docs/`, `documentation/`, `notes/`, `wiki/`
- `architecture.md`, `design.md`, `structure.md`
- `security.md`, `security.txt`
- `TODO.md`, `backlog.md`, `roadmap.md`
- Любые другие `.md` или `.txt` с мета-информацией

**Не будут затронуты:**
- Код (*.js, *.ts, *.py, etc)
- node_modules/, dist/, build/
- Init/ (новый фреймворк)
- Lock файлы

#### 2. Анализ и mapping

AI определит:
```
docs/README.md → PROJECT_INTAKE.md (Problem, Solution, Goals)
docs/architecture.md → ARCHITECTURE.md (Tech Stack, Decisions)
notes/security.txt → SECURITY.md (Security practices)
TODO.md → BACKLOG.md (Tasks, features)
api-docs.md → ARCHITECTURE.md (API Structure section)
```

#### 3. Обнаружение конфликтов

AI выявит:

**🔴 Критичные:**
- Отсутствие security документации
- Противоречия в архитектуре
- Устаревшая критичная информация

**🟡 Средние:**
- Дублирование информации
- Структурные различия
- Неполнота данных

**🟢 Низкие:**
- Косметические различия
- Избыточная детализация

#### 4. Миграция информации

AI заполнит Init/ файлы:
- **CLAUDE.md** - Tech Stack, специфичные инструкции
- **PROJECT_INTAKE.md** - Problem/Solution/Value, User Personas, User Flows, Features
- **SECURITY.md** - Security practices (или пометит [CRITICAL: NEEDS FILLING])
- **ARCHITECTURE.md** - Tech Stack, Folder Structure, Module Architecture, API, DB
- **BACKLOG.md** - TODO items с обновленными статусами
- **AGENTS.md** - Паттерны из кода
- **WORKFLOW.md** - Существующие workflow (или дефолтные)

#### 5. Архивирование

Все legacy файлы переместятся в:
```
archive/
├── README.md (пояснение что это архив)
├── docs/
│   ├── README.md
│   └── architecture.md
├── notes/
│   └── security.txt
└── other/
    └── TODO.md
```

#### 6. Отчеты

**MIGRATION_REPORT.md** будет содержать:
- Summary статистики
- Детальный mapping
- Логи миграции для каждого файла
- Список архивированных файлов
- Next steps

**CONFLICTS.md** (если есть конфликты):
- Список всех конфликтов
- Приоритеты (🔴🟡🟢)
- Рекомендации по разрешению
- Checklists для действий

---

## Пауза для проверки

### ⏸️ После Этапа 1 миграция останавливается

Вы получите сообщение:
```
✅ Миграция (Этап 1) завершена!

📊 Результаты:
- Найдено legacy файлов: 8
- Перенесено в Init/: 7
- Архивировано в archive/: 8
- Обнаружено конфликтов: 3 (🔴 1 🟡 1 🟢 1)

⏸️ МИГРАЦИЯ ПРИОСТАНОВЛЕНА ДЛЯ ПРОВЕРКИ

📋 ЧТО ДЕЛАТЬ ДАЛЬШЕ: ...
```

### Что нужно сделать

#### 1. Прочитайте MIGRATION_REPORT.md

```bash
# Откройте в редакторе
code MIGRATION_REPORT.md

# Или попросите AI
"Прочитай MIGRATION_REPORT.md и расскажи основные моменты"
```

**Проверьте:**
- ✅ Все ли legacy файлы учтены
- ✅ Правильный ли mapping
- ✅ Ничего важного не потеряно
- ✅ Логи миграции имеют смысл

#### 2. Если есть CONFLICTS.md - разрешите конфликты

##### Автоматическое разрешение через `/migrate-resolve`

**Рекомендуемый способ:**

```bash
/migrate-resolve
```

Эта команда запускает интерактивный процесс разрешения конфликтов:

✅ **Что делает:**
- Читает каждый конфликт из CONFLICTS.md
- Анализирует legacy файлы и Init/ файлы
- Предлагает умное решение (merge стратегия)
- Спрашивает ваше подтверждение для каждого конфликта
- Применяет изменения автоматически после [A]
- Создает детальный лог в CONFLICT_RESOLUTION_LOG.md
- Создает бэкапы перед изменениями

✅ **Интерактивный выбор для каждого конфликта:**
```
Конфликт #1: README.md vs PROJECT_INTAKE.md

🤖 Предлагаю решение (merge стратегия):
1. Взять секцию "Architecture" из archive/docs/README.md
2. Вставить в Init/ARCHITECTURE.md после "## Core Principles"
...

Ваш выбор:
[A] Авто-решение - применить предложение AI
[M] Ручное решение - я разберусь сам позже
[S] Пропустить - перейти к следующему
[Q] Выйти - завершить работу
```

✅ **Безопасность:**
- Бэкапы в `.conflict_resolution_backup/`
- Можно откатить через `/migrate-rollback --conflicts-only`
- Legacy файлы не модифицируются
- Требует подтверждение на каждом шаге

**Подробнее:** См. `.claude/commands/migrate-resolve.md`

---

##### Ручное разрешение конфликтов

Если предпочитаете разрешать вручную:

```bash
# Откройте CONFLICTS.md
code CONFLICTS.md

# Или попросите AI помочь
"Помоги разрешить конфликт #1 в CONFLICTS.md"
```

**Порядок разрешения:**
1. Начните с 🔴 критичных конфликтов (MUST resolve)
2. Потом 🟡 средних (SHOULD resolve)
3. 🟢 низкие можно отложить

**Типичные конфликты и решения:**

##### Missing Security Documentation (🔴)
```
Проблема: Нет security документации в legacy
Решение:
1. "Проанализируй код на security patterns"
2. "Заполни SECURITY.md на основе анализа кода"
3. "Запусти /security для аудита"
```

##### Architecture Mismatch (🔴)
```
Проблема: Legacy описывает монолит, фреймворк предполагает модули
Решение:
1. "Проанализируй текущую структуру проекта"
2. "Предложи модульное разделение"
3. "Обнови ARCHITECTURE.md с планом модульности"
```

##### Incomplete User Personas (🟡)
```
Проблема: User Personas не найдены в legacy
Решение:
1. "На основе features и кода создай User Personas"
2. "Заполни секцию User Personas в PROJECT_INTAKE.md"
```

#### 3. Проверьте Init/ файлы

**Откройте каждый файл и проверьте:**

```bash
# PROJECT_INTAKE.md
code Init/PROJECT_INTAKE.md
```
- [ ] Problem/Solution/Value заполнены
- [ ] User Personas созданы (хотя бы 1-2)
- [ ] User Flows описаны
- [ ] Features перечислены
- [ ] Modular Structure спланирована

```bash
# SECURITY.md
code Init/SECURITY.md
```
- [ ] НЕ содержит [CRITICAL: NEEDS FILLING]
- [ ] Все секции заполнены
- [ ] Специфичные для проекта practices описаны

```bash
# ARCHITECTURE.md
code Init/ARCHITECTURE.md
```
- [ ] Tech Stack актуален
- [ ] Folder Structure правильная
- [ ] Module Architecture спланирована
- [ ] Key Decisions сохранены (WHY!)

```bash
# BACKLOG.md
code Init/BACKLOG.md
```
- [ ] TODO items перенесены
- [ ] Статусы актуальны
- [ ] Приоритеты расставлены

#### 4. Заполните пробелы

Ищите маркеры:
- `[NEEDS FILLING]` - секция не заполнена
- `[NEEDS UPDATE]` - информация неполная
- `[CRITICAL: NEEDS FILLING]` - критично заполнить

**Попросите AI помочь:**
```
"Найди все [NEEDS FILLING] в Init/ файлах и помоги заполнить"
"Заполни секцию User Flows в PROJECT_INTAKE.md на основе features"
"Обнови ARCHITECTURE.md с модульной структурой"
```

#### 5. Сравните с archive/

```bash
# Проверьте что ничего не потеряно
"Сравни Init/ARCHITECTURE.md с archive/docs/architecture.md - вся ли информация перенесена?"
"Проверь что все TODO из archive/other/TODO.md есть в BACKLOG.md"
```

### Когда готовы к финализации

**Критерии готовности:**
- ✅ MIGRATION_REPORT.md прочитан и понятен
- ✅ Все 🔴 критичные конфликты разрешены
- ✅ SECURITY.md полностью заполнен (это критично!)
- ✅ PROJECT_INTAKE.md заполнен (минимум Problem/Solution/Value + Features)
- ✅ ARCHITECTURE.md актуален
- ✅ BACKLOG.md обновлен
- ✅ Вы уверены что ничего не потеряно

**Если не готовы - не торопитесь!**
- Можете продолжить работу в проекте
- Вернуться к миграции позже
- Попросить AI помочь заполнить пробелы

---

## Этап 2: Финализация

### Запуск финализации

```bash
/migrate-finalize
```

### Что происходит

#### 1. Предварительные проверки

AI проверит:
- [ ] MIGRATION_REPORT.md существует
- [ ] archive/ создан
- [ ] Init/ файлы заполнены
- [ ] SECURITY.md не содержит [CRITICAL: NEEDS FILLING]
- [ ] Конфликты разрешены

**Если проверки не прошли:**
```
🛑 Финализация остановлена

Причина: SECURITY.md содержит [CRITICAL: NEEDS FILLING]

Действия:
1. Заполните все секции SECURITY.md
2. Запустите /security для аудита
3. Вернитесь к /migrate-finalize
```

#### 2. Финализация документов

- ✅ Добавит финальную секцию в MIGRATION_REPORT.md
- ✅ Переместит MIGRATION_REPORT.md в archive/
- ✅ Переместит CONFLICTS.md в archive/ (если был)

#### 3. Обновление файлов

**CLAUDE.md** получит migration notice:
```markdown
## 📝 Migration Notice

> This project was migrated to Claude Code Starter framework v1.0 on 2025-01-10

**Archive location:** `archive/`
**Migration report:** `archive/MIGRATION_REPORT.md`
**Framework version:** v1.0

**Single source of truth is now Init/ folder.**
Legacy documentation archived for reference only.
```

**BACKLOG.md** получит запись:
```markdown
### 2025-01-10 - Migrated to Claude Code Starter v1.0
**Status:** ✅ Complete
**Description:** Successfully migrated legacy documentation to structured framework
```

#### 4. Git commit

AI создаст коммит:
```
chore: Finalize migration to Claude Code Starter framework v1.0

Successfully migrated legacy documentation to structured framework.

Changes:
- All legacy meta-files archived to archive/
- Documentation restructured into Init/ framework
- SECURITY.md, PROJECT_INTAKE.md, ARCHITECTURE.md updated
- BACKLOG.md updated with current status
- Single source of truth established

Migration report: archive/MIGRATION_REPORT.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

#### 5. Финальный вывод

```
🎉 МИГРАЦИЯ ЗАВЕРШЕНА УСПЕШНО!

✅ Финализация выполнена:
- ✅ MIGRATION_REPORT.md архивирован
- ✅ CLAUDE.md обновлен
- ✅ BACKLOG.md обновлен
- ✅ Git commit создан

📂 Структура проекта: ...

🎯 Что дальше: ...
```

### После финализации

**Структура проекта:**
```
your-project/
├── Init/                    # ✅ ЕДИНЫЙ ИСТОЧНИК ИСТИНЫ
│   ├── CLAUDE.md
│   ├── PROJECT_INTAKE.md
│   ├── SECURITY.md
│   ├── ARCHITECTURE.md
│   ├── BACKLOG.md
│   └── ...
├── archive/                 # Только для справки
│   ├── README.md
│   ├── MIGRATION_REPORT.md
│   ├── CONFLICTS_RESOLVED.md (если был)
│   ├── docs/...
│   ├── notes/...
│   └── other/...
└── src/                     # Код не изменен
```

**Что делать дальше:**
1. Прочитать обновленный CLAUDE.md
2. Использовать Init/ как единый источник истины
3. Обновлять документацию при изменениях
4. Использовать slash-команды для работы
5. Игнорировать archive/ (только для справки)

---

## Примеры миграции

### Пример 1: Проект с минимальной документацией

**До миграции:**
```
project/
├── README.md (200 строк - все вперемешку)
├── TODO.txt (список задач)
└── src/
```

**Процесс:**
1. `/migrate` - анализирует README.md и TODO.txt
2. Создает PROJECT_INTAKE.md из README.md
3. Создает BACKLOG.md из TODO.txt
4. Помечает SECURITY.md как [CRITICAL: NEEDS FILLING]
5. Предлагает модульную структуру на основе кода
6. ⏸️ Пауза
7. Пользователь заполняет SECURITY.md
8. `/migrate-finalize` - завершает

**После миграции:**
```
project/
├── Init/
│   ├── PROJECT_INTAKE.md (из README.md)
│   ├── SECURITY.md (заполнен вручную)
│   ├── ARCHITECTURE.md (из анализа кода)
│   ├── BACKLOG.md (из TODO.txt)
│   └── ...
├── archive/
│   ├── README.md
│   └── TODO.txt
└── src/
```

### Пример 2: Проект с обширной legacy документацией

**До миграции:**
```
project/
├── docs/
│   ├── README.md
│   ├── architecture.md
│   ├── api-reference.md
│   ├── deployment.md
│   └── security-notes.txt
├── notes/
│   ├── user-research.md
│   ├── design-decisions.md
│   └── tech-debt.md
├── TODO.md
└── src/
```

**Процесс:**
1. `/migrate` - анализирует все docs/ и notes/
2. Создает mapping:
   - docs/README.md → PROJECT_INTAKE.md (Problem/Solution)
   - docs/architecture.md → ARCHITECTURE.md (Tech Stack, Decisions)
   - docs/api-reference.md → ARCHITECTURE.md (API section)
   - docs/security-notes.txt → SECURITY.md
   - notes/user-research.md → PROJECT_INTAKE.md (User Personas)
   - notes/design-decisions.md → ARCHITECTURE.md (Key Decisions - WHY!)
   - notes/tech-debt.md → BACKLOG.md (Technical Debt section)
   - TODO.md → BACKLOG.md (Tasks)
3. Обнаруживает конфликт 🟡: дублирование API docs в разных местах
4. ⏸️ Пауза
5. Пользователь разрешает: оставить в ARCHITECTURE.md, удалить дубли
6. `/migrate-finalize` - завершает

**После миграции:**
```
project/
├── Init/
│   ├── PROJECT_INTAKE.md (из docs/README.md + notes/user-research.md)
│   ├── SECURITY.md (из docs/security-notes.txt)
│   ├── ARCHITECTURE.md (из docs/architecture.md + api-reference + notes/design-decisions)
│   ├── BACKLOG.md (из TODO.md + notes/tech-debt.md)
│   └── ...
├── archive/
│   ├── docs/...
│   ├── notes/...
│   └── TODO.md
└── src/
```

### Пример 3: Проект с противоречивой документацией

**До миграции:**
```
project/
├── README.md (описывает монолитную архитектуру)
├── docs/
│   └── new-architecture.md (план перехода на микросервисы)
├── TODO.md (старые задачи, многие уже сделаны)
└── src/ (реально код частично модульный)
```

**Процесс:**
1. `/migrate` - анализирует противоречия
2. Обнаруживает конфликты:
   - 🔴 Архитектура: README.md говорит монолит, new-architecture.md микросервисы, код модульный
   - 🟡 BACKLOG: TODO.md устарел
3. Создает CONFLICTS.md с детальным описанием
4. ⏸️ Пауза
5. Пользователь:
   - Анализирует реальный код: "Проанализируй src/ и определи реальную архитектуру"
   - Решает: "Мы используем модульный монолит, не микросервисы"
   - Обновляет ARCHITECTURE.md с реальностью
   - Обновляет BACKLOG.md со статусами: "Проверь какие задачи из TODO.md уже реализованы"
6. Удаляет CONFLICTS.md
7. `/migrate-finalize` - завершает

**После миграции:**
```
project/
├── Init/
│   ├── ARCHITECTURE.md (реальная модульная архитектура)
│   ├── BACKLOG.md (актуальные задачи с правильными статусами)
│   └── ...
├── archive/
│   ├── README.md (устаревший)
│   ├── docs/new-architecture.md (план который не реализован)
│   ├── TODO.md (устаревший)
│   └── MIGRATION_REPORT.md (как разрешили конфликты)
└── src/
```

---

## Решение проблем

### Проблема: "AI не нашел некоторые важные файлы"

**Решение:**
```
1. После /migrate проверьте MIGRATION_REPORT.md
2. Если файл не учтен:
   "Прочитай docs/important-file.md и добавь информацию в Init/PROJECT_INTAKE.md"
3. Вручную дополните Init/ файлы
4. Продолжите с /migrate-finalize
```

### Проблема: "Конфликтов слишком много, не знаю с чего начать"

**Решение через `/migrate-resolve`:**
```bash
/migrate-resolve
```

Эта команда:
- Проведет вас через каждый конфликт интерактивно
- Предложит конкретное решение для каждого
- Вы выбираете [A]вто/[M]ануально/[S]кип/[Q]выход
- Создает бэкапы и логи
- Можно выйти [Q] в любой момент и вернуться позже

**Ручное решение:**
```
1. Откройте CONFLICTS.md
2. Сосредоточьтесь только на 🔴 критичных
3. Разрешайте по одному:
   "Помоги разрешить критичный конфликт #1"
4. 🟡 и 🟢 можно отложить на потом
```

### Проблема: "SECURITY.md пустой, не знаю что писать"

**Решение:**
```
1. "Проанализируй код проекта на security patterns"
2. "Найди где используется auth, validation, sanitization"
3. "На основе анализа заполни SECURITY.md"
4. "Запусти /security для финального аудита"
5. Дополни вручную специфичные для проекта правила
```

### Проблема: "Legacy документация сильно устарела"

**Решение:**
```
1. Не копируйте слепо устаревшую информацию
2. "Проанализируй реальный код в src/ и обнови ARCHITECTURE.md"
3. "Сравни legacy TODO.md с кодом и обнови статусы в BACKLOG.md"
4. Используйте legacy как reference, но верьте коду
```

### Проблема: "Хочу откатить миграцию"

**Решение: Используйте `/migrate-rollback`**

```bash
/migrate-rollback
```

Эта команда автоматически:
- Определит статус миграции (до или после финализации)
- Восстановит legacy файлы из archive/
- Удалит или восстановит Init/
- Откатит git commit (если был)
- Создаст резервную копию на случай проблем

**Поддерживаемые сценарии:**

#### До финализации (после `/migrate`)
```
✅ Быстрый откат:
- Восстанавливает legacy из archive/
- Удаляет Init/, MIGRATION_REPORT.md, CONFLICTS.md
- Удаляет archive/ (опционально)
```

#### После финализации (после `/migrate-finalize`)
```
✅ Откат с git:
- Использует git revert для отката commit
- Восстанавливает legacy из archive/
- Удаляет или восстанавливает Init/ к pre-migration
- Создает rollback commit
```

**Безопасность:**
- ⚠️ Создается резервная копия в `.rollback_backup/`
- ⚠️ Запрашивает подтверждение перед действиями
- ⚠️ Можно прервать на любом этапе

**Ручной откат:**

Если команда не работает, см. детали в `.claude/commands/migrate-rollback.md`

### Проблема: "После миграции команда не знает где искать информацию"

**Решение:**
```
1. Проведите встречу команды
2. Покажите новую структуру Init/
3. Объясните:
   - Init/ - единый источник истины
   - archive/ - только для справки
   - Каждый файл имеет четкую цель
4. Создайте чек-лист "Где что искать":
   - Требования → PROJECT_INTAKE.md
   - Архитектура → ARCHITECTURE.md
   - Задачи → BACKLOG.md
   - Безопасность → SECURITY.md
5. Обновите onboarding документацию
```

---

## FAQ

### Q: Сколько времени занимает миграция?

**A:** Зависит от размера проекта:
- Маленький проект (1-3 legacy файла): 15-30 минут
- Средний проект (5-10 legacy файлов): 1-2 часа
- Большой проект (10+ legacy файлов): 2-4 часа

Большая часть времени - это ваша ручная проверка и заполнение пробелов.

### Q: Можно ли мигрировать постепенно?

**A:** Нет, миграция атомарная:
- Либо полностью мигрируете
- Либо не мигрируете вообще

Но после миграции можете постепенно улучшать Init/ файлы.

### Q: Что делать с legacy файлами после миграции?

**A:**
- НЕ удаляйте archive/ (история проекта)
- НЕ обновляйте файлы в archive/
- Используйте только для справки
- Init/ - единственный источник истины

### Q: Нужно ли мигрировать README.md?

**A:**
- Информация из README.md мигрирует в PROJECT_INTAKE.md
- Сам README.md остается (нужен для GitHub)
- После миграции обновите README.md используя README-TEMPLATE.md из Init/

### Q: Что если в проекте уже есть CLAUDE.md?

**A:**
- AI сохранит ваш существующий CLAUDE.md в archive/
- Создаст новый из шаблона
- Перенесет специфичные инструкции из старого
- Вы можете вручную дополнить после миграции

### Q: Безопасно ли удалять CONFLICTS.md?

**A:**
- Удаляйте только после разрешения ВСЕХ конфликтов
- /migrate-finalize перемещает его в archive/CONFLICTS_RESOLVED.md
- Не удаляйте вручную до финализации

### Q: Можно ли запустить /migrate несколько раз?

**A:**
- Нет, /migrate работает только один раз
- Если нужно перезапустить:
  1. Удалите Init/ и archive/
  2. Запустите /migrate снова
- После /migrate-finalize повторная миграция невозможна

### Q: Что делать если AI перенес информацию в неправильный файл?

**A:**
```
1. После /migrate (до финализации):
   - Вручную переместите информацию куда нужно
   - Обновите Init/ файлы
   - Продолжите с /migrate-finalize

2. После /migrate-finalize:
   - Просто отредактируйте Init/ файлы
   - Init/ - это обычные markdown файлы
   - Создайте коммит с исправлениями
```

### Q: Нужно ли обновлять CI/CD после миграции?

**A:** Возможно, если CI/CD использовал legacy файлы:
```yaml
# До миграции
- run: cat docs/version.txt

# После миграции
- run: cat Init/BACKLOG.md | grep "Current Version"
```

Проверьте все скрипты которые читали legacy файлы.

---

## Чек-лист успешной миграции

### Перед миграцией
- [ ] Проект в git
- [ ] Все изменения закоммичены
- [ ] Сделан бэкап (опционально)
- [ ] Init/ скопирован в проект
- [ ] Claude Code запущен

### После Этапа 1
- [ ] MIGRATION_REPORT.md прочитан
- [ ] Все legacy файлы учтены
- [ ] Mapping корректный
- [ ] Все 🔴 конфликты разрешены
- [ ] SECURITY.md заполнен
- [ ] PROJECT_INTAKE.md заполнен
- [ ] ARCHITECTURE.md актуален
- [ ] BACKLOG.md обновлен
- [ ] Нет [NEEDS FILLING] в критичных местах

### После Этапа 2
- [ ] /migrate-finalize выполнен
- [ ] Git commit создан
- [ ] Init/ - единый источник истины
- [ ] archive/ содержит всю историю
- [ ] Команда знает о новой структуре
- [ ] CI/CD обновлен (если нужно)

---

## Полезные команды

```bash
# Посмотреть migration report
cat archive/MIGRATION_REPORT.md

# Проверить что все legacy файлы в archive
ls -la archive/

# Сравнить Init/ с archive/
diff Init/ARCHITECTURE.md archive/docs/architecture.md

# Найти [NEEDS FILLING] в Init/
grep -r "NEEDS FILLING" Init/

# Проверить что нет секретов в Init/
grep -r "password\|api_key\|secret" Init/

# Посмотреть историю изменений
git log --oneline --follow Init/ARCHITECTURE.md
```

---

## Дополнительные ресурсы

- **CLAUDE.md** - главный файл контекста после миграции
- **PROJECT_INTAKE.md** - требования и цели проекта
- **ARCHITECTURE.md** - архитектура и технические решения
- **BACKLOG.md** - текущий статус и планы
- **SECURITY.md** - правила безопасности
- **archive/MIGRATION_REPORT.md** - детальный отчет о миграции

---

**Успешной миграции! 🚀**

Если возникли вопросы - создайте [Issue на GitHub](https://github.com/alexeykrol/claude-code-starter/issues)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
