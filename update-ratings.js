import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateRatings() {
  console.log('📊 Updating product ratings and reviews...\n');

  const updates = [
    { name: 'PUBG', rating: 4.9, reviews: 342 },
    { name: 'BO7', rating: 4.6, reviews: 187 },
    { name: 'Rust', rating: 4.7, reviews: 256 },
    { name: 'Fortnite', rating: 4.8, reviews: 421 },
    { name: 'Apex Legends', rating: 4.5, reviews: 163 },
    { name: 'Valorant', rating: 4.7, reviews: 298 },
    { name: 'HWID Spoofer', rating: 4.9, reviews: 512 },
    { name: 'Battlefield 6', rating: 4.4, reviews: 89 },
    { name: 'Rainbow Six Siege', rating: 4.6, reviews: 234 },
    { name: 'Delta Force', rating: 4.8, reviews: 376 },
    { name: 'Arc Raiderssss', rating: 4.3, reviews: 127 },
    { name: 'Marvel Rivalssa', rating: 4.9, reviews: 445 },
  ];

  for (const update of updates) {
    const { data, error } = await supabase
      .from('products')
      .update({ rating: update.rating, reviews: update.reviews })
      .eq('name', update.name)
      .select();

    if (error) {
      console.error(`❌ Error updating ${update.name}:`, error.message);
    } else if (data && data.length > 0) {
      console.log(`✅ ${update.name}: ${update.rating} ⭐ (${update.reviews} reviews)`);
    } else {
      console.log(`⚠️  ${update.name}: Not found in database`);
    }
  }

  console.log('\n✨ Done! Ratings updated successfully.');
}

updateRatings().catch(console.error);
