import nodemailer from 'nodemailer';

const GMAIL_USER = 'petyaiscute@gmail.com';
const GMAIL_APP_PASSWORD = 'bfmeghukdikgetkp';

async function testGmailSMTP() {
  console.log('📧 Testing Gmail SMTP...\n');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  const emailHtml = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0a0a0a">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#0f0f0f;border-radius:16px;border:1px solid #1a1a1a">
<tr><td style="background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:50px 40px;text-align:center">
<img src="https://i.postimg.cc/rpzJ4dt5/Hanzo-AVI.png" alt="Hanzo" style="width:120px;height:auto;margin:0 auto 24px;display:block" />
<div style="width:100px;height:100px;background:rgba(255,255,255,0.15);border-radius:50%;margin:0 auto 24px;box-shadow:0 0 40px rgba(16,185,129,0.4);display:flex;align-items:center;justify-content:center">
<svg width="50" height="50" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10b981" stroke-width="2.5" fill="none"/></svg>
</div>
<h1 style="margin:0;color:white;font-size:36px;font-weight:800">Payment Successful!</h1>
<p style="margin:16px 0 0 0;color:rgba(255,255,255,0.95);font-size:18px">Thank you for your purchase</p>
</td></tr>
<tr><td style="padding:48px 40px">
<div style="background:#121212;border:1px solid #1f1f1f;border-radius:12px;padding:32px;margin-bottom:32px">
<h2 style="margin:0 0 24px 0;color:#fff;font-size:22px;font-weight:700">Order Details</h2>
<table width="100%"><tr><td style="padding:14px 0;border-bottom:1px solid #1f1f1f"><span style="color:#888;font-size:15px">Order Number</span></td><td align="right" style="padding:14px 0;border-bottom:1px solid #1f1f1f"><span style="color:#10b981;font-weight:700;font-family:monospace">ORD-12345678</span></td></tr>
<tr><td style="padding:14px 0;border-bottom:1px solid #1f1f1f"><span style="color:#888;font-size:15px">Product</span></td><td align="right" style="padding:14px 0;border-bottom:1px solid #1f1f1f"><span style="color:#fff;font-weight:600">PUBG Cheat</span></td></tr>
<tr><td style="padding:14px 0;border-bottom:1px solid #1f1f1f"><span style="color:#888;font-size:15px">Variant</span></td><td align="right" style="padding:14px 0;border-bottom:1px solid #1f1f1f"><span style="color:#fff">1 Week</span></td></tr>
<tr><td style="padding:20px 0 0 0"><span style="color:#888;font-size:17px;font-weight:600">Total Paid</span></td><td align="right" style="padding:20px 0 0 0"><span style="color:#10b981;font-size:32px;font-weight:800">$28.90</span></td></tr>
</table></div>
<div style="background:linear-gradient(135deg,rgba(16,185,129,0.08),rgba(5,150,105,0.08));border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:28px;margin-bottom:32px">
<h3 style="margin:0 0 14px 0;color:#fff;font-size:19px;font-weight:700">📦 What's Next?</h3>
<p style="margin:0;color:rgba(255,255,255,0.85);font-size:15px;line-height:1.7">Your purchase has been confirmed! You'll receive your product details within the next few minutes.</p>
</div>
<div style="text-align:center;padding:24px 0">
<p style="margin:0 0 20px 0;color:#888;font-size:15px">Need help?</p>
<a href="mailto:petyaiscute@gmail.com" style="display:inline-block;background:linear-gradient(135deg,#10b981,#059669);color:white;text-decoration:none;padding:16px 40px;border-radius:10px;font-weight:700">Contact Support</a>
</div>
</td></tr>
<tr><td style="background:#0a0a0a;padding:36px 40px;text-align:center;border-top:1px solid #1a1a1a">
<p style="margin:0 0 10px 0;color:#fff;font-size:20px;font-weight:800">HANZO</p>
<p style="margin:0 0 20px 0;color:#10b981;font-size:14px;font-weight:600">Premium Gaming Cheats</p>
<p style="margin:0;color:#555;font-size:13px">© 2024 Hanzo Marketplace</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  try {
    const info = await transporter.sendMail({
      from: '"Hanzo Marketplace" <petyaiscute@gmail.com>',
      to: 'lukahockey21@gmail.com',
      subject: '✅ Order Confirmed - ORD-12345678',
      html: emailHtml,
    });

    console.log('✅ SUCCESS! Email sent via Gmail!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Check lukahockey21@gmail.com INBOX');
    console.log('✉️  From: petyaiscute@gmail.com');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGmailSMTP();
