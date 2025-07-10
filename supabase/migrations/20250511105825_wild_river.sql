/*
  # Fix profiles RLS policies

  1. Changes
    - Drop existing RLS policies for profiles table
    - Create new policies with correct permissions for signup flow
    - Add policy for profile deletion
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable profile creation during signup" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable delete access for own profile" ON profiles;

-- Create new policies with correct permissions
CREATE POLICY "Enable profile creation during signup"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable delete access for own profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);