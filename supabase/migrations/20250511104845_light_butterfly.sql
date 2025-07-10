/*
  # Fix profiles table RLS policies

  1. Changes
    - Drop existing RLS policies for profiles table
    - Add new policies that properly handle profile creation and management
    - Allow authenticated users to create their own profile
    - Allow users to view and update their own profile
    - Allow admins to view all profiles

  2. Security
    - Ensure users can only access their own data
    - Maintain admin access to all profiles
    - Enable secure profile creation during signup
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable select for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Allow public read access" ON profiles;

-- Create new policies
CREATE POLICY "Enable profile creation during signup"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable read access for own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Enable update access for own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable delete access for own profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);