const SUPABASE_URL = 'https://rucygmkwvmkzbxydoglm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Y3lnbWt3dm1remJ4eWRvZ2xtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTYzMTMsImV4cCI6MjA4MjE3MjMxM30.5HORNuSF2hBZo1hLQ8B-SPMtVqhlrgoEB8-nepl9xc4';

async function checkOrders() {
  try {
    console.log('📊 Fetching all orders...\n');
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    const orders = await response.json();
    
    if (response.ok) {
      console.log(`✅ Found ${orders.length} orders\n`);
      console.log('='.repeat(80));
      
      let totalRevenue = 0;
      let completedCount = 0;
      
      orders.forEach((order, index) => {
        console.log(`\n${index + 1}. Order ID: ${order.id}`);
        console.log('-'.repeat(80));
        console.log(`Customer: ${order.customer_email || 'N/A'}`);
        console.log(`Product: ${order.product_name}`);
        console.log(`Amount: $${order.amount}`);
        console.log(`Status: ${order.status}`);
        console.log(`Payment ID: ${order.payment_id || 'N/A'}`);
        console.log(`Created: ${order.created_at}`);
        
        if (order.status === 'completed') {
          totalRevenue += Number(order.amount);
          completedCount++;
        }
      });
      
      console.log('\n' + '='.repeat(80));
      console.log(`\n📈 Summary:`);
      console.log(`   Total Orders: ${orders.length}`);
      console.log(`   Completed Orders: ${completedCount}`);
      console.log(`   Total Revenue: $${totalRevenue.toFixed(2)}`);
      
      // Check for duplicates
      const paymentIds = orders.map(o => o.payment_id).filter(Boolean);
      const duplicates = paymentIds.filter((id, index) => paymentIds.indexOf(id) !== index);
      
      if (duplicates.length > 0) {
        console.log(`\n⚠️  WARNING: Found ${duplicates.length} duplicate payment IDs!`);
        duplicates.forEach(id => {
          const dupes = orders.filter(o => o.payment_id === id);
          console.log(`\n   Payment ID: ${id}`);
          dupes.forEach(d => console.log(`     - Order ${d.id}: $${d.amount} (${d.status})`));
        });
      }
      
    } else {
      console.error('❌ Error:', orders);
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

checkOrders();
