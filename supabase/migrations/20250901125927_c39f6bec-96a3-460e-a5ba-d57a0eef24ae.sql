-- Remover políticas problemáticas que causam recursão
DROP POLICY IF EXISTS "Super admins can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;

-- Criar função de segurança para verificar role sem recursão
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Recrear políticas usando a função segura
CREATE POLICY "Super admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.get_user_role(auth.uid()) = 'super_admin'::user_role
  OR auth.uid() = id
);

CREATE POLICY "Super admins can create profiles"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (
  public.get_user_role(auth.uid()) = 'super_admin'::user_role
);

CREATE POLICY "Super admins can update profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  public.get_user_role(auth.uid()) = 'super_admin'::user_role
  OR auth.uid() = id
);

-- Atualizar políticas das barbearias para usar a função segura
DROP POLICY IF EXISTS "Super admins can create barbershops" ON public.barbershops;
DROP POLICY IF EXISTS "Super admins can update barbershops" ON public.barbershops;
DROP POLICY IF EXISTS "Super admins can view all barbershops" ON public.barbershops;

CREATE POLICY "Super admins can view all barbershops"
ON public.barbershops
FOR SELECT
TO authenticated
USING (
  public.get_user_role(auth.uid()) = 'super_admin'::user_role
  OR owner_id = auth.uid()
);

CREATE POLICY "Super admins can create barbershops"
ON public.barbershops
FOR INSERT
TO authenticated
WITH CHECK (
  public.get_user_role(auth.uid()) = 'super_admin'::user_role
);

CREATE POLICY "Super admins can update barbershops"
ON public.barbershops
FOR UPDATE
TO authenticated
USING (
  public.get_user_role(auth.uid()) = 'super_admin'::user_role
  OR owner_id = auth.uid()
);