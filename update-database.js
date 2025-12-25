const SUPABASE_URL = 'https://rucygmkwvmkzbxydoglm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Y3lnbWt3dm1remJ4eWRvZ2xtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTYzMTMsImV4cCI6MjA4MjE3MjMxM30.5HORNuSF2hBZo1hLQ8B-SPMtVqhlrgoEB8-nepl9xc4';

const newProducts = [
  {
    name: 'PUBG',
    description: 'Powerful PUBG suite for both ranked and casual.',
    price: 5.90,
    category: 'cheats',
    status: 'undetected',
    features: ['ESP', 'Aimbot', 'No Recoil', 'Radar', 'Undetected'],
    is_featured: true
  },
  {
    name: 'Arc Raiders',
    description: 'Premium advantage suite for Arc Raiders.',
    price: 8.90,
    category: 'cheats',
    status: 'undetected',
    features: ['ESP', 'Aimbot', 'Loot ESP', 'Player ESP', 'Safe'],
    is_featured: true
  },
  {
    name: 'Marvel Rivals',
    description: 'Competitive tools for Marvel Rivals ranked play.',
    price: 10.90,
    category: 'cheats',
    status: 'undetected',
    features: ['Aimbot', 'ESP', 'Ability ESP', 'Ultimate Tracker', 'Undetected'],
    is_featured: true
  },
  {
    name: 'BO7',
    description: 'High-impact suite for Black Ops 7.',
    price: 7.90,
    category: 'cheats',
    status: 'undetected',
    features: ['Aimbot', 'Wallhack', 'Radar', 'No Recoil', 'Safe Mode'],
    is_featured: false
  },
  {
    name: 'Rust',
    description: 'Undetected Rust tool focused on legit gameplay.',
    price: 9.90,
    category: 'cheats',
    status: 'undetected',
    features: ['ESP', 'Aimbot', 'Loot ESP', 'Player ESP', 'Anti-Aim'],
    is_featured: false
  },
  {
    name: 'Fortnite',
    description: 'Smooth, low-FOV Fortnite advantage built for wins.',
    price: 11.90,
    category: 'cheats',
    status: 'undetected',
    features: ['Aimbot', 'ESP', 'Loot ESP', 'Build ESP', 'Undetected'],
    is_featured: true
  },
  {
    name: 'Fortnite Accounts (Full Access)',
    description: 'Instant full-access Fortnite accounts with rare skins.',
    price: 15.99,
    category: 'accounts',
    status: 'undetected',
    features: ['Full Access', 'Rare Skins', 'Instant Delivery', 'Warranty', 'Email Changeable'],
    is_featured: true
  },
  {
    name: 'Apex Legends',
    description: 'Configurable Apex Legends suite for ranked grinders.',
    price: 7.90,
    category: 'cheats',
    status: 'undetected',
    features: ['Aimbot', 'ESP', 'Glow ESP', 'Item ESP', 'Safe'],
    is_featured: false
  },
  {
    name: 'Valorant',
    description: 'Low-Risk Valorant tool with clean wall info and helpers.',
    price: 7.90,
    category: 'cheats',
    status: 'undetected',
    features: ['ESP', 'Aimbot', 'Triggerbot', 'Radar', 'Undetected'],
    is_featured: false
  },
  {
    name: 'HWID Spoofer',
    description: 'Clean slate HWID spoofer for supported games.',
    price: 19.99,
    category: 'tools',
    status: 'undetected',
    features: ['HWID Spoof', 'Instant', 'Safe', 'Multi-Game', 'Unban'],
    is_featured: true
  },
  {
    name: 'Battlefield 6',
    description: 'Large-scale Battlefield 6 tool with conquest and beyond.',
    price: 11.99,
    category: 'cheats',
    status: 'undetected',
    features: ['Aimbot', 'ESP', 'Vehicle ESP', 'Radar', 'Undetected'],
    is_featured: false
  },
  {
    name: 'Rainbow Six Siege',
    description: 'Tactical R6 tool with clean wall info and helpers.',
    price: 6.99,
    category: 'cheats',
    status: 'undetected',
    features: ['ESP', 'Aimbot', 'Gadget ESP', 'Recoil Control', 'Safe'],
    is_featured: false
  },
  {
    name: 'Delta Force',
    description: 'Next-gen Delta Force advantage pack.',
    price: 7.90,
    category: 'cheats',
    status: 'undetected',
    features: ['ESP', 'Aimbot', 'Loot ESP', 'Player ESP', 'Undetected'],
    is_featured: true
  }
];

async function updateDatabase() {
  try {
    // Step 1: Create the table and enum if they don't exist
    console.log('Creating database schema...');
    const createTableSQL = `
-- Create enum for product status
DO $$ BEGIN
  CREATE TYPE public.product_status AS ENUM ('undetected', 'testing', 'updating', 'down');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;

-- Products are publicly readable
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Only authenticated users can modify
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

-- Delete all existing products
DELETE FROM public.products;
`;

    const sqlResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: createTableSQL })
    });

    console.log('Schema creation response:', sqlResponse.status);

    // Step 2: Insert new products
    console.log('Inserting new products...');
    const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(newProducts)
    });

    if (insertResponse.ok) {
      console.log('✅ Successfully updated database with new products!');
    } else {
      const error = await insertResponse.text();
      console.error('❌ Error inserting products:', error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateDatabase();
