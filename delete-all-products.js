import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteAllProducts() {
  console.log('🗑️  Deleting all products...\n');

  try {
    // Delete all product variants first
    const variantsResult = await supabase
      .from('product_variants')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (variantsResult.error) {
      console.error('⚠️  Error deleting variants:', variantsResult.error.message);
    } else {
      console.log('✅ All variants deleted');
    }

    // Delete all products
    const productsResult = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (productsResult.error) {
      console.error('❌ Error deleting products:', productsResult.error.message);
    } else {
      console.log('✅ All products deleted');
    }

    console.log('\n✅ All products and variants have been removed!');
  } catch (err) {
    console.error('❌ Exception:', err);
  }
}

deleteAllProducts();
