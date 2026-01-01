import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

console.log('🔧 Applying database constraint using Supabase client...\n');

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'public' },
  auth: { persistSession: false }
});

async function applyConstraintViaQuery() {
  try {
    // Method 1: Try using raw SQL query via Supabase client
    console.log('📝 Attempting to add unique constraint on payment_id...\n');

    // First, check if constraint already exists by querying pg_constraint
    const { data: existingConstraints, error: checkError } = await supabase
      .from('pg_constraint')
      .select('conname')
      .eq('conname', 'orders_payment_id_unique')
      .limit(1);

    if (!checkError && existingConstraints && existingConstraints.length > 0) {
      console.log('✅ Unique constraint already exists!');
      console.log('✅ Database is already protected from duplicate orders.\n');
      return;
    }

    // If we can't check, try to add it anyway (will fail gracefully if exists)
    console.log('⚙️  Attempting to create constraint...\n');

    // Use the REST API directly to execute SQL
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

    if (!projectRef) {
      throw new Error('Could not extract project reference from Supabase URL');
    }

    console.log(`📡 Project: ${projectRef}`);
    console.log('🔑 Using service role key to execute SQL...\n');

    // Execute SQL using Supabase's query endpoint
    const sqlQuery = `
      DO $$ 
      BEGIN
        -- Add unique constraint if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'orders_payment_id_unique'
        ) THEN
          ALTER TABLE orders ADD CONSTRAINT orders_payment_id_unique UNIQUE (payment_id);
          RAISE NOTICE 'Unique constraint added';
        ELSE
          RAISE NOTICE 'Constraint already exists';
        END IF;
        
        -- Add index if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_payment_id'
        ) THEN
          CREATE INDEX idx_orders_payment_id ON orders(payment_id);
          RAISE NOTICE 'Index created';
        ELSE
          RAISE NOTICE 'Index already exists';
        END IF;
      END $$;
    `;

    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: sqlQuery })
    });

    const responseText = await response.text();

    if (response.ok) {
      console.log('✅ SQL executed successfully!');
      console.log('✅ Unique constraint has been applied to the orders table.');
      console.log('✅ Index created for better performance.\n');
      console.log('🎉 Your database is now protected from duplicate orders!\n');
    } else {
      console.log('⚠️  Direct SQL execution not available.');
      console.log('Response:', responseText);
      console.log('\n📋 Manual SQL needed - copy and paste this into Supabase SQL Editor:\n');
      console.log('='.repeat(70));
      console.log('ALTER TABLE orders ADD CONSTRAINT orders_payment_id_unique UNIQUE (payment_id);');
      console.log('CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);');
      console.log('='.repeat(70));
      console.log(`\n🔗 Go to: https://supabase.com/dashboard/project/${projectRef}/sql/new\n`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📋 Please apply this SQL manually in Supabase SQL Editor:\n');
    console.log('='.repeat(70));
    console.log('ALTER TABLE orders ADD CONSTRAINT orders_payment_id_unique UNIQUE (payment_id);');
    console.log('CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);');
    console.log('='.repeat(70));
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    if (projectRef) {
      console.log(`\n🔗 Go to: https://supabase.com/dashboard/project/${projectRef}/sql/new\n`);
    }
  }
}

applyConstraintViaQuery().catch(console.error);
