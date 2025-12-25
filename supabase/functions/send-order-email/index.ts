import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { orderNumber, customerEmail, customerName, productName, variantLabel, amount, redemptionCode } = await req.json();
    
    const gmailUser = Deno.env.get("GMAIL_USER");
    const gmailPassword = Deno.env.get("GMAIL_APP_PASSWORD");
    
    if (!gmailUser || !gmailPassword) {
      throw new Error("Gmail credentials not configured");
    }

    // Beautiful HTML email template
    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
          
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 40px 60px 40px; text-align: center; position: relative;">
              <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Payment Successful!</h1>
              <p style="margin: 12px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Thank you for your purchase</p>
            </td>
          </tr>

          <!-- Order Details -->
          <tr>
            <td style="padding: 40px;">
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px; margin-bottom: 30px;">
                <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 20px; font-weight: 600;">Order Details</h2>
                
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                      <span style="color: rgba(255,255,255,0.6); font-size: 14px;">Order Number</span>
                    </td>
                    <td align="right" style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                      <span style="color: #667eea; font-weight: 600; font-family: monospace; font-size: 14px;">${orderNumber}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                      <span style="color: rgba(255,255,255,0.6); font-size: 14px;">Product</span>
                    </td>
                    <td align="right" style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                      <span style="color: #ffffff; font-weight: 600; font-size: 14px;">${productName}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                      <span style="color: rgba(255,255,255,0.6); font-size: 14px;">Variant</span>
                    </td>
                    <td align="right" style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                      <span style="color: #ffffff; font-size: 14px;">${variantLabel}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 16px 0 0 0;">
                      <span style="color: rgba(255,255,255,0.6); font-size: 16px; font-weight: 600;">Total Paid</span>
                    </td>
                    <td align="right" style="padding: 16px 0 0 0;">
                      <span style="color: #667eea; font-size: 28px; font-weight: 700;">$${amount.toFixed(2)}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- What's Next -->
              <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); border: 1px solid rgba(102, 126, 234, 0.2); border-radius: 16px; padding: 24px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 12px 0; color: #ffffff; font-size: 18px; font-weight: 600;">🎫 Redeem Your Customer Role</h3>
                <p style="margin: 0 0 16px 0; color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.6;">
                  Join our Discord server and use the <strong>/redeem</strong> command with your code below to get your customer role and access exclusive channels!
                </p>
                <div style="background: rgba(0,0,0,0.3); border: 2px dashed rgba(102, 126, 234, 0.5); border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 16px;">
                  <p style="margin: 0 0 8px 0; color: rgba(255,255,255,0.6); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Your Redemption Code</p>
                  <p style="margin: 0; color: #667eea; font-size: 24px; font-weight: 700; font-family: monospace; letter-spacing: 2px;">${redemptionCode || 'GENERATING...'}</p>
                </div>
                <a href="https://discord.gg/hanzo" style="display: block; background: #5865F2; color: white; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-weight: 600; font-size: 14px; text-align: center; box-shadow: 0 4px 12px rgba(88, 101, 242, 0.3);">
                  Join Discord & Redeem
                </a>
              </div>

              <!-- Support -->
              <div style="text-align: center; padding: 20px 0;">
                <p style="margin: 0 0 16px 0; color: rgba(255,255,255,0.6); font-size: 14px;">Need help with your order?</p>
                <a href="mailto:support@hanzo.gg" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                  Contact Support
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: rgba(255,255,255,0.02); padding: 30px 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
              <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 18px; font-weight: 700;">Hanzo Marketplace</p>
              <p style="margin: 0 0 16px 0; color: rgba(255,255,255,0.5); font-size: 13px;">Premium digital products for gamers</p>
              <div style="margin: 16px 0;">
                <a href="https://hanzo.gg" style="color: #667eea; text-decoration: none; font-size: 13px; margin: 0 12px;">Website</a>
                <span style="color: rgba(255,255,255,0.2);">•</span>
                <a href="https://discord.gg/hanzo" style="color: #667eea; text-decoration: none; font-size: 13px; margin: 0 12px;">Discord</a>
                <span style="color: rgba(255,255,255,0.2);">•</span>
                <a href="mailto:support@hanzo.gg" style="color: #667eea; text-decoration: none; font-size: 13px; margin: 0 12px;">Support</a>
              </div>
              <p style="margin: 16px 0 0 0; color: rgba(255,255,255,0.4); font-size: 12px;">
                © ${new Date().getFullYear()} Hanzo Marketplace. All rights reserved.
              </p>
            </td>
          </tr>
        </table>

        <!-- Security Notice -->
        <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
          <tr>
            <td style="text-align: center; padding: 20px;">
              <p style="margin: 0; color: rgba(255,255,255,0.4); font-size: 12px; line-height: 1.6;">
                🔒 This email contains sensitive order information. Please keep it secure.<br>
                If you didn't make this purchase, please contact us immediately.
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

    // Send email via Gmail SMTP
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 587,
        tls: true,
        auth: {
          username: gmailUser,
          password: gmailPassword,
        },
      },
    });

    await client.send({
      from: `Hanzo Marketplace <${gmailUser}>`,
      to: customerEmail,
      subject: `✅ Order Confirmed - ${orderNumber}`,
      html: emailHtml,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true, message: "Email sent via Gmail" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Email error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
