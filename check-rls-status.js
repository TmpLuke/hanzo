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

async function checkRLS() {
  console.log('🔍 Checking RLS status and testing operations...\n');

  const tables = ['products', 'product_variants', 'orders', 'admin_settings'];

  for (const table of tables) {
    console.log(`\n📋 Testing ${table}:`);
    
    // Try to read
    const { data: readData, error: readError } = await supabase
      .from(table)
      .select('*')
      .limit(1);
    
    if (readError) {
      console.log(`  ❌ READ: ${readError.message}`);
    } else {
      console.log(`  ✅ READ: OK (${readData?.length || 0} rows)`);
    }

    // Try to update (if we have data)
    if (readData && readData.length > 0) {
      const firstRow = readData[0];
      const { error: updateError } = await supabase
        .from(table)
        .update({ updated_at: new Date().toISOString() })
        .eq('id', firstRow.id);
      
      if (updateError) {
        console.log(`  ❌ UPDATE: ${updateError.message}`);
      } else {
        console.log(`  ✅ UPDATE: OK`);
      }
    }
  }

  console.log('\n\n📝 TO FIX: Run this SQL in Supabase SQL Editor:');
  console.log('─'.repeat(60));
  console.log(`
-- Disable RLS on all tables
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings DISABLE ROW LEVEL SECURITY;
  `);
  console.log('─'.repeat(60));
  console.log('\n🔗 Go to: https://supabase.com/dashboard/project/rucygmkwvmkzbxydoglm/sql/new');
}

checkRLS().catch(console.error);
