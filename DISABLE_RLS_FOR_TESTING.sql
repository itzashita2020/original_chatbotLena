-- TEMPORARY: Disable RLS for testing attachments without auth
-- IMPORTANT: Re-enable this when auth is implemented!

-- Disable RLS for message_attachments table
ALTER TABLE message_attachments DISABLE ROW LEVEL SECURITY;

-- You can also create a permissive policy instead:
-- CREATE POLICY "Allow all for testing"
--   ON message_attachments
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);

-- To re-enable later (when auth is ready):
-- ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Allow all for testing" ON message_attachments;
