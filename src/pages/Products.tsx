import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductCard } from "@/components/products/ProductCard";
import { fetchProducts, Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconSearch, IconX } from "@/components/icons/HanzoIcons";
import { Grid3X3 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState("popular");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    // Load products
    const productsData = await fetchProducts();
    setProducts(productsData);
    
    // Load categories from database
    const { data: categoriesData } = await supabase
      .from("categories" as any)
      .select("*")
      .order("display_order");
    
    if (categoriesData && categoriesData.length > 0) {
      setCategories(categoriesData);
    } else {
      // Fallback categories
      setCategories([
        { slug: 'aimbots', name: 'Aimbots' },
        { slug: 'esp', name: 'ESP' },
        { slug: 'radar', name: 'Radar' },
        { slug: 'spoofers', name: 'Spoofers' },
        { slug: 'unlocks', name: 'Unlocks' },
        { slug: 'bundles', name: 'Bundles' },
      ]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("category") || "all";
    if (q !== searchQuery) setSearchQuery(q);
    if (cat !== selectedCategory) setSelectedCategory(cat);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result = result.reverse();
        break;
      case "price-low":
        result = result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result = result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [products, searchQuery, sortBy, selectedCategory]);

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    const next = new URLSearchParams(searchParams);
    if (slug === "all") {
      next.delete("category");
    } else {
      next.set("category", slug);
    }
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("popular");
  };

  return (
    <MainLayout>
      <div className="min-h-screen pt-12 pb-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden mb-16">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
          
          <div className="container mx-auto px-4 relative z-10 text-center py-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6 animate-fade-in">
              <span className="text-sm text-primary font-medium">Premium Collection</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-4 animate-slide-up">
              <span className="text-gradient">All Products</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Discover our complete collection of premium gaming tools
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            <Button
              onClick={() => handleCategoryClick("all")}
              variant={selectedCategory === "all" ? "default" : "outline"}
              className={`rounded-full px-6 transition-all ${
                selectedCategory === "all"
                  ? "bg-primary text-black hover:bg-primary/90"
                  : "border-border/50 hover:border-primary/50"
              }`}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              All Products
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.slug}
                onClick={() => handleCategoryClick(cat.slug)}
                variant={selectedCategory === cat.slug ? "default" : "outline"}
                className={`rounded-full px-6 transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-primary text-black hover:bg-primary/90"
                    : "border-border/50 hover:border-primary/50"
                }`}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-10 p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  const v = e.target.value;
                  setSearchQuery(v);
                  const next = new URLSearchParams(searchParams);
                  if (v) next.set("q", v); else next.delete("q");
                  setSearchParams(next);
                }}
                className="pl-12 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 transition-all"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-56 h-12 bg-background/50 border-border/50 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Results count */}
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
              </div>
              
              {/* Clear Filters */}
              {(searchQuery || selectedCategory !== "all") && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="rounded-xl">
                  <IconX className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="rounded-3xl bg-card/50 border border-border/50 animate-pulse overflow-hidden">
                  <div className="aspect-[4/3] bg-muted/30" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-muted/30 rounded-lg w-3/4" />
                    <div className="h-4 bg-muted/20 rounded-lg w-full" />
                    <div className="h-8 bg-muted/30 rounded-lg w-1/2 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="animate-scale-in"
                  style={{ animationDelay: `${(idx % 8) * 0.05}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 rounded-3xl bg-muted/30 flex items-center justify-center mx-auto mb-6">
                <IconSearch className="w-12 h-12 text-muted-foreground/50" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No products found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find any products matching your search. Try different keywords or clear your filters.
              </p>
              <Button onClick={clearFilters} size="lg" className="rounded-xl">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
