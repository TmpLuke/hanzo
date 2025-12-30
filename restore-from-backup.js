const SUPABASE_URL = 'https://rucygmkwvmkzbxydoglm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Y3lnbWt3dm1remJ4eWRvZ2xtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTYzMTMsImV4cCI6MjA4MjE3MjMxM30.5HORNuSF2hBZo1hLQ8B-SPMtVqhlrgoEB8-nepl9xc4';
import fs from 'fs';

async function restoreFromBackup(backupFile) {
  try {
    console.log(`🔄 Restoring products from ${backupFile}...\n`);
    
    // Read backup file
    if (!fs.existsSync(backupFile)) {
      console.error(`❌ Backup file not found: ${backupFile}`);
      console.log('\n💡 Available backup files:');
      const files = fs.readdirSync('.').filter(f => f.startsWith('products-backup-') && f.endsWith('.json'));
      files.forEach(f => console.log(`   - ${f}`));
      return;
    }

    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    
    console.log(`📊 Backup Info:`);
    console.log(`   - Date: ${backup.backup_date}`);
    console.log(`   - Products: ${backup.total_products}`);
    console.log('');

    // Delete existing products
    console.log('🗑️  Clearing existing products...');
    await fetch(`${SUPABASE_URL}/rest/v1/products?id=neq.00000000-0000-0000-0000-000000000000`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      }
    });

    // Restore each product
    for (const product of backup.products) {
      const { variants, id, created_at, updated_at, ...productData } = product;
      
      // Insert product
      const response = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(productData)
      });

      const newProduct = await response.json();
      
      if (response.ok && newProduct[0]) {
        console.log(`✅ Restored: ${product.name}`);
        
        // Restore variants
        if (variants && variants.length > 0) {
          for (const variant of variants) {
            const { id: variantId, created_at: vCreated, updated_at: vUpdated, product_id, ...variantData } = variant;
            
            await fetch(`${SUPABASE_URL}/rest/v1/product_variants`, {
              method: 'POST',
              headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                ...variantData,
                product_id: newProduct[0].id
              })
            });
          }
          console.log(`   ↳ Restored ${variants.length} variants`);
        }
      } else {
        console.error(`❌ Failed to restore: ${product.name}`, newProduct);
      }
    }

    console.log('\n✅ Restore completed!');
    
  } catch (error) {
    console.error('❌ Restore error:', error.message);
  }
}

// Get backup file from command line or use latest
const backupFile = process.argv[2];

if (!backupFile) {
  // Find latest backup
  const files = fs.readdirSync('.').filter(f => f.startsWith('products-backup-') && f.endsWith('.json'));
  if (files.length === 0) {
    console.error('❌ No backup files found!');
    console.log('\n💡 Run "node backup-products.js" first to create a backup.');
    process.exit(1);
  }
  
  // Sort by timestamp (newest first)
  files.sort().reverse();
  const latestBackup = files[0];
  
  console.log(`📁 Using latest backup: ${latestBackup}\n`);
  restoreFromBackup(latestBackup);
} else {
  restoreFromBackup(backupFile);
}
