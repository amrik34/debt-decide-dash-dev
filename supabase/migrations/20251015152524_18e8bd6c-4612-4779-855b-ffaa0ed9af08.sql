-- Add column to store personal info field statuses for each bureau
ALTER TABLE public.credit_reports 
ADD COLUMN personal_info_field_statuses JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.credit_reports.personal_info_field_statuses IS 'Stores keep/remove status for each personal info field across all three bureaus. Structure: {field_name: {experian: "keep"|"remove", equifax: "keep"|"remove", transunion: "keep"|"remove"}}';