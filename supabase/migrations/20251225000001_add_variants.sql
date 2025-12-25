-- Create variants table
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  duration TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Variants are publicly readable
CREATE POLICY "Variants are viewable by everyone" 
ON public.product_variants 
FOR SELECT 
USING (true);

-- Anyone can modify variants (for now)
CREATE POLICY "Anyone can insert variants" 
ON public.product_variants 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update variants" 
ON public.product_variants 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete variants" 
ON public.product_variants 
FOR DELETE 
USING (true);

-- Disable RLS on products table
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- Insert variants for all existing products
DO $$
DECLARE
  product_record RECORD;
BEGIN
  FOR product_record IN SELECT id, name, price FROM public.products LOOP
    -- Insert variants based on product name
    IF product_record.name = 'PUBG' THEN
      INSERT INTO public.product_variants (product_id, duration, price, label) VALUES
        (product_record.id, '1day', 5.90, '1 Day'),
        (product_record.id, '1week', 28.90, '7 Day'),
        (product_record.id, '1month', 69.90, '30 Day');
    ELSIF product_record.name = 'Arc Raiders' OR product_record.name = 'Arc Raiderssss' THEN
      INSERT INTO public.product_variants (product_id, duration, price, label) VALUES
        (product_record.id, '1day', 8.80, '1 Day'),
        (product_record.id, '1week', 44.90, '7 Day'),
        (product_record.id, '1month', 89.90, '30 Day');
    ELSIF product_record.name = 'Marvel Rivals' OR product_record.name = 'Marvel Rivalssa' THEN
      INSERT INTO public.product_variants (product_id, duration, price, label) VALUES
        (product_record.id, '1day', 10.90, '1 Day'),
        (product_record.id, '1week', 34.90, '7 Day'),
        (product_record.id, '1month', 69.90, '30 Day');
    ELSIF product_record.name = 'BO7' THEN
      INSERT INTO public.product_variants (product_id, duration, price, label) VALUES
        (product_record.id, '1day', 7.90, '1 Day'),
        (product_record.id, '3day', 12.90, '3 Day'),
        (product_record.id, '1week', 19.90, '7 Day'),
        (product_record.id, '1month', 39.90, '30 Day'),
        (product_record.id, 'lifetime', 149.00, 'Lifetime');
    ELSIF product_record.name = 'Rust' THEN
      INSERT INTO public.product_variants (product_id, duration, price, label) VALUES
        (product_record.id, '1day', 9.90, '1 Day'),
        (product_record.id, '1week', 34.90, '7 Day'),
        (product_record.id, '1month', 64.90, '30 Day');
    ELSIF product_record.name = 'Fortnite' THEN
      INSERT INTO public.product_variants (product_id, duration, price, label) VALUES
        (product_record.id, '1day', 11.90, '1 Day'),
        (product_record.id, '3day', 26.90, '3 Day'),
        (product_record.id, '1week', 58.90, '7 Day'),
        (product_record.id, '1month', 99.90, '30 Day');
    ELSIF product_record.name = 'Apex Legends' THEN
      INSERT INTO public.product_variants (product_id, duration, price, label) VALUES
        (product_record.id, '1day', 7.90, '1 Day'),
        (product_record.id, '1week', 39.90, '7 Day'),
        (product_record.id, '1month', 69.90, '30 Day');
    ELSIF product_record.name = 'Valorant' THEN
      INSERT INTO public.product_variants (product_id, duration, price, label) VALUES
        (product_record.id, '1day', 7.90, '1 Day'),
        (product_record.id, '1week', 24.90, '7 Day'),
        (product_record.id, '1month', 44.90, '30 Day');
    ELSIF product_record.name = 'HWID Spoofer' THEN
      INSERT INTO public.product_variants (product_id, duration, price, label) VALUES
        (product_record.id, 'onetime', 19.99, 'One Time'),
        (product_record.id, 'lifetime', 49.99, 'Lifetime');
    ELSIF product_record.name = 'Battlefield 6' THEN
      INSERT INTO public.product_variants (product_id, duration, price, label) VALUES
        (product_record.id, '1day', 11.90, '1 Day'),
        (product_record.id, '3day', 19.90, '3 Day'),
        (product_record.id, '1week', 39.90, '7 Day'),
        (product_record.id, '1month', 79.90, '30 Day'),
        (product_record.id, 'lifetime', 199.00, 'Lifetime');
    ELSIF product_record.name = 'Rainbow Six Siege' THEN
      INSERT INTO public.product_variants (product_id, duration, price, label) VALUES
        (product_record.id, '1day', 6.90, '1 Day'),
        (product_record.id, '1week', 29.90, '7 Day'),
        (product_record.id, '1month', 54.90, '30 Day');
    ELSIF product_record.name = 'Delta Force' THEN
      INSERT INTO public.product_variants (product_id, duration, price, label) VALUES
        (product_record.id, '1day', 7.90, '1 Day'),
        (product_record.id, '1week', 29.90, '7 Day'),
        (product_record.id, '1month', 49.90, '30 Day');
    END IF;
  END LOOP;
END $$;
