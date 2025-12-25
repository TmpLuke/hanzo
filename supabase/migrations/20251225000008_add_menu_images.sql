-- Add menu_images column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS menu_images text[];

-- Add comment
COMMENT ON COLUMN products.menu_images IS 'Array of menu/feature image URLs shown below features section';
