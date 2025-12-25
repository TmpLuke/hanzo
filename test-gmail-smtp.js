const nodemailer = require('nodemailer');

const GMAIL_USER = 'petyaiscute@gmail.com';
const GMAIL_APP_PASSWORD = 'bfmeghukdiketkp';

async function testGmailSMTP() {
  console.log('📧 Testing Gmail SMTP...\n');

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Hanzo</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #0f0f0f; border-radius: 16px; overflow: hidden; border: 1px solid #1a1a1a;">
          
          <!-- Header with Hanzo Green -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 50px 40px; text-align: center;">
              <div style="width: 100px; height: 100px; background: rgba(255,255,255,0.15); border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 40px rgba(16, 185, 129, 0.4);">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h1 style="margin: 0; color: white; font-size: 36px; font-weight: 800; letter-spacing: -1px; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">Payment Successful!</h1>
              <p style="margin: 16px 0 0 0; color: rgba(255,255,255,0.95); font-size: 18px; font-weight: 500;">Thank you for your purchase</p>
            </td>
          </tr>

          <!-- Order Details -->
          <tr>
            <td style="padding: 48px 40px;">
              <div style="background: #121212; border: 1px solid #1f1f1f; border-radius: 12px; padding: 32px; margin-bottom: 32px;">
                <h2 style="margin: 0 0 24px 0; color: #ffffff; font-size: 22px; font-weight: 700;">Order Details</h2>
                
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 14px 0; border-bottom: 1px solid #1f1f1f;">
                      <span style="color: #888888; font-size: 15px;">Order Number</span>
                    </td>
                    <td align="right" style="padding: 14px 0; border-bottom: 1px solid #1f1f1f;">
                      <span style="color: #10b981; font-weight: 700; font-family: 'Courier New', monospace; font-size: 15px;">ORD-12345678</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 14px 0; border-bottom: 1px solid #1f1f1f;">
                      <span style="color: #888888; font-size: 15px;">Product</span>
                    </td>
                    <td align="right" style="padding: 14px 0; border-bottom: 1px solid #1f1f1f;">
                      <span style="color: #ffffff; font-weight: 600; font-size: 15px;">PUBG Cheat</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 14px 0; border-bottom: 1px solid #1f1f1f;">
                      <span style="color: #888888; font-size: 15px;">Variant</span>
                    </td>
                    <td align="right" style="padding: 14px 0; border-bottom: 1px solid #1f1f1f;">
                      <span style="color: #ffffff; font-size: 15px;">1 Week</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 0 0 0;">
                      <span style="color: #888888; font-size: 17px; font-weight: 600;">Total Paid</span>
                    </td>
                    <td align="right" style="padding: 20px 0 0 0;">
                      <span style="color: #10b981; font-size: 32px; font-weight: 800; text-shadow: 0 0 20px rgba(16, 185, 129, 0.3);">$28.90</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- What's Next -->
              <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 28px; margin-bottom: 32px;">
                <h3 style="margin: 0 0 14px 0; color: #ffffff; font-size: 19px; font-weight: 700;">📦 What's Next?</h3>
                <p style="margin: 0; color: rgba(255,255,255,0.85); font-size: 15px; line-height: 1.7;">
                  Your purchase has been confirmed! You'll receive your product details and download instructions in a separate email within the next few minutes.
                </p>
              </div>

              <!-- Support Button -->
              <div style="text-align: center; padding: 24px 0;">
                <p style="margin: 0 0 20px 0; color: #888888; font-size: 15px;">Need help with your order?</p>
                <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 10px; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.35);">
                      <a href="mailto:petyaiscute@gmail.com" style="display: inline-block; color: white; text-decoration: none; padding: 16px 40px; font-weight: 700; font-size: 15px;">
                        Contact Support
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #0a0a0a; padding: 36px 40px; text-align: center; border-top: 1px solid #1a1a1a;">
              <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 20px; font-weight: 800;">HANZO</p>
              <p style="margin: 0 0 20px 0; color: #10b981; font-size: 14px; font-weight: 600;">Premium Gaming Cheats</p>
              <p style="margin: 20px 0 0 0; color: #555555; font-size: 13px;">
                © ${new Date().getFullYear()} Hanzo Marketplace. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"Hanzo Marketplace" <petyaiscute@gmail.com>',
      to: 'lukahockey21@gmail.com',
      subject: '✅ Order Confirmed - ORD-12345678',
      html: emailHtml,
    });

    console.log('✅ SUCCESS! Email sent via Gmail SMTP!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Check lukahockey21@gmail.com inbox (NOT spam!)');
    console.log('✉️  Sent from: petyaiscute@gmail.com');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGmailSMTP();
