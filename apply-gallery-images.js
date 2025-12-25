import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('Adding gallery_images column to products table...');
  
  try {
    // Note: This uses raw SQL which requires service role key
    // For now, you'll need to run this migration manually in Supabase SQL editor
    console.log('\n⚠️  Please run this SQL in your Supabase SQL Editor:');
    console.log('\nALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_images text[];');
    console.log('\nOr apply the migration file: supabase/migrations/20251225000007_add_gallery_images.sql');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

applyMigration();
