-- Create dispute_items table
CREATE TABLE IF NOT EXISTS public.dispute_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  credit_report_id UUID NOT NULL REFERENCES public.credit_reports(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'inquiry', 'public_record', 'account', etc.
  item_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'negative',
  reason TEXT,
  instructions TEXT,
  bureau TEXT NOT NULL, -- 'experian', 'equifax', 'transunion'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dispute_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view dispute items"
  ON public.dispute_items
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create dispute items"
  ON public.dispute_items
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update dispute items"
  ON public.dispute_items
  FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete dispute items"
  ON public.dispute_items
  FOR DELETE
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_dispute_items_updated_at
  BEFORE UPDATE ON public.dispute_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();