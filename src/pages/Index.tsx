import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { fetchProducts, type Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { IconCart, IconChevronRight, IconCheck, IconStar } from "@/components/icons/HanzoIcons";
import { Badge } from "@/components/ui/badge";
import hanzoLogo from "@/assets/hanzo-logo.png";
import { ShoppingCart, Sparkles, Gamepad2, ChevronDown, Grid3X3, Activity } from "lucide-react";
import { CouponPopup } from "@/components/CouponPopup";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { StatsCounter } from "@/components/home/StatsCounter";
import { BackToTop } from "@/components/BackToTop";

// Store products globally to avoid re-fetching
let cachedProducts: Product[] = [];

// Hero Section - matching visuals.gg style
function HeroSection() {
  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/30" />
      
      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Large glowing orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[150px] animate-glow-pulse" />
      
      {/* Smaller accent orbs */}
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '3s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />

      <div className="container mx-auto px-4 relative z-10 text-center">
        {/* Trust Badge with glow */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 mb-12 animate-fade-in backdrop-blur-sm shadow-lg shadow-primary/20">
          <IconCheck className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground font-medium">
            Trusted by <span className="text-primary font-bold">50,000+</span> Gamers Worldwide
          </span>
        </div>

        {/* Main Heading with better gradient */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold leading-[1.05] mb-8 animate-slide-up">
          <span className="text-foreground">Unleash Your Power</span>
          <br />
          <span className="text-gradient inline-block mt-2">Dominate The Game</span>
        </h1>

        {/* Subtext with better spacing */}
        <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-slide-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
          Take your gaming to the next level with our premium cheats, designed to redefine how you play and dominate every match.
        </p>

        {/* CTA Buttons with enhanced styling */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Link to="/products">
            <Button variant="hero" size="lg" className="gap-2 px-10 py-7 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105">
              <Grid3X3 className="w-6 h-6" />
              Browse Products
            </Button>
          </Link>
          <Link to="/status">
            <Button variant="outline" size="lg" className="gap-2 px-10 py-7 text-lg font-semibold rounded-2xl border-2 hover:bg-card/50 backdrop-blur-sm">
              <Activity className="w-6 h-6" />
              View Status
            </Button>
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/50 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Instant Delivery</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/50 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">24/7 Support</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/50 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Regular Updates</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-7 h-7 text-primary/60" />
        </div>
      </div>
    </section>
  );
}

// PayPal Notice Banner
function PayPalNoticeBanner() {
  return (
    <section className="py-8 bg-gradient-to-r from-blue-500/10 via-blue-600/10 to-blue-500/10 border-y border-blue-500/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l1.12-7.106c.082-.518.526-.9 1.05-.9h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.201-1.284.096-2.296-.859-3.18z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">Want to Pay with PayPal?</h3>
              <p className="text-sm text-muted-foreground">
                Join our Discord server for PayPal payment options
              </p>
            </div>
          </div>
          <a
            href="https://discord.gg/hanzo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0"
          >
            <Button className="gap-2 bg-blue-500 hover:bg-blue-600 text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Join Discord
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

// Product Card - matching visuals.gg style
function ProductCardVisuals({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const cheapestVariant = product.variants && product.variants.length > 0
    ? product.variants.reduce((min, v) => v.price < min.price ? v : min, product.variants[0])
    : { id: `${product.id}-1day`, label: "1 Day", price: product.price, duration: "1day" as const };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      productName: product.name,
      variantId: cheapestVariant.id,
      variantLabel: cheapestVariant.label,
      price: cheapestVariant.price,
      image: product.image,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
  };

  return (
    <div
      ref={cardRef}
      className="group relative bg-gradient-to-br from-card to-card/50 rounded-3xl border border-border/50 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer"
      style={{ transformStyle: 'preserve-3d', transition: 'transform 0.1s ease-out, box-shadow 0.3s ease' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Product Image */}
      <div className="aspect-[4/3] overflow-hidden bg-muted/30 relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-foreground mb-1 truncate group-hover:text-primary transition-colors">{product.name}</h3>
            {product.badge && (
              <Badge variant="secondary" className="bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                {product.category.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mt-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl border-2 hover:bg-primary/10 hover:border-primary transition-all"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product.id}`);
              }}
            >
              View Details
            </Button>
            <Button
              onClick={handleAddToCart}
              size="icon"
              className="h-9 w-9 rounded-xl bg-primary/10 hover:bg-primary hover:text-black border-2 border-primary/30 hover:border-primary transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground font-medium mb-0.5">From</div>
            <div className="text-2xl font-bold text-primary">${product.price}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Best Seller Section with shuffling
function BestSellerSection({ products }: { products: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const bestSellers = products.filter(p => p.badge).slice(0, 6);

  // Auto-shuffle products
  useEffect(() => {
    if (bestSellers.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, bestSellers.length - 2));
    }, 4000);
    return () => clearInterval(interval);
  }, [bestSellers.length]);

  const visibleProducts = bestSellers.slice(currentIndex, currentIndex + 3).length >= 3
    ? bestSellers.slice(currentIndex, currentIndex + 3)
    : [...bestSellers.slice(currentIndex), ...bestSellers.slice(0, 3 - (bestSellers.length - currentIndex))];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background dots */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--muted-foreground) / 0.3) 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Best Seller</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Best Seller Products
          </h2>
          <p className="text-muted-foreground">
            Products that are loved by our customers
          </p>
        </div>

        {/* Products Grid with animation */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {visibleProducts.map((product, idx) => (
            <div
              key={`${product.id}-${idx}`}
              className="animate-fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <ProductCardVisuals product={product} />
            </div>
          ))}
        </div>

        {/* Carousel dots */}
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: Math.max(1, bestSellers.length - 2) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
                }`}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/products">
            <Button variant="outline" className="gap-2">
              <Grid3X3 className="w-4 h-4" />
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// All Products shuffling carousel
function AllProductsCarousel({ products }: { products: Product[] }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (products.length === 0) return;
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [products.length]);

  const getVisibleProducts = () => {
    if (products.length === 0) return [];
    const visible = [];
    for (let i = 0; i < 4; i++) {
      visible.push(products[(offset + i) % products.length]);
    }
    return visible;
  };

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <IconStar className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">All Products</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Explore Our Collection
          </h2>
          <p className="text-muted-foreground">
            Premium digital products for every creator
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {getVisibleProducts().map((product, idx) => (
            <div
              key={`${product.id}-${offset}-${idx}`}
              className="animate-scale-in"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <ProductCardVisuals product={product} />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/products">
            <Button variant="hero" size="lg" className="gap-2">
              <Grid3X3 className="w-5 h-5" />
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Trending Now - based on recent verified orders
function TrendingSection({ products }: { products: Product[] }) {
  const [trending, setTrending] = useState<Product[]>([]);
  useEffect(() => {
    const loadTrending = async () => {
      const from = new Date();
      from.setDate(from.getDate() - 7);
      const { data, error } = await supabase
        .from("orders" as any)
        .select("product_name, status, created_at")
        .gte("created_at", from.toISOString())
        .eq("status", "completed");
      if (error || !data) {
        setTrending(products.slice(0, 4));
        return;
      }
      const counts: Record<string, number> = {};
      for (const o of data) {
        const name = o.product_name as string;
        counts[name] = (counts[name] || 0) + 1;
      }
      const sortedNames = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([n]) => n);
      const mapped: Product[] = [];
      for (const n of sortedNames) {
        const p = products.find(pp => pp.name === n);
        if (p) mapped.push(p);
        if (mapped.length >= 4) break;
      }
      if (mapped.length < 4) {
        for (const p of products) {
          if (!mapped.find(m => m.id === p.id)) mapped.push(p);
          if (mapped.length >= 4) break;
        }
      }
      setTrending(mapped);
    };
    loadTrending();
  }, [products]);
  if (trending.length === 0) return null;
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Trending Now</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Popular This Week
          </h2>
          <p className="text-muted-foreground">
            Driven by verified purchases in the last 7 days
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trending.map((p) => (
            <ProductCardVisuals key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials
function Testimonials() {
  const items = [
    { name: "Rogue", game: "Fortnite", text: "Clean ESP and legit aim. Stayed undetected for weeks.", rating: 5 },
    { name: "Atlas", game: "Rust", text: "Loot ESP saved me hours. Super stable.", rating: 5 },
    { name: "Nova", game: "Apex", text: "Configurator is slick, aimbot feels human.", rating: 4.5 },
  ];
  return (
    <section className="py-24 bg-gradient-to-b from-black/10 to-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold">What Players Say</h2>
          <p className="text-muted-foreground">Real feedback from real users</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border p-6 hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.game}</div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{t.text}</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className={`w-3 h-3 rounded-full ${j + 1 <= Math.round(t.rating) ? 'bg-primary' : 'bg-muted'}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Index Page
const Index = () => {
  const [products, setProducts] = useState<Product[]>(cachedProducts);
  const [isLoading, setIsLoading] = useState(cachedProducts.length === 0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      if (cachedProducts.length > 0) {
        setProducts(cachedProducts);
        setIsLoading(false);
        setLoaded(true);
        return;
      }

      setIsLoading(true);
      const data = await fetchProducts();
      cachedProducts = data;
      setProducts(data);
      setIsLoading(false);
      setLoaded(true);
    };

    loadProducts();
  }, []);

  return (
    <>
      <AnnouncementBanner />
      <CouponPopup />
      <BackToTop />
      <MainLayout hideFooter={false}>
        <HeroSection />
        <StatsCounter />
        <PayPalNoticeBanner />
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        ) : (
          <>
            <BestSellerSection products={products} />
            {loaded && <TrendingSection products={products} />}
            <Testimonials />
            <AllProductsCarousel products={products} />
          </>
        )}
      </MainLayout>
    </>
  );
};

export default Index;
