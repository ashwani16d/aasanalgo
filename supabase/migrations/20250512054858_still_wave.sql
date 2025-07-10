/*
  # Simplify Authentication Flow

  1. Changes
    - Add username field to profiles
    - Set fixed admin credentials
    - Update RLS policies
*/

-- Add username field to profiles if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS username text;

-- Set fixed admin credentials
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@aasanalgo.com',
  crypt('admin123', gen_salt('bf')),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, email, full_name, role, is_owner, username)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@aasanalgo.com',
  'Admin',
  'admin',
  true,
  'admin'
) ON CONFLICT (id) DO NOTHING;

-- Update RLS policies
DROP POLICY IF EXISTS "Enable profile creation during signup" ON profiles;
DROP POLICY IF EXISTS "Enable profile selection" ON profiles;
DROP POLICY IF EXISTS "Enable profile updates" ON profiles;
DROP POLICY IF EXISTS "Enable profile deletion" ON profiles;

CREATE POLICY "Enable profile creation during signup"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable profile selection"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable profile updates"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable profile deletion"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);