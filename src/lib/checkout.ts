import { createCheckoutSession, getCheckoutUrl } from "./moneymotion";
import { supabase } from "@/integrations/supabase/client";

export interface CheckoutData {
  productId: string;
  productName: string;
  variantId: string;
  variantLabel: string;
  priceCents: number;
  email: string;
  customerName?: string;
}

export interface CartCheckoutItem {
  productId: string;
  productName: string;
  variantId: string;
  variantLabel: string;
  price: number;
  quantity: number;
}

export interface CartCheckoutData {
  items: CartCheckoutItem[];
  email: string;
  customerName?: string;
  couponCode?: string;
}

export async function createMoneyMotionCheckout(data: CheckoutData) {
  try {
    // 0. Idempotency guard: reuse or attach session to recent pending order for this email
    try {
      const since = new Date();
      since.setMinutes(since.getMinutes() - 3);
      const { data: recent } = await supabase
        .from("orders" as any)
        .select("id, payment_id, status, created_at")
        .eq("customer_email", data.email)
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false })
        .limit(1);
      const existing = Array.isArray(recent) ? recent.find((o: any) => o.status === "pending") : null;
      if (existing) {
        if (existing.payment_id) {
          return {
            success: true,
            checkoutUrl: getCheckoutUrl(existing.payment_id),
            orderId: existing.id,
          };
        }
        const siteUrl0 = (import.meta.env.VITE_SITE_URL || window.location.origin).replace('http://', 'https://');
        const session0 = await createCheckoutSession({
          description: `Order (pending) - ${data.productName}`,
          urls: {
            success: `${siteUrl0}/checkout/success?order_id=${existing.id}`,
            cancel: `${siteUrl0}/checkout/cancel?order_id=${existing.id}`,
            failure: `${siteUrl0}/checkout/failure?order_id=${existing.id}`,
          },
          userInfo: { email: data.email },
          lineItems: [
            {
              name: data.productName,
              description: `${data.productName} - ${data.variantLabel}`,
              pricePerItemInCents: data.priceCents,
              quantity: 1,
            },
          ],
        });
        await supabase.from("orders" as any).update({ payment_id: session0.checkoutSessionId }).eq("id", existing.id);
        return {
          success: true,
          checkoutUrl: getCheckoutUrl(session0.checkoutSessionId),
          orderId: existing.id,
        };
      }
    } catch {}
    // 1. Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
    
    // 2. Create pending order in database
    const { data: order, error: orderError } = await supabase
      .from("orders" as any)
      .insert({
        order_number: orderNumber,
        customer_email: data.email,
        customer_name: data.customerName,
        product_id: data.productId,
        variant_id: data.variantId,
        product_name: data.productName,
        variant_label: data.variantLabel,
        amount: data.priceCents / 100, // Convert cents to dollars
        status: "pending",
        payment_method: "MoneyMotion",
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Error creating order:", orderError);
      throw new Error("Failed to create order");
    }

    const orderId = (order as any).id;
    
    // Get site URL - use env variable or fallback to window location
    let siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
    
    // Ensure HTTPS for production
    if (!siteUrl.startsWith('https://') && !siteUrl.includes('localhost')) {
      siteUrl = siteUrl.replace('http://', 'https://');
    }
    
    console.log('🌐 Using site URL:', siteUrl);

    // 3. Create MoneyMotion Session
    const session = await createCheckoutSession({
      description: `Order ${orderNumber} - ${data.productName}`,
      urls: {
        success: `${siteUrl}/checkout/success?order_id=${orderId}`,
        cancel: `${siteUrl}/checkout/cancel?order_id=${orderId}`,
        failure: `${siteUrl}/checkout/failure?order_id=${orderId}`,
      },
      userInfo: { email: data.email },
      lineItems: [
        {
          name: data.productName,
          description: `${data.productName} - ${data.variantLabel}`,
          pricePerItemInCents: data.priceCents,
          quantity: 1,
        },
      ],
    });

    // 4. Save session ID to order
    const { error: updateError } = await supabase
      .from("orders" as any)
      .update({ payment_id: session.checkoutSessionId })
      .eq("id", orderId);

    if (updateError) {
      console.error("Error updating order with session ID:", updateError);
    }

    return {
      success: true,
      checkoutUrl: getCheckoutUrl(session.checkoutSessionId),
      orderId,
    };
  } catch (error) {
    console.error("Checkout Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create checkout",
    };
  }
}

export async function createCartCheckout(data: CartCheckoutData) {
  try {
    // 0. Idempotency: reuse recent pending session for this email to avoid double charges
    try {
      const since = new Date();
      since.setMinutes(since.getMinutes() - 3);
      const { data: recent } = await supabase
        .from("orders" as any)
        .select("id, payment_id, status, created_at, amount, product_name")
        .eq("customer_email", data.email)
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false })
        .limit(1);
      const existingPending = Array.isArray(recent) ? recent.find((o: any) => o.status === "pending") : null;
      if (existingPending) {
        if (existingPending.payment_id) {
          return {
            success: true,
            checkoutUrl: getCheckoutUrl(existingPending.payment_id),
            orderId: existingPending.id,
          };
        }
        // Attach a new session to this existing pending order instead of creating a new order
        let lineItems0 = data.items.map(item => ({
          name: item.productName,
          description: `${item.productName} - ${item.variantLabel}`,
          pricePerItemInCents: Math.round(item.price * 100),
          quantity: item.quantity,
        }));
        const siteUrl0 = (import.meta.env.VITE_SITE_URL || window.location.origin).replace('http://', 'https://');
        const session0 = await createCheckoutSession({
          description: `Order (pending) - ${data.items.length} item(s)`,
          urls: {
            success: `${siteUrl0}/checkout/success?order_id=${existingPending.id}`,
            cancel: `${siteUrl0}/checkout/cancel?order_id=${existingPending.id}`,
            failure: `${siteUrl0}/checkout/failure?order_id=${existingPending.id}`,
          },
          userInfo: { email: data.email },
          lineItems: lineItems0,
        });
        await supabase.from("orders" as any).update({ payment_id: session0.checkoutSessionId }).eq("id", existingPending.id);
        return {
          success: true,
          checkoutUrl: getCheckoutUrl(session0.checkoutSessionId),
          orderId: existingPending.id,
        };
      }
    } catch {}
    // 1. Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
    
    // 2. Calculate total
    const totalAmount = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let finalTotal = totalAmount;
    let appliedCoupon: any = null;
    let discountAmount = 0;
    if (data.couponCode) {
      try {
        const saved = localStorage.getItem('coupons');
        const list = saved ? JSON.parse(saved) : [];
        const found = Array.isArray(list) ? list.find((c: any) => c.code?.toUpperCase() === data.couponCode?.toUpperCase() && c.isActive !== false) : null;
        if (found) {
          const now = new Date();
          const exp = found.expiresAt ? new Date(found.expiresAt) : null;
          const notExpired = !exp || exp.getTime() >= now.getTime();
          if (notExpired) {
            appliedCoupon = found;
            if (found.type === 'percentage') {
              discountAmount = (totalAmount * (Number(found.discount) || 0)) / 100;
            } else {
              discountAmount = Number(found.discount) || 0;
            }
            if (discountAmount > totalAmount) discountAmount = totalAmount;
            finalTotal = totalAmount - discountAmount;
          }
        }
      } catch {}
    }
    
    // 3. Create pending order in database
    const { data: order, error: orderError } = await supabase
      .from("orders" as any)
      .insert({
        order_number: orderNumber,
        customer_email: data.email,
        customer_name: data.customerName,
        product_id: data.items[0].productId, // Primary product
        variant_id: data.items[0].variantId,
        product_name: data.items.length > 1 
          ? `${data.items[0].productName} + ${data.items.length - 1} more`
          : data.items[0].productName,
        variant_label: data.items[0].variantLabel,
        amount: finalTotal,
        status: "pending",
        payment_method: "MoneyMotion",
        notes: appliedCoupon ? `Coupon ${appliedCoupon.code} applied` : undefined,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Error creating order:", orderError);
      throw new Error("Failed to create order");
    }

    const orderId = (order as any).id;
    
    // Get site URL
    let siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
    
    if (!siteUrl.startsWith('https://') && !siteUrl.includes('localhost')) {
      siteUrl = siteUrl.replace('http://', 'https://');
    }
    
    console.log('🌐 Using site URL:', siteUrl);

    // 4. Create MoneyMotion Session with all items (apply discount if present)
    let lineItems = data.items.map(item => ({
      name: item.productName,
      description: `${item.productName} - ${item.variantLabel}`,
      pricePerItemInCents: Math.round(item.price * 100),
      quantity: item.quantity,
    }));
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        const pct = Math.max(0, Math.min(100, Number(appliedCoupon.discount) || 0));
        lineItems = lineItems.map(li => ({
          ...li,
          pricePerItemInCents: Math.max(0, Math.round(li.pricePerItemInCents * (1 - pct / 100))),
        }));
      } else {
        let remaining = Math.round((Number(appliedCoupon.discount) || 0) * 100);
        for (let i = 0; i < lineItems.length && remaining > 0; i++) {
          const li = lineItems[i];
          const itemTotal = li.pricePerItemInCents * li.quantity;
          const discountForItem = Math.min(remaining, itemTotal);
          const perItemDiscount = Math.floor(discountForItem / li.quantity);
          lineItems[i] = {
            ...li,
            pricePerItemInCents: Math.max(0, li.pricePerItemInCents - perItemDiscount),
          };
          remaining -= perItemDiscount * li.quantity;
        }
      }
    }

    const session = await createCheckoutSession({
      description: `Order ${orderNumber} - ${data.items.length} item(s)${appliedCoupon ? ` - Coupon ${appliedCoupon.code}` : ""}`,
      urls: {
        success: `${siteUrl}/checkout/success?order_id=${orderId}`,
        cancel: `${siteUrl}/checkout/cancel?order_id=${orderId}`,
        failure: `${siteUrl}/checkout/failure?order_id=${orderId}`,
      },
      userInfo: { email: data.email },
      lineItems,
    });

    // 5. Save session ID to order
    const { error: updateError } = await supabase
      .from("orders" as any)
      .update({ payment_id: session.checkoutSessionId })
      .eq("id", orderId);

    if (updateError) {
      console.error("Error updating order with session ID:", updateError);
    }

    return {
      success: true,
      checkoutUrl: getCheckoutUrl(session.checkoutSessionId),
      orderId,
    };
  } catch (error) {
    console.error("Cart Checkout Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create checkout",
    };
  }
}
