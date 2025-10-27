# Database Migrations

## 📋 Applying Migration to Supabase

### Method 1: Supabase Dashboard (Recommended for first time)

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Select your project (`projekt-lena1`)

2. **Navigate to SQL Editor**
   - Left sidebar → SQL Editor
   - Click "+ New query"

3. **Copy Migration SQL**
   - Open file: `20251023_initial_schema.sql`
   - Copy entire content (Ctrl+A, Ctrl+C)

4. **Paste and Run**
   - Paste into SQL Editor
   - Click "Run" (или Ctrl+Enter)
   - ✅ Success message: "Success. No rows returned"

5. **Verify Tables Created**
   - Left sidebar → Table Editor
   - You should see 4 tables:
     - ✅ profiles
     - ✅ chats
     - ✅ messages
     - ✅ usage_stats

### Method 2: Supabase CLI (Advanced)

```bash
# Install Supabase CLI (если ещё не установлен)
npm install -g supabase

# Login to Supabase
supabase login

# Link project
supabase link --project-ref [your-project-id]

# Apply migration
supabase db push

# Verify
supabase db remote status
```

---

## 🗄️ Database Schema

### Tables Created:

1. **profiles** - User profiles
   - Links to `auth.users`
   - Fields: user_id, email, display_name, avatar_url

2. **chats** - Chat conversations
   - User's chat sessions
   - Fields: title, category, tags, is_favorite, metadata
   - Unique features: organization, search

3. **messages** - Individual messages
   - Belongs to chats
   - Fields: role, content, tokens_used, model
   - Full-text search enabled!

4. **usage_stats** - Usage tracking
   - Daily statistics per user
   - Fields: total_messages, total_tokens, date

### Security:

✅ **Row Level Security (RLS) enabled on ALL tables**
- Users can only see their own data
- Automatic security policies applied

### Indexes:

✅ **Full-text search indexes:**
- `chats.title` - search by chat title
- `messages.content` - search inside messages (🌟 UNIQUE FEATURE!)

✅ **Performance indexes:**
- user_id, created_at, last_message_at, is_favorite

### Triggers:

✅ **Auto-update timestamps:**
- `updated_at` automatically updates on changes

✅ **Auto-update last_message_at:**
- Chat's `last_message_at` updates when new message added

---

## ✅ Verification Checklist

After applying migration, verify:

- [ ] 4 tables created (profiles, chats, messages, usage_stats)
- [ ] RLS enabled on all tables (check Table Editor → table → Policies)
- [ ] Full-text search indexes created (check Database → Extensions → pg_trgm)
- [ ] Triggers working (insert a test row, check `updated_at`)

---

## 🔄 Rollback (if needed)

If something went wrong:

```sql
-- Drop tables in reverse order (foreign keys)
DROP TABLE IF EXISTS usage_stats CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS chats CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_chats_updated_at ON chats;
DROP TRIGGER IF EXISTS update_usage_stats_updated_at ON usage_stats;
DROP TRIGGER IF EXISTS update_chat_last_message_trigger ON messages;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS update_chat_last_message();
```

Then re-run the migration.

---

## 📝 Notes

- Migration file: `20251023_initial_schema.sql`
- Created: 2025-10-23
- Version: 1.0 (initial schema)
- RLS: ✅ Enabled
- Full-text search: ✅ Enabled (Russian language)

---

**Next step:** Generate TypeScript types from database schema
