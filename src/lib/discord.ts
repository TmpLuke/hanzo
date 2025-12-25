import { supabase } from "@/integrations/supabase/client";

interface OrderData {
  orderNumber: string;
  customerEmail: string;
  customerName?: string;
  productName: string;
  variantLabel?: string;
  amount: number;
  paymentMethod?: string;
}

export async function sendDiscordNotification(orderData: OrderData) {
  try {
    // Get webhook URL from environment variable
    const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;

    if (!webhookUrl || webhookUrl === "") {
      console.log("Discord webhook not configured");
      return;
    }

    if (!webhookUrl || webhookUrl === "") {
      console.log("Discord webhook not configured");
      return;
    }

    // Create embed for Discord
    const embed = {
      title: "🎉 New Purchase!",
      color: 0x00ff00, // Green color
      fields: [
        {
          name: "Order Number",
          value: `\`${orderData.orderNumber}\``,
          inline: true,
        },
        {
          name: "Amount",
          value: `**$${orderData.amount.toFixed(2)}**`,
          inline: true,
        },
        {
          name: "Product",
          value: orderData.productName,
          inline: false,
        },
        {
          name: "Variant",
          value: orderData.variantLabel || "N/A",
          inline: true,
        },
        {
          name: "Customer",
          value: orderData.customerName || orderData.customerEmail,
          inline: true,
        },
        {
          name: "Email",
          value: orderData.customerEmail,
          inline: false,
        },
        {
          name: "Payment Method",
          value: orderData.paymentMethod || "Unknown",
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Hanzo Marketplace",
      },
    };

    // Send to Discord
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "Hanzo Store",
        avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      console.error("Failed to send Discord webhook:", await response.text());
    } else {
      console.log("Discord notification sent successfully");
    }
  } catch (error) {
    console.error("Error sending Discord notification:", error);
  }
}

// Function to create an order and send notification
export async function createOrder(orderData: {
  customerEmail: string;
  customerName?: string;
  productId: string;
  variantId?: string;
  productName: string;
  variantLabel?: string;
  amount: number;
  paymentMethod?: string;
  paymentId?: string;
}) {
  try {
    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;

    // Insert order into database
    const { data: order, error } = await supabase
      .from("orders" as any)
      .insert({
        order_number: orderNumber,
        customer_email: orderData.customerEmail,
        customer_name: orderData.customerName,
        product_id: orderData.productId,
        variant_id: orderData.variantId,
        product_name: orderData.productName,
        variant_label: orderData.variantLabel,
        amount: orderData.amount,
        status: "completed", // Set to completed when payment succeeds
        payment_method: orderData.paymentMethod,
        payment_id: orderData.paymentId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating order:", error);
      throw error;
    }

    // Send Discord notification
    await sendDiscordNotification({
      orderNumber,
      customerEmail: orderData.customerEmail,
      customerName: orderData.customerName,
      productName: orderData.productName,
      variantLabel: orderData.variantLabel,
      amount: orderData.amount,
      paymentMethod: orderData.paymentMethod,
    });

    return order;
  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
}
