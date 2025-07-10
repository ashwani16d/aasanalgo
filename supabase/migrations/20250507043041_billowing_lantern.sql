/*
  # Add admin password protection
  
  1. Changes
    - Add admin_password column to profiles table
    - Add admin password verification function
*/

-- Add admin_password column to profiles
ALTER TABLE profiles
ADD COLUMN admin_password text;

-- Function to verify admin password
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