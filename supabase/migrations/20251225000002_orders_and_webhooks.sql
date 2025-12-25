-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  product_id UUID NOT NULL REFERENCES public.products(id),
  variant_id UUID REFERENCES public.product_variants(id),
  product_name TEXT NOT NULL,
  variant_label TEXT,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_id TEXT,
  discord_notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders are viewable by everyone (for now)
CREATE POLICY "Orders are viewable by everyone" 
ON public.orders 
FOR SELECT 
USING (true);

-- Anyone can insert orders
CREATE POLICY "Anyone can insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Anyone can update orders
CREATE POLICY "Anyone can update orders" 
ON public.orders 
FOR UPDATE 
USING (true);

-- Create settings table for webhook URL
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Settings are viewable by everyone
CREATE POLICY "Settings are viewable by everyone" 
ON public.settings 
FOR SELECT 
USING (true);

-- Anyone can modify settings
CREATE POLICY "Anyone can insert settings" 
ON public.settings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update settings" 
ON public.settings 
FOR UPDATE 
USING (true);

-- Insert default Discord webhook setting (empty by default)
INSERT INTO public.settings (key, value) 
VALUES ('discord_webhook_url', '')
ON CONFLICT (key) DO NOTHING;

-- Create function to send Discord webhook
CREATE OR REPLACE FUNCTION public.send_discord_webhook()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT;
  payload JSON;
BEGIN
  -- Only send webhook for completed orders
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Get webhook URL from settings
    SELECT value INTO webhook_url FROM public.settings WHERE key = 'discord_webhook_url';
    
    -- Only send if webhook URL is configured
    IF webhook_url IS NOT NULL AND webhook_url != '' THEN
      -- Mark as notified
      NEW.discord_notified = true;
      
      -- Note: Actual webhook sending needs to be done from your backend/edge function
      -- This trigger just marks the order as ready for notification
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for Discord notifications
DROP TRIGGER IF EXISTS discord_webhook_trigger ON public.orders;
CREATE TRIGGER discord_webhook_trigger
BEFORE INSERT OR UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.send_discord_webhook();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_discord_notified ON public.orders(discord_notified) WHERE discord_notified = false;
