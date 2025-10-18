-- Add mailing address and portal access fields to affiliates table
ALTER TABLE public.affiliates 
ADD COLUMN IF NOT EXISTS mailing_address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'United States',
ADD COLUMN IF NOT EXISTS portal_access BOOLEAN DEFAULT false;