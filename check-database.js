const SUPABASE_URL = 'https://rucygmkwvmkzbxydoglm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Y3lnbWt3dm1remJ4eWRvZ2xtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTYzMTMsImV4cCI6MjA4MjE3MjMxM30.5HORNuSF2hBZo1hLQ8B-SPMtVqhlrgoEB8-nepl9xc4';

async function checkDatabase() {
  try {
    console.log('Checking database connection...');
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Database connected! Found ${data.length} products`);
      if (data.length === 0) {
        console.log('\n⚠️  No products in database!');
        console.log('\nYou need to run this SQL in your Supabase dashboard:');
        console.log('https://rucygmkwvmkzbxydoglm.supabase.co/project/_/sql\n');
        console.log('Copy and paste this SQL:\n');
        console.log('-- First, disable RLS');
        console.log('ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;\n');
        console.log('-- Then insert products');
        console.log("INSERT INTO public.products (name, description, price, category, status, features, is_featured) VALUES");
        console.log("('PUBG', 'Powerful PUBG suite for both ranked and casual.', 5.90, 'cheats', 'undetected', ARRAY['ESP', 'Aimbot', 'No Recoil', 'Radar', 'Undetected'], true),");
        console.log("('Arc Raiders', 'Premium advantage suite for Arc Raiders.', 8.90, 'cheats', 'undetected', ARRAY['ESP', 'Aimbot', 'Loot ESP', 'Player ESP', 'Safe'], true),");
        console.log("('Marvel Rivals', 'Competitive tools for Marvel Rivals ranked play.', 10.90, 'cheats', 'undetected', ARRAY['Aimbot', 'ESP', 'Ability ESP', 'Ultimate Tracker', 'Undetected'], true),");
        console.log("('BO7', 'High-impact suite for Black Ops 7.', 7.90, 'cheats', 'undetected', ARRAY['Aimbot', 'Wallhack', 'Radar', 'No Recoil', 'Safe Mode'], false),");
        console.log("('Rust', 'Undetected Rust tool focused on legit gameplay.', 9.90, 'cheats', 'undetected', ARRAY['ESP', 'Aimbot', 'Loot ESP', 'Player ESP', 'Anti-Aim'], false),");
        console.log("('Fortnite', 'Smooth, low-FOV Fortnite advantage built for wins.', 11.90, 'cheats', 'undetected', ARRAY['Aimbot', 'ESP', 'Loot ESP', 'Build ESP', 'Undetected'], true),");
        console.log("('Apex Legends', 'Configurable Apex Legends suite for ranked grinders.', 7.90, 'cheats', 'undetected', ARRAY['Aimbot', 'ESP', 'Glow ESP', 'Item ESP', 'Safe'], false),");
        console.log("('Valorant', 'Low-Risk Valorant tool with clean wall info and helpers.', 7.90, 'cheats', 'undetected', ARRAY['ESP', 'Aimbot', 'Triggerbot', 'Radar', 'Undetected'], false),");
        console.log("('HWID Spoofer', 'Clean slate HWID spoofer for supported games.', 19.99, 'tools', 'undetected', ARRAY['HWID Spoof', 'Instant', 'Safe', 'Multi-Game', 'Unban'], true),");
        console.log("('Battlefield 6', 'Large-scale Battlefield 6 tool with conquest and beyond.', 11.99, 'cheats', 'undetected', ARRAY['Aimbot', 'ESP', 'Vehicle ESP', 'Radar', 'Undetected'], false),");
        console.log("('Rainbow Six Siege', 'Tactical R6 tool with clean wall info and helpers.', 6.99, 'cheats', 'undetected', ARRAY['ESP', 'Aimbot', 'Gadget ESP', 'Recoil Control', 'Safe'], false),");
        console.log("('Delta Force', 'Next-gen Delta Force advantage pack.', 7.90, 'cheats', 'undetected', ARRAY['ESP', 'Aimbot', 'Loot ESP', 'Player ESP', 'Undetected'], true);");
      } else {
        console.log('\n✅ Products found:');
        data.forEach(p => console.log(`  - ${p.name} ($${p.price})`));
      }
    } else {
      console.error('❌ Error:', data);
      if (data.message && data.message.includes('relation')) {
        console.log('\n⚠️  Products table does not exist!');
        console.log('\nGo to: https://rucygmkwvmkzbxydoglm.supabase.co/project/_/sql');
        console.log('\nRun the SQL from: supabase/migrations/20251224224218_a58dce0c-b0a7-4a4b-a122-9901acef8ea3.sql');
      }
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

checkDatabase();
