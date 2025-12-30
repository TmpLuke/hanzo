const SUPABASE_URL = 'https://rucygmkwvmkzbxydoglm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Y3lnbWt3dm1remJ4eWRvZ2xtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTYzMTMsImV4cCI6MjA4MjE3MjMxM30.5HORNuSF2hBZo1hLQ8B-SPMtVqhlrgoEB8-nepl9xc4';

async function checkProducts() {
  try {
    console.log('📊 Fetching all product details...\n');
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    const products = await response.json();
    
    if (response.ok) {
      console.log(`✅ Found ${products.length} products\n`);
      console.log('='.repeat(80));
      
      products.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name}`);
        console.log('-'.repeat(80));
        console.log(`ID: ${product.id}`);
        console.log(`Price: $${product.price}`);
        console.log(`Category: ${product.category}`);
        console.log(`Status: ${product.status}`);
        console.log(`Featured: ${product.is_featured ? 'Yes' : 'No'}`);
        console.log(`Rating: ${product.rating || 'N/A'}`);
        console.log(`\nDescription:`);
        console.log(`  ${product.description || 'N/A'}`);
        console.log(`\nFeatures:`);
        if (product.features && product.features.length > 0) {
          product.features.forEach(f => console.log(`  • ${f}`));
        } else {
          console.log('  N/A');
        }
        console.log(`\nDetailed Features:`);
        if (product.detailed_features && product.detailed_features.length > 0) {
          product.detailed_features.forEach(f => console.log(`  • ${f}`));
        } else {
          console.log('  N/A');
        }
        console.log(`\nImage URL:`);
        console.log(`  ${product.image_url || 'N/A'}`);
        console.log(`\nGallery Images:`);
        if (product.gallery_images && product.gallery_images.length > 0) {
          product.gallery_images.forEach((img, i) => console.log(`  ${i + 1}. ${img}`));
        } else {
          console.log('  N/A');
        }
        console.log(`\nMenu Images:`);
        if (product.menu_images && product.menu_images.length > 0) {
          product.menu_images.forEach((img, i) => console.log(`  ${i + 1}. ${img}`));
        } else {
          console.log('  N/A');
        }
        console.log(`\nCreated: ${product.created_at}`);
        console.log(`Updated: ${product.updated_at}`);
      });
      
      console.log('\n' + '='.repeat(80));
      console.log(`\n✅ Total: ${products.length} products`);
    } else {
      console.error('❌ Error:', products);
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

checkProducts();
