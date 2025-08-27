-- Create profile for existing admin user
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  u.id,
  u.email,
  'Super Admin',
  'super_admin'::user_role
FROM auth.users u 
WHERE u.email = 'admin@sistema.com'
AND NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
);