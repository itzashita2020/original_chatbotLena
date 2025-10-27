---
description: Откатить миграцию на Claude Code Starter framework
---

# Откат миграции проекта

> Используйте эту команду для отката миграции на любом этапе

## ⚠️ ВАЖНО

Эта команда откатывает миграцию и восстанавливает legacy файлы.
Используйте осторожно!

**Поддерживаемые сценарии:**
1. Откат после `/migrate` (до финализации)
2. Откат после `/migrate-finalize` (после финализации)

---

## 📋 Процесс отката

### Шаг 1: Определить статус миграции

Проверить что существует:

```bash
# Проверить файлы миграции
ls -la MIGRATION_REPORT.md 2>/dev/null
ls -la CONFLICTS.md 2>/dev/null
ls -la archive/ 2>/dev/null

# Проверить git log на migration commit
git log -1 --grep="migrate" --oneline 2>/dev/null
```

**Определить статус:**

**Статус A: После /migrate (до финализации)**
- ✅ MIGRATION_REPORT.md существует (в корне)
- ✅ archive/ существует
- ✅ Init/ обновлен
- ❌ Нет migration commit в git

**Статус B: После /migrate-finalize**
- ✅ archive/MIGRATION_REPORT.md (в archive, не в корне)
- ✅ archive/ существует
- ✅ Init/ обновлен
- ✅ Migration commit в git log
- ✅ CLAUDE.md содержит migration notice

### Шаг 2: Предупреждение пользователю

Показать текущий статус и спросить подтверждение:

```
⚠️ ROLLBACK МИГРАЦИИ

Текущий статус: [Статус A или B]

Что будет сделано:
- Восстановлены legacy файлы из archive/
- Удалены Init/ файлы (или восстановлены к pre-migration состоянию)
- Удалены отчёты миграции
[- Откат git commit (если Статус B)]

⚠️ ВСЕ ИЗМЕНЕНИЯ В Init/ ФАЙЛАХ ПОСЛЕ МИГРАЦИИ БУДУТ ПОТЕРЯНЫ!

Вы уверены? (yes/no)
```

Если ответ не "yes" - остановить выполнение.

### Шаг 3: Сохранить резервную копию (опционально)

```bash
# Создать backup текущего состояния Init/
mkdir -p .rollback_backup
cp -r Init/ .rollback_backup/Init_$(date +%Y%m%d_%H%M%S)

echo "Резервная копия создана в .rollback_backup/"
```

### Шаг 4: Откат в зависимости от статуса

#### Для Статуса A (до финализации):

```bash
# 1. Восстановить legacy файлы из archive/
if [ -d "archive/docs" ]; then
  mkdir -p docs
  cp -r archive/docs/* docs/ 2>/dev/null || true
fi

if [ -d "archive/notes" ]; then
  mkdir -p notes
  cp -r archive/notes/* notes/ 2>/dev/null || true
fi

if [ -d "archive/other" ]; then
  cp -r archive/other/* . 2>/dev/null || true
fi

# 2. Восстановить корневые legacy файлы
for file in archive/*.md; do
  if [ -f "$file" ] && [ "$(basename $file)" != "README.md" ]; then
    cp "$file" .
  fi
done

# 3. Удалить Init/ (если это был новый проект)
# ИЛИ восстановить оригинальные Init/ файлы (если они были)
read -p "Удалить Init/ полностью? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  rm -rf Init/
else
  echo "Init/ оставлен как есть"
fi

# 4. Удалить файлы миграции
rm -f MIGRATION_REPORT.md
rm -f CONFLICTS.md

# 5. Удалить archive/
read -p "Удалить archive/? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  rm -rf archive/
else
  echo "archive/ оставлен для справки"
fi

echo "✅ Откат завершён (Статус A)"
```

#### Для Статуса B (после финализации):

```bash
# 1. Найти migration commit
MIGRATION_COMMIT=$(git log --grep="Finalize migration" --format="%H" -1)

if [ -z "$MIGRATION_COMMIT" ]; then
  echo "⚠️ Migration commit не найден"
  echo "Попробуйте откат вручную"
  exit 1
fi

echo "Найден migration commit: $MIGRATION_COMMIT"

# 2. Проверить что commit можно откатить
git show $MIGRATION_COMMIT --stat

read -p "Откатить этот commit? (yes/no) " -r
if [ "$REPLY" != "yes" ]; then
  echo "Откат отменён"
  exit 0
fi

# 3. Создать новый commit который откатывает миграцию
# (используем revert, не reset, чтобы сохранить историю)
git revert $MIGRATION_COMMIT --no-edit -m 1

# 4. Восстановить legacy файлы из archive/
# (они должны быть в git после revert)
if [ -d "archive/docs" ]; then
  mkdir -p docs
  cp -r archive/docs/* docs/ 2>/dev/null || true
fi

if [ -d "archive/notes" ]; then
  mkdir -p notes
  cp -r archive/notes/* notes/ 2>/dev/null || true
fi

if [ -d "archive/other" ]; then
  cp -r archive/other/* . 2>/dev/null || true
fi

# 5. Удалить Init/ или восстановить
read -p "Удалить Init/ полностью? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  rm -rf Init/
  git add -A
else
  # Восстановить оригинальные Init/ файлы до миграции
  git show $MIGRATION_COMMIT^:Init/ > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    git checkout $MIGRATION_COMMIT^ -- Init/
    echo "Init/ восстановлен к состоянию до миграции"
  fi
fi

# 6. Создать rollback commit
git add -A
git commit -m "$(cat <<'EOF'
chore: Rollback migration to Claude Code Starter framework

Reverted migration due to [REASON - fill in].

Restored:
- Legacy files from archive/
- Project to pre-migration state

Original migration commit: $MIGRATION_COMMIT

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

echo "✅ Откат завершён (Статус B) с git commit"
```

### Шаг 5: Проверка результата

```bash
# Показать текущее состояние
git status

# Показать структуру
ls -la

echo ""
echo "📊 Результат отката:"
echo ""
echo "Legacy файлы:"
find . -maxdepth 2 -name "*.md" -not -path "./Init/*" | head -10

echo ""
echo "Init/:"
ls -la Init/ 2>/dev/null || echo "Init/ удалён"

echo ""
echo "Git status:"
git log -3 --oneline
```

### Шаг 6: Финальный вывод

```
🎉 ОТКАТ МИГРАЦИИ ЗАВЕРШЁН!

✅ Что было сделано:
- Восстановлены legacy файлы из archive/
- [Init/ удалён / Init/ восстановлен к pre-migration]
- [Git commit откачен (Статус B)]
- Резервная копия создана в .rollback_backup/

📁 Текущая структура:
[показать tree или ls]

⚠️ Что дальше:

1. **Проверьте восстановленные файлы**
   - Убедитесь что всё на месте
   - Проверьте содержимое

2. **Если нужен Init/ обратно**
   - Можно скопировать из .rollback_backup/
   - Или запустить /migrate заново

3. **Удалите .rollback_backup/**
   - Когда убедитесь что всё в порядке:
   ```bash
   rm -rf .rollback_backup/
   ```

4. **archive/ директория**
   - [Оставлена для справки / Удалена]
   - Можно удалить вручную если не нужна

💡 Если хотите попробовать миграцию снова:
```bash
/migrate
```

---

Миграция успешно откачена. Проект вернулся к legacy состоянию.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

---

## 🔐 Безопасность

Перед откатом проверить:

### Данные
- [ ] Резервная копия создана
- [ ] archive/ существует и содержит legacy файлы
- [ ] Нет критичных изменений в Init/ которые нужно сохранить

### Git
- [ ] Все изменения закоммичены (если нужно их сохранить)
- [ ] Проверен список commit'ов которые будут откачены
- [ ] Понятны последствия revert

### Проект
- [ ] Команда знает об откате
- [ ] Никто не работает с Init/ файлами параллельно

---

## 🚫 Условия остановки

Остановить rollback если:

### Критичные условия:
- ❌ archive/ не существует или пуст
- ❌ archive/ не содержит legacy файлов
- ❌ Git имеет uncommitted changes которые будут потеряны
- ❌ Migration commit имеет зависимые commit'ы сверху

### Предупреждения (спросить пользователя):
- ⚠️ В Init/ есть изменения после миграции
- ⚠️ archive/ выглядит неполным
- ⚠️ Migration commit старше 1 дня

**В случае остановки:**
```
🛑 Rollback остановлен

Причина: [ОПИСАНИЕ]

Действия:
1. [Действие 1]
2. [Действие 2]
3. Попробуйте /migrate-rollback снова

Или выполните rollback вручную:
- Восстановите файлы из archive/
- Удалите Init/ (или восстановите к pre-migration)
- Откатите git commit: git revert [commit-hash]
```

---

## 💡 Ручной rollback

Если команда не работает, выполните вручную:

### Для Статуса A (до финализации):

```bash
# 1. Восстановить legacy
cp -r archive/docs/* docs/
cp -r archive/notes/* notes/
cp archive/other/* .

# 2. Удалить Init/
rm -rf Init/

# 3. Удалить отчёты
rm -f MIGRATION_REPORT.md CONFLICTS.md

# 4. Удалить archive/
rm -rf archive/
```

### Для Статуса B (после финализации):

```bash
# 1. Найти commit
git log --grep="Finalize migration" --oneline

# 2. Откатить
git revert [commit-hash] -m 1

# 3. Восстановить legacy
cp -r archive/docs/* docs/
cp -r archive/notes/* notes/
cp archive/other/* .

# 4. Удалить Init/
rm -rf Init/

# 5. Commit
git add -A
git commit -m "chore: Rollback migration"
```

---

## 📝 После отката

### Понять почему откатили

Документируйте причину:
- Что пошло не так?
- Какие конфликты не удалось разрешить?
- Что не понравилось в новой структуре?

### Решить продолжать или нет

**Если хотите попробовать снова:**
1. Исправьте проблемы в legacy перед миграцией
2. Подготовьте лучше (заполните больше информации)
3. Запустите `/migrate` снова

**Если останетесь с legacy:**
1. Продолжайте работать как раньше
2. Возможно, фреймворк не подходит для вашего проекта
3. Это нормально - не все проекты нуждаются в структурировании

---

## 🔍 Troubleshooting

### Проблема: "archive/ не найден"

**Причина:** archive/ был удалён или перемещён

**Решение:**
```bash
# Проверить git history
git log --all --full-history -- archive/

# Восстановить из git
git checkout [commit] -- archive/
```

### Проблема: "Не могу откатить git commit"

**Причина:** Есть конфликты или зависимые commit'ы

**Решение:**
```bash
# Вместо revert используйте reset (опасно!)
git reset --hard [commit-before-migration]

# Или откатите вручную без git
# и создайте новый commit с исправлениями
```

### Проблема: "Init/ содержит важные изменения"

**Причина:** После миграции были сделаны изменения

**Решение:**
```bash
# Сохраните изменения перед rollback
cp -r Init/ ../Init_backup_$(date +%Y%m%d)

# Затем выполните rollback

# После rollback можете выборочно восстановить
```

---

**Rollback - это не провал. Это безопасный способ вернуться назад если что-то не подошло.**

🤖 Generated with [Claude Code](https://claude.com/claude-code)
