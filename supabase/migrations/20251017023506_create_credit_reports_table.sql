/*
  # Create credit reports system

  ## Tables Created
  1. `credit_reports`
    - `id` (uuid, primary key) - Unique identifier for each credit report
    - `client_id` (text) - ID of the client this report belongs to
    - `file_name` (text) - Original filename of uploaded PDF
    - `file_path` (text) - Storage path for the PDF file
    - `provider` (text) - Credit report provider name
    - `reference_number` (text) - Optional reference number
    - `report_date` (date) - Date of the credit report
    - `saved_date` (timestamptz) - When the report was saved
    - `status` (text) - Processing status (pending, completed, etc)
    - `personal_info` (jsonb) - Personal information for all 3 bureaus
    - `fico_scores` (jsonb) - FICO scores for all 3 bureaus
    - `summary` (jsonb) - Credit summary data for all 3 bureaus
    - `accounts` (jsonb) - Array of account information
    - `inquiries` (jsonb) - Array of credit inquiries
    - `analysis_data` (jsonb) - Legacy format for backward compatibility
    - `personal_info_field_statuses` (jsonb) - Field status tracking
    - `created_at` (timestamptz) - Record creation timestamp
    - `updated_at` (timestamptz) - Record update timestamp

  ## Security
  - Enable RLS on credit_reports table
  - Add policies for SELECT, INSERT, UPDATE, DELETE operations
  - Create storage bucket for PDF files
  - Add storage policies for file operations

  ## Triggers
  - Auto-update updated_at timestamp on record changes
*/

-- Create function to update timestamps
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
  reference_number TEXT,
  report_date DATE,
  saved_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  personal_info JSONB,
  fico_scores JSONB,
  summary JSONB,
  accounts JSONB DEFAULT '[]'::jsonb,
  inquiries JSONB DEFAULT '[]'::jsonb,
  analysis_data JSONB,
  personal_info_field_statuses JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.credit_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for credit_reports
CREATE POLICY "Users can view credit reports"
  ON public.credit_reports
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create credit reports"
  ON public.credit_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update credit reports"
  ON public.credit_reports
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete credit reports"
  ON public.credit_reports
  FOR DELETE
  TO authenticated
  USING (true);

-- Storage policies for credit-reports bucket
CREATE POLICY "Users can upload credit reports"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'credit-reports');

CREATE POLICY "Users can view credit reports"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'credit-reports');

CREATE POLICY "Users can delete credit reports"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'credit-reports');

-- Create trigger for updated_at
CREATE TRIGGER update_credit_reports_updated_at
  BEFORE UPDATE ON public.credit_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
