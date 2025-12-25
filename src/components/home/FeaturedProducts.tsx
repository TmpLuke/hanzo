import { Link } from "react-router-dom";
import { ProductCard } from "@/components/products/ProductCard";
import { getFeaturedProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { IconChevronRight } from "@/components/icons/HanzoIcons";

export function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts();

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Hand-picked products loved by creators worldwide
            </p>
          </div>
          <Link to="/products" className="hidden sm:block">
            <Button variant="ghost" className="group">
              View All
              <IconChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link to="/products">
            <Button variant="outline" className="group">
              View All Products
              <IconChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
