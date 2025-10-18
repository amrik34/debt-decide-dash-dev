/*
  # Fix credit_reports table policies to allow anonymous access

  ## Changes
  1. Update RLS policies to allow anon role access
    - Allows viewing credit reports without authentication
    - Allows creating credit reports without authentication
    - Allows updating credit reports without authentication
    - Allows deleting credit reports without authentication

  ## Note
  - This is for development purposes
  - In production, implement proper authentication
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view credit reports" ON public.credit_reports;
DROP POLICY IF EXISTS "Users can create credit reports" ON public.credit_reports;
DROP POLICY IF EXISTS "Users can update credit reports" ON public.credit_reports;
DROP POLICY IF EXISTS "Users can delete credit reports" ON public.credit_reports;

-- Recreate policies with public access
CREATE POLICY "Anyone can view credit reports"
  ON public.credit_reports
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create credit reports"
  ON public.credit_reports
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update credit reports"
  ON public.credit_reports
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete credit reports"
  ON public.credit_reports
  FOR DELETE
  TO public
  USING (true);
