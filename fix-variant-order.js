const SUPABASE_URL = 'https://rucygmkwvmkzbxydoglm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Y3lnbWt3dm1remJ4eWRvZ2xtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTYzMTMsImV4cCI6MjA4MjE3MjMxM30.5HORNuSF2hBZo1hLQ8B-SPMtVqhlrgoEB8-nepl9xc4';

const durationOrder = {
  '1day': 1,
  '1week': 2,
  '1month': 3,
  'lifetime': 4
};

async function fixVariantOrder() {
  try {
    console.log('🔄 Fixing variant order for all products...\n');
    
    // Fetch all products
    const productsResponse = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,name`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    const products = await productsResponse.json();
    console.log(`Found ${products.length} products\n`);

    for (const product of products) {
      // Fetch variants for this product
      const variantsResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/product_variants?product_id=eq.${product.id}&select=*`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        }
      );

      const variants = await variantsResponse.json();
      
      if (!variants || variants.length === 0) {
        console.log(`⚠️  ${product.name}: No variants found`);
        continue;
      }

      // Sort variants by duration order
      const sortedVariants = variants.sort((a, b) => {
        const orderA = durationOrder[a.duration] || 999;
        const orderB = durationOrder[b.duration] || 999;
        return orderA - orderB;
      });

      console.log(`✅ ${product.name}:`);
      sortedVariants.forEach((v, i) => {
        console.log(`   ${i + 1}. ${v.label} - $${v.price}`);
      });

      // Delete all variants
      await fetch(
        `${SUPABASE_URL}/rest/v1/product_variants?product_id=eq.${product.id}`,
        {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        }
      );

      // Re-insert in correct order
      for (const variant of sortedVariants) {
        const { id, created_at, updated_at, ...variantData } = variant;
        
        await fetch(`${SUPABASE_URL}/rest/v1/product_variants`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(variantData)
        });
      }
    }

    console.log('\n✅ All variants reordered successfully!');
    console.log('Order: 1 Day → 1 Week → 1 Month → Lifetime');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixVariantOrder();
