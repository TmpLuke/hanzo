import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IconChevronRight, IconStar } from "@/components/icons/HanzoIcons";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Trusted by <span className="text-primary font-semibold">10,000+</span> content creators
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 animate-slide-up">
            Premium Digital Products for
            <span className="text-gradient block mt-2">Content Creators</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Elevate your stream with professional overlays, powerful tools, and stunning graphics. Everything you need to stand out.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/products">
              <Button variant="hero" size="xl" className="group">
                Browse Products
                <IconChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/products?category=bundles">
              <Button variant="glass" size="xl">
                View Bundles
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border/50 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div>
              <div className="text-3xl md:text-4xl font-display font-bold text-gradient">200+</div>
              <div className="text-sm text-muted-foreground mt-1">Premium Products</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-display font-bold text-gradient">50K+</div>
              <div className="text-sm text-muted-foreground mt-1">Happy Customers</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <IconStar className="w-6 h-6 text-warning" />
                <span className="text-3xl md:text-4xl font-display font-bold">4.9</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
