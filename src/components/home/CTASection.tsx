import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IconChevronRight } from "@/components/icons/HanzoIcons";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Ready to Elevate Your
            <span className="text-gradient block mt-2">Content Creation?</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-10">
            Join thousands of creators who've transformed their streams with Hanzo. 
            Start browsing our premium collection today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/products">
              <Button variant="hero" size="xl" className="group">
                Explore Products
                <IconChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/products?category=bundles">
              <Button variant="glass" size="xl">
                View Bundle Deals
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            🔒 Secure checkout • Instant delivery • Lifetime access
          </p>
        </div>
      </div>
    </section>
  );
}
