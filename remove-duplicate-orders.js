const SUPABASE_URL = 'https://rucygmkwvmkzbxydoglm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Y3lnbWt3dm1remJ4eWRvZ2xtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTYzMTMsImV4cCI6MjA4MjE3MjMxM30.5HORNuSF2hBZo1hLQ8B-SPMtVqhlrgoEB8-nepl9xc4';

async function removeDuplicates() {
  try {
    console.log('🔍 Finding duplicate orders...\n');
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.asc`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    const orders = await response.json();
    
    if (!response.ok) {
      console.error('❌ Error fetching orders:', orders);
      return;
    }

    // Group by payment_id
    const grouped = {};
    orders.forEach(order => {
      if (order.payment_id) {
        if (!grouped[order.payment_id]) {
          grouped[order.payment_id] = [];
        }
        grouped[order.payment_id].push(order);
      }
    });

    // Find duplicates
    const duplicates = Object.entries(grouped).filter(([_, orders]) => orders.length > 1);
    
    if (duplicates.length === 0) {
      console.log('✅ No duplicates found!');
      return;
    }

    console.log(`Found ${duplicates.length} duplicate payment IDs\n`);

    for (const [paymentId, dupeOrders] of duplicates) {
      console.log(`Payment ID: ${paymentId}`);
      console.log(`  Found ${dupeOrders.length} orders:`);
      
      // Keep the first one (oldest), delete the rest
      const [keep, ...toDelete] = dupeOrders;
      
      console.log(`  ✓ Keeping: ${keep.id} (${keep.created_at})`);
      
      for (const order of toDelete) {
        console.log(`  ✗ Deleting: ${order.id} (${order.created_at})`);
        
        const deleteResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${order.id}`, {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
          }
        });

        if (deleteResponse.ok) {
          console.log(`    ✅ Deleted successfully`);
        } else {
          console.log(`    ❌ Failed to delete`);
        }
      }
      console.log('');
    }

    console.log('✅ Duplicate removal complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

removeDuplicates();
