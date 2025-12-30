import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, Plus, Edit, Trash2, MoreHorizontal,
  ImagePlus, Shield, AlertTriangle, Wrench, XOctagon, Check, X
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

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  status: ProductStatus;
  image_url: string | null;
  gallery_images?: string[] | null;
  menu_images?: string[] | null;
  features: string[] | null;
  rating?: number | null;
  reviews?: number | null;
  is_featured: boolean | null;
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  undetected: { label: "Undetected", icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  testing: { label: "Testing", icon: AlertTriangle, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  updating: { label: "Updating", icon: Wrench, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  down: { label: "Down", icon: XOctagon, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [variantsDialogOpen, setVariantsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductForVariants, setSelectedProductForVariants] = useState<Product | null>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "cheats",
    status: "undetected" as ProductStatus,
    image_url: "",
    gallery_images: [] as string[],
    menu_images: [] as string[],
    features: [] as string[],
    rating: 4.5,
    reviews: 50,
    is_featured: false,
  });
  const [currentFeature, setCurrentFeature] = useState("");
  const [currentGalleryImage, setCurrentGalleryImage] = useState("");
  const [currentMenuImage, setCurrentMenuImage] = useState("");
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [newVariant, setNewVariant] = useState({
    label: "",
    duration: "1day" as any,
    price: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Supabase error:", error);
        toast.error("Failed to fetch products");
      } else {
        console.log("Products loaded:", data);
        setProducts(data || []);
      }
    } catch (err) {
      console.error("Exception fetching products:", err);
      toast.error("Failed to fetch products");
    }
    setLoading(false);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const handleSaveProduct = async () => {
    if (!newProduct.name.trim()) {
      toast.error("Product name is required");
      return;
    }

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
      rating: newProduct.rating,
      reviews: newProduct.reviews,
      is_featured: newProduct.is_featured,
    };
    
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) {
          toast.error(`Failed to update product: ${error.message}`);
        } else {
          toast.success("Product updated successfully!");
          fetchProducts();
        }
      } else {
        const { error } = await supabase
          .from("products")
          .insert(productData);

        if (error) {
          toast.error(`Failed to create product: ${error.message}`);
        } else {
          toast.success("Product created successfully!");
          fetchProducts();
        }
      }
      setDialogOpen(false);
      setEditingProduct(null);
      resetForm();
    } catch (err) {
      console.error("Error saving product:", err);
      toast.error("An error occurred while saving the product");
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      category: "cheats",
      status: "undetected",
      image_url: "",
      gallery_images: [],
      menu_images: [],
      features: [],
      rating: 4.5,
      reviews: 50,
      is_featured: false,
    });
    setCurrentFeature("");
    setCurrentGalleryImage("");
    setCurrentMenuImage("");
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
        
      if (error) {
        toast.error(`Failed to delete product: ${error.message}`);
      } else {
        toast.success("Product deleted successfully!");
        fetchProducts();
      }
    } catch (err) {
      console.error("Error deleting product:", err);
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
      gallery_images: product.gallery_images || [],
      menu_images: product.menu_images || [],
      features: product.features || [],
      rating: product.rating || 4.5,
      reviews: product.reviews || 50,
      is_featured: product.is_featured || false,
    });
    setDialogOpen(true);
  };

  const updateProductStatus = async (id: string, status: ProductStatus) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ status })
        .eq("id", id);

      if (error) {
        toast.error(`Failed to update status: ${error.message}`);
      } else {
        toast.success(`Status updated to ${statusConfig[status].label}`);
        fetchProducts();
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status: ProductStatus) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.bg} ${config.color} ${config.border}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const handleManageVariants = async (product: Product) => {
    setSelectedProductForVariants(product);
    try {
      const { data, error } = await (supabase as any)
        .from("product_variants")
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
    } catch (err) {
      console.error("Error loading variants:", err);
      toast.error("Failed to load variants");
    }
  };

  const updateVariantPrice = async (variantId: string, newPrice: number) => {
    try {
      const { error } = await (supabase as any)
        .from("product_variants")
        .update({ price: newPrice })
        .eq("id", variantId);

      if (error) {
        toast.error("Failed to update variant price");
        console.error(error);
      } else {
        toast.success("Variant price updated!");
        if (selectedProductForVariants) {
          handleManageVariants(selectedProductForVariants);
        }
      }
    } catch (err) {
      console.error("Error updating variant:", err);
      toast.error("Failed to update variant price");
    }
  };

  const addVariant = async () => {
    if (!newVariant.label.trim() || !selectedProductForVariants) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from("product_variants")
        .insert({
          product_id: selectedProductForVariants.id,
          label: newVariant.label,
          duration: newVariant.duration,
          price: newVariant.price,
        });

      if (error) {
        toast.error("Failed to add variant");
        console.error(error);
      } else {
        toast.success("Variant added!");
        setNewVariant({ label: "", duration: "1day", price: 0 });
        if (selectedProductForVariants) {
          handleManageVariants(selectedProductForVariants);
        }
      }
    } catch (err) {
      console.error("Error adding variant:", err);
      toast.error("Failed to add variant");
    }
  };

  const updateVariant = async () => {
    if (!editingVariant || !newVariant.label.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from("product_variants")
        .update({
          label: newVariant.label,
          duration: newVariant.duration,
          price: newVariant.price,
        })
        .eq("id", editingVariant.id);

      if (error) {
        toast.error("Failed to update variant");
        console.error(error);
      } else {
        toast.success("Variant updated!");
        setEditingVariant(null);
        setNewVariant({ label: "", duration: "1day", price: 0 });
        if (selectedProductForVariants) {
          handleManageVariants(selectedProductForVariants);
        }
      }
    } catch (err) {
      console.error("Error updating variant:", err);
      toast.error("Failed to update variant");
    }
  };

  const deleteVariant = async (variantId: string) => {
    if (!confirm("Are you sure you want to delete this variant?")) {
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from("product_variants")
        .delete()
        .eq("id", variantId);

      if (error) {
        toast.error("Failed to delete variant");
        console.error(error);
      } else {
        toast.success("Variant deleted!");
        if (selectedProductForVariants) {
          handleManageVariants(selectedProductForVariants);
        }
      }
    } catch (err) {
      console.error("Error deleting variant:", err);
      toast.error("Failed to delete variant");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button 
          className="gap-2 bg-primary hover:bg-primary/90" 
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

      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-card/50 border-border/50"
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No products found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="rounded-lg bg-card border border-border p-4 hover:border-primary/30 transition-all"
            >
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImagePlus className="w-6 h-6 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">${product.price}</p>
                  <div className="mt-2">{getStatusBadge(product.status)}</div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditProduct(product)} className="gap-2">
                      <Edit className="w-4 h-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleManageVariants(product)} className="gap-2">
                      <span>💎</span> Manage Variants
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {(Object.keys(statusConfig) as ProductStatus[]).map((status) => (
                      <DropdownMenuItem 
                        key={status} 
                        onClick={() => updateProductStatus(product.id, status)}
                        className={product.status === status ? 'bg-primary/10' : ''}
                      >
                        {statusConfig[status].label}
                        {product.status === status && <Check className="w-3 h-3 ml-auto" />}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive" 
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct ? "Update the product details" : "Fill in the details to create a new product"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input 
                value={newProduct.name} 
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Enter product name"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={newProduct.description} 
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Enter product description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input 
                type="number"
                value={newProduct.price} 
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input 
                value={newProduct.category} 
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                placeholder="cheats"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={newProduct.status} onValueChange={(value) => setNewProduct({ ...newProduct, status: value as ProductStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(statusConfig) as ProductStatus[]).map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusConfig[status].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cover Image URL</Label>
              <Input 
                value={newProduct.image_url} 
                onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Gallery Images */}
            <div className="space-y-2">
              <Label>Gallery Images (slideshow)</Label>
              <div className="flex gap-2">
                <Input 
                  value={currentGalleryImage} 
                  onChange={(e) => setCurrentGalleryImage(e.target.value)}
                  placeholder="https://example.com/gallery.jpg"
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
                >
                  Add
                </Button>
              </div>
              {newProduct.gallery_images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {newProduct.gallery_images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-20 object-cover rounded border border-border" />
                      <button
                        type="button"
                        onClick={() => setNewProduct({
                          ...newProduct,
                          gallery_images: newProduct.gallery_images.filter((_, i) => i !== idx)
                        })}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100"
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
              <Label>Menu Images (features showcase)</Label>
              <div className="flex gap-2">
                <Input 
                  value={currentMenuImage} 
                  onChange={(e) => setCurrentMenuImage(e.target.value)}
                  placeholder="https://example.com/menu.jpg"
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
                >
                  Add
                </Button>
              </div>
              {newProduct.menu_images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {newProduct.menu_images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt={`Menu ${idx}`} className="w-full h-20 object-cover rounded border border-border" />
                      <button
                        type="button"
                        onClick={() => setNewProduct({
                          ...newProduct,
                          menu_images: newProduct.menu_images.filter((_, i) => i !== idx)
                        })}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-2">
              <Label>Features</Label>
              <div className="flex gap-2">
                <Input 
                  value={currentFeature} 
                  onChange={(e) => setCurrentFeature(e.target.value)}
                  placeholder="Add a feature"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && currentFeature.trim()) {
                      e.preventDefault();
                      setNewProduct({ 
                        ...newProduct, 
                        features: [...newProduct.features, currentFeature.trim()] 
                      });
                      setCurrentFeature("");
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (currentFeature.trim()) {
                      setNewProduct({ 
                        ...newProduct, 
                        features: [...newProduct.features, currentFeature.trim()] 
                      });
                      setCurrentFeature("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              {newProduct.features.length > 0 && (
                <div className="space-y-2">
                  {newProduct.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                      <span className="text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => setNewProduct({
                          ...newProduct,
                          features: newProduct.features.filter((_, i) => i !== idx)
                        })}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                <input
                  type="checkbox"
                  checked={newProduct.is_featured}
                  onChange={(e) => setNewProduct({ ...newProduct, is_featured: e.target.checked })}
                  className="mr-2"
                />
                Mark as Featured
              </Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProduct} className="bg-primary hover:bg-primary/90">
              {editingProduct ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Variants Dialog */}
      <Dialog open={variantsDialogOpen} onOpenChange={setVariantsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Variants</DialogTitle>
            <DialogDescription>
              {selectedProductForVariants?.name} - Add, edit, or delete variants
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Add/Edit Form */}
            <div className="bg-muted/50 p-4 rounded space-y-3">
              <h3 className="font-semibold">{editingVariant ? "Edit Variant" : "Add New Variant"}</h3>
              <Input
                placeholder="Label (e.g., 1 Day)"
                value={newVariant.label}
                onChange={(e) => setNewVariant({ ...newVariant, label: e.target.value })}
              />
              <Select value={newVariant.duration} onValueChange={(value) => setNewVariant({ ...newVariant, duration: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onetime">One Time</SelectItem>
                  <SelectItem value="1day">1 Day</SelectItem>
                  <SelectItem value="3day">3 Days</SelectItem>
                  <SelectItem value="1week">1 Week</SelectItem>
                  <SelectItem value="1month">1 Month</SelectItem>
                  <SelectItem value="lifetime">Lifetime</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Price"
                value={newVariant.price}
                onChange={(e) => setNewVariant({ ...newVariant, price: parseFloat(e.target.value) || 0 })}
                step="0.01"
              />
              <div className="flex gap-2">
                <Button onClick={editingVariant ? updateVariant : addVariant} className="flex-1 bg-primary">
                  {editingVariant ? "Update Variant" : "Add Variant"}
                </Button>
                {editingVariant && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingVariant(null);
                      setNewVariant({ label: "", duration: "1day", price: 0 });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            {/* Variants List */}
            <div className="space-y-2">
              <h3 className="font-semibold">Existing Variants</h3>
              {variants.length === 0 ? (
                <p className="text-muted-foreground text-sm">No variants found</p>
              ) : (
                variants.map((variant) => (
                  <div key={variant.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div className="flex-1">
                      <p className="font-semibold">{variant.label}</p>
                      <p className="text-sm text-muted-foreground">${Number(variant.price).toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingVariant(variant);
                          setNewVariant({
                            label: variant.label,
                            duration: variant.duration,
                            price: variant.price,
                          });
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteVariant(variant.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVariantsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
