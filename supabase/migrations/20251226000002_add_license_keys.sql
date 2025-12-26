-- Create license_keys table
CREATE TABLE IF NOT EXISTS license_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  license_key TEXT NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  used_by_email TEXT,
  used_at TIMESTAMP WITH TIME ZONE,
  order_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_delivery_settings table
CREATE TABLE IF NOT EXISTS product_delivery_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  delivery_type TEXT NOT NULL DEFAULT 'auto', -- 'auto' or 'manual'
  discord_message TEXT DEFAULT 'Please open a ticket at discord.gg/hanzo to receive your license key.',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, variant_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_license_keys_product_variant ON license_keys(product_id, variant_id);
CREATE INDEX IF NOT EXISTS idx_license_keys_is_used ON license_keys(is_used);
CREATE INDEX IF NOT EXISTS idx_license_keys_order_id ON license_keys(order_id);
CREATE INDEX IF NOT EXISTS idx_product_delivery_settings_lookup ON product_delivery_settings(product_id, variant_id);

-- Add license_key column to orders table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='orders' AND column_name='license_key') THEN
    ALTER TABLE orders ADD COLUMN license_key TEXT;
  END IF;
END $$;

-- Add delivery_type column to orders table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='orders' AND column_name='delivery_type') THEN
    ALTER TABLE orders ADD COLUMN delivery_type TEXT DEFAULT 'auto';
  END IF;
END $$;
