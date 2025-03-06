
-- Add contact_info and logo_url columns to provider_signup_requests table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'provider_signup_requests'
    AND column_name = 'contact_info'
  ) THEN
    ALTER TABLE public.provider_signup_requests ADD COLUMN contact_info text;
  END IF;

  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'provider_signup_requests'
    AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE public.provider_signup_requests ADD COLUMN logo_url text;
  END IF;
END
$$;

-- Create storage bucket for provider assets if it doesn't exist
BEGIN
  -- This will be handled by the application code
END;
