import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { createOrder } from "@/lib/discord";
import { getCheckoutSessionInfo } from "@/lib/moneymotion";
import { CheckCircle, Mail } from "lucide-react";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const { data, error } = await supabase
        .from("orders" as any)
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) {
        console.error("Error loading order:", error);
        return;
      }

      setOrder(data);

      // If order is still pending, mark it as completed and send Discord notification
      if ((data as any).status === "pending") {
        await completeOrder(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const completeOrder = async (orderData: any) => {
    try {
      let updatedAmount = Number(orderData.amount);
      if (orderData.payment_id) {
        try {
          const info = await getCheckoutSessionInfo(orderData.payment_id);
          if (info?.totalCents) {
            const mmAmount = info.totalCents / 100;
            if (!isNaN(mmAmount) && mmAmount > 0) {
              updatedAmount = mmAmount;
            }
          }
        } catch (e) {
          console.error("MoneyMotion info fetch failed:", e);
        }
      }

      const { error } = await supabase
        .from("orders" as any)
        .update({ status: "completed", amount: updatedAmount })
        .eq("id", orderData.id);

      if (error) {
        console.error("Error updating order:", error);
        return;
      }

      // Send Discord notification
      await createOrder({
        customerEmail: orderData.customer_email,
        customerName: orderData.customer_name,
        productId: orderData.product_id,
        variantId: orderData.variant_id,
        productName: orderData.product_name,
        variantLabel: orderData.variant_label,
        amount: updatedAmount,
        paymentMethod: "MoneyMotion",
        paymentId: orderData.payment_id,
      });

      // Send email to customer
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const emailResponse = await fetch(`${apiUrl}/api/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderNumber: orderData.order_number,
            customerEmail: orderData.customer_email,
            customerName: orderData.customer_name || "Customer",
            productName: orderData.product_name,
            variantLabel: orderData.variant_label,
            amount: orderData.amount,
          }),
        });

        if (!emailResponse.ok) {
          console.error("Error sending email:", await emailResponse.text());
        } else {
          console.log("Order confirmation email sent!");
        }
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
      }

      console.log("Order completed and notification sent!");
    } catch (error) {
      console.error("Error completing order:", error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Processing your order...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <Link to="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen pt-16 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground text-lg">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          <div className="rounded-2xl bg-card border border-border p-8 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Order Number</span>
                <span className="font-mono font-semibold">{order.order_number}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Product</span>
                <span className="font-semibold">{order.product_name}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Variant</span>
                <span className="font-semibold">{order.variant_label}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Email</span>
                <span className="font-semibold">{order.customer_email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="text-2xl font-bold text-primary">
                  ${Number(order.amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 mb-8">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Check Your Email</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent your purchase details and download instructions to{" "}
                  <span className="font-semibold text-foreground">{order.customer_email}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-primary/30 p-6 mb-8">
            <h3 className="font-semibold mb-3 text-lg">🎮 How to Claim Your Product</h3>
            <p className="text-sm text-muted-foreground mb-4">
              To receive your product key, please open a ticket in our Discord server with your order number.
            </p>
            <a 
              href="https://discord.gg/hanzo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Open Ticket on Discord
              </Button>
            </a>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Order: <span className="font-mono font-semibold">{order.order_number}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/products" className="flex-1">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Need help? Contact us at petyaiscute@gmail.com</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
