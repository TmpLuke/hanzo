import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

console.log('🚀 Deploying Supabase Edge Functions...\n');

// Set environment variables for the functions
const secrets = [
  { name: 'GMAIL_USER', value: process.env.GMAIL_USER },
  { name: 'GMAIL_APP_PASSWORD', value: process.env.GMAIL_APP_PASSWORD },
  { name: 'DISCORD_WEBHOOK_URL', value: process.env.VITE_DISCORD_WEBHOOK_URL },
  { name: 'MONEYMOTION_WEBHOOK_SECRET', value: process.env.MONEYMOTION_WEBHOOK_SECRET },
  { name: 'VITE_MONEYMOTION_API_KEY', value: process.env.VITE_MONEYMOTION_API_KEY },
];

console.log('📝 Setting environment secrets...\n');

for (const secret of secrets) {
  if (secret.value) {
    try {
      execSync(`npx supabase secrets set ${secret.name}="${secret.value}"`, { 
        stdio: 'inherit',
        env: { ...process.env, SUPABASE_ACCESS_TOKEN: process.env.SUPABASE_ACCESS_TOKEN }
      });
      console.log(`✅ Set ${secret.name}`);
    } catch (error) {
      console.error(`❌ Failed to set ${secret.name}`);
    }
  } else {
    console.log(`⚠️  Skipping ${secret.name} (not set in .env)`);
  }
}

console.log('\n📦 Deploying functions...\n');

try {
  execSync('npx supabase functions deploy send-order-email', { stdio: 'inherit' });
  console.log('✅ send-order-email deployed');
} catch (error) {
  console.error('❌ Failed to deploy send-order-email');
}

try {
  execSync('npx supabase functions deploy moneymotion-webhook', { stdio: 'inherit' });
  console.log('✅ moneymotion-webhook deployed');
} catch (error) {
  console.error('❌ Failed to deploy moneymotion-webhook');
}

console.log('\n✨ Deployment complete!');
