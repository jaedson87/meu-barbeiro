-- Inserir profiles para usuários existentes se não existirem
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'full_name', 'Usuário'),
    CASE 
        WHEN u.email = 'admin@sistema.com' THEN 'super_admin'::user_role
        WHEN u.email = 'dono@teste.com' THEN 'owner'::user_role
        ELSE 'owner'::user_role
    END
FROM auth.users u 
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
);