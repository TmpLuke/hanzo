import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, Plus, Edit, Trash2, MoreHorizontal,
  ImagePlus, Shield, AlertTriangle, Wrench, XOctagon, Check, X, Upload
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type ProductStatus = "undetected" | "testing" | "updating" | "down";

interface DetailedFeatureSection {
  title: string;
  items: string[];
}

interface DetailedFeatures {
  sections: DetailedFeatureSection[];
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  status: ProductStatus;
  image_url: string | null;
  features: string[] | null;
  detailed_features?: DetailedFeatures | null;
  rating?: number | null;
  reviews?: number | null;
  is_featured: boolean | null;
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  undetected: { 
    label: "Undetected", 
    icon: Shield, 
    color: "text-emerald-400", 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/20"
  },
  testing: { 
    label: "Testing", 
    icon: AlertTriangle, 
    color: "text-blue-400", 
    bg: "bg-blue-500/10", 
    border: "border-blue-500/30",
    glow: "shadow-blue-500/20"
  },
  updating: { 
    label: "Updating", 
    icon: Wrench, 
    color: "text-amber-400", 
    bg: "bg-amber-500/10", 
    border: "border-amber-500/30",
    glow: "shadow-amber-500/20"
  },
  down: { 
    label: "Down", 
    icon: XOctagon, 
    color: "text-red-400", 
    bg: "bg-red-500/10", 
    border: "border-red-500/30",
    glow: "shadow-red-500/20"
  },
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [variantsByProduct, setVariantsByProduct] = useState<Record<string, any[]>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [variantsDialogOpen, setVariantsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductForVariants, setSelectedProductForVariants] = useState<Product | null>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "aimbots",
    status: "undetected" as ProductStatus,
    image_url: "",
    gallery_images: [] as string[],
    menu_images: [] as string[],
    features: [] as string[],
    detailed_features: { sections: [] } as DetailedFeatures,
    rating: 4.5,
    reviews: 50,
    is_featured: false,
  });
  const [currentFeature, setCurrentFeature] = useState("");
  const [currentGalleryImage, setCurrentGalleryImage] = useState("");
  const [currentMenuImage, setCurrentMenuImage] = useState("");
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(null);
  const [currentDetailedSection, setCurrentDetailedSection] = useState({ title: "", items: [""] });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories" as any)
      .select("*")
      .order("display_order", { ascending: true });
    
    if (!error && data) {
      setCategories(data);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast.error("Failed to fetch products");
      console.error(error);
    } else {
      setProducts(data || []);
      // Fetch all variants in one query and map by product_id
      const { data: variantsData, error: variantsErr } = await supabase
        .from("product_variants" as any)
        .select("*");
      if (!variantsErr && variantsData) {
        const map: Record<string, any[]> = {};
        for (const v of variantsData) {
          const pid = v.product_id;
          if (!map[pid]) map[pid] = [];
          map[pid].push(v);
        }
        // sort by common duration order
        Object.keys(map).forEach((pid) => {
          map[pid] = map[pid].sort((a, b) => (a.price as number) - (b.price as number));
        });
        setVariantsByProduct(map);
      }
    }
    setLoading(false);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSaveProduct = async () => {
    console.log('Saving product:', editingProduct ? 'UPDATE' : 'INSERT', newProduct);
    
    const productData = {
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      category: newProduct.category,
      status: newProduct.status,
      image_url: newProduct.image_url || null,
      gallery_images: newProduct.gallery_images.length > 0 ? newProduct.gallery_images : null,
      menu_images: newProduct.menu_images.length > 0 ? newProduct.menu_images : null,
      features: newProduct.features,
      detailed_features: newProduct.detailed_features,
      rating: newProduct.rating,
      reviews: newProduct.reviews,
      is_featured: newProduct.is_featured,
    };
    
    if (editingProduct) {
      const { data, error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id)
        .select();

      if (error) {
        console.error('Update error:', error);
        toast.error(`Failed to update product: ${error.message}`);
      } else {
        console.log('Product updated:', data);
        toast.success("Product updated successfully!");
        fetchProducts();
      }
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert(productData)
        .select();

      if (error) {
        console.error('Insert error:', error);
        toast.error(`Failed to create product: ${error.message}`);
      } else {
        console.log('Product created:', data);
        toast.success("Product created successfully!");
        fetchProducts();
      }
    }
    setDialogOpen(false);
    setEditingProduct(null);
    resetForm();
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      category: "aimbots",
      status: "undetected",
      image_url: "",
      gallery_images: [],
      menu_images: [],
      features: [],
      detailed_features: { sections: [] },
      rating: 4.5,
      reviews: 50,
      is_featured: false,
    });
    setCurrentGalleryImage("");
    setCurrentMenuImage("");
    setCurrentFeature("");
    setEditingFeatureIndex(null);
    setCurrentDetailedSection({ title: "", items: [""] });
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This will also delete all related orders and variants.')) {
      return;
    }

    console.log('Deleting product and related data:', id);
    
    try {
      // First, delete related orders
      const { error: ordersError } = await supabase
        .from("orders" as any)
        .delete()
        .eq("product_id", id);
      
      if (ordersError) {
        console.error('Error deleting orders:', ordersError);
        toast.error(`Failed to delete related orders: ${ordersError.message}`);
        return;
      }

      // Delete related variants
      const { error: variantsError } = await supabase
        .from("product_variants" as any)
        .delete()
        .eq("product_id", id);
      
      if (variantsError) {
        console.error('Error deleting variants:', variantsError);
        // Continue anyway, variants might not exist
      }

      // Finally, delete the product
      const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)
        .select();
        
      if (error) {
        console.error('Delete error:', error);
        toast.error(`Failed to delete product: ${error.message}`);
      } else {
        console.log('Product deleted:', data);
        toast.success("Product and related data deleted successfully!");
        fetchProducts();
      }
    } catch (err) {
      console.error('Exception during delete:', err);
      toast.error("An error occurred while deleting the product");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description || "",
      price: Number(product.price),
      category: product.category,
      status: product.status,
      image_url: product.image_url || "",
      gallery_images: (product as any).gallery_images || [],
      menu_images: (product as any).menu_images || [],
      features: product.features || [],
      detailed_features: product.detailed_features || { sections: [] },
      rating: product.rating || 4.5,
      reviews: product.reviews || 50,
      is_featured: product.is_featured || false,
    });
    setDialogOpen(true);
  };

  const updateProductStatus = async (id: string, status: ProductStatus) => {
    console.log('Updating product status:', id, status);
    const { data, error } = await supabase
      .from("products")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) {
      console.error('Status update error:', error);
      toast.error(`Failed to update status: ${error.message}`);
    } else {
      console.log('Status updated successfully:', data);
      toast.success(`Status updated to ${statusConfig[status].label}`);
      fetchProducts();
    }
  };

  const handleManageVariants = async (product: Product) => {
    setSelectedProductForVariants(product);
    const { data, error } = await supabase
      .from("product_variants" as any)
      .select("*")
      .eq("product_id", product.id)
      .order("price");

    if (error) {
      toast.error("Failed to load variants");
      console.error(error);
    } else {
      setVariants(data || []);
      setVariantsDialogOpen(true);
    }
  };

  const updateVariantPrice = async (variantId: string, newPrice: number) => {
    const { error } = await supabase
      .from("product_variants" as any)
      .update({ price: newPrice })
      .eq("id", variantId);

    if (error) {
      toast.error("Failed to update variant price");
      console.error(error);
    } else {
      toast.success("Variant price updated!");
      // Refresh variants
      if (selectedProductForVariants) {
        handleManageVariants(selectedProductForVariants);
      }
    }
  };

  const deleteVariant = async (variantId: string) => {
    if (!confirm('Are you sure you want to delete this variant?')) {
      return;
    }

    const { error } = await supabase
      .from("product_variants" as any)
      .delete()
      .eq("id", variantId);

    if (error) {
      toast.error("Failed to delete variant");
      console.error(error);
    } else {
      toast.success("Variant deleted!");
      // Refresh variants
      if (selectedProductForVariants) {
        handleManageVariants(selectedProductForVariants);
      }
      // Refresh products to update variant count
      fetchProducts();
    }
  };

  const getStatusBadge = (status: ProductStatus) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.bg} ${config.color} ${config.border} shadow-lg ${config.glow}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map(cat => ({ value: cat.slug, label: cat.name }))
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog and statuses</p>
        </div>
        <Button 
          className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105" 
          onClick={() => { 
            setEditingProduct(null); 
            resetForm();
            setDialogOpen(true); 
          }}
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/50 border-border/50 focus:border-primary/50 focus:bg-card transition-all duration-300"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-44 bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
            {categoryOptions.map((cat) => (
              <SelectItem key={cat.value} value={cat.value} className="hover:bg-primary/10 focus:bg-primary/10">
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl bg-card/50 border border-border/50 overflow-hidden animate-pulse">
              <div className="aspect-square bg-muted/50" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-muted/50 rounded w-3/4" />
                <div className="h-3 bg-muted/30 rounded w-full" />
                <div className="h-3 bg-muted/30 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="group rounded-xl bg-[#0d0f12] border border-white/10 overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
            >
              <div className="p-4 flex gap-4">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImagePlus className="w-6 h-6 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="absolute -top-1 -right-1">{getStatusBadge(product.status)}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 hover:bg-primary/10 hover:text-primary transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border/50 min-w-[180px]">
                        <DropdownMenuItem onClick={() => handleEditProduct(product)} className="gap-2 hover:bg-primary/10 focus:bg-primary/10">
                          <Edit className="w-4 h-4" /> Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManageVariants(product)} className="gap-2 hover:bg-primary/10 focus:bg-primary/10">
                          <span className="text-lg">💎</span> Manage Variants
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/50" />
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Change Status</div>
                        {(Object.keys(statusConfig) as ProductStatus[]).map((status) => {
                          const config = statusConfig[status];
                          const Icon = config.icon;
                          return (
                            <DropdownMenuItem 
                              key={status} 
                              onClick={() => updateProductStatus(product.id, status)}
                              className={`gap-2 hover:bg-primary/10 focus:bg-primary/10 ${product.status === status ? 'bg-primary/5' : ''}`}
                            >
                              <Icon className={`w-4 h-4 ${config.color}`} />
                              <span>{config.label}</span>
                              {product.status === status && <Check className="w-3 h-3 ml-auto text-primary" />}
                            </DropdownMenuItem>
                          );
                        })}
                        <DropdownMenuSeparator className="bg-border/50" />
                        <DropdownMenuItem 
                          className="gap-2 text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive" 
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mt-2">
                    <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold border border-primary/20">undetected</span>
                    {product.is_featured && (
                      <span className="text-[11px] bg-white/5 text-white/80 px-2 py-0.5 rounded-full border border-white/10">Popular</span>
                    )}
                    <span className="text-[11px] bg-white/5 text-white/70 px-2 py-0.5 rounded-full border border-white/10">
                      {(variantsByProduct[product.id]?.length || 0)} variants
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-2">{product.description}</p>
                  <div className="mt-2 text-xs text-white/80">
                    {(() => {
                      const v = variantsByProduct[product.id] || [];
                      const order = ["onetime","1day","3day","1week","1month","lifetime"];
                      const sorted = [...v].sort((a,b) => order.indexOf(a.duration) - order.indexOf(b.duration));
                      const shown = sorted.slice(0,3);
                      const parts = shown.map((vv) => `${vv.label} $${Number(vv.price).toFixed(2)}`);
                      const more = sorted.length > shown.length ? ` • +${sorted.length - shown.length} more` : "";
                      return parts.join(" • ") + more;
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <ImagePlus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
          <Button onClick={() => { setSearchQuery(""); setCategoryFilter("all"); }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct ? "Update the product details below" : "Fill in the details to create a new product"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input 
                value={newProduct.name} 
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Enter product name"
                className="bg-background/50 border-border/50 focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={newProduct.description} 
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Enter product description"
                rows={3}
                className="bg-background/50 border-border/50 focus:border-primary/50 resize-none"
              />
            </div>
            
            {/* Image URL */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Cover Image URL (shown on cards)
              </Label>
              <Input 
                value={newProduct.image_url} 
                onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                placeholder="https://example.com/cover-image.jpg"
                className="bg-background/50 border-border/50 focus:border-primary/50"
              />
              {newProduct.image_url && (
                <div className="mt-2 rounded-lg overflow-hidden border border-border/50">
                  <img src={newProduct.image_url} alt="Preview" className="w-full h-32 object-cover" />
                </div>
              )}
            </div>

            {/* Gallery Images for Slideshow */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ImagePlus className="w-4 h-4" />
                Gallery Images (slideshow on detail page)
              </Label>
              <div className="flex gap-2">
                <Input 
                  value={currentGalleryImage} 
                  onChange={(e) => setCurrentGalleryImage(e.target.value)}
                  placeholder="https://example.com/gallery-image.jpg"
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && currentGalleryImage.trim()) {
                      e.preventDefault();
                      setNewProduct({ 
                        ...newProduct, 
                        gallery_images: [...newProduct.gallery_images, currentGalleryImage.trim()] 
                      });
                      setCurrentGalleryImage("");
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (currentGalleryImage.trim()) {
                      setNewProduct({ 
                        ...newProduct, 
                        gallery_images: [...newProduct.gallery_images, currentGalleryImage.trim()] 
                      });
                      setCurrentGalleryImage("");
                    }
                  }}
                  className="flex-shrink-0"
                >
                  Add
                </Button>
              </div>
              {newProduct.gallery_images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {newProduct.gallery_images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={img} 
                        alt={`Gallery ${index + 1}`} 
                        className="w-full h-20 object-cover rounded-lg border border-border/50" 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setNewProduct({
                            ...newProduct,
                            gallery_images: newProduct.gallery_images.filter((_, i) => i !== index)
                          });
                        }}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Menu Images */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ImagePlus className="w-4 h-4" />
                Menu Images (shown below features)
              </Label>
              <div className="flex gap-2">
                <Input 
                  value={currentMenuImage} 
                  onChange={(e) => setCurrentMenuImage(e.target.value)}
                  placeholder="https://example.com/menu-image.jpg"
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && currentMenuImage.trim()) {
                      e.preventDefault();
                      setNewProduct({ 
                        ...newProduct, 
                        menu_images: [...newProduct.menu_images, currentMenuImage.trim()] 
                      });
                      setCurrentMenuImage("");
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (currentMenuImage.trim()) {
                      setNewProduct({ 
                        ...newProduct, 
                        menu_images: [...newProduct.menu_images, currentMenuImage.trim()] 
                      });
                      setCurrentMenuImage("");
                    }
                  }}
                  className="flex-shrink-0"
                >
                  Add
                </Button>
              </div>
              {newProduct.menu_images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {newProduct.menu_images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={img} 
                        alt={`Menu ${index + 1}`} 
                        className="w-full h-20 object-cover rounded-lg border border-border/50" 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setNewProduct({
                            ...newProduct,
                            menu_images: newProduct.menu_images.filter((_, i) => i !== index)
                          });
                        }}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input 
                  type="number"
                  step="0.01"
                  value={newProduct.price} 
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                  placeholder="29.99"
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newProduct.category} onValueChange={(v) => setNewProduct({ ...newProduct, category: v })}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
                    {categories.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Rating and Reviews */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rating (0-5)</Label>
                <Input 
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={newProduct.rating} 
                  onChange={(e) => setNewProduct({ ...newProduct, rating: parseFloat(e.target.value) || 0 })}
                  placeholder="4.5"
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Reviews Count</Label>
                <Input 
                  type="number"
                  value={newProduct.reviews} 
                  onChange={(e) => setNewProduct({ ...newProduct, reviews: parseInt(e.target.value) || 0 })}
                  placeholder="50"
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={newProduct.status} onValueChange={(v: ProductStatus) => setNewProduct({ ...newProduct, status: v })}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
                  {(Object.keys(statusConfig) as ProductStatus[]).map((status) => {
                    const config = statusConfig[status];
                    const Icon = config.icon;
                    return (
                      <SelectItem key={status} value={status}>
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${config.color}`} />
                          {config.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Basic Features */}
            <div className="space-y-2">
              <Label>Basic Features</Label>
              <div className="flex gap-2">
                <Input 
                  value={currentFeature}
                  onChange={(e) => setCurrentFeature(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && currentFeature.trim()) {
                      e.preventDefault();
                      if (editingFeatureIndex !== null) {
                        const updatedFeatures = [...newProduct.features];
                        updatedFeatures[editingFeatureIndex] = currentFeature.trim();
                        setNewProduct({ ...newProduct, features: updatedFeatures });
                        setEditingFeatureIndex(null);
                      } else {
                        setNewProduct({ 
                          ...newProduct, 
                          features: [...newProduct.features, currentFeature.trim()] 
                        });
                      }
                      setCurrentFeature("");
                    }
                  }}
                  placeholder={editingFeatureIndex !== null ? "Edit feature and press Enter" : "Type a feature and press Enter"}
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                />
                <Button 
                  type="button"
                  onClick={() => {
                    if (currentFeature.trim()) {
                      if (editingFeatureIndex !== null) {
                        const updatedFeatures = [...newProduct.features];
                        updatedFeatures[editingFeatureIndex] = currentFeature.trim();
                        setNewProduct({ ...newProduct, features: updatedFeatures });
                        setEditingFeatureIndex(null);
                      } else {
                        setNewProduct({ 
                          ...newProduct, 
                          features: [...newProduct.features, currentFeature.trim()] 
                        });
                      }
                      setCurrentFeature("");
                    }
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  {editingFeatureIndex !== null ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </Button>
                {editingFeatureIndex !== null && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingFeatureIndex(null);
                      setCurrentFeature("");
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {newProduct.features.map((feature, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                    {feature}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentFeature(feature);
                        setEditingFeatureIndex(idx);
                      }}
                      className="hover:text-foreground"
                      title="Edit feature"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewProduct({ 
                        ...newProduct, 
                        features: newProduct.features.filter((_, i) => i !== idx) 
                      })}
                      className="hover:text-destructive"
                      title="Delete feature"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Detailed Features */}
            <div className="space-y-2">
              <Label>Detailed Features (Sections)</Label>
              <div className="space-y-3 p-3 bg-background/30 rounded-lg border border-border/50">
                <Input 
                  value={currentDetailedSection.title}
                  onChange={(e) => setCurrentDetailedSection({ ...currentDetailedSection, title: e.target.value })}
                  placeholder="Section title (e.g., 'Aimbot Core')"
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                />
                {currentDetailedSection.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input 
                      value={item}
                      onChange={(e) => {
                        const newItems = [...currentDetailedSection.items];
                        newItems[idx] = e.target.value;
                        setCurrentDetailedSection({ ...currentDetailedSection, items: newItems });
                      }}
                      placeholder="Feature item"
                      className="bg-background/50 border-border/50 focus:border-primary/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newItems = currentDetailedSection.items.filter((_, i) => i !== idx);
                        setCurrentDetailedSection({ ...currentDetailedSection, items: newItems.length ? newItems : [""] });
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDetailedSection({ 
                      ...currentDetailedSection, 
                      items: [...currentDetailedSection.items, ""] 
                    })}
                    className="flex-1"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Item
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      if (currentDetailedSection.title && currentDetailedSection.items.some(i => i.trim())) {
                        setNewProduct({
                          ...newProduct,
                          detailed_features: {
                            sections: [
                              ...newProduct.detailed_features.sections,
                              {
                                title: currentDetailedSection.title,
                                items: currentDetailedSection.items.filter(i => i.trim())
                              }
                            ]
                          }
                        });
                        setCurrentDetailedSection({ title: "", items: [""] });
                      }
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Section
                  </Button>
                </div>
              </div>
              
              {/* Display added sections with edit capability */}
              {newProduct.detailed_features.sections.length > 0 && (
                <div className="space-y-2 mt-3">
                  {newProduct.detailed_features.sections.map((section, sectionIdx) => (
                    <div key={sectionIdx} className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{section.title}</h4>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => {
                              // Load section into editor
                              setCurrentDetailedSection({
                                title: section.title,
                                items: [...section.items]
                              });
                              // Remove from list
                              setNewProduct({
                                ...newProduct,
                                detailed_features: {
                                  sections: newProduct.detailed_features.sections.filter((_, i) => i !== sectionIdx)
                                }
                              });
                            }}
                            title="Edit section"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setNewProduct({
                              ...newProduct,
                              detailed_features: {
                                sections: newProduct.detailed_features.sections.filter((_, i) => i !== sectionIdx)
                              }
                            })}
                            title="Delete section"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {section.items.map((item, itemIdx) => (
                          <li key={itemIdx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={newProduct.is_featured}
                onChange={(e) => setNewProduct({ ...newProduct, is_featured: e.target.checked })}
                className="w-4 h-4 rounded border-border/50"
              />
              <Label htmlFor="featured" className="cursor-pointer">Mark as Featured</Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-border/50 hover:bg-muted/50">
              Cancel
            </Button>
            <Button onClick={handleSaveProduct} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
              {editingProduct ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Variants Dialog */}
      <Dialog open={variantsDialogOpen} onOpenChange={setVariantsDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl">Manage Variants</DialogTitle>
            <DialogDescription>
              {selectedProductForVariants?.name} - Update variant prices
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto">
            {variants.map((variant) => (
              <div key={variant.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                <div className="flex-1">
                  <p className="font-medium">{variant.label}</p>
                  <p className="text-xs text-muted-foreground">{variant.duration}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    defaultValue={variant.price}
                    onBlur={(e) => {
                      const newPrice = parseFloat(e.target.value);
                      if (!isNaN(newPrice) && newPrice !== variant.price) {
                        updateVariantPrice(variant.id, newPrice);
                      }
                    }}
                    className="w-24 bg-background border-border/50 focus:border-primary/50"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteVariant(variant.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    title="Delete variant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVariantsDialogOpen(false)} className="border-border/50 hover:bg-muted/50">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
