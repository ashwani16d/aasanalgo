/*
  # Fix profiles RLS policies

  1. Changes
    - Drop existing RLS policies for profiles table
    - Add new policies that allow proper profile creation during signup
    - Ensure authenticated users can manage their own profiles
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users creating their own profil" ON profiles;
DROP POLICY IF EXISTS "Enable read access for users to their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on their user_id" ON profiles;
DROP POLICY IF EXISTS "Allow public read for email verification" ON profiles;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users only"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable select for authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR role = 'admin');

CREATE POLICY "Enable update for users based on id"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow public read access"
  ON profiles FOR SELECT
  TO public
  USING (true);