import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('Applying categories migration...');
  
  const sql = readFileSync('./supabase/migrations/20251226000001_add_categories.sql', 'utf8');
  
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    console.error('Migration failed:', error);
    console.log('\nTrying alternative method...');
    
    // Try executing statements one by one
    const statements = sql.split(';').filter(s => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        const { error: stmtError } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
        if (stmtError) {
          console.error('Statement failed:', statement.substring(0, 100) + '...');
          console.error('Error:', stmtError);
        } else {
          console.log('✓ Statement executed');
        }
      }
    }
  } else {
    console.log('✓ Migration applied successfully!');
  }
  
  // Verify categories were created
  const { data: categories, error: fetchError } = await supabase
    .from('categories')
    .select('*');
  
  if (fetchError) {
    console.error('Could not fetch categories:', fetchError);
  } else {
    console.log(`\n✓ Found ${categories.length} categories:`);
    categories.forEach(cat => console.log(`  - ${cat.name} (${cat.slug})`));
  }
}

applyMigration();
