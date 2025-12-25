import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trash2, ShoppingCart } from 'lucide-react';
import { createCartCheckout } from '@/lib/checkout';

export default function CartCheckout() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPreview, setDiscountPreview] = useState(0);

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      setDiscountPreview(0);
      toast.error('Enter a coupon code');
      return;
    }
    try {
      const saved = localStorage.getItem('coupons');
      const list = saved ? JSON.parse(saved) : [];
      const found = Array.isArray(list)
        ? list.find((c: any) => c.code?.toUpperCase() === couponCode.toUpperCase() && c.isActive !== false)
        : null;
      if (!found) {
        setDiscountPreview(0);
        toast.error('Invalid or inactive coupon');
        return;
      }
      const now = new Date();
      const exp = found.expiresAt ? new Date(found.expiresAt) : null;
      const notExpired = !exp || exp.getTime() >= now.getTime();
      if (!notExpired) {
        setDiscountPreview(0);
        toast.error('Coupon expired');
        return;
      }
      const subtotal = getTotalPrice();
      let discount = 0;
      if (found.type === 'percentage') {
        discount = (subtotal * (Number(found.discount) || 0)) / 100;
      } else {
        discount = Number(found.discount) || 0;
      }
      if (discount > subtotal) discount = subtotal;
      setDiscountPreview(discount);
      toast.success(`Applied ${found.code}`);
    } catch {
      toast.error('Failed to apply coupon');
    }
  };

  const handleCheckout = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await createCartCheckout({
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          variantId: item.variantId,
          variantLabel: item.variantLabel,
          price: item.price,
          quantity: item.quantity,
        })),
        email,
        customerName: customerName || undefined,
        couponCode: couponCode || undefined,
      });

      if (result.success && result.checkoutUrl) {
        toast.success('Redirecting to checkout...');
        clearCart();
        window.location.href = result.checkoutUrl;
      } else {
        toast.error(result.error || 'Failed to create checkout');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('An error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some products to your cart to continue
            </p>
            <Button onClick={() => navigate('/products')}>Browse Products</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl font-display font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Cart Items */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
              {items.map((item) => (
                <Card
                  key={`${item.productId}-${item.variantId}`}
                  className="p-4 flex gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.productName}</h3>
                    <p className="text-sm text-muted-foreground">{item.variantLabel}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.productId, item.variantId, item.quantity - 1)
                          }
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.productId, item.variantId, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                      </div>
                      <p className="text-lg font-bold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.productId, item.variantId)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </Card>
              ))}
            </div>

            {/* Checkout Form */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Customer Details</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isProcessing}
                      className="h-12"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your purchase details will be sent here
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name (Optional)</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      disabled={isProcessing}
                      className="h-12"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Total</h2>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="bg-background"
                  />
                  <Button variant="outline" onClick={applyCoupon}>
                    Apply
                  </Button>
                </div>
                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.productName} x{item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  {discountPreview > 0 && (
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="text-green-500">- ${discountPreview.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-2xl font-bold mt-3">
                    <span>Total:</span>
                    <span className="text-primary">
                      ${(Math.max(0, getTotalPrice() - discountPreview)).toFixed(2)}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-black"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Complete Purchase'
                  )}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
