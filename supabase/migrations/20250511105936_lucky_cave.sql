/*
  # Fix profiles RLS policies

  1. Changes
    - Drop existing restrictive policies
    - Add new policies that allow:
      - Profile creation during signup
      - Users to view and update their own profiles
      - Admins to view all profiles
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable profile creation during signup" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable delete access for own profile" ON profiles;

-- Create new policies
CREATE POLICY "Enable profile creation during signup"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING ((auth.uid() = id) OR (EXISTS (
    SELECT 1 FROM profiles profiles_1
    WHERE (profiles_1.id = auth.uid() AND profiles_1.role = 'admin')
  )));

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable delete access for own profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);