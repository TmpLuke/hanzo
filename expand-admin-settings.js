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

async function expandAdminSettings() {
  console.log('🔧 Expanding admin_settings table...\n');
  console.log('⚠️  You need to run this SQL in Supabase SQL Editor:\n');
  console.log('─'.repeat(70));
  console.log(`
-- Add all necessary columns to admin_settings table
ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS site_name TEXT DEFAULT 'Hanzo';
ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS site_description TEXT DEFAULT 'Premium digital products for content creators';
ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS support_email TEXT DEFAULT 'support@hanzo.gg';
ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS sellhub_api_key TEXT;
ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS sellhub_webhook_secret TEXT;
ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS platform_fee DECIMAL(5,2) DEFAULT 2.5;
ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true;
ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS order_alerts BOOLEAN DEFAULT true;
ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS low_stock_alerts BOOLEAN DEFAULT true;
ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false;
ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS ip_whitelist TEXT;
ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT false;
ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS show_announcement BOOLEAN DEFAULT true;
ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS announcement_text TEXT DEFAULT 'WINTER & CHRISTMAS SALE IS HERE! Use Coupon Code: HANZO10 for 10% OFF EVERYTHING!';

-- Disable RLS on admin_settings
ALTER TABLE admin_settings DISABLE ROW LEVEL SECURITY;
  `);
  console.log('─'.repeat(70));
  console.log('\n🔗 Go to: https://supabase.com/dashboard/project/rucygmkwvmkzbxydoglm/sql/new');
  console.log('\n✅ After running the SQL, your admin settings will save properly!');
}

expandAdminSettings().catch(console.error);
