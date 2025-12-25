import { supabase } from "@/integrations/supabase/client";

export interface ProductVariant {
  id: string;
  duration: "1day" | "1week" | "1month" | "lifetime" | "3day" | "onetime";
  price: number;
  label: string;
}

export interface DetailedFeatureSection {
  title: string;
  items: string[];
}

export interface DetailedFeatures {
  sections: DetailedFeatureSection[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: "cheats" | "tools" | "accounts";
  image: string; // Cover image for cards
  galleryImages?: string[]; // Slideshow images for detail page
  menuImages?: string[]; // Menu/feature images shown below features
  rating: number;
  reviews: number;
  badge?: string;
  features: string[];
  detailedFeatures?: DetailedFeatures;
  inStock: boolean;
  variants: ProductVariant[];
  status?: string;
}

// Fetch products from Supabase with variants
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (productsError) {
      console.error("Error fetching products:", productsError);
      return [];
    }

    const { data: variantsData, error: variantsError } = await supabase
      .from("product_variants" as any)
      .select("*");

    if (variantsError) {
      console.error("Error fetching variants:", variantsError);
    }

    return (productsData || []).map((p) => {
      const productVariants = (variantsData || [])
        .filter((v: any) => v.product_id === p.id)
        .map((v: any) => ({
          id: v.id,
          duration: v.duration as any,
          price: Number(v.price),
          label: v.label,
        }));

      return {
        id: p.id,
        name: p.name,
        description: p.description || "",
        price: productVariants.length > 0 ? productVariants[0].price : Number(p.price),
        category: p.category as "cheats" | "tools" | "accounts",
        image: p.image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
        galleryImages: (p as any).gallery_images || undefined,
        menuImages: (p as any).menu_images || undefined,
        rating: Number((p as any).rating) || 4.5,
        reviews: Number((p as any).reviews) || 50,
        badge: p.is_featured ? "Featured" : undefined,
        features: p.features || [],
        detailedFeatures: (p as any).detailed_features || undefined,
        inStock: true,
        status: p.status,
        variants: productVariants.length > 0 ? productVariants : [
          { id: `${p.id}-1day`, duration: "1day", price: Number(p.price), label: "1 Day" },
        ],
      };
    });
  } catch (err) {
    console.error("Exception fetching products:", err);
    return [];
  }
};

// For compatibility - will be populated on first load
export let products: Product[] = [];

// Initialize products
fetchProducts().then(data => {
  products = data;
});

export const categories = [
  { id: "cheats", name: "Cheats", icon: "cheats", count: 0 },
  { id: "tools", name: "Tools", icon: "tool", count: 0 },
  { id: "accounts", name: "Accounts", icon: "accounts", count: 0 },
];

export const getProductById = async (id: string): Promise<Product | undefined> => {
  const products = await fetchProducts();
  return products.find(p => p.id === id);
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const products = await fetchProducts();
  return products.filter(p => p.category === category);
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const products = await fetchProducts();
  return products.filter(p => p.badge).slice(0, 4);
};
