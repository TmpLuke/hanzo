const SUPABASE_URL = 'https://rucygmkwvmkzbxydoglm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Y3lnbWt3dm1remJ4eWRvZ2xtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTYzMTMsImV4cCI6MjA4MjE3MjMxM30.5HORNuSF2hBZo1hLQ8B-SPMtVqhlrgoEB8-nepl9xc4';
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1453538427852034058/04BOZHtEnxLeChM_Ky9OExkUvbwTOzMwhPyERMfn9bGhcLjy4-7yoZzqZvBWdQbWniNI';

async function saveWebhook() {
  try {
    console.log('💾 Saving Discord webhook to database...');
    
    // Save webhook to settings table
    const response = await fetch(`${SUPABASE_URL}/rest/v1/settings`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        key: 'discord_webhook_url',
        value: WEBHOOK_URL
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Failed to save webhook:', error);
      return;
    }

    console.log('✅ Webhook saved successfully!');
    console.log('\n🧪 Testing webhook...');

    // Test the webhook
    const testResponse = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Hanzo Store',
        embeds: [
          {
            title: '🎉 Test Notification',
            description: 'Your Discord webhook is now connected to Hanzo Marketplace!',
            color: 0x00ff00,
            fields: [
              {
                name: 'Status',
                value: '✅ Webhook is working correctly!',
              },
              {
                name: 'What happens next?',
                value: 'You will receive notifications here whenever someone makes a purchase on your store.',
              }
            ],
            timestamp: new Date().toISOString(),
            footer: {
              text: 'Hanzo Marketplace',
            },
          },
        ],
      }),
    });

    if (testResponse.ok) {
      console.log('✅ Test notification sent! Check your Discord channel.');
      console.log('\n🎯 All set! You will now receive purchase notifications in Discord.');
    } else {
      console.error('❌ Failed to send test notification');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

saveWebhook();
