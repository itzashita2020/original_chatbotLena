# Modules - Modular Architecture

## 📦 6 Independent Modules

### ⭐ Core Modules
1. **auth** - Authentication (GitHub OAuth via Supabase)
2. **chat** - Chat management ⭐ CORE

### 🔧 Supporting Modules
3. **ai** - OpenAI integration (GPT-4, streaming)
4. **user** - User profiles & settings

### 🌟 Unique Features
5. **export** - Export chats to JSON/Markdown/TXT 🌟
6. **search** - Full-text search across chats 🌟

---

## 🎯 Public API Pattern

### ✅ Правильное использование:

```typescript
// ✅ Импорт ТОЛЬКО через index.ts (Public API)
import { useAuth, AuthService, type User } from '@/modules/auth'
import { ChatService, type Chat } from '@/modules/chat'
```

### ❌ Неправильное использование:

```typescript
// ❌ НЕ импортировать напрямую из внутренних файлов!
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { ChatService } from '@/modules/chat/services/ChatService'
```

**Почему это важно?**
- ✅ Изоляция модулей - изменения внутри не влияют на другие модули
- ✅ Экономия токенов AI - при изменении одного модуля не нужно переписывать другие
- ✅ Clear API - понятно что экспортирует модуль

---

## 📁 Module Structure

Каждый модуль следует единой структуре:

```
module-name/
├── index.ts          # 🚪 PUBLIC API (единственный entry point)
├── types.ts          # TypeScript types
├── services/         # Business logic
│   └── ServiceName.ts
├── hooks/            # React hooks (если нужны)
│   └── useHookName.ts
└── components/       # React components (если нужны)
    └── ComponentName.tsx
```

---

## 🔄 Development Phases

| Module | Phase | Status |
|--------|-------|--------|
| auth | Phase 1.4 | 📋 Types created, waiting for implementation |
| user | Phase 1.4 | 📋 Types created, waiting for implementation |
| chat ⭐ | Phase 2 | 📋 Types created, waiting for implementation |
| ai | Phase 2 | 📋 Types created, waiting for implementation |
| export 🌟 | Phase 3 | 📋 Types created, waiting for implementation |
| search 🌟 | Phase 3 | 📋 Types created, waiting for implementation |

---

## 🎓 Module Usage Examples

### Auth Module (Phase 1.4)

```typescript
'use client'

import { useAuth } from '@/modules/auth'

export function LoginButton() {
  const { signInWithGithub, loading } = useAuth()

  return (
    <button onClick={signInWithGithub} disabled={loading}>
      Sign in with GitHub
    </button>
  )
}
```

### Chat Module (Phase 2)

```typescript
'use client'

import { useChat } from '@/modules/chat'

export function ChatList() {
  const { chats, loading } = useChat()

  if (loading) return <div>Loading...</div>

  return (
    <ul>
      {chats.map(chat => (
        <li key={chat.id}>{chat.title}</li>
      ))}
    </ul>
  )
}
```

### Export Module (Phase 3) 🌟

```typescript
'use client'

import { ExportService, type ExportFormat } from '@/modules/export'

async function exportChat(chatId: string, format: ExportFormat) {
  const result = await ExportService.exportChat(chatId, { format })
  // Download file...
}
```

---

## 🔐 Module Dependencies

```
auth ← (no dependencies)
  ↓
user ← auth
  ↓
chat ← auth, user, ai
  ↓
export ← chat
  ↓
search ← chat
```

**Правило:** Модули могут зависеть только от модулей выше по иерархии.

---

## 📝 Adding New Module

1. Create folder: `src/modules/new-module/`
2. Create files:
   - `types.ts` - TypeScript types
   - `index.ts` - Public API
   - `services/NewService.ts` - Business logic
3. Export only through `index.ts`
4. Update this README

---

## ✅ Current Status

**Phase 1.3: Module Structure** ✅ COMPLETED

- [x] 6 module folders created
- [x] TypeScript types for all modules
- [x] Public API (index.ts) for all modules
- [x] Module README

**Next:** Phase 1.4 - Auth Module implementation
