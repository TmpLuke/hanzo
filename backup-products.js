const SUPABASE_URL = 'https://rucygmkwvmkzbxydoglm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Y3lnbWt3dm1remJ4eWRvZ2xtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTYzMTMsImV4cCI6MjA4MjE3MjMxM30.5HORNuSF2hBZo1hLQ8B-SPMtVqhlrgoEB8-nepl9xc4';
import fs from 'fs';

async function backupProducts() {
  try {
    console.log('🔄 Backing up all products...\n');
    
    // Fetch all products
    const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    const products = await response.json();
    
    if (!response.ok) {
      console.error('❌ Error fetching products:', products);
      return;
    }

    console.log(`✅ Found ${products.length} products\n`);

    // Fetch variants for each product
    const productsWithVariants = await Promise.all(
      products.map(async (product) => {
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
        return { ...product, variants: variants || [] };
      })
    );

    // Create backup object
    const backup = {
      backup_date: new Date().toISOString(),
      total_products: productsWithVariants.length,
      products: productsWithVariants
    };

    // Save to JSON file
    const filename = `products-backup-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(backup, null, 2));

    console.log('✅ Backup completed successfully!');
    console.log(`📁 Saved to: ${filename}`);
    console.log(`\n📊 Backup Summary:`);
    console.log(`   - Total Products: ${backup.total_products}`);
    console.log(`   - Backup Date: ${backup.backup_date}`);
    
    // Show what was backed up
    console.log(`\n📦 Products backed up:`);
    productsWithVariants.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name}`);
      console.log(`      - Price: $${p.price}`);
      console.log(`      - Image: ${p.image_url ? '✓' : '✗'}`);
      console.log(`      - Gallery: ${p.gallery_images?.length || 0} images`);
      console.log(`      - Menu Images: ${p.menu_images?.length || 0} images`);
      console.log(`      - Variants: ${p.variants.length}`);
    });

  } catch (error) {
    console.error('❌ Backup error:', error.message);
  }
}

backupProducts();
