-- Insert a super admin user for testing
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@sistema.com',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Super Admin", "role": "super_admin"}',
  false,
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Insert an owner user for testing  
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'dono@barbearia.com',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Dono da Barbearia", "role": "owner"}',
  false,
  'authenticated'
) ON CONFLICT (email) DO NOTHING;