import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = 'https://rucygmkwvmkzbxydoglm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Y3lnbWt3dm1remJ4eWRvZ2xtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTYzMTMsImV4cCI6MjA4MjE3MjMxM30.5HORNuSF2hBZo1hLQ8B-SPMtVqhlrgoEB8-nepl9xc4';

async function applyMigration() {
    try {
        const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20251225000004_add_admin_settings.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('Applying migration...');

        // Using the same endpoint as the existing update-database.js
        // Assuming 'exec' function exists as per the existing codebase patterns
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: sql })
        });

        if (response.ok) {
            console.log('✅ Migration applied successfully.');
        } else {
            // It might fail if the function doesn't exist or permissions issue
            // But since update-database.js uses it, it's our best bet.
            const text = await response.text();
            console.error('❌ Migration failed:', response.status, text);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

applyMigration();
