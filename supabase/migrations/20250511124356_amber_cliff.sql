/*
  # Set up admin panel access

  1. Changes
    - Set up admin password for the owner
    - Ensure only the first admin user can access the admin panel
    - Add function to verify admin ownership
*/

-- Enable pgcrypto if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add is_owner column to profiles to mark the owner
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_owner boolean DEFAULT false;

-- Mark the first admin as the owner
UPDATE profiles 
SET 
  is_owner = true,
  admin_password = crypt('AasnAlgo2025!', gen_salt('bf'))
WHERE id = (
  SELECT id 
  FROM profiles 
  WHERE role = 'admin' 
  ORDER BY created_at ASC 
  LIMIT 1
);

-- Drop existing verify function
DROP FUNCTION IF EXISTS verify_admin_password;

-- Create new verify function that checks for owner status
CREATE OR REPLACE FUNCTION verify_admin_password(user_id uuid, password text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = user_id 
    AND role = 'admin'
    AND is_owner = true
    AND admin_password = crypt(password, admin_password)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;