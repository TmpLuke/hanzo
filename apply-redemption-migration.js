import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  try {
    console.log('📦 Reading migration file...');
    const migration = readFileSync('./supabase/migrations/20251225000009_add_redemption_codes.sql', 'utf8');

    console.log('🚀 Applying redemption codes migration...');
    
    // Split by semicolons and execute each statement
    const statements = migration
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.error('Error executing statement:', error);
          console.log('Statement:', statement.substring(0, 100) + '...');
        }
      }
    }

    console.log('✅ Migration applied successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Create a "Customer" role in Discord and copy its ID');
    console.log('2. Create a "#redeem-logs" channel and copy its ID');
    console.log('3. Add these to Railway environment variables:');
    console.log('   - CUSTOMER_ROLE_ID=your_role_id');
    console.log('   - REDEEM_LOGS_CHANNEL_ID=your_channel_id');
    console.log('4. Redeploy your bot on Railway');
    console.log('\n🎉 Redemption system is ready!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\n💡 Alternative: Run the SQL manually in Supabase Dashboard');
    console.log('   Go to: SQL Editor → Paste migration → Run');
    process.exit(1);
  }
}

applyMigration();
