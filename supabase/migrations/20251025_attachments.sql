-- Attachments Migration
-- Created: 2025-10-25
-- Description: Adds support for file attachments in messages

-- ============================================
-- 1. CREATE STORAGE BUCKET
-- ============================================
-- Note: This needs to be done via Supabase Dashboard or CLI
-- Storage → Create Bucket → name: "chat-attachments"
-- Make it public for easier access to images

-- ============================================
-- 2. MESSAGE_ATTACHMENTS TABLE
-- ============================================
-- Stores metadata about files attached to messages

CREATE TABLE message_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,

  -- File information
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- MIME type (image/jpeg, application/pdf, etc.)
  file_size INTEGER NOT NULL, -- Size in bytes
  storage_path TEXT NOT NULL, -- Path in Supabase Storage

  -- Preview/thumbnail (optional, for images)
  thumbnail_url TEXT,

  -- Metadata
  width INTEGER, -- For images
  height INTEGER, -- For images
  metadata JSONB,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX message_attachments_message_id_idx ON message_attachments(message_id);
CREATE INDEX message_attachments_file_type_idx ON message_attachments(file_type);
CREATE INDEX message_attachments_created_at_idx ON message_attachments(created_at);

-- Enable RLS
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see attachments from their own messages
CREATE POLICY "Users can view own attachments"
  ON message_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM messages
      JOIN chats ON chats.id = messages.chat_id
      WHERE messages.id = message_attachments.message_id
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create attachments in own messages"
  ON message_attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM messages
      JOIN chats ON chats.id = messages.chat_id
      WHERE messages.id = message_attachments.message_id
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own attachments"
  ON message_attachments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM messages
      JOIN chats ON chats.id = messages.chat_id
      WHERE messages.id = message_attachments.message_id
      AND chats.user_id = auth.uid()
    )
  );

-- ============================================
-- 3. STORAGE POLICIES
-- ============================================
-- Note: These policies should be set via Supabase Dashboard:
--
-- For "chat-attachments" bucket:
-- 1. INSERT policy: authenticated users can upload
--    using: auth.role() = 'authenticated'
--
-- 2. SELECT policy: public can view (for easier image display)
--    using: true
--
-- 3. DELETE policy: users can delete their own files
--    using: auth.uid()::text = (storage.foldername(name))[1]
--
-- File path structure: {user_id}/{chat_id}/{filename}

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
