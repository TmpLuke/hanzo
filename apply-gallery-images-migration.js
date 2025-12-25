import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Need: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  console.log('🔧 Adding gallery_images column to products table...\n');
  
  try {
    // Try to add the column using a simple update (this will fail but we can check the error)
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('gallery_images')
      .limit(1);
    
    if (testError && testError.message.includes('gallery_images')) {
      console.log('✅ Column does not exist yet, needs to be added.\n');
      console.log('📋 Please run this SQL in your Supabase SQL Editor:\n');
      console.log('━'.repeat(60));
      console.log('ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_images text[];');
      console.log('━'.repeat(60));
      console.log('\n🔗 Open SQL Editor: https://supabase.com/dashboard/project/_/sql\n');
      console.log('Or use the add-gallery-images-column.html file in your browser.');
    } else if (!testError) {
      console.log('✅ Column already exists! You\'re all set.');
    } else {
      console.error('❌ Error checking column:', testError);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

applyMigration();
