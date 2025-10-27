# File Attachments Setup Guide

Добавлена поддержка прикрепления файлов и картинок в чаты!

## Что было сделано

### 1. Database Migration ✅
- Создана таблица `message_attachments` для хранения метаданных файлов
- Файл миграции: `supabase/migrations/20251025_attachments.sql`

### 2. API Endpoint ✅
- `/api/upload` - загрузка файлов в Supabase Storage
- Поддерживаемые форматы: изображения, PDF, текстовые документы
- Максимальный размер файла: 10MB

### 3. UI Components ✅
- Обновлен `ChatInput` компонент с кнопкой прикрепления
- Превью прикрепленных файлов перед отправкой
- Возможность удалить файлы до отправки

## Что нужно настроить вручную

### Step 1: Применить SQL миграцию

1. Перейди в Supabase Dashboard → SQL Editor
2. Создай новый Query
3. Скопируй и вставь содержимое файла `supabase/migrations/20251025_attachments.sql`
4. Нажми "Run"

### Step 2: Создать Storage Bucket

1. Перейди в Supabase Dashboard → Storage
2. Нажми "New Bucket"
3. Параметры:
   - Name: `chat-attachments`
   - Public: ✅ Включить (для удобного доступа к изображениям)
4. Нажми "Create Bucket"

### Step 3: Настроить Storage Policies

В разделе Storage → chat-attachments → Policies:

#### Policy 1: INSERT (Upload)
- Name: "Authenticated users can upload"
- Allowed operation: INSERT
- Policy definition:
```sql
auth.role() = 'authenticated'
```

#### Policy 2: SELECT (View)
- Name: "Public can view files"
- Allowed operation: SELECT
- Policy definition:
```sql
true
```

#### Policy 3: DELETE (Remove)
- Name: "Users can delete own files"
- Allowed operation: DELETE
- Policy definition:
```sql
auth.uid()::text = (storage.foldername(name))[1]
```

### Step 4: Обновить ChatWindow для обработки файлов

Файл нужно обновить для интеграции загрузки файлов при отправке сообщения.

Найди `ChatWindow.tsx` и обнови логику отправки сообщения:

```typescript
const handleSendMessage = async (content: string, attachments?: File[]) => {
  if (!currentChat) return

  // Сначала создать сообщение
  const userMessage = await createMessage(currentChat.id, content)

  // Затем загрузить файлы
  if (attachments && attachments.length > 0) {
    for (const file of attachments) {
      await uploadAttachment(file, userMessage.id, currentChat.id)
    }
  }

  // Отправить в AI...
}

const uploadAttachment = async (file: File, messageId: string, chatId: string) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('messageId', messageId)
  formData.append('chatId', chatId)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload file')
  }

  return response.json()
}
```

### Step 5: Обновить отображение сообщений

В `ChatMessage.tsx` добавь отображение прикрепленных файлов:

1. Загружай attachments при получении сообщения
2. Отображай картинки как `<img>`
3. Для других файлов показывай ссылку для скачивания

## Поддерживаемые форматы

- 🖼️ Изображения: JPEG, PNG, GIF, WebP
- 📄 Документы: PDF, TXT, Markdown
- 📝 Office: DOC, DOCX

## Ограничения

- Максимальный размер файла: 10MB
- Множественная загрузка: да
- Формат хранения: `{user_id}/{chat_id}/{filename}`

## Структура БД

```sql
message_attachments
├── id (UUID)
├── message_id (UUID) → messages.id
├── file_name (TEXT)
├── file_type (TEXT) - MIME type
├── file_size (INTEGER) - bytes
├── storage_path (TEXT) - path in Storage
├── thumbnail_url (TEXT) - for images
├── width (INTEGER) - for images
├── height (INTEGER) - for images
├── metadata (JSONB)
└── created_at (TIMESTAMPTZ)
```

## Тестирование

1. Открой чат
2. Нажми на кнопку скрепки (📎) слева от поля ввода
3. Выбери файл(ы)
4. Увидишь превью прикрепленных файлов
5. Нажми "Send" для отправки

## Troubleshooting

### Ошибка: "Failed to upload file"
- Проверь что bucket `chat-attachments` создан
- Проверь Storage Policies

### Ошибка: "Unauthorized"
- Проверь что пользователь залогинен
- Проверь INSERT policy для Storage

### Файлы не отображаются
- Проверь SELECT policy для Storage
- Проверь что bucket настроен как Public

---

**Готово!** Теперь пользователи могут прикреплять файлы и картинки к сообщениям в чатах.
