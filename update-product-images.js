import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Using a generic gaming/cart icon image that works for all products
const PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=600&fit=crop';

async function updateAllProductImages() {
  console.log('🎨 Updating all product images to use the same cart icon...\n');

  try {
    // Get all products
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name');

    if (fetchError) {
      console.error('❌ Failed to fetch products:', fetchError.message);
      process.exit(1);
    }

    console.log(`Found ${products.length} products to update\n`);

    // Update each product with the same image
    for (const product of products) {
      const { error } = await supabase
        .from('products')
        .update({ image_url: PRODUCT_IMAGE })
        .eq('id', product.id);

      if (error) {
        console.error(`❌ Failed to update ${product.name}:`, error.message);
      } else {
        console.log(`✅ Updated ${product.name}`);
      }
    }

    console.log('\n✨ All products now have the same image!');
    console.log('🔄 Refresh your product pages to see the changes.');

  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

updateAllProductImages();
