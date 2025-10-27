---
description: Финализация миграции на Claude Code Starter framework
---

# Финализация миграции проекта

> Используйте эту команду для завершения миграции после проверки и разрешения всех конфликтов

## ⚠️ ВАЖНО

Эта команда выполняет **Этап 2** (финализация).
Перед запуском убедитесь, что:
- ✅ Прочитали MIGRATION_REPORT.md
- ✅ Разрешили все критичные конфликты из CONFLICTS.md
- ✅ Проверили все Init/ файлы на полноту
- ✅ Заполнили секции помеченные [NEEDS FILLING]

---

## 📋 Процесс финализации (Этап 2)

### Шаг 1: Предварительные проверки

Перед финализацией проверить:

```bash
# Проверить существование обязательных файлов
ls -la MIGRATION_REPORT.md
ls -la archive/

# Проверить Init/ файлы
ls -la Init/
```

**Обязательные условия:**
- [ ] MIGRATION_REPORT.md существует
- [ ] archive/ создан и содержит legacy файлы
- [ ] Init/ файлы заполнены
- [ ] Конфликты разрешены (CONFLICTS.md удален или пуст)

### Шаг 2: Проверка критичных файлов

Прочитать и проверить:

#### SECURITY.md
- [ ] Не содержит [CRITICAL: NEEDS FILLING]
- [ ] Все секции заполнены
- [ ] Security practices задокументированы

**Если SECURITY.md не заполнен:**
```
🔴 КРИТИЧЕСКАЯ ОШИБКА:
SECURITY.md должен быть полностью заполнен перед финализацией.
Это не опциональный файл!

Действия:
1. Заполните все секции SECURITY.md
2. Запустите /security для аудита
3. Вернитесь к /migrate-finalize
```

#### PROJECT_INTAKE.md
- [ ] Problem/Solution/Value заполнены
- [ ] User Personas созданы (минимум 1)
- [ ] User Flows описаны
- [ ] Features перечислены
- [ ] Modular Structure спланирована

**Если критичные секции не заполнены:**
```
⚠️ ПРЕДУПРЕЖДЕНИЕ:
PROJECT_INTAKE.md содержит незаполненные критичные секции.
Рекомендуется заполнить перед финализацией.

Продолжить? (y/n)
```

#### ARCHITECTURE.md
- [ ] Tech Stack актуален
- [ ] Folder Structure отражает реальность
- [ ] Module Architecture спланирован
- [ ] Key Decisions задокументированы

#### BACKLOG.md
- [ ] Статусы задач актуальны
- [ ] Приоритеты расставлены

### Шаг 3: Проверка конфликтов

```bash
# Проверить существует ли CONFLICTS.md
if [ -f "CONFLICTS.md" ]; then
  echo "⚠️ CONFLICTS.md все еще существует"
  echo "Прочитайте его и убедитесь что все конфликты разрешены"
fi
```

**Если CONFLICTS.md существует:**
1. Прочитать файл
2. Проверить что все критичные (🔴) конфликты разрешены
3. Спросить пользователя: "Все конфликты разрешены? (y/n)"
4. Если да - продолжить
5. Если нет - остановить и попросить разрешить

### Шаг 4: Финализация документов

#### Переместить MIGRATION_REPORT.md в archive/

```bash
# Добавить финальную секцию в MIGRATION_REPORT.md
cat >> MIGRATION_REPORT.md << 'EOF'

---

## ✅ Migration Finalized

**Date:** [DATE]
**Status:** COMPLETE

### Final Actions:
- All conflicts resolved
- All critical sections filled
- Init/ declared as single source of truth
- MIGRATION_REPORT.md archived

### Verification:
- [x] SECURITY.md complete
- [x] PROJECT_INTAKE.md complete
- [x] ARCHITECTURE.md complete
- [x] BACKLOG.md current
- [x] All conflicts resolved

Migration to Claude Code Starter framework v1.0 successfully completed.

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF

# Переместить в archive
mv MIGRATION_REPORT.md archive/
```

#### Удалить CONFLICTS.md (если существует и разрешен)

```bash
if [ -f "CONFLICTS.md" ]; then
  mv CONFLICTS.md archive/CONFLICTS_RESOLVED.md
fi
```

### Шаг 5: Обновить PROJECT_INTAKE.md Migration Status

**КРИТИЧНО:** Пометить проект как мигрированный для протокола Cold Start!

```bash
# Получить текущую дату
CURRENT_DATE=$(date +%Y-%m-%d)

# Обновить Migration Status в PROJECT_INTAKE.md
# Заменить: **Migration Status:** [NOT MIGRATED]
# На: **Migration Status:** ✅ COMPLETED (2025-01-12)
```

**Используя Edit tool:**

```markdown
OLD:
**Status:** ✅ FILLED
**Migration Status:** [NOT MIGRATED]
**Last Updated:** [DATE]

NEW:
**Status:** ✅ FILLED
**Migration Status:** ✅ COMPLETED ($CURRENT_DATE)
**Last Updated:** $CURRENT_DATE
```

**Зачем это нужно:**
- При следующем "cold start" AI НЕ будет читать MIGRATION_REPORT.md
- Экономия токенов: ~5k токенов при каждой перезагрузке
- См. CLAUDE.md → "🔄 Протокол Cold Start"

### Шаг 6: Обновить CLAUDE.md

Добавить в начало CLAUDE.md секцию о миграции:

```markdown
---

## 📝 Migration Notice

> This project was migrated to Claude Code Starter framework v1.0 on [DATE]

**Archive location:** `archive/`
**Migration report:** `archive/MIGRATION_REPORT.md`
**Framework version:** v1.0

**Single source of truth is now Init/ folder.**
Legacy documentation archived for reference only.

---
```

### Шаг 7: Обновить BACKLOG.md

Добавить в начало BACKLOG.md:

```markdown
## 🎯 Recent Updates

### [DATE] - Migrated to Claude Code Starter v1.0
**Status:** ✅ Complete
**Description:** Successfully migrated legacy documentation to structured framework
**Details:**
- All legacy files archived to `archive/`
- Documentation restructured to Init/ framework
- Single source of truth established
- See `archive/MIGRATION_REPORT.md` for full report

---
```

### Шаг 8: Создать Git commit

```bash
# Проверить статус
git status

# Добавить Init/ файлы
git add Init/

# Добавить archive/
git add archive/

# Добавить удаленные legacy файлы (если были в git)
git add -A

# Создать коммит
git commit -m "$(cat <<'EOF'
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
EOF
)"

# Показать результат
git log -1 --stat
```

### Шаг 9: Финальный вывод

После завершения вывести:

```
🎉 МИГРАЦИЯ ЗАВЕРШЕНА УСПЕШНО!

✅ Финализация выполнена:
- ✅ MIGRATION_REPORT.md архивирован
- ✅ CONFLICTS.md обработан (если был)
- ✅ CLAUDE.md обновлен с migration notice
- ✅ BACKLOG.md обновлен
- ✅ Git commit создан

📂 Структура проекта:

project/
├── Init/                    # ✅ ЕДИНЫЙ ИСТОЧНИК ИСТИНЫ
│   ├── CLAUDE.md           (updated)
│   ├── PROJECT_INTAKE.md   (migrated)
│   ├── SECURITY.md         (migrated)
│   ├── ARCHITECTURE.md     (migrated)
│   ├── BACKLOG.md          (updated)
│   └── ...
├── archive/                 # Исторические файлы
│   ├── README.md
│   ├── MIGRATION_REPORT.md
│   └── legacy files...
└── src/                     # Код без изменений

🎯 Что дальше:

1. **Прочитайте обновленный CLAUDE.md**
   - Он теперь ваш главный гайд
   - Содержит migration notice

2. **Используйте Init/ как единый источник истины**
   - PROJECT_INTAKE.md - для требований
   - ARCHITECTURE.md - для архитектуры
   - BACKLOG.md - для статуса задач
   - SECURITY.md - для безопасности

3. **Archive/ только для справки**
   - НЕ обновляйте файлы в archive/
   - Обращайтесь только при необходимости

4. **Обновляйте документацию при изменениях**
   - После каждого спринта обновляйте BACKLOG.md
   - При архитектурных изменениях обновляйте ARCHITECTURE.md
   - При новых паттернах обновляйте AGENTS.md

5. **Используйте slash-команды**
   - /commit - для коммитов
   - /pr - для Pull Requests
   - /security - для аудита безопасности
   - /feature - для новых фич
   - /db-migrate - для миграций БД

📚 Полезные команды:

# Посмотреть migration report
cat archive/MIGRATION_REPORT.md

# Проверить структуру Init/
ls -la Init/

# Начать работу с фреймворком
claude

💡 Рекомендации:

1. **Познакомьте команду с новой структурой**
   - Покажите где теперь искать информацию
   - Объясните что Init/ - единый источник истины

2. **Обновите CI/CD если нужно**
   - Если CI/CD ссылался на старые файлы - обновите пути

3. **Сделайте review documentation**
   - Через неделю проверьте что все используют новую структуру
   - Дополните документацию по необходимости

---

Миграция на Claude Code Starter framework v1.0 завершена!
Теперь ваш проект использует структурированную мета-документацию.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

---

## 🔐 Финальные проверки

Перед завершением убедиться:

### Структура
- [ ] Init/ содержит все обязательные файлы
- [ ] archive/ содержит все legacy файлы
- [ ] archive/README.md создан
- [ ] archive/MIGRATION_REPORT.md существует

### Документация
- [ ] CLAUDE.md содержит migration notice
- [ ] BACKLOG.md обновлен
- [ ] SECURITY.md полностью заполнен
- [ ] PROJECT_INTAKE.md заполнен

### Git
- [ ] Коммит создан
- [ ] Все изменения включены в коммит
- [ ] Commit message описательный

---

## 🚫 Условия остановки

Остановить финализацию если:

### Критичные условия:
- ❌ SECURITY.md не заполнен
- ❌ MIGRATION_REPORT.md не существует
- ❌ archive/ не создан
- ❌ Init/ файлы не заполнены

### Предупреждения (спросить пользователя):
- ⚠️ CONFLICTS.md существует
- ⚠️ PROJECT_INTAKE.md содержит много [NEEDS FILLING]
- ⚠️ ARCHITECTURE.md не полный

**В случае остановки:**
```
🛑 Финализация остановлена

Причина: [ОПИСАНИЕ]

Действия для продолжения:
1. [Действие 1]
2. [Действие 2]
3. Запустите /migrate-finalize снова
```

---

## 💡 Rollback (если что-то пошло не так)

Если во время финализации произошла ошибка:

```bash
# Откатить последний коммит (если был создан)
git reset --soft HEAD~1

# Восстановить MIGRATION_REPORT.md
mv archive/MIGRATION_REPORT.md ./ 2>/dev/null || true

# Восстановить CONFLICTS.md
mv archive/CONFLICTS_RESOLVED.md ./CONFLICTS.md 2>/dev/null || true

echo "Rollback выполнен. Исправьте проблемы и запустите /migrate-finalize снова"
```

---

## 📝 Post-Migration Checklist

После успешной финализации:

### Immediate (сразу)
- [ ] Прочитать CLAUDE.md
- [ ] Проверить что все файлы в Init/ актуальны
- [ ] Убедиться что команда знает о новой структуре

### Week 1 (первая неделя)
- [ ] Обновить BACKLOG.md после первого спринта
- [ ] Дополнить AGENTS.md новыми паттернами
- [ ] Проверить что все используют Init/ как источник истины

### Week 2-4 (2-4 недели)
- [ ] Review documentation - все ли актуально?
- [ ] Дополнить ARCHITECTURE.md если были изменения
- [ ] Обновить README.md проекта если нужно

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
