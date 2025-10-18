-- Create affiliates table
CREATE TABLE public.affiliates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  date_added TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

-- Create policies for affiliates
CREATE POLICY "Users can view all affiliates" 
ON public.affiliates 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create affiliates" 
ON public.affiliates 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update affiliates" 
ON public.affiliates 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete affiliates" 
ON public.affiliates 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_affiliates_updated_at
BEFORE UPDATE ON public.affiliates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();