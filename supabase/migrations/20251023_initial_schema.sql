-- Projekt Lena1 - Initial Database Schema
-- Created: 2025-10-23
-- Description: Creates 4 tables (profiles, chats, messages, usage_stats) with RLS

-- ============================================
-- 1. Enable UUID extension
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. PROFILES TABLE
-- ============================================
-- Stores user profile information
-- Links to Supabase auth.users via user_id

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT profiles_user_id_key UNIQUE (user_id)
);

-- Index for faster lookups
CREATE INDEX profiles_user_id_idx ON profiles(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see/edit their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 3. CHATS TABLE
-- ============================================
-- Stores chat conversations

CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Chat',

  -- Unique features: organization
  category TEXT, -- e.g., "Work", "Personal", "Learning"
  tags TEXT[], -- Array of tags
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB, -- Custom metadata (color, icon, etc.)

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX chats_user_id_idx ON chats(user_id);
CREATE INDEX chats_created_at_idx ON chats(created_at DESC);
CREATE INDEX chats_last_message_at_idx ON chats(last_message_at DESC NULLS LAST);
CREATE INDEX chats_is_favorite_idx ON chats(is_favorite) WHERE is_favorite = TRUE;
CREATE INDEX chats_category_idx ON chats(category) WHERE category IS NOT NULL;

-- Full-text search index on title
CREATE INDEX chats_title_search_idx ON chats USING gin(to_tsvector('russian', title));

-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own chats"
  ON chats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chats"
  ON chats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats"
  ON chats FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats"
  ON chats FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. MESSAGES TABLE
-- ============================================
-- Stores individual messages in chats

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,

  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,

  -- Metadata
  tokens_used INTEGER, -- For usage tracking
  model TEXT, -- GPT model used (gpt-4, gpt-3.5-turbo, etc.)
  metadata JSONB, -- Additional data (temperature, etc.)

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX messages_chat_id_idx ON messages(chat_id);
CREATE INDEX messages_created_at_idx ON messages(created_at);

-- Full-text search on content (UNIQUE FEATURE!)
CREATE INDEX messages_content_search_idx ON messages USING gin(to_tsvector('russian', content));

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see messages from their own chats
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own chats"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own messages"
  ON messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

-- ============================================
-- 5. USAGE_STATS TABLE
-- ============================================
-- Tracks AI usage statistics per user

CREATE TABLE usage_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Usage metrics
  total_messages INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  total_chats INTEGER NOT NULL DEFAULT 0,

  -- Date tracking
  date DATE NOT NULL DEFAULT CURRENT_DATE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT usage_stats_user_date_key UNIQUE (user_id, date)
);

-- Indexes
CREATE INDEX usage_stats_user_id_idx ON usage_stats(user_id);
CREATE INDEX usage_stats_date_idx ON usage_stats(date DESC);

-- Enable RLS
ALTER TABLE usage_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own stats"
  ON usage_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON usage_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON usage_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 6. FUNCTIONS & TRIGGERS
-- ============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at for chats
CREATE TRIGGER update_chats_updated_at
  BEFORE UPDATE ON chats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at for usage_stats
CREATE TRIGGER update_usage_stats_updated_at
  BEFORE UPDATE ON usage_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: Update chat.last_message_at when new message is added
CREATE OR REPLACE FUNCTION update_chat_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chats
  SET last_message_at = NEW.created_at
  WHERE id = NEW.chat_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update last_message_at on message insert
CREATE TRIGGER update_chat_last_message_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_last_message();

-- ============================================
-- 7. SEED DATA (optional, for testing)
-- ============================================

-- This will be empty for production
-- Add test data here if needed for development

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- To apply this migration in Supabase:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Create new query
-- 3. Copy-paste this entire file
-- 4. Click "Run"
--
-- Or use Supabase CLI:
-- supabase db push
