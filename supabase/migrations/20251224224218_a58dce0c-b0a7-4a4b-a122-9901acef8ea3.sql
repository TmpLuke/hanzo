-- Create enum for product status
CREATE TYPE public.product_status AS ENUM ('undetected', 'testing', 'updating', 'down');

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'general',
  status product_status NOT NULL DEFAULT 'undetected',
  image_url TEXT,
  features TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products are publicly readable
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Only authenticated users can modify (will add admin role check later)
CREATE POLICY "Authenticated users can insert products" 
ON public.products 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" 
ON public.products 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete products" 
ON public.products 
FOR DELETE 
TO authenticated
USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, description, price, category, status, features, is_featured) VALUES
('Hanzo Aimbot Pro', 'Advanced aimbot with smooth targeting and FOV customization', 29.99, 'aimbots', 'undetected', ARRAY['Smooth Aim', 'FOV Control', 'Bone Selection', 'Visibility Check'], true),
('Hanzo ESP Suite', 'Complete ESP package with player, item, and vehicle detection', 24.99, 'esp', 'undetected', ARRAY['Player ESP', 'Item ESP', 'Distance Display', 'Health Bars'], true),
('Hanzo Radar Hack', 'Real-time minimap radar showing all enemies', 19.99, 'radar', 'testing', ARRAY['2D Radar', 'Enemy Tracking', 'Custom Icons', 'Zoom Control'], false),
('Hanzo Spoofer', 'Hardware ID spoofer for ban protection', 34.99, 'spoofers', 'undetected', ARRAY['HWID Spoof', 'Serial Spoof', 'MAC Spoof', 'Disk Spoof'], true),
('Hanzo Unlock All', 'Unlock all weapons, skins, and operators', 14.99, 'unlocks', 'updating', ARRAY['All Weapons', 'All Skins', 'All Operators', 'Battle Pass'], false),
('Hanzo Bundle Pack', 'Complete package with all tools included', 79.99, 'bundles', 'undetected', ARRAY['All Tools', 'Priority Support', 'Lifetime Updates', 'Custom Configs'], true);