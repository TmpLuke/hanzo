import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupDuplicateOrders() {
  console.log('🔍 Finding duplicate orders...\n');

  // Find all orders grouped by payment_id
  const { data: allOrders, error: fetchError } = await supabase
    .from('orders')
    .select('*')
    .not('payment_id', 'is', null)
    .order('created_at', { ascending: true });

  if (fetchError) {
    console.error('❌ Error fetching orders:', fetchError);
    return;
  }

  // Group by payment_id
  const ordersByPaymentId = {};
  allOrders.forEach(order => {
    if (!ordersByPaymentId[order.payment_id]) {
      ordersByPaymentId[order.payment_id] = [];
    }
    ordersByPaymentId[order.payment_id].push(order);
  });

  // Find duplicates
  const duplicates = [];
  Object.entries(ordersByPaymentId).forEach(([paymentId, orders]) => {
    if (orders.length > 1) {
      // Keep the first one, mark rest as duplicates
      const [keep, ...remove] = orders;
      console.log(`\n📦 Payment ID: ${paymentId}`);
      console.log(`   ✅ Keeping: Order ${keep.order_number} (${keep.id})`);
      orders.slice(1).forEach(dup => {
        console.log(`   ❌ Removing: Order ${dup.order_number} (${dup.id})`);
        duplicates.push(dup.id);
      });
    }
  });

  if (duplicates.length === 0) {
    console.log('\n✅ No duplicates found!');
    return;
  }

  console.log(`\n🗑️  Found ${duplicates.length} duplicate orders to remove`);
  console.log('⏳ Deleting duplicates...\n');

  // Delete duplicates
  const { error: deleteError } = await supabase
    .from('orders')
    .delete()
    .in('id', duplicates);

  if (deleteError) {
    console.error('❌ Error deleting duplicates:', deleteError);
    return;
  }

  console.log(`✅ Successfully removed ${duplicates.length} duplicate orders!`);
  console.log('💰 Your revenue balance should now be correct.\n');
}

cleanupDuplicateOrders().catch(console.error);
