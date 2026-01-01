import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
    console.log('🔧 Applying unique constraint to prevent duplicate orders...\n');

    try {
      // Add unique constraint on payment_id
      const { error: constraintError } = await supabase.rpc('exec', {
          query: 'ALTER TABLE orders ADD CONSTRAINT orders_payment_id_unique UNIQUE (payment_id);'
      });

      if (constraintError) {
          // Try alternative method - direct SQL execution
          console.log('⚠️  RPC method failed, trying alternative...');

          // Check if constraint already exists
          const { data: constraints } = await supabase
              .from('information_schema.table_constraints')
              .select('constraint_name')
              .eq('table_name', 'orders')
              .eq('constraint_name', 'orders_payment_id_unique');

          if (constraints && constraints.length > 0) {
              console.log('✅ Unique constraint already exists!');
          } else {
              console.log('⚠️  Please apply this SQL manually in Supabase SQL Editor:');
              console.log('\n' + '='.repeat(60));
              console.log('ALTER TABLE orders ADD CONSTRAINT orders_payment_id_unique UNIQUE (payment_id);');
              console.log('CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);');
              console.log('='.repeat(60) + '\n');
          }
      } else {
          console.log('✅ Unique constraint added successfully!');
      }

      // Add index for performance
      console.log('📊 Adding index for better query performance...');
      const { error: indexError } = await supabase.rpc('exec', {
          query: 'CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);'
      });

      if (!indexError) {
          console.log('✅ Index created successfully!');
      }

      console.log('\n✨ Migration complete! Future duplicate orders will be prevented.\n');
  } catch (error) {
      console.error('❌ Error:', error);
      console.log('\n⚠️  Please apply the migration manually in Supabase SQL Editor.');
  }
}

applyMigration().catch(console.error);
