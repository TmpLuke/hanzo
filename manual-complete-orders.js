const SUPABASE_URL = 'https://rucygmkwvmkzbxydoglm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Y3lnbWt3dm1remJ4eWRvZ2xtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTYzMTMsImV4cCI6MjA4MjE3MjMxM30.5HORNuSF2hBZo1hLQ8B-SPMtVqhlrgoEB8-nepl9xc4';

// Get payment ID from command line
const paymentId = process.argv[2];

if (!paymentId) {
  console.log('Usage: node manual-complete-orders.js <payment_id>');
  console.log('\nExample: node manual-complete-orders.js 2df0bcf0-9889-40b3-b633-c218bf3dbb16');
  process.exit(1);
}

async function completeOrder() {
  try {
    console.log(`🔍 Finding order with payment ID: ${paymentId}\n`);
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders?payment_id=eq.${paymentId}&select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    const orders = await response.json();
    
    if (!response.ok || orders.length === 0) {
      console.error('❌ Order not found');
      return;
    }

    const order = orders[0];
    
    console.log(`Found order:`);
    console.log(`  ID: ${order.id}`);
    console.log(`  Customer: ${order.customer_email}`);
    console.log(`  Product: ${order.product_name}`);
    console.log(`  Amount: $${order.amount}`);
    console.log(`  Status: ${order.status}\n`);

    if (order.status === 'completed') {
      console.log('✅ Order already completed!');
      return;
    }

    console.log('Marking as completed...');
    
    const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${order.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        status: 'completed',
        updated_at: new Date().toISOString()
      })
    });

    if (updateResponse.ok) {
      console.log('✅ Order marked as completed!');
      console.log('\n💡 Make sure to configure MoneyMotion webhook URL:');
      console.log('   https://rucygmkwvmkzbxydoglm.supabase.co/functions/v1/moneymotion-webhook');
    } else {
      console.error('❌ Failed to update order');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

completeOrder();
