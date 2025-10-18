-- Add personal_info column to credit_reports table
ALTER TABLE public.credit_reports 
ADD COLUMN IF NOT EXISTS personal_info jsonb;