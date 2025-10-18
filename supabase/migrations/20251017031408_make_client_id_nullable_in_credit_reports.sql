/*
  # Make client_id nullable in credit_reports table

  1. Changes
    - Alter `credit_reports` table to make `client_id` column nullable
    - This allows credit reports to be uploaded without being associated with a client initially
    - Client association can be added later if needed
  
  2. Security
    - No changes to RLS policies needed
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'credit_reports' 
    AND column_name = 'client_id'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE credit_reports ALTER COLUMN client_id DROP NOT NULL;
  END IF;
END $$;
