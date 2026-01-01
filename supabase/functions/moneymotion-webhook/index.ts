import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-signature",
};

// Function to verify checkout session status with MoneyMotion API
// Function to verify checkout session status with MoneyMotion API
async function verifyCheckoutSession(sessionId: string, apiKey: string) {
  try {
    // MoneyMotion API requires GET for this endpoint with query params
    const response = await fetch(
      `https://api.moneymotion.io/checkoutSessions.getCompletedOrPendingCheckoutSessionInfo?json.checkoutId=${sessionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to verify session:", await response.text());
      return null;
    }

    const data = await response.json();
    return data?.result?.data?.json || null;
  } catch (error) {
    console.error("Error verifying session:", error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature");
    const webhookSecret = Deno.env.get("MONEYMOTION_WEBHOOK_SECRET");
    const apiKey = Deno.env.get("VITE_MONEYMOTION_API_KEY");

    if (!webhookSecret || !signature) {
      console.error("Missing webhook secret or signature");
      return new Response(
        JSON.stringify({ error: "Missing secret/signature" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let isVerifiedSignature = false;

    if (webhookSecret && signature) {
      // Verify signature (HMAC SHA-512)
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(webhookSecret),
        { name: "HMAC", hash: "SHA-512" },
        false,
        ["sign"]
      );

      const signatureBuffer = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(rawBody)
      );

      const calculatedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      if (signature === calculatedSignature) {
        isVerifiedSignature = true;
      } else {
        console.error("Invalid signature");
        // We continue to allow API verification, but we flag it
      }
    } else {
      console.warn("No signature provided");
    }

    /*
       We do NOT return 401 immediately if signature fails, 
       because we want to support manual verification via API check.
       BUT we must ensure that if signature is invalid, we ONLY process 
       if the API check returns "completed".
    */

    // Parse webhook body
    const body = JSON.parse(rawBody);
    console.log("MoneyMotion webhook received:", body);

    // Handle checkout_session:complete event
    if (body.event === "checkout_session:complete") {
      const sessionId = body.checkoutSessionId || body.sessionId;
      const customerEmail = body.customer?.email;

      console.log(`Payment success for session: ${sessionId}`);

      // Verify session status with MoneyMotion API
      let sessionInfo = null;
      let isPaymentVerified = false;

      if (apiKey) {
        sessionInfo = await verifyCheckoutSession(sessionId, apiKey);
        if (sessionInfo) {
          console.log("Session verified:", sessionInfo);
          
          // Check if session is actually completed
          if (sessionInfo.status === "completed") {
            isPaymentVerified = true;
          } else if (sessionInfo.status !== "pending") {
            console.error("Session not completed:", sessionInfo.status);
            return new Response(
              JSON.stringify({ error: "Session not completed" }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }
      }

      // SECURITY CRITICAL: Ensure we have either a valid signature OR a verified payment status from API
      if (!isVerifiedSignature && !isPaymentVerified) {
        return new Response(
          JSON.stringify({ error: "Unauthorized: Invalid signature and unverified payment" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Initialize Supabase client
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Find order by payment_id (session ID)
      const { data: order, error: findError } = await supabase
        .from("orders")
        .select("*")
        .eq("payment_id", sessionId)
        .single();

      if (findError || !order) {
        console.error("Order not found:", findError);
        return new Response(
          JSON.stringify({ error: "Order not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Prevent duplicate processing
      if (order.status === "completed") {
        console.log("Order already completed, skipping");
        return new Response(
          JSON.stringify({ received: true, message: "Already processed" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get actual amount from verified session
      let actualAmount = order.amount;
      if (sessionInfo && sessionInfo.totalPriceInCents) {
        // Convert cents to dollars (MoneyMotion uses EUR cents)
        actualAmount = sessionInfo.totalPriceInCents / 100;
        console.log(`Updating amount from ${order.amount} to ${actualAmount}`);
      }

      // Update order status to completed with correct amount
      const { error: updateError } = await supabase
        .from("orders")
        .update({ 
          status: "completed",
          amount: actualAmount,
          updated_at: new Date().toISOString()
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("Error updating order:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update order" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Send Discord notification
      const discordWebhookUrl = Deno.env.get("DISCORD_WEBHOOK_URL");
      if (discordWebhookUrl) {
        const embed = {
          title: "🎉 New Purchase!",
          color: 0x00ff00,
          fields: [
            {
              name: "Order Number",
              value: `\`${order.order_number}\``,
              inline: true,
            },
            {
              name: "Amount",
              value: `**€${Number(actualAmount).toFixed(2)}**`,
              inline: true,
            },
            {
              name: "Product",
              value: order.product_name,
              inline: false,
            },
            {
              name: "Variant",
              value: order.variant_label || "N/A",
              inline: true,
            },
            {
              name: "Customer",
              value: order.customer_name || order.customer_email,
              inline: true,
            },
            {
              name: "Email",
              value: order.customer_email,
              inline: false,
            },
            {
              name: "Payment Method",
              value: "MoneyMotion",
              inline: true,
            },
            {
              name: "Session ID",
              value: `\`${sessionId}\``,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Hanzo Marketplace • hanzocheats.com",
          },
        };

        try {
          await fetch(discordWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: "Hanzo Store",
              embeds: [embed],
            }),
          });
          console.log("Discord notification sent");
        } catch (discordError) {
          console.error("Discord notification failed:", discordError);
        }
      }

      // Send email notification via Supabase Edge Function
      try {
        const emailResponse = await fetch(
          `${supabaseUrl}/functions/v1/send-order-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({
              orderNumber: order.order_number,
              customerEmail: order.customer_email,
              customerName: order.customer_name || "Customer",
              productName: order.product_name,
              variantLabel: order.variant_label,
              amount: actualAmount,
            }),
          }
        );

        if (emailResponse.ok) {
          console.log("Email notification sent");
        } else {
          console.error("Email notification failed:", await emailResponse.text());
        }
      } catch (emailError) {
        console.error("Email error:", emailError);
      }

      console.log("Order completed successfully");
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
