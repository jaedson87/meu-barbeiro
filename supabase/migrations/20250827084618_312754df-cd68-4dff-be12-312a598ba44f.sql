-- Create admin user directly in auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@sistema.com',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Insert corresponding profile
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  u.id,
  u.email,
  'Super Admin',
  'super_admin'::user_role
FROM auth.users u 
WHERE u.email = 'admin@sistema.com';