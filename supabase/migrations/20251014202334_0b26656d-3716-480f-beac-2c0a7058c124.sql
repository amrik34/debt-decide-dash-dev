-- Create function to update timestamps (if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create storage bucket for credit reports
INSERT INTO storage.buckets (id, name, public)
VALUES ('credit-reports', 'credit-reports', false)
ON CONFLICT (id) DO NOTHING;

-- Create credit_reports table
CREATE TABLE IF NOT EXISTS public.credit_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  provider TEXT,
  saved_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  analysis_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.credit_reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their client's credit reports" ON public.credit_reports;
DROP POLICY IF EXISTS "Users can create credit reports" ON public.credit_reports;
DROP POLICY IF EXISTS "Users can update credit reports" ON public.credit_reports;
DROP POLICY IF EXISTS "Users can delete credit reports" ON public.credit_reports;

-- Create policies for credit_reports
CREATE POLICY "Users can view their client's credit reports"
  ON public.credit_reports
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create credit reports"
  ON public.credit_reports
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update credit reports"
  ON public.credit_reports
  FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete credit reports"
  ON public.credit_reports
  FOR DELETE
  USING (true);

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Users can upload credit reports" ON storage.objects;
DROP POLICY IF EXISTS "Users can view credit reports" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete credit reports" ON storage.objects;

-- Storage policies for credit-reports bucket
CREATE POLICY "Users can upload credit reports"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'credit-reports');

CREATE POLICY "Users can view credit reports"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'credit-reports');

CREATE POLICY "Users can delete credit reports"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'credit-reports');

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_credit_reports_updated_at ON public.credit_reports;
CREATE TRIGGER update_credit_reports_updated_at
  BEFORE UPDATE ON public.credit_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();