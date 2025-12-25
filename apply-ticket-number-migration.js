import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function applyMigration() {
  console.log('📊 Applying ticket number migration...');
  
  const migration = fs.readFileSync('supabase/migrations/20251225000011_add_ticket_number.sql', 'utf8');
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: migration });
    
    if (error) {
      console.error('❌ Error applying migration:', error);
      console.log('\n⚠️  You may need to run this SQL manually in Supabase dashboard:');
      console.log(migration);
    } else {
      console.log('✅ Migration applied successfully!');
      console.log('✅ Ticket numbering system is ready!');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.log('\n📋 Run this SQL manually in Supabase SQL Editor:');
    console.log('─'.repeat(50));
    console.log(migration);
    console.log('─'.repeat(50));
  }
}

applyMigration();
