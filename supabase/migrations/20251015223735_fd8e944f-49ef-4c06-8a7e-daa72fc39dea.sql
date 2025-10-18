-- Create letters table
CREATE TABLE public.letters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  letter_title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Default',
  status TEXT NOT NULL DEFAULT 'active',
  ai_eligible BOOLEAN DEFAULT true,
  is_favorite BOOLEAN DEFAULT false,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;

-- Create policies for letters
CREATE POLICY "Users can view all letters" 
ON public.letters 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create letters" 
ON public.letters 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update letters" 
ON public.letters 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete letters" 
ON public.letters 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_letters_updated_at
BEFORE UPDATE ON public.letters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample letters based on the screenshot
INSERT INTO public.letters (letter_title, category, status, ai_eligible) VALUES
('Request Annual Credit Report', 'Default', 'active', true),
('Default Round 1 (Dispute Credit Report Items)', 'Default', 'active', true),
('Method of Verification (MOD)', 'Credit Bureau Letters', 'active', true),
('Method of Verification (MOD) Alternate', 'Credit Bureau Letters', 'active', false),
('Validate Debt (609 Letter)', 'Credit Bureau Letters', 'active', true),
('Victim of Identity Theft', 'Credit Bureau Letters', 'active', true);