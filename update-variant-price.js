import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as readline from 'readline';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function listProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name')
    .order('name');

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return products;
}

async function listVariants(productId) {
  const { data: variants, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', productId)
    .order('price');

  if (error) {
    console.error('Error fetching variants:', error);
    return [];
  }

  return variants;
}

async function updateVariantPrice(variantId, newPrice) {
  const { error } = await supabase
    .from('product_variants')
    .update({ price: newPrice })
    .eq('id', variantId);

  if (error) {
    console.error('Error updating variant:', error);
    return false;
  }

  return true;
}

async function main() {
  console.log('💰 Variant Price Updater\n');

  // List products
  const products = await listProducts();
  if (products.length === 0) {
    console.log('No products found');
    rl.close();
    return;
  }

  console.log('📦 Products:');
  products.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name}`);
  });

  const productIndex = await question('\nSelect product number: ');
  const selectedProduct = products[parseInt(productIndex) - 1];

  if (!selectedProduct) {
    console.log('Invalid selection');
    rl.close();
    return;
  }

  console.log(`\n✅ Selected: ${selectedProduct.name}\n`);

  // List variants
  const variants = await listVariants(selectedProduct.id);
  if (variants.length === 0) {
    console.log('No variants found for this product');
    rl.close();
    return;
  }

  console.log('💎 Variants:');
  variants.forEach((v, i) => {
    console.log(`  ${i + 1}. ${v.label} - $${Number(v.price).toFixed(2)}`);
  });

  const variantIndex = await question('\nSelect variant number to update: ');
  const selectedVariant = variants[parseInt(variantIndex) - 1];

  if (!selectedVariant) {
    console.log('Invalid selection');
    rl.close();
    return;
  }

  console.log(`\n✅ Selected: ${selectedVariant.label} (Current: $${Number(selectedVariant.price).toFixed(2)})`);

  const newPrice = await question('Enter new price: $');
  const priceNum = parseFloat(newPrice);

  if (isNaN(priceNum) || priceNum < 0) {
    console.log('Invalid price');
    rl.close();
    return;
  }

  console.log(`\n🔄 Updating ${selectedVariant.label} from $${Number(selectedVariant.price).toFixed(2)} to $${priceNum.toFixed(2)}...`);

  const success = await updateVariantPrice(selectedVariant.id, priceNum);

  if (success) {
    console.log('✅ Price updated successfully!');
  } else {
    console.log('❌ Failed to update price');
  }

  rl.close();
}

main().catch(console.error);
