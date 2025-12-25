-- Create admin_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  holiday_mode TEXT NOT NULL DEFAULT 'none',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read settings (needed for effect to show on public pages)
CREATE POLICY "Settings are viewable by everyone" 
ON public.admin_settings 
FOR SELECT 
USING (true);

-- Only authenticated users can update (admin check should be enforced by app logic + RLS if we had roles, for now auth is enough as per current pattern)
CREATE POLICY "Authenticated users can update settings" 
ON public.admin_settings 
FOR UPDATE 
TO authenticated
USING (true);

-- Authenticated users can insert (for initial setup)
CREATE POLICY "Authenticated users can insert settings" 
ON public.admin_settings 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Insert default row if not exists
INSERT INTO public.admin_settings (holiday_mode)
SELECT 'none'
WHERE NOT EXISTS (SELECT 1 FROM public.admin_settings);
