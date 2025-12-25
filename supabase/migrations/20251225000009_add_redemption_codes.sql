-- Create redemption_codes table
CREATE TABLE IF NOT EXISTS public.redemption_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  product_name TEXT NOT NULL,
  variant_label TEXT,
  discord_user_id TEXT,
  discord_username TEXT,
  redeemed BOOLEAN DEFAULT false,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.redemption_codes ENABLE ROW LEVEL SECURITY;

-- Redemption codes are viewable by everyone
CREATE POLICY "Redemption codes are viewable by everyone" 
ON public.redemption_codes 
FOR SELECT 
USING (true);

-- Anyone can insert redemption codes
CREATE POLICY "Anyone can insert redemption codes" 
ON public.redemption_codes 
FOR INSERT 
WITH CHECK (true);

-- Anyone can update redemption codes
CREATE POLICY "Anyone can update redemption codes" 
ON public.redemption_codes 
FOR UPDATE 
USING (true);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_redemption_codes_code ON public.redemption_codes(code);
CREATE INDEX IF NOT EXISTS idx_redemption_codes_order_id ON public.redemption_codes(order_id);
CREATE INDEX IF NOT EXISTS idx_redemption_codes_discord_user_id ON public.redemption_codes(discord_user_id);
CREATE INDEX IF NOT EXISTS idx_redemption_codes_redeemed ON public.redemption_codes(redeemed);

-- Add redemption_code column to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS redemption_code TEXT;

-- Function to generate unique redemption code
CREATE OR REPLACE FUNCTION generate_redemption_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..12 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    IF i % 4 = 0 AND i < 12 THEN
      result := result || '-';
    END IF;
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create redemption code when order is completed
CREATE OR REPLACE FUNCTION create_redemption_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
BEGIN
  -- Only create code for completed orders that don't have one yet
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') AND NEW.redemption_code IS NULL THEN
    -- Generate unique code
    LOOP
      new_code := generate_redemption_code();
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.redemption_codes WHERE code = new_code);
    END LOOP;
    
    -- Update order with code
    NEW.redemption_code = new_code;
    
    -- Insert into redemption_codes table
    INSERT INTO public.redemption_codes (
      code,
      order_id,
      order_number,
      customer_email,
      product_name,
      variant_label
    ) VALUES (
      new_code,
      NEW.id,
      NEW.order_number,
      NEW.customer_email,
      NEW.product_name,
      NEW.variant_label
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS create_redemption_code_trigger ON public.orders;
CREATE TRIGGER create_redemption_code_trigger
BEFORE INSERT OR UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION create_redemption_code();
