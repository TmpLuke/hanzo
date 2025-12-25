const WEBHOOK_URL = 'https://discord.com/api/webhooks/1453538427852034058/04BOZHtEnxLeChM_Ky9OExkUvbwTOzMwhPyERMfn9bGhcLjy4-7yoZzqZvBWdQbWniNI';

async function testWebhook() {
  console.log('🧪 Testing Discord webhook...\n');

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Hanzo Store',
        embeds: [
          {
            title: '🎉 New Purchase!',
            color: 0x00ff00,
            fields: [
              {
                name: 'Order Number',
                value: '`ORD-12345678`',
                inline: true,
              },
              {
                name: 'Amount',
                value: '**$28.90**',
                inline: true,
              },
              {
                name: 'Product',
                value: 'PUBG Cheat',
                inline: false,
              },
              {
                name: 'Variant',
                value: '1 Week',
                inline: true,
              },
              {
                name: 'Customer',
                value: 'John Doe',
                inline: true,
              },
              {
                name: 'Email',
                value: 'customer@example.com',
                inline: false,
              },
              {
                name: 'Payment Method',
                value: 'Credit Card',
                inline: true,
              },
            ],
            timestamp: new Date().toISOString(),
            footer: {
              text: 'Hanzo Marketplace',
            },
          },
        ],
      }),
    });

    if (response.ok) {
      console.log('✅ SUCCESS! Test notification sent to Discord!');
      console.log('📱 Check your Discord channel to see the message.\n');
      console.log('🎯 Your webhook is working perfectly!');
      console.log('   You will receive notifications like this whenever someone makes a purchase.\n');
    } else {
      const error = await response.text();
      console.error('❌ Failed to send notification:', error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testWebhook();
