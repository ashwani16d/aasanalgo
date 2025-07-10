/*
  # Add INSERT policy for profiles table

  1. Security Changes
    - Add INSERT policy for profiles table to allow new user registration
    - Policy ensures users can only create their own profile with their auth ID
    
  Note: This is critical for user signup functionality
*/

CREATE POLICY "Users can create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);