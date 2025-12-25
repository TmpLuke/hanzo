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

const newProducts = [
  {
    name: 'DirectSand Private',
    description: 'Premium private Fortnite cheat with advanced features. Undetected and regularly updated for maximum performance.',
    price: 14.99,
    category: 'cheats',
    image_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=400&fit=crop',
    features: [
      'Aimbot with customizable FOV',
      'ESP (Player, Loot, Vehicles)',
      'No Recoil & No Spread',
      'Radar Hack',
      'Stream-proof mode',
      'Regular updates',
      'Private build - Limited slots',
      '24/7 Discord support'
    ],
    is_featured: true,
    status: 'active',
    rating: 4.8,
    reviews: 127
  },
  {
    name: 'X (Twitter) Accounts',
    description: 'Premium aged X (Twitter) accounts with followers and activity. Perfect for marketing and social media management.',
    price: 9.99,
    category: 'accounts',
    image_url: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600&h=400&fit=crop',
    features: [
      'Aged accounts (6+ months)',
      '500-2000 followers',
      'Verified email included',
      'Active posting history',
      'No bans or restrictions',
      'Instant delivery',
      'Replacement guarantee',
      'Discord support'
    ],
    is_featured: false,
    status: 'active',
    rating: 4.6,
    reviews: 89
  },
  {
    name: 'Twitch Accounts',
    description: 'Premium Twitch accounts with followers and watch time. Ready for streaming or viewbotting services.',
    price: 12.99,
    category: 'accounts',
    image_url: 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=600&h=400&fit=crop',
    features: [
      'Aged accounts (3+ months)',
      '100-500 followers',
      'Email access included',
      'Watch time history',
      'No bans or warnings',
      'Affiliate ready',
      'Instant delivery',
      'Discord support'
    ],
    is_featured: false,
    status: 'active',
    rating: 4.7,
    reviews: 64
  }
];

async function addProducts() {
  console.log('🚀 Adding new products to database...\n');

  for (const product of newProducts) {
    console.log(`Adding: ${product.name}...`);
    
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
      console.log(`✅ Added ${product.name} (ID: ${productId})`);

      // Add variants for each product
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
        console.error(`❌ Error adding variants for ${product.name}:`, variantError.message);
      } else {
        console.log(`   ✅ Added variants for ${product.name}`);
      }
    }
    console.log('');
  }

  console.log('✅ All products added successfully!');
}

addProducts().catch(console.error);
