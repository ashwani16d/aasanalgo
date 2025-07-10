/*
  # Set initial admin user
  
  Updates the first user's role to admin for initial setup
*/

UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id 
  FROM profiles 
  ORDER BY created_at ASC 
  LIMIT 1
);