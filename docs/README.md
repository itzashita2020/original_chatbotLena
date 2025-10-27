# Projekt Lena1 - AI Chat Bot

**Version:** 2.0.0 (Modular Monolith)
**Last Updated:** 2025-10-23

Учебное веб-приложение AI чат-бота с уникальными возможностями организации истории диалогов, экспорта чатов в файлы и полнотекстового поиска по всем разговорам. Построено на модульной архитектуре для экономии токенов при разработке с AI-агентами.

---

## 📚 Documentation

### For Developers & AI Agents
- **[CLAUDE.md](CLAUDE.md)** - 🤖 **AUTO-LOADED** - Context for Claude Code (always read first!)
- **[PROJECT_INTAKE.md](PROJECT_INTAKE.md)** - ⭐ **START HERE** - Project requirements and context
- **[TECHNICAL_SPECIFICATION.md](TECHNICAL_SPECIFICATION.md)** - 📋 Technical specification (v2.0, modular architecture)
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and technical decisions
- **[BACKLOG.md](BACKLOG.md)** - Implementation status and roadmap (**SINGLE SOURCE OF TRUTH**)
- **[PROJECT_SNAPSHOT.md](PROJECT_SNAPSHOT.md)** - Quick overview of current status
- **[SECURITY.md](SECURITY.md)** - 🔐 **CRITICAL** - Security requirements
- **[WORKFLOW.md](WORKFLOW.md)** - Development workflows and sprint processes

### Quick Start for AI Agents
1. Read [CLAUDE.md](CLAUDE.md) - **Auto-loaded context** for Claude Code
2. Read [PROJECT_INTAKE.md](PROJECT_INTAKE.md) - Essential project context (User Personas, User Flows)
3. Read [BACKLOG.md](BACKLOG.md) - Current status and priorities (Phase 0 completed, ready for Phase 1)
4. Read [ARCHITECTURE.md](ARCHITECTURE.md) - Modular architecture (6 modules)
5. Read [SECURITY.md](SECURITY.md) - **Read before ANY coding!**

---

## ✨ Features

### Core Features
- 📋 **GitHub OAuth Authentication** - Secure login via Supabase Auth
- 💬 **AI Chat Interface** - Real-time conversation with GPT-4 (streaming responses)
- 💾 **Chat History** - Persistent storage of all conversations in PostgreSQL

### 🌟 Unique Features (Differentiators)
- 📥 **Export to Files** - Export any chat to JSON, Markdown, or TXT format
- 🔍 **Full-text Search** - Search across all your conversations
- 🏷️ **Chat Organization** - Categories, tags, favorites, and custom metadata

### Additional Features
- 📊 **Usage Statistics** - Track your AI usage (tokens, messages, costs)
- ⚙️ **User Settings** - Customize theme, language, AI parameters
- 🎨 **Modern UI** - Clean interface with Tailwind CSS + Radix UI

**Legend:**
- ✅ Completed (Phase 0: Documentation)
- 📋 Planned (Phase 1-4: Development, ~219 hours)

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router) + React 18
- **Language:** TypeScript 5.x (strict mode)
- **Styling:** Tailwind CSS 3.x + Radix UI
- **State:** Zustand 4.x
- **Icons:** Lucide React

### Backend & Infrastructure
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth (GitHub OAuth)
- **AI:** OpenAI API (GPT-4, streaming)
- **API:** Next.js API Routes + Server Actions
- **Hosting:** localhost:3000 (MVP) → Vercel (production)

### Testing
- **Unit:** Vitest
- **Integration:** Testing Library
- **E2E:** Playwright

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed technical decisions and reasoning.

---

## 🏗️ Architecture

**Modular Monolith** - 6 independent modules inside a single Next.js application:

```
projekt-lena1/
├── app/               # Next.js App Router (routes, pages)
├── src/
│   ├── modules/       # 🎯 6 CORE MODULES
│   │   ├── auth/      # Authentication (GitHub OAuth)
│   │   ├── user/      # User profiles & settings
│   │   ├── chat/      # Chat management ⭐ CORE
│   │   ├── ai/        # OpenAI integration
│   │   ├── export/    # Export to files 🌟 UNIQUE
│   │   └── search/    # Full-text search 🌟 UNIQUE
│   ├── components/    # Shared UI components
│   ├── lib/           # Utilities (Supabase, OpenAI clients)
│   └── store/         # Zustand state management
└── supabase/          # Database migrations
```

**Why Modular Architecture?**
- ✅ **Token efficiency** - Change one module without rewriting others
- ✅ **Clear boundaries** - Each module has public API (`index.ts`)
- ✅ **Isolation** - Internal changes don't cascade
- ✅ **Educational** - Easy to understand and maintain

See [ARCHITECTURE.md](ARCHITECTURE.md) for full structure and design decisions.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([download](https://nodejs.org/))
- npm or pnpm
- Git
- GitHub account (for OAuth)
- Supabase account (free tier: [supabase.com](https://supabase.com))
- OpenAI API key ([platform.openai.com](https://platform.openai.com))

### Installation

**⚠️ Note:** Project is currently in **Phase 0 (Documentation)**. Development starts in Phase 1.

When development begins (Phase 1+):

```bash
# 1. Clone repository
git clone [repo-url]
cd projekt-lena1

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_ANON_KEY, OPENAI_API_KEY

# 4. Run Supabase migrations
npx supabase db push

# 5. Start development server
npm run dev

# 6. Open browser
# http://localhost:3000
```

### Environment Variables

Create `.env.local` file:

```bash
# Supabase (https://app.supabase.com → Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]

# OpenAI (https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-[your-api-key]

# GitHub OAuth (Supabase → Authentication → Providers → GitHub)
# Configure in Supabase Dashboard
```

---

## 📅 Development Status

**Current Phase:** Phase 0 - Documentation ✅ (Completed 2025-10-23)

**Next Phase:** Phase 1 - Foundation 📋 (Week 1-2, ~41 hours)

**Overall Progress:** 0% (0/4 development phases completed)

See [BACKLOG.md](BACKLOG.md) for detailed implementation plan.

### Development Phases

| Phase | Name | Duration | Status |
|-------|------|----------|--------|
| Phase 0 | Documentation | 1 day | ✅ COMPLETED |
| Phase 1 | Foundation | Week 1-2 (~41h) | 📋 NOT STARTED |
| Phase 2 | Core Chat | Week 3-4 (~62h) | 📋 NOT STARTED |
| Phase 3 | Unique Features | Week 5-6 (~56h) | 📋 NOT STARTED |
| Phase 4 | Polish & Testing | Week 7-8 (~60h) | 📋 NOT STARTED |

**Total Estimated Time:** ~219 hours (7-8 weeks)

---

## 🎯 Project Goals

### Educational Goals
- Learn Next.js 14 (App Router, Server Components)
- Practice modular architecture patterns
- Integrate with third-party APIs (Supabase, OpenAI)
- Implement real-time features (streaming AI responses)
- Work with AI-assisted development (Claude Code)

### Product Goals
- Create ChatGPT alternative with **unique features**:
  - 🌟 Export conversations to files
  - 🌟 Search across all chats
  - 🌟 Organize chats with categories/tags
- Deploy working MVP on localhost:3000
- Optionally: Deploy to Vercel for public access

---

## 👥 User Personas

**Target Users:** Students, Junior Developers, Self-taught Developers

See [PROJECT_INTAKE.md](PROJECT_INTAKE.md) for detailed User Personas and User Flows.

---

## 🔐 Security

- ✅ GitHub OAuth (no passwords stored)
- ✅ Supabase Row Level Security (RLS)
- ✅ Environment variables (never committed)
- ✅ Input validation (Zod schemas)
- ✅ TypeScript strict mode

See [SECURITY.md](SECURITY.md) for complete security requirements.

---

## 🤝 Contributing

This is an educational project. Contributions are welcome!

1. Read [WORKFLOW.md](WORKFLOW.md) for development process
2. Check [BACKLOG.md](BACKLOG.md) for available tasks
3. Follow [ARCHITECTURE.md](ARCHITECTURE.md) patterns
4. Write tests for new features

---

## 📄 License

[Specify license - MIT, Apache 2.0, etc.]

---

## 🙏 Acknowledgments

- **Claude Code** - AI-assisted development
- **Next.js** - Full-stack React framework
- **Supabase** - Backend as a Service
- **OpenAI** - GPT-4 API
- **Vercel** - Hosting platform

---

*Built with 🤖 AI assistance (Claude Code) and modular architecture for token efficiency*
