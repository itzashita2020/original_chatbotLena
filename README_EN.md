# 🤖 AI Chat Application

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai)

**Modern web application for chatting with AI assistant powered by GPT-4/GPT-4o**

[Русская версия](README.md) · [Demo](#) · [Documentation](docs/) · [Report Bug](../../issues)

</div>

---

## ✨ Features

### 🎯 Core Features
- **💬 AI Chat with GPT-4/4o** - Intelligent conversations with real-time streaming responses (Server-Sent Events)
- **🔐 Secure Authentication** - Email/Password and GitHub OAuth via Supabase Auth
- **💾 Conversation History** - All conversations stored in PostgreSQL with Row Level Security
- **📱 Responsive Interface** - Fully responsive design for desktop, tablet, and mobile
- **🔒 Personal API Keys** - Each user uses their own OpenAI API key (secure, no shared costs)

### 🌟 Unique Capabilities

#### 📎 File Upload (6 formats)
- **🖼️ Images** - PNG, JPG, GIF, WebP (analysis via GPT-4o Vision)
- **📄 Documents** - PDF, DOCX (text extraction)
- **📊 Data** - CSV, JSON (parsing and analysis)
- **📝 Text** - TXT, Markdown, HTML
- **🔍 OCR** - Automatic text recognition on scans via Tesseract.js

#### 📥 Chat Export (4 formats)
- **📕 PDF** - Beautifully formatted document with metadata
- **💾 JSON** - Complete chat dump with all data
- **📝 Markdown** - Universal text format
- **📄 TXT** - Plain text file

#### 🔍 Search & Organization
- **Full-text search** - Across all chats with highlighting
- **Rename chats** - Convenient history management
- **Delete chats** - With cascading message deletion
- **📊 Statistics** - Track tokens, messages, costs

---

## 🚀 Quick Start

### Requirements

- **Node.js** 18+ ([download](https://nodejs.org/))
- **Supabase Account** (free tier) - [supabase.com](https://supabase.com)
- **OpenAI API Key** - [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/AlenaArtamonava/ai-chat-app.git
cd ai-chat-app

# 2. Install dependencies
cd app
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Fill in ONLY Supabase credentials
# OpenAI API key NOT NEEDED (each user adds their own via Settings)

# 4. Start application
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Supabase Setup

#### 1. Create Supabase Project
1. Go to [app.supabase.com](https://app.supabase.com)
2. Create new project
3. Copy `Project URL` and `anon public` key

#### 2. Run Database Migrations

Open **SQL Editor** in Supabase and execute all scripts from `supabase/migrations/` folder:

<details>
<summary>📋 Show SQL migrations</summary>

**1. Core Tables** (`supabase/migrations/20241027_initial_schema.sql`):
```sql
-- Chats table
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Chat',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_used INTEGER,
  model TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attachments table
CREATE TABLE message_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_chats_updated_at ON chats(updated_at DESC);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_message_attachments_message_id ON message_attachments(message_id);

-- Row Level Security
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

-- Access policies (users see only their data)
CREATE POLICY "Users can view own chats" ON chats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats" ON chats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats" ON chats
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages in own chats" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in own chats" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view attachments in own chats" ON message_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN chats c ON c.id = m.chat_id
      WHERE m.id = message_attachments.message_id
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert attachments in own chats" ON message_attachments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN chats c ON c.id = m.chat_id
      WHERE m.id = message_attachments.message_id
      AND c.user_id = auth.uid()
    )
  );
```

**2. User Settings** (`supabase/migrations/20251027_user_settings.sql`):
```sql
-- User settings table (personal API keys)
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  openai_api_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fast lookup index
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Access policies
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);
```

</details>

#### 3. Configure Storage (for file uploads)

1. Go to **Storage** → **Create Bucket**
2. Create bucket named `chat-attachments`
3. Configure access policies:

```sql
-- Allow users to upload files to their folder
CREATE POLICY "Users can upload own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'chat-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to read their files
CREATE POLICY "Users can view own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'chat-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## 🛠️ Tech Stack

<table>
<tr>
<td width="50%" valign="top">

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript 5** - Typed JavaScript
- **Tailwind CSS** - Utility-first CSS
- **Radix UI** - Accessible UI components
- **React Markdown** - Markdown rendering
- **Zustand** - State management

</td>
<td width="50%" valign="top">

### Backend & Infrastructure
- **Supabase** - PostgreSQL + Auth + Storage + RLS
- **OpenAI API** - GPT-4, GPT-4o (vision) models
- **Next.js API Routes** - Serverless endpoints
- **Server-Sent Events** - Real-time streaming responses
- **pdf2json** - PDF parsing
- **mammoth** - DOCX parsing
- **Tesseract.js** - OCR for scans

</td>
</tr>
</table>

---

## 📁 Project Structure

```
Projekt_Lena1/
├── app/                           # Next.js application
│   ├── src/
│   │   ├── app/                   # App Router
│   │   │   ├── api/               # API endpoints
│   │   │   │   ├── ai/stream/     # 🔥 AI streaming (SSE)
│   │   │   │   ├── chats/         # Chat CRUD
│   │   │   │   ├── upload/        # File upload (6 formats)
│   │   │   │   ├── export/        # Export (PDF/JSON/MD/TXT)
│   │   │   │   ├── search/        # Full-text search
│   │   │   │   └── settings/      # User settings
│   │   │   ├── (auth)/            # Authentication pages
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   └── (dashboard)/       # Main page
│   │   │       └── settings/      # Settings page
│   │   ├── components/            # React components
│   │   │   ├── ui/                # Reusable UI components
│   │   │   └── layout/            # Layout components
│   │   ├── modules/               # 🎯 Modular architecture
│   │   │   ├── ai/                # OpenAI integration
│   │   │   ├── auth/              # Authentication
│   │   │   ├── chat/              # Chat services & components
│   │   │   ├── export/            # Export to 4 formats
│   │   │   ├── search/            # Chat search
│   │   │   └── upload/            # File upload
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── lib/                   # Utilities & configs
│   │   │   └── supabase/          # Supabase clients
│   │   └── store/                 # Zustand stores
│   └── public/                    # Static files
├── supabase/
│   └── migrations/                # SQL migrations
│       ├── 20241027_initial_schema.sql
│       └── 20251027_user_settings.sql
└── docs/                          # Documentation
    ├── QUICKSTART.md
    ├── ARCHITECTURE.md
    ├── API.md
    └── DEPLOYMENT.md
```

---

## 🔌 API Endpoints

### Authentication
```
GET  /auth/callback          # OAuth callback
```

### Chats
```
GET    /api/chats             # Get all user chats
POST   /api/chats             # Create new chat
GET    /api/chats/[id]        # Get chat by ID
PUT    /api/chats/[id]        # Update chat (rename)
DELETE /api/chats/[id]        # Delete chat
GET    /api/chats/[id]/messages # Get all chat messages
```

### AI & Messages
```
POST /api/ai/stream           # 🔥 Streaming AI response (SSE)
                              # Supports: text, images, documents
                              # Automatic model selection (gpt-4o for vision)
```

### Files
```
POST /api/upload              # Upload file
                              # Supported formats:
                              # - Images: PNG, JPG, GIF, WebP
                              # - Documents: PDF, DOCX
                              # - Data: CSV, JSON
                              # - Text: TXT, MD, HTML
                              # Automatic OCR for scans
```

### Export
```
GET  /api/export/[id]?format=pdf   # Export chat to PDF
GET  /api/export/[id]?format=json  # Export chat to JSON
GET  /api/export/[id]?format=md    # Export chat to Markdown
GET  /api/export/[id]?format=txt   # Export chat to TXT
```

### Search
```
GET /api/search?q=query       # Full-text search across all chats
```

### Settings
```
GET  /api/settings            # Get user settings
POST /api/settings            # Save OpenAI API key
```

---

## ⚙️ Environment Variables

Create file `app/.env.local`:

```env
# Supabase Configuration
# Get these from: https://app.supabase.com → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI API Key - NOT REQUIRED!
# Each user enters their personal API key via Settings
# This is more secure and doesn't use your funds
# OPENAI_API_KEY=

# GitHub OAuth (optional)
# Configure in: Supabase → Authentication → Providers → GitHub
# GITHUB_CLIENT_ID=your-github-client-id
# GITHUB_CLIENT_SECRET=your-github-client-secret

# App URL (for production on Vercel)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

---

## 🎨 Usage

### 1. Registration and Login
1. Open application
2. Register via Email/Password or GitHub
3. Confirm email (if using email registration)

### 2. Adding OpenAI API Key
⚠️ **Important!** Chat won't work without API key.

1. Click avatar in top right corner
2. Select **Settings**
3. Paste your OpenAI API key (starts with `sk-...`)
4. Click **Save Settings**

Get API key: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### 3. Using Chat
- **New chat**: "+ New Chat" button in sidebar
- **Send message**: Enter text and press Enter or send button
- **Upload files**: 📎 button - supports images, PDF, DOCX, CSV and more
- **Rename**: Click on chat title
- **Export**: Export button in chat header (choose format)
- **Search**: 🔍 button to search all chats

### 4. Working with Images
1. Upload image via 📎
2. Ask question about image
3. GPT-4o Vision will analyze and respond

Supported: object recognition, reading text in images, analyzing charts, scene description.

---

## 🚢 Deploy to Vercel

### Automatic Deployment

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set **Root Directory**: `app`
4. Add environment variables (Supabase only!)
5. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Environment Variables in Vercel

Add in **Settings → Environment Variables**:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

⚠️ **DO NOT add** `OPENAI_API_KEY` - users use their personal keys!

### Configure Domain in Supabase

After deployment, add Vercel domain to Supabase:
1. **Authentication → URL Configuration**
2. Add to **Redirect URLs**: `https://your-app.vercel.app/auth/callback`

---

## 🔒 Security

### Row Level Security (RLS)
All data is isolated at database level. Users see only their own chats and messages.

### API Keys
- OpenAI API keys stored encrypted in Supabase
- No keys transmitted to frontend
- Each user uses only their own key

### Authentication
- JWT tokens with automatic refresh
- CSRF protection
- Email verification (optional)

---

## 📊 Performance

- **Streaming responses** - User sees response instantly (SSE)
- **Query optimization** - PostgreSQL indexes
- **Lazy loading** - Load chats on demand
- **CDN** - Static files via Vercel Edge Network

---

## 🧪 Development

### Run in dev mode
```bash
cd app
npm run dev
```

### Build for production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

---

## 🤝 Contributing

Contributions welcome! For major changes, please open an issue first.

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

Distributed under MIT License. See `LICENSE` for details.

---

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) - GPT-4 and GPT-4o API
- [Supabase](https://supabase.com) - Backend platform
- [Vercel](https://vercel.com) - Next.js framework and hosting
- [Radix UI](https://radix-ui.com) - Accessible UI components
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR engine

---

## 📞 Contact

If you have questions or suggestions:

- Open an [Issue](../../issues)
- Create a [Pull Request](../../pulls)

---

<div align="center">

**⭐ Star if this project was helpful!**

Made with ❤️ by Alena Artamonava

</div>
