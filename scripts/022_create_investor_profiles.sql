-- Create investor_profiles table
CREATE TABLE IF NOT EXISTS public.investor_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  investor_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.investor_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Investors can only view and update their own profile
CREATE POLICY "investor_profiles_select_own"
  ON public.investor_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "investor_profiles_update_own"
  ON public.investor_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admin can view all investor profiles (for admin panel)
CREATE POLICY "investor_profiles_select_admin"
  ON public.investor_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admin can insert and update investor profiles
CREATE POLICY "investor_profiles_insert_admin"
  ON public.investor_profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "investor_profiles_update_admin"
  ON public.investor_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Add investor_id to investments table to link investments to investor accounts
ALTER TABLE public.investments
ADD COLUMN IF NOT EXISTS investor_id UUID REFERENCES public.investor_profiles(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_investments_investor_id ON public.investments(investor_id);

-- Update RLS policies for investments to allow investors to view their own investments
CREATE POLICY "investments_select_own"
  ON public.investments FOR SELECT
  USING (
    auth.uid() = investor_id
    OR status = 'approved' -- Anyone can see approved investments
  );

COMMENT ON TABLE public.investor_profiles IS 'Stores investor profile information linked to auth.users';
COMMENT ON COLUMN public.investments.investor_id IS 'Links investment to investor account (optional for backward compatibility)';
