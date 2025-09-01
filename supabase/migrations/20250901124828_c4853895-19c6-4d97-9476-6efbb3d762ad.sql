-- Criar usuários de teste
DO $$
DECLARE
    admin_user_id UUID;
    owner_user_id UUID;
    barbershop_id UUID;
BEGIN
    -- Criar usuário admin se não existir
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_user_meta_data,
        role,
        aud
    )
    VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000000',
        'admin@sistema.com',
        crypt('123456', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"full_name": "Super Admin", "role": "super_admin"}',
        'authenticated',
        'authenticated'
    )
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO admin_user_id;

    -- Se o usuário admin foi criado agora, criar o profile
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO public.profiles (id, email, full_name, role)
        VALUES (admin_user_id, 'admin@sistema.com', 'Super Admin', 'super_admin');
    END IF;

    -- Criar usuário dono se não existir
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_user_meta_data,
        role,
        aud
    )
    VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000000',
        'dono@teste.com',
        crypt('123456', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"full_name": "Dono da Barbearia", "role": "owner"}',
        'authenticated',
        'authenticated'
    )
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO owner_user_id;

    -- Se o usuário dono foi criado agora, criar o profile e a barbearia
    IF owner_user_id IS NOT NULL THEN
        INSERT INTO public.profiles (id, email, full_name, role)
        VALUES (owner_user_id, 'dono@teste.com', 'Dono da Barbearia', 'owner');

        -- Criar uma barbearia de exemplo
        INSERT INTO public.barbershops (owner_id, name, slug, address, phone)
        VALUES (
            owner_user_id,
            'Barbearia Elite',
            'barbearia-elite',
            'Rua das Flores, 123 - Centro',
            '(11) 99999-9999'
        )
        RETURNING id INTO barbershop_id;

        -- Criar barbeiros de exemplo
        INSERT INTO public.barbers (barbershop_id, name, phone, email) VALUES
        (barbershop_id, 'João Silva', '(11) 98888-1111', 'joao@elite.com'),
        (barbershop_id, 'Carlos Santos', '(11) 98888-2222', 'carlos@elite.com'),
        (barbershop_id, 'Miguel Oliveira', '(11) 98888-3333', 'miguel@elite.com');

        -- Criar serviços de exemplo
        INSERT INTO public.services (barbershop_id, name, category, duration, price) VALUES
        (barbershop_id, 'Corte de Cabelo', 'Corte', 30, 40.00),
        (barbershop_id, 'Barba Completa', 'Barba', 30, 35.00),
        (barbershop_id, 'Corte + Barba', 'Combo', 60, 70.00),
        (barbershop_id, 'Sobrancelha', 'Outros', 15, 20.00);
    END IF;
END $$;