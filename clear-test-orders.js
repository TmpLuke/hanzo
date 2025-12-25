import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function clearOrders() {
  console.log('⚠️  Deleting all test orders...\n');
  
  const { error } = await supabase
    .from('orders')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log('✅ All test orders deleted!');
  console.log('💰 Revenue is now $0.00');
  console.log('\nYour bot stats will now show clean data.');
}

clearOrders();
