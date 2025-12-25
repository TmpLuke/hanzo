import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { fetchProducts, type Product } from "@/data/products";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconStar, IconCheck, IconChevronRight } from "@/components/icons/HanzoIcons";
import { ChevronLeft, ChevronRight, Shield, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { createMoneyMotionCheckout } from "@/lib/checkout";
import { useCart } from "@/contexts/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0]);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const loadProduct = async () => {
    setLoading(true);
    const products = await fetchProducts();
    const foundProduct = products.find(p => p.id === id);
    
    if (foundProduct) {
      setProduct(foundProduct);
      const related = products
        .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4);
      setRelatedProducts(related);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The product you're looking for doesn't exist.
            </p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant || !product) {
      toast.error("Please select a variant");
      return;
    }

    addToCart({
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      variantLabel: selectedVariant.label,
      price: selectedVariant.price,
      image: product.image,
    });
  };

  const handleBuyNow = () => {
    setCheckoutDialogOpen(true);
  };

  const handleCheckout = async () => {
    if (!email || !selectedVariant || !product) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await createMoneyMotionCheckout({
        productId: product.id,
        productName: product.name,
        variantId: selectedVariant.id,
        variantLabel: selectedVariant.label,
        priceCents: Math.round(selectedVariant.price * 100),
        email,
        customerName: customerName || undefined,
      });

      if (result.success && result.checkoutUrl) {
        toast.success("Redirecting to checkout...");
        window.location.href = result.checkoutUrl;
      } else {
        toast.error(result.error || "Failed to create checkout");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <IconChevronRight className="w-4 h-4" />
            <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
            <IconChevronRight className="w-4 h-4" />
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Main Content - Visuals.gg Style */}
          <div className="grid lg:grid-cols-[1.2fr,1fr] gap-8 mb-16">
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              {/* Main Image with Badge */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-card/80 to-card border border-border group">
                {product.badge && (
                  <Badge className="absolute top-6 left-6 bg-primary text-black font-semibold px-4 py-2 text-sm z-10 rounded-xl">
                    {product.badge}
                  </Badge>
                )}
                
                <div className="aspect-square relative">
                  <img
                    src={product.galleryImages && product.galleryImages.length > 0 
                      ? product.galleryImages[currentImageIndex] 
                      : product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-emerald-600/20 mix-blend-multiply pointer-events-none" />
                  
                  {/* Navigation Arrows */}
                  {product.galleryImages && product.galleryImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => 
                          prev === 0 ? product.galleryImages!.length - 1 : prev - 1
                        )}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => 
                          prev === product.galleryImages!.length - 1 ? 0 : prev + 1
                        )}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              {product.galleryImages && product.galleryImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.galleryImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-primary ring-2 ring-primary/20 scale-95' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="space-y-6">
              {/* Category & Title */}
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                  {product.category}
                </span>
                <h1 className="text-4xl font-display font-bold mb-3">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <IconStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-warning fill-warning"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Variants */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Variants</h3>
                <div className="space-y-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        selectedVariant?.id === variant.id
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                          : "border-border hover:border-primary/30 hover:bg-card/50"
                      }`}
                    >
                      <span className="font-semibold">{variant.label}</span>
                      <span className="text-2xl font-bold text-primary">${variant.price.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  onClick={handleAddToCart}
                  variant="outline"
                  className="h-14 text-lg font-semibold rounded-2xl border-2 border-primary text-primary hover:bg-primary/10"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  className="h-14 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90 text-black shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Buy Now
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-primary" />
                  <span>Instant Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-primary" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Features */}
          {product.detailedFeatures && product.detailedFeatures.sections && (
            <div className="mb-16">
              <h2 className="text-3xl font-display font-bold mb-8">Complete Feature Set</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {product.detailedFeatures.sections.map((section, idx) => (
                  <div key={idx} className="rounded-3xl bg-card/50 border border-border p-8 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
                    <h3 className="text-xl font-semibold mb-6 text-primary flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      {section.title}
                    </h3>
                    <div className="space-y-3">
                      {section.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-start gap-3">
                          <IconCheck className="w-5 h-5 text-primary/70 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Basic Features (fallback) */}
          {(!product.detailedFeatures || !product.detailedFeatures.sections) && product.features.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-display font-bold mb-8">What's Included</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 p-5 rounded-2xl bg-card/50 border border-border hover:border-primary/30 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <IconCheck className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Menu Images */}
          {product.menuImages && product.menuImages.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-display font-bold mb-8 text-center">Menu Images</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.menuImages.map((img, index) => (
                  <div 
                    key={index} 
                    className="rounded-3xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 group cursor-pointer"
                  >
                    <img
                      src={img}
                      alt={`Menu ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-display font-bold">Related Products</h2>
                <Link to={`/products?category=${product.category}`}>
                  <Button variant="ghost" className="group">
                    View All
                    <IconChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={checkoutDialogOpen} onOpenChange={setCheckoutDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              Enter your details to proceed to secure checkout
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-xl bg-muted/50 p-4 border border-border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedVariant?.label}</p>
                </div>
                <p className="text-2xl font-bold text-primary">${selectedVariant?.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isProcessing}
                className="h-12 rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                Your purchase details will be sent to this email
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
                className="h-12 rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCheckoutDialogOpen(false)}
              disabled={isProcessing}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCheckout} 
              disabled={isProcessing}
              className="rounded-xl bg-primary hover:bg-primary/90 text-black"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Processing...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
