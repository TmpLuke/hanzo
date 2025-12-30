import { Link } from "react-router-dom";
import { useState, useRef } from "react";
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
  const [added, setAdded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
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
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
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
    <Link to={`/product/${product.id}`} className="group block">
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="rounded-3xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 overflow-hidden relative"
        style={{ transformStyle: 'preserve-3d', transition: 'transform 0.1s ease-out, box-shadow 0.3s ease' }}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-primary/90 text-black font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
              {product.badge}
            </Badge>
          </div>
        )}
        
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        <div className="p-6 relative z-10">
          <div className="mb-4">
            <h3 className="text-xl font-bold truncate group-hover:text-primary transition-colors mb-2">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-2 hover:bg-primary/10 hover:border-primary transition-all"
                onClick={(e) => e.preventDefault()}
              >
                View Details
              </Button>
              <Button
                onClick={handleAddToCart}
                size="icon"
                className={`h-9 w-9 rounded-xl bg-primary/10 hover:bg-primary hover:text-black border-2 border-primary/30 hover:border-primary transition-all ${added ? 'scale-110 bg-primary text-black' : ''}`}
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground font-medium mb-0.5">From</div>
              <div className="text-2xl font-bold text-primary">
                ${cheapestPrice.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
