-- Create company_profile table
CREATE TABLE public.company_profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT,
  website TEXT,
  time_zone TEXT DEFAULT 'America/Los_Angeles',
  mailing_address TEXT,
  apt_suite_unit TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'United States',
  phone TEXT,
  fax TEXT,
  sender_name TEXT,
  sender_email TEXT,
  invoice_company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_profile ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view company profile"
ON public.company_profile
FOR SELECT
USING (true);

CREATE POLICY "Users can create company profile"
ON public.company_profile
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update company profile"
ON public.company_profile
FOR UPDATE
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_company_profile_updated_at
BEFORE UPDATE ON public.company_profile
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();