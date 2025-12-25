import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function checkOrders() {
  console.log('Checking orders in database...\n');
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  if (!orders || orders.length === 0) {
    console.log('✅ No orders found - database is clean!');
    return;
  }
  
  console.log(`Found ${orders.length} orders:\n`);
  
  let totalRevenue = 0;
  orders.forEach((order, i) => {
    console.log(`${i + 1}. ${order.order_number}`);
    console.log(`   Product: ${order.product_name}`);
    console.log(`   Amount: $${order.amount}`);
    console.log(`   Status: ${order.status}`);
    console.log(`   Customer: ${order.customer_email}`);
    console.log(`   Date: ${new Date(order.created_at).toLocaleString()}\n`);
    totalRevenue += parseFloat(order.amount);
  });
  
  console.log(`💰 Total Revenue: $${totalRevenue.toFixed(2)}`);
}

checkOrders();
