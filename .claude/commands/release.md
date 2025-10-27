---
description: Создать релиз фреймворка Claude Code Starter
---

# Релиз фреймворка

> Используйте эту команду для создания нового релиза фреймворка с автоматическим обновлением версии, CHANGELOG, README и архивов.

## ⚠️ ВАЖНО

Эта команда предназначена **ТОЛЬКО для claude-code-starter проекта**.
Не используйте её в пользовательских проектах!

---

## 🎯 Что делает команда

1. **Анализирует изменения** с последнего релиза
2. **Определяет тип релиза** (patch/minor/major)
3. **Обновляет версию** во всех местах
4. **Обновляет CHANGELOG.md** с описанием изменений
5. **Обновляет README файлы** если нужно
6. **Пересобирает zip-архивы**
7. **Создает release commit**
8. **Пушит на GitHub**

---

## 📋 Процесс релиза

### Шаг 1: Определить текущую версию

```bash
# Прочитать текущую версию из README.md
grep "badge/version" README.md
```

Текущая версия в формате badge: `version-1.2.5`

### Шаг 2: Проанализировать изменения

```bash
# Получить все коммиты с последнего release коммита
git log --oneline --grep="chore: Bump version" -1
# Получить коммиты после последнего релиза
git log <last-release-commit>..HEAD --oneline
```

**Проанализировать коммиты:**
- Какие файлы изменены?
- Новые фичи или багфиксы?
- Breaking changes?
- Изменения в шаблонах (Init/, init_eng/)?

### Шаг 3: Определить тип релиза

**Спросить пользователя:**

```
🎯 Анализ изменений с последнего релиза:

Найдено коммитов: X
Основные изменения:
- [краткий список изменений из git log]

Какой тип релиза создать?

1. Patch (1.2.X) - багфиксы, документация, мелкие улучшения
2. Minor (1.X.0) - новые фичи, обратно совместимые изменения
3. Major (X.0.0) - breaking changes, крупный рефакторинг

Выберите [1/2/3]:
```

**Правила версионирования (Semantic Versioning):**

- **Patch (X.X.N):**
  - Исправления багов
  - Обновления документации
  - Мелкие улучшения без новых фич
  - Обновления зависимостей
  
- **Minor (X.N.0):**
  - Новые фичи
  - Новые команды (slash commands)
  - Новые секции в шаблонах
  - Обратно совместимые изменения
  - Улучшения существующих фич
  
- **Major (N.0.0):**
  - Breaking changes
  - Удаление deprecated функций
  - Изменение структуры файлов
  - Несовместимые изменения API

### Шаг 4: Вычислить новую версию

```bash
# Пример: текущая 1.2.5
# Patch: 1.2.6
# Minor: 1.3.0
# Major: 2.0.0

CURRENT_VERSION="1.2.5"
# Разобрать на major.minor.patch
# Инкрементировать нужную часть
# Сформировать NEW_VERSION
```

**Подтвердить у пользователя:**
```
Новая версия: ${NEW_VERSION}
Продолжить? [y/n]
```

### Шаг 5: Собрать информацию для CHANGELOG

**Для каждого коммита с последнего релиза:**

1. Прочитать commit message
2. Определить категорию:
   - `feat:` → Added
   - `fix:` → Fixed
   - `docs:` → Changed/Documentation
   - `refactor:` → Changed
   - `chore:` → (пропустить или Maintenance)
3. Извлечь ключевые изменения

**Сгруппировать по категориям:**
- Added (новые фичи)
- Fixed (исправления)
- Changed (изменения)
- Removed (удаления)
- Deprecated (устаревшее)

### Шаг 6: Создать CHANGELOG секцию

**Шаблон:**

```markdown
## [${NEW_VERSION}] - $(date +%Y-%m-%d)

### [Краткое описание релиза]

**Goal:** [Главная цель этого релиза]

### Added

- [Новая фича 1]
  - Описание
  - Файлы: Init/file.md, init_eng/file.md
- [Новая фича 2]

### Fixed

- [Исправление 1]
  - Проблема: [описание]
  - Решение: [описание]
- [Исправление 2]

### Changed

- [Изменение 1]
- [Изменение 2]

### Impact

**For Users:**
- ✅ [Польза 1]
- ✅ [Польза 2]

### Files Modified

**Templates:**
- Init/FILE.md (+X lines)
- init_eng/FILE.md (+X lines)

**Documentation:**
- README.md
- README_RU.md

**Archives:**
- init-starter.zip (recreated)
- init-starter-en.zip (recreated)

---
```

**Вставить в начало CHANGELOG.md** (после заголовка, перед последней версией)

### Шаг 7: Обновить версию в README файлах

**Файлы для обновления:**
1. README.md - строка с badge
2. README_RU.md - строка с badge

**Использовать Edit tool:**

```markdown
OLD:
[![Version](https://img.shields.io/badge/version-${CURRENT_VERSION}-orange.svg)]

NEW:
[![Version](https://img.shields.io/badge/version-${NEW_VERSION}-orange.svg)]
```

### Шаг 8: Проверить нужны ли обновления в README

**Спросить пользователя:**

```
Нужно ли обновить описание в README файлах?
(Например, добавить новую фичу в список "The Solution")

[y/n]
```

Если yes - предложить конкретные изменения на основе CHANGELOG.

### Шаг 9: Пересобрать zip-архивы

```bash
# Пересобрать оба архива
cd Init && zip -r ../init-starter.zip . -x "*.DS_Store"
cd ../init_eng && zip -r ../init-starter-en.zip . -x "*.DS_Store"
cd ..
ls -lh init-starter*.zip
```

### Шаг 10: Создать release commit

**Commit message шаблон:**

```
chore: Release v${NEW_VERSION}

Release v${NEW_VERSION} includes [краткое описание].

## Highlights:

[2-3 ключевых изменения]

## Changes in this commit:

### Version Updates
- README.md: ${CURRENT_VERSION} → ${NEW_VERSION}
- README_RU.md: ${CURRENT_VERSION} → ${NEW_VERSION}

### CHANGELOG.md
Added v${NEW_VERSION} entry documenting:
- [Категория 1]: [кратко]
- [Категория 2]: [кратко]

### Archives Recreated
- init-starter.zip (updated with all changes)
- init-starter-en.zip (updated with all changes)

[Если были изменения в README - описать]

## Impact:

[Ключевые метрики влияния]

See CHANGELOG.md for full details.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Создать коммит:**

```bash
git add CHANGELOG.md README.md README_RU.md init-starter.zip init-starter-en.zip

# Если были другие изменения - добавить их тоже
git add [other files if needed]

git commit -m "[message from template]"
```

### Шаг 11: Показать diff для проверки

```bash
git show HEAD --stat
```

**Подтвердить у пользователя:**
```
Коммит создан. Проверьте изменения выше.

Запушить на GitHub? [y/n]
```

### Шаг 12: Push на GitHub

```bash
git push origin main
```

### Шаг 13: Создать GitHub Release (опционально)

**Спросить пользователя:**
```
Создать GitHub Release?

Это создаст:
- Tag v${NEW_VERSION}
- Release страницу на GitHub
- Attach архивов к релизу

[y/n]
```

**Если yes:**

```bash
# Создать tag
git tag -a "v${NEW_VERSION}" -m "Release v${NEW_VERSION}"
git push origin "v${NEW_VERSION}"

# Создать GitHub Release с помощью gh CLI
gh release create "v${NEW_VERSION}" \
  --title "v${NEW_VERSION}" \
  --notes "[Извлечь из CHANGELOG.md секцию для этой версии]" \
  init-starter.zip \
  init-starter-en.zip
```

### Шаг 14: Финальный вывод

```
🎉 РЕЛИЗ v${NEW_VERSION} СОЗДАН УСПЕШНО!

✅ Что сделано:
- ✅ CHANGELOG.md обновлен
- ✅ Версия в README: ${CURRENT_VERSION} → ${NEW_VERSION}
- ✅ Архивы пересобраны
- ✅ Коммит создан и запушен
[- ✅ GitHub Release создан (если было)]

📊 Статистика:
- Коммитов с последнего релиза: X
- Файлов изменено: Y
- Тип релиза: [Patch/Minor/Major]

🔗 Ссылки:
- Commit: https://github.com/alexeykrol/claude-code-starter/commit/[hash]
[- Release: https://github.com/alexeykrol/claude-code-starter/releases/tag/v${NEW_VERSION}]

📋 Следующие шаги:
- Проверьте CHANGELOG.md на GitHub
- Проверьте что версия обновилась в README
- При необходимости обновите описание релиза на GitHub

---

Релиз v${NEW_VERSION} готов к использованию! 🚀
```

---

## 🚫 Условия остановки

Остановить релиз если:

### Критические условия:
- ❌ Нет новых коммитов с последнего релиза
- ❌ Working directory не чист (uncommitted changes)
- ❌ Не в папке claude-code-starter
- ❌ Нет прав на push

### Предупреждения (спросить пользователя):
- ⚠️ Очень мало изменений (1-2 тривиальных коммита)
- ⚠️ Нет тестов новых фич
- ⚠️ Документация не обновлена для новых фич

**В случае остановки:**
```
🛑 Релиз остановлен

Причина: [ОПИСАНИЕ]

Действия для продолжения:
1. [Действие 1]
2. [Действие 2]
3. Запустите /release снова
```

---

## 💡 Советы

### Хорошие практики релизов:

1. **Регулярность:**
   - Patch релизы: как только исправлен баг
   - Minor релизы: каждые 1-2 недели для новых фич
   - Major релизы: редко, только для breaking changes

2. **Качество CHANGELOG:**
   - Пишите для пользователей, не для разработчиков
   - Объясняйте ЗАЧЕМ, а не только ЧТО
   - Включайте примеры влияния ("saves 60% tokens")
   - Добавляйте migration path для breaking changes

3. **Коммуникация:**
   - Announce в Issues/Discussions для major релизов
   - Highlight breaking changes
   - Provide upgrade guide

---

## 🔄 Интеграция с другими командами

- После `/feature` → Может понадобиться minor релиз
- После `/fix` → Может понадобиться patch релиз
- После рефакторинга → Проверить нужен ли релиз

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
