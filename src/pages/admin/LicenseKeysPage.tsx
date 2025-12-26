import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Key, Upload, Download } from "lucide-react";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
}

interface Variant {
  id: string;
  label: string;
  product_id: string;
}

interface LicenseKey {
  id: string;
  product_id: string;
  variant_id: string;
  license_key: string;
  is_used: boolean;
  used_by_email: string | null;
  used_at: string | null;
  created_at: string;
}

interface DeliverySetting {
  id: string;
  product_id: string;
  variant_id: string;
  delivery_type: 'auto' | 'manual';
  discord_message: string;
}

export default function LicenseKeysPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [licenseKeys, setLicenseKeys] = useState<LicenseKey[]>([]);
  const [deliverySettings, setDeliverySettings] = useState<DeliverySetting[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [bulkKeys, setBulkKeys] = useState("");
  const [singleKey, setSingleKey] = useState("");
  
  const [deliveryType, setDeliveryType] = useState<'auto' | 'manual'>('auto');
  const [discordMessage, setDiscordMessage] = useState("Please open a ticket at discord.gg/hanzo to receive your license key.");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProduct && selectedVariant) {
      fetchLicenseKeys();
      fetchDeliverySetting();
    }
  }, [selectedProduct, selectedVariant]);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch products
    const { data: productsData } = await supabase
      .from("products")
      .select("id, name")
      .order("name");
    
    if (productsData) setProducts(productsData);
    
    // Fetch variants
    const { data: variantsData } = await supabase
      .from("product_variants" as any)
      .select("*")
      .order("price");
    
    if (variantsData) setVariants(variantsData);
    
    setLoading(false);
  };

  const fetchLicenseKeys = async () => {
    if (!selectedProduct || !selectedVariant) return;
    
    const { data, error } = await supabase
      .from("license_keys" as any)
      .select("*")
      .eq("product_id", selectedProduct)
      .eq("variant_id", selectedVariant)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error(error);
    } else {
      setLicenseKeys(data || []);
    }
  };

  const fetchDeliverySetting = async () => {
    if (!selectedProduct || !selectedVariant) return;
    
    const { data } = await supabase
      .from("product_delivery_settings" as any)
      .select("*")
      .eq("product_id", selectedProduct)
      .eq("variant_id", selectedVariant)
      .single();
    
    if (data) {
      setDeliveryType(data.delivery_type);
      setDiscordMessage(data.discord_message || "Please open a ticket at discord.gg/hanzo to receive your license key.");
    } else {
      setDeliveryType('auto');
      setDiscordMessage("Please open a ticket at discord.gg/hanzo to receive your license key.");
    }
  };

  const handleAddSingleKey = async () => {
    if (!selectedProduct || !selectedVariant || !singleKey.trim()) {
      toast.error("Please select product, variant and enter a license key");
      return;
    }

    const { error } = await supabase
      .from("license_keys" as any)
      .insert({
        product_id: selectedProduct,
        variant_id: selectedVariant,
        license_key: singleKey.trim(),
      });

    if (error) {
      toast.error(`Failed to add key: ${error.message}`);
    } else {
      toast.success("License key added!");
      setSingleKey("");
      fetchLicenseKeys();
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedProduct || !selectedVariant || !bulkKeys.trim()) {
      toast.error("Please select product, variant and enter license keys");
      return;
    }

    const keys = bulkKeys
      .split('\n')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    if (keys.length === 0) {
      toast.error("No valid keys found");
      return;
    }

    const keysToInsert = keys.map(key => ({
      product_id: selectedProduct,
      variant_id: selectedVariant,
      license_key: key,
    }));

    const { error } = await supabase
      .from("license_keys" as any)
      .insert(keysToInsert);

    if (error) {
      toast.error(`Failed to upload keys: ${error.message}`);
    } else {
      toast.success(`${keys.length} license keys uploaded!`);
      setBulkKeys("");
      fetchLicenseKeys();
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm("Are you sure you want to delete this license key?")) return;

    const { error } = await supabase
      .from("license_keys" as any)
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(`Failed to delete key: ${error.message}`);
    } else {
      toast.success("License key deleted!");
      fetchLicenseKeys();
    }
  };

  const handleSaveDeliverySetting = async () => {
    if (!selectedProduct || !selectedVariant) {
      toast.error("Please select product and variant");
      return;
    }

    const { error } = await supabase
      .from("product_delivery_settings" as any)
      .upsert({
        product_id: selectedProduct,
        variant_id: selectedVariant,
        delivery_type: deliveryType,
        discord_message: discordMessage,
      }, {
        onConflict: 'product_id,variant_id'
      });

    if (error) {
      toast.error(`Failed to save settings: ${error.message}`);
    } else {
      toast.success("Delivery settings saved!");
    }
  };

  const filteredVariants = variants.filter(v => v.product_id === selectedProduct);
  const unusedKeys = licenseKeys.filter(k => !k.is_used);
  const usedKeys = licenseKeys.filter(k => k.is_used);

  const selectedProductName = products.find(p => p.id === selectedProduct)?.name || "";
  const selectedVariantName = variants.find(v => v.id === selectedVariant)?.label || "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold">License Key Management</h1>
        <p className="text-muted-foreground">Manage license keys and delivery settings for products</p>
      </div>

      {/* Product & Variant Selection */}
      <div className="grid md:grid-cols-2 gap-4 p-6 rounded-xl bg-card border border-border">
        <div className="space-y-2">
          <Label>Select Product</Label>
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Select Variant</Label>
          <Select 
            value={selectedVariant} 
            onValueChange={setSelectedVariant}
            disabled={!selectedProduct}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a variant" />
            </SelectTrigger>
            <SelectContent>
              {filteredVariants.map(v => (
                <SelectItem key={v.id} value={v.id}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedProduct && selectedVariant && (
        <>
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="text-sm text-muted-foreground mb-1">Total Keys</div>
              <div className="text-3xl font-bold">{licenseKeys.length}</div>
            </div>
            <div className="p-6 rounded-xl bg-card border border-primary/30">
              <div className="text-sm text-muted-foreground mb-1">Available</div>
              <div className="text-3xl font-bold text-primary">{unusedKeys.length}</div>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="text-sm text-muted-foreground mb-1">Used</div>
              <div className="text-3xl font-bold">{usedKeys.length}</div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="add" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="add">Add Keys</TabsTrigger>
              <TabsTrigger value="manage">Manage Keys</TabsTrigger>
              <TabsTrigger value="settings">Delivery Settings</TabsTrigger>
            </TabsList>

            {/* Add Keys Tab */}
            <TabsContent value="add" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Single Key */}
                <div className="p-6 rounded-xl bg-card border border-border space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Add Single Key
                  </h3>
                  <div className="space-y-2">
                    <Label>License Key</Label>
                    <Input
                      value={singleKey}
                      onChange={(e) => setSingleKey(e.target.value)}
                      placeholder="Enter license key"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddSingleKey();
                      }}
                    />
                  </div>
                  <Button onClick={handleAddSingleKey} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Key
                  </Button>
                </div>

                {/* Bulk Upload */}
                <div className="p-6 rounded-xl bg-card border border-border space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Bulk Upload
                  </h3>
                  <div className="space-y-2">
                    <Label>License Keys (one per line)</Label>
                    <Textarea
                      value={bulkKeys}
                      onChange={(e) => setBulkKeys(e.target.value)}
                      placeholder="KEY-1234-5678&#10;KEY-ABCD-EFGH&#10;KEY-WXYZ-9876"
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </div>
                  <Button onClick={handleBulkUpload} className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Keys
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Manage Keys Tab */}
            <TabsContent value="manage" className="space-y-4">
              <div className="rounded-xl bg-card border border-border overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr>
                        <th className="text-left p-4 font-semibold">License Key</th>
                        <th className="text-left p-4 font-semibold">Status</th>
                        <th className="text-left p-4 font-semibold">Used By</th>
                        <th className="text-right p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {licenseKeys.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center p-8 text-muted-foreground">
                            No license keys added yet
                          </td>
                        </tr>
                      ) : (
                        licenseKeys.map((key) => (
                          <tr key={key.id} className="border-t border-border hover:bg-muted/30">
                            <td className="p-4 font-mono text-sm">{key.license_key}</td>
                            <td className="p-4">
                              {key.is_used ? (
                                <span className="px-2 py-1 rounded-full bg-red-500/10 text-red-400 text-xs">
                                  Used
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                                  Available
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {key.used_by_email || '-'}
                            </td>
                            <td className="p-4 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteKey(key.id)}
                                className="hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Delivery Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <div className="p-6 rounded-xl bg-card border border-border space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Delivery Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryType === 'auto'}
                        onChange={() => setDeliveryType('auto')}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium">Automatic Delivery</div>
                        <div className="text-sm text-muted-foreground">
                          License keys will be automatically sent from your stock when orders are completed
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryType === 'manual'}
                        onChange={() => setDeliveryType('manual')}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium">Manual Delivery (Discord Ticket)</div>
                        <div className="text-sm text-muted-foreground">
                          Show a message asking customers to open a Discord ticket
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {deliveryType === 'manual' && (
                  <div className="space-y-2">
                    <Label>Discord Message</Label>
                    <Textarea
                      value={discordMessage}
                      onChange={(e) => setDiscordMessage(e.target.value)}
                      rows={3}
                      placeholder="Message to show customers"
                    />
                  </div>
                )}

                <Button onClick={handleSaveDeliverySetting} className="w-full">
                  Save Delivery Settings
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
