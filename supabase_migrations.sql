
-- This file is only for documentation purposes 
-- Check if the profiles table exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles'
  ) THEN
    CREATE TABLE public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
      full_name TEXT,
      role TEXT DEFAULT 'parent',
      avatar_url TEXT,
      phone TEXT,
      location TEXT,
      username TEXT UNIQUE,
      preferred_communication TEXT DEFAULT 'email',
      preferred_payment_method TEXT,
      referral_code TEXT,
      provider_info JSONB
    );

    -- Add indexes for performance
    CREATE INDEX idx_profiles_role ON public.profiles(role);
  END IF;

  -- If the table exists but the role column doesn't have a default value
  -- or doesn't restrict to valid roles, add constraint
  IF EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles'
  ) AND NOT EXISTS (
    SELECT FROM pg_constraint
    WHERE conname = 'profiles_role_check'
  ) THEN
    -- Add constraints to ensure role is one of the allowed values
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('parent', 'provider', 'admin'));
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own profile
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can read own profile'
  ) THEN
    CREATE POLICY "Users can read own profile" 
    ON public.profiles 
    FOR SELECT 
    USING (auth.uid() = id);
  END IF;
END $$;

-- Create policy for users to update their own profile
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" 
    ON public.profiles 
    FOR UPDATE 
    USING (auth.uid() = id);
  END IF;
END $$;

-- Create RLS policy for children table to ensure parents can only see their own children
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'children' 
    AND policyname = 'Users can read own children'
  ) THEN
    CREATE POLICY "Users can read own children" 
    ON public.children 
    FOR SELECT 
    USING (auth.uid() = parent_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'children' 
    AND policyname = 'Users can insert own children'
  ) THEN
    CREATE POLICY "Users can insert own children" 
    ON public.children 
    FOR INSERT 
    WITH CHECK (auth.uid() = parent_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'children' 
    AND policyname = 'Users can update own children'
  ) THEN
    CREATE POLICY "Users can update own children" 
    ON public.children 
    FOR UPDATE 
    USING (auth.uid() = parent_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'children' 
    AND policyname = 'Users can delete own children'
  ) THEN
    CREATE POLICY "Users can delete own children" 
    ON public.children 
    FOR DELETE 
    USING (auth.uid() = parent_id);
  END IF;
END $$;

-- Create a function that updates the updated_at column on every update
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update the updated_at column for profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_trigger 
    WHERE tgname = 'update_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;
