import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function disableRLS() {
  console.log('🔓 Disabling Row Level Security on tables...\n');

  // Note: RLS can only be disabled using the service role key or through Supabase dashboard
  // The anon key doesn't have permission to alter tables
  
  console.log('⚠️  To disable RLS, you need to:');
  console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
  console.log('2. Select your project: rucygmkwvmkzbxydoglm');
  console.log('3. Go to Database > Tables');
  console.log('4. For each table (products, product_variants, orders):');
  console.log('   - Click on the table');
  console.log('   - Go to "RLS" tab');
  console.log('   - Click "Disable RLS"');
  console.log('\nOR run this SQL in the SQL Editor:');
  console.log('\n-- Disable RLS on all tables');
  console.log('ALTER TABLE products DISABLE ROW LEVEL SECURITY;');
  console.log('ALTER TABLE product_variants DISABLE ROW LEVEL SECURITY;');
  console.log('ALTER TABLE orders DISABLE ROW LEVEL SECURITY;');
  console.log('\n✅ After disabling RLS, your admin panel will work!');
}

disableRLS().catch(console.error);
