/*
  # Fix Profile RLS Policies

  1. Changes
    - Drop existing profile policies
    - Add new policies for profile creation and management
    - Add policy for initial profile creation during signup
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users creating their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on their user_id"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable read access for users to their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow public read for email verification
CREATE POLICY "Allow public read for email verification"
  ON profiles FOR SELECT
  TO public
  USING (true);