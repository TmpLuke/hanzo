const MONEYMOTION_API_KEY = 'mk_live_A5CFqwvkmkX5GKPO2tE5ibjLCfjUGLnz';
const MONEYMOTION_API_URL = 'https://api.moneymotion.io';

async function testMoneyMotionAPI() {
  console.log('🧪 Testing MoneyMotion API Integration...\n');

  try {
    // Test creating a checkout session
    const params = {
      description: 'Test Order - PUBG Cheat',
      urls: {
        success: 'http://localhost:5173/checkout/success?order_id=test123',
        cancel: 'http://localhost:5173/checkout/cancel',
        failure: 'http://localhost:5173/checkout/failure',
      },
      userInfo: {
        email: 'test@example.com',
      },
      lineItems: [
        {
          name: 'PUBG Cheat',
          description: 'PUBG Cheat - 1 Week',
          pricePerItemInCents: 2890, // $28.90
          quantity: 1,
        },
      ],
    };

    // CRITICAL: MoneyMotion requires this exact structure
    const payload = { json: params };

    console.log('📤 Sending request to MoneyMotion API...');
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(
      `${MONEYMOTION_API_URL}/checkoutSessions.createCheckoutSession`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': MONEYMOTION_API_KEY,
          'X-Currency': 'USD',
        },
        body: JSON.stringify(payload),
      }
    );

    const responseText = await response.text();
    console.log('\n📥 Response Status:', response.status);
    console.log('Response Body:', responseText);

    if (!response.ok) {
      console.error('\n❌ API Error:', responseText);
      console.error('\nPossible issues:');
      console.error('1. Invalid API key');
      console.error('2. API key not activated');
      console.error('3. Account not verified');
      console.error('4. Incorrect request format');
      return;
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('\n❌ Failed to parse response:', responseText);
      return;
    }

    // Extract session ID
    const sessionId =
      responseData?.result?.data?.json?.checkoutSessionId ||
      responseData?.result?.data?.checkoutSessionId;

    if (!sessionId) {
      console.error('\n❌ No session ID in response');
      console.error('Response structure:', JSON.stringify(responseData, null, 2));
      return;
    }

    console.log('\n✅ SUCCESS! Checkout session created!');
    console.log('Session ID:', sessionId);
    console.log('Checkout URL:', `https://moneymotion.io/checkout/${sessionId}`);
    console.log('\n🎯 Your MoneyMotion integration is working correctly!');
    console.log('\nNext steps:');
    console.log('1. Run the database migration in Supabase');
    console.log('2. Deploy the webhook function (see deploy-webhook.md)');
    console.log('3. Configure the webhook URL in MoneyMotion dashboard');
    console.log('4. Test a real purchase!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nMake sure:');
    console.error('1. Your API key is correct');
    console.error('2. You have internet connection');
    console.error('3. MoneyMotion API is accessible');
  }
}

testMoneyMotionAPI();
