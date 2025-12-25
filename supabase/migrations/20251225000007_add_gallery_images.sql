-- Add gallery_images column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS gallery_images text[];

-- Add comment
COMMENT ON COLUMN products.gallery_images IS 'Array of image URLs for product detail page slideshow';
