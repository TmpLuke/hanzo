import { Link } from "react-router-dom";
import { useState } from "react";
import { Product } from "@/data/products";
import { IconCart } from "@/components/icons/HanzoIcons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [tilt, setTilt] = useState<{rx: number; ry: number}>({ rx: 0, ry: 0 });
  const [added, setAdded] = useState(false);
  
  // Get the cheapest variant price
  const cheapestPrice = product.variants.length > 0 
    ? Math.min(...product.variants.map(v => v.price))
    : product.price;

  // Get the shortest duration variant label
  const cheapestVariant = product.variants.length > 0
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

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div
        className="rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-transform duration-300 overflow-hidden relative"
        style={{ perspective: "800px" }}
        onMouseMove={(e) => {
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const rx = ((y / rect.height) - 0.5) * -8;
          const ry = ((x / rect.width) - 0.5) * 10;
          setTilt({ rx, ry });
        }}
        onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
      >
        <div className="relative aspect-[4/3]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover will-change-transform"
            style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
          />
          <div className="absolute inset-0 bg-emerald-600/15 mix-blend-multiply" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-primary/10 to-transparent" />
        </div>
        <div className="p-4 space-y-3">
          <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-3">
            <Link
              to={`/product/${product.id}`}
              className="flex-1"
            >
              <button className="w-full flex items-center justify-center gap-2 bg-[#2a3142] hover:bg-[#323948] text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 border border-white/10">
                <IconCart className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </Link>
            <Button
              onClick={handleAddToCart}
              variant="outline"
              size="icon"
              className={`h-10 w-10 rounded-lg border-2 border-primary/30 hover:bg-primary/20 hover:border-primary transition-transform duration-200 ${added ? 'scale-110' : ''}`}
              onMouseDown={() => setAdded(true)}
              onMouseUp={() => setTimeout(() => setAdded(false), 150)}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
            <div className="text-right min-w-[92px]">
              <div className="text-xs text-muted-foreground">Starting at</div>
              <div className="text-xl font-bold text-primary">
                ${cheapestPrice.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
