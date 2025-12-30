import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function restoreProducts() {
  console.log('🔄 Restoring products from SQL migration...\n');

  try {
    // Clear existing products
    console.log('Clearing old products...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('❌ Error clearing products:', deleteError.message);
      return;
    }

    // Insert new products
    const products = [
      { name: 'PUBG', description: 'Powerful PUBG suite for both ranked and casual.', price: 5.90, category: 'cheats', status: 'undetected', features: ['ESP', 'Aimbot', 'No Recoil', 'Radar', 'Undetected'], is_featured: true },
      { name: 'Arc Raiders', description: 'Premium advantage suite for Arc Raiders.', price: 8.90, category: 'cheats', status: 'undetected', features: ['ESP', 'Aimbot', 'Loot ESP', 'Player ESP', 'Safe'], is_featured: true },
      { name: 'Marvel Rivals', description: 'Competitive tools for Marvel Rivals ranked play.', price: 10.90, category: 'cheats', status: 'undetected', features: ['Aimbot', 'ESP', 'Ability ESP', 'Ultimate Tracker', 'Undetected'], is_featured: true },
      { name: 'BO7', description: 'High-impact suite for Black Ops 7.', price: 7.90, category: 'cheats', status: 'undetected', features: ['Aimbot', 'Wallhack', 'Radar', 'No Recoil', 'Safe Mode'], is_featured: false },
      { name: 'Rust', description: 'Undetected Rust tool focused on legit gameplay.', price: 9.90, category: 'cheats', status: 'undetected', features: ['ESP', 'Aimbot', 'Loot ESP', 'Player ESP', 'Anti-Aim'], is_featured: false },
      { name: 'Fortnite', description: 'Smooth, low-FOV Fortnite advantage built for wins.', price: 11.90, category: 'cheats', status: 'undetected', features: ['Aimbot', 'ESP', 'Loot ESP', 'Build ESP', 'Undetected'], is_featured: true },
      { name: 'Fortnite Accounts (Full Access)', description: 'Instant full-access Fortnite accounts with rare skins.', price: 15.99, category: 'accounts', status: 'undetected', features: ['Full Access', 'Rare Skins', 'Instant Delivery', 'Warranty', 'Email Changeable'], is_featured: true },
      { name: 'Apex Legends', description: 'Configurable Apex Legends suite for ranked grinders.', price: 7.90, category: 'cheats', status: 'undetected', features: ['Aimbot', 'ESP', 'Glow ESP', 'Item ESP', 'Safe'], is_featured: false },
      { name: 'Valorant', description: 'Low-Risk Valorant tool with clean wall info and helpers.', price: 7.90, category: 'cheats', status: 'undetected', features: ['ESP', 'Aimbot', 'Triggerbot', 'Radar', 'Undetected'], is_featured: false },
      { name: 'HWID Spoofer', description: 'Clean slate HWID spoofer for supported games.', price: 19.99, category: 'tools', status: 'undetected', features: ['HWID Spoof', 'Instant', 'Safe', 'Multi-Game', 'Unban'], is_featured: true },
      { name: 'Battlefield 6', description: 'Large-scale Battlefield 6 tool with conquest and beyond.', price: 11.99, category: 'cheats', status: 'undetected', features: ['Aimbot', 'ESP', 'Vehicle ESP', 'Radar', 'Undetected'], is_featured: false },
      { name: 'Rainbow Six Siege', description: 'Tactical R6 tool with clean wall info and helpers.', price: 6.99, category: 'cheats', status: 'undetected', features: ['ESP', 'Aimbot', 'Gadget ESP', 'Recoil Control', 'Safe'], is_featured: false },
      { name: 'Delta Force', description: 'Next-gen Delta Force advantage pack.', price: 7.90, category: 'cheats', status: 'undetected', features: ['ESP', 'Aimbot', 'Loot ESP', 'Player ESP', 'Undetected'], is_featured: true }
    ];

    console.log(`\nInserting ${products.length} products...\n`);

    for (const product of products) {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();

      if (error) {
        console.error(`❌ Error adding ${product.name}:`, error.message);
        continue;
      }

      if (data && data.length > 0) {
        const productId = data[0].id;
        console.log(`✅ Added ${product.name}`);

        // Add variants
        const variants = [
          { product_id: productId, duration: '1day', price: product.price, label: '1 Day' },
          { product_id: productId, duration: '1week', price: product.price * 5, label: '1 Week' },
          { product_id: productId, duration: '1month', price: product.price * 15, label: '1 Month' },
          { product_id: productId, duration: 'lifetime', price: product.price * 50, label: 'Lifetime' }
        ];

        const { error: variantError } = await supabase
          .from('product_variants')
          .insert(variants);

        if (variantError) {
          console.error(`   ⚠️ Error adding variants:`, variantError.message);
        }
      }
    }

    console.log('\n✅ All products restored successfully!');
  } catch (error) {
    console.error('❌ Restoration failed:', error.message);
  }
}

restoreProducts();
