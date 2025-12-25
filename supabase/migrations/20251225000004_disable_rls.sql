-- Disable RLS on all tables to allow admin operations
-- In production, you should implement proper RLS policies with authentication

-- Disable RLS on products table
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Disable RLS on product_variants table
ALTER TABLE product_variants DISABLE ROW LEVEL SECURITY;

-- Disable RLS on orders table
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Disable RLS on settings table (if it exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'settings') THEN
        ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;
