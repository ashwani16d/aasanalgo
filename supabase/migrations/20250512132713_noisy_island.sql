/*
  # Fix admin password and verification

  1. Changes
    - Reset admin password
    - Update verification function
*/

-- Enable pgcrypto if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Reset admin password to 'admin123'
UPDATE profiles 
SET 
  admin_password = crypt('admin123', gen_salt('bf')),
  is_owner = true
WHERE role = 'admin';

-- Drop and recreate the verify function
DROP FUNCTION IF EXISTS verify_admin_password;

CREATE OR REPLACE FUNCTION verify_admin_password(user_id uuid, password text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = user_id 
    AND role = 'admin'
    AND admin_password = crypt(password, admin_password)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;