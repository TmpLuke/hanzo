-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Aimbots', 'aimbots', 'Precision targeting tools', 1),
  ('ESP', 'esp', 'Enhanced visual information', 2),
  ('Radar', 'radar', 'Advanced detection systems', 3),
  ('Spoofers', 'spoofers', 'Hardware ID protection', 4),
  ('Unlocks', 'unlocks', 'Game content unlocks', 5),
  ('Bundles', 'bundles', 'Package deals', 6)
ON CONFLICT (slug) DO NOTHING;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);
