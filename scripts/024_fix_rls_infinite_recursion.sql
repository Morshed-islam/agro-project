-- Fix infinite recursion in RLS policies by creating a SECURITY DEFINER function
-- This function bypasses RLS when checking if a user is an admin

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "investor_profiles_select_admin" ON investor_profiles;
DROP POLICY IF EXISTS "investor_profiles_insert_admin" ON investor_profiles;
DROP POLICY IF EXISTS "investor_profiles_update_admin" ON investor_profiles;

-- Create a SECURITY DEFINER function to check if user is admin
-- This bypasses RLS and prevents infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate profiles policy using the is_admin() function
CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  USING (is_admin());

-- Recreate investor_profiles policies using the is_admin() function
CREATE POLICY "investor_profiles_select_admin"
  ON public.investor_profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "investor_profiles_insert_admin"
  ON public.investor_profiles FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "investor_profiles_update_admin"
  ON public.investor_profiles FOR UPDATE
  USING (is_admin());

-- Also add delete policy for admin
CREATE POLICY "investor_profiles_delete_admin"
  ON public.investor_profiles FOR DELETE
  USING (is_admin());

COMMENT ON FUNCTION public.is_admin() IS 'Checks if current user is an admin. Uses SECURITY DEFINER to bypass RLS and prevent infinite recursion.';
