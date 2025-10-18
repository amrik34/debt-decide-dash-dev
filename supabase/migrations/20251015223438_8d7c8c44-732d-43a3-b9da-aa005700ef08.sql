-- Add new columns to affiliates table
ALTER TABLE public.affiliates 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS phone_ext TEXT,
ADD COLUMN IF NOT EXISTS phone_mobile TEXT,
ADD COLUMN IF NOT EXISTS company_website TEXT,
ADD COLUMN IF NOT EXISTS assigned_to TEXT,
ADD COLUMN IF NOT EXISTS fax TEXT,
ADD COLUMN IF NOT EXISTS add_to_master_list BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update affiliate_name to be nullable since we now have first_name and last_name
ALTER TABLE public.affiliates ALTER COLUMN affiliate_name DROP NOT NULL;

-- Create storage bucket for affiliate images
INSERT INTO storage.buckets (id, name, public)
VALUES ('affiliate-images', 'affiliate-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for affiliate images
CREATE POLICY "Anyone can view affiliate images"
ON storage.objects FOR SELECT
USING (bucket_id = 'affiliate-images');

CREATE POLICY "Users can upload affiliate images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'affiliate-images');

CREATE POLICY "Users can update affiliate images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'affiliate-images');

CREATE POLICY "Users can delete affiliate images"
ON storage.objects FOR DELETE
USING (bucket_id = 'affiliate-images');