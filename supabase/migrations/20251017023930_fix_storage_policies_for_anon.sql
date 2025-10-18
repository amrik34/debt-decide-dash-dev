/*
  # Fix storage policies to allow anonymous access

  ## Changes
  1. Update storage policies to allow anon role access
    - Allows file uploads without authentication
    - Allows file viewing without authentication
    - Allows file deletion without authentication

  ## Note
  - This is a temporary solution for development
  - In production, you should implement proper authentication
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload credit reports" ON storage.objects;
DROP POLICY IF EXISTS "Users can view credit reports" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete credit reports" ON storage.objects;

-- Recreate policies with anon access
CREATE POLICY "Anyone can upload credit reports"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'credit-reports');

CREATE POLICY "Anyone can view credit reports"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'credit-reports');

CREATE POLICY "Anyone can delete credit reports"
  ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'credit-reports');
