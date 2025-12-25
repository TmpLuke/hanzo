import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, Plus, Copy, Trash2, MoreHorizontal, Ticket,
  Calendar, Percent, Hash, Check
} from "lucide-react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  showInPopup: boolean;
  createdAt: string;
}

const initialCoupons: Coupon[] = [
  { id: "1", code: "HANZO10", discount: 10, type: "percentage", usageLimit: 1000, usedCount: 234, expiresAt: "2025-01-31", isActive: true, showInPopup: true, createdAt: "2024-12-01" },
  { id: "2", code: "WELCOME20", discount: 20, type: "percentage", usageLimit: 500, usedCount: 89, expiresAt: "2025-02-28", isActive: true, showInPopup: false, createdAt: "2024-12-15" },
  { id: "3", code: "SAVE5", discount: 5, type: "fixed", usageLimit: 200, usedCount: 156, expiresAt: "2025-01-15", isActive: true, showInPopup: false, createdAt: "2024-11-20" },
  { id: "4", code: "BUNDLE15", discount: 15, type: "percentage", usageLimit: 100, usedCount: 45, expiresAt: "2025-03-01", isActive: true, showInPopup: false, createdAt: "2024-12-10" },
  { id: "5", code: "FLASH50", discount: 50, type: "percentage", usageLimit: 50, usedCount: 50, expiresAt: "2024-12-20", isActive: false, showInPopup: false, createdAt: "2024-12-18" },
];

// Load coupons from localStorage or use initial
const loadCoupons = (): Coupon[] => {
  const saved = localStorage.getItem('coupons');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse coupons', e);
      return initialCoupons;
    }
  }
  return initialCoupons;
};

// Save coupons to localStorage
const saveCoupons = (coupons: Coupon[]) => {
  localStorage.setItem('coupons', JSON.stringify(coupons));
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(loadCoupons());
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: "",
    discount: 10,
    type: "percentage",
    usageLimit: 100,
    expiresAt: "",
    isActive: true,
    showInPopup: false,
  });

  // Save coupons to localStorage whenever they change
  useEffect(() => {
    saveCoupons(coupons);
    
    // Update popup coupon if needed
    const popupCoupon = coupons.find(c => c.showInPopup);
    if (popupCoupon) {
      localStorage.setItem('popupCoupon', JSON.stringify(popupCoupon));
    } else {
      localStorage.removeItem('popupCoupon');
    }
  }, [coupons]);

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "HANZO";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCoupon({ ...newCoupon, code });
  };

  const handleSaveCoupon = () => {
    const coupon: Coupon = {
      id: Date.now().toString(),
      code: newCoupon.code || "",
      discount: newCoupon.discount || 10,
      type: newCoupon.type || "percentage",
      usageLimit: newCoupon.usageLimit || 100,
      usedCount: 0,
      expiresAt: newCoupon.expiresAt || "",
      isActive: true,
      showInPopup: newCoupon.showInPopup || false,
      createdAt: new Date().toISOString().split("T")[0],
    };
    
    // If this coupon is set to show in popup, disable all others
    if (coupon.showInPopup) {
      setCoupons(coupons.map(c => ({ ...c, showInPopup: false })));
    }
    
    setCoupons([coupon, ...coupons]);
    toast.success(`Coupon ${coupon.code} created!`);
    setDialogOpen(false);
    setNewCoupon({ code: "", discount: 10, type: "percentage", usageLimit: 100, expiresAt: "", isActive: true, showInPopup: false });
  };

  const togglePopupDisplay = (id: string) => {
    const updatedCoupons = coupons.map(c => ({
      ...c,
      showInPopup: c.id === id ? !c.showInPopup : false // Only one can be shown in popup
    }));
    setCoupons(updatedCoupons);
    
    const coupon = updatedCoupons.find(c => c.id === id);
    if (coupon?.showInPopup) {
      // Save to localStorage
      localStorage.setItem('popupCoupon', JSON.stringify(coupon));
      toast.success(`${coupon.code} will now show in the popup every time!`);
      
      // Trigger a storage event to notify other tabs/windows
      window.dispatchEvent(new Event('storage'));
    } else {
      toast.success("Popup coupon disabled");
      localStorage.removeItem('popupCoupon');
    }
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    toast.success("Coupon status updated!");
  };

  const deleteCoupon = (id: string) => {
    const coupon = coupons.find(c => c.id === id);
    if (coupon?.showInPopup) {
      localStorage.removeItem('popupCoupon');
    }
    setCoupons(coupons.filter(c => c.id !== id));
    toast.success("Coupon deleted!");
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied ${code} to clipboard!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Coupons</h1>
          <p className="text-muted-foreground">Create and manage discount codes</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            <Ticket className="w-4 h-4" />
            Preview Popup
          </Button>
          <Button className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Create Coupon
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search coupons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Coupons Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCoupons.map((coupon) => (
          <div key={coupon.id} className={`rounded-2xl bg-card border ${coupon.isActive ? "border-border" : "border-border/50 opacity-60"} ${coupon.showInPopup ? "ring-2 ring-primary shadow-lg shadow-primary/20" : ""} p-5 hover:border-primary/30 transition-all`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${coupon.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-lg">{coupon.code}</span>
                    <button onClick={() => copyCode(coupon.code)} className="p-1 hover:bg-muted rounded">
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${coupon.isActive ? "text-primary" : "text-muted-foreground"}`}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                    {coupon.showInPopup && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                        Popup
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => copyCode(coupon.code)}>
                    <Copy className="w-4 h-4 mr-2" /> Copy Code
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => togglePopupDisplay(coupon.id)}>
                    <Ticket className="w-4 h-4 mr-2" /> {coupon.showInPopup ? "Hide from Popup" : "Show in Popup"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleCouponStatus(coupon.id)}>
                    <Check className="w-4 h-4 mr-2" /> {coupon.isActive ? "Deactivate" : "Activate"}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={() => deleteCoupon(coupon.id)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Percent className="w-4 h-4" /> Discount
                </span>
                <span className="font-semibold">
                  {coupon.type === "percentage" ? `${coupon.discount}%` : `$${coupon.discount}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Hash className="w-4 h-4" /> Usage
                </span>
                <span className="font-semibold">{coupon.usedCount} / {coupon.usageLimit}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Expires
                </span>
                <span className="font-semibold">{coupon.expiresAt}</span>
              </div>
            </div>

            {/* Usage Bar */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Usage Progress</span>
                <span>{Math.round((coupon.usedCount / coupon.usageLimit) * 100)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (coupon.usedCount / coupon.usageLimit) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Coupon Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Coupon</DialogTitle>
            <DialogDescription>Create a new discount code for your customers</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Coupon Code</Label>
              <div className="flex gap-2">
                <Input 
                  value={newCoupon.code} 
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="HANZO10"
                  className="font-mono"
                />
                <Button variant="outline" onClick={generateCode}>Generate</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount</Label>
                <Input 
                  type="number"
                  value={newCoupon.discount} 
                  onChange={(e) => setNewCoupon({ ...newCoupon, discount: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newCoupon.type} onValueChange={(v: "percentage" | "fixed") => setNewCoupon({ ...newCoupon, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Usage Limit</Label>
                <Input 
                  type="number"
                  value={newCoupon.usageLimit} 
                  onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Expires</Label>
                <Input 
                  type="date"
                  value={newCoupon.expiresAt} 
                  onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCoupon}>Create Coupon</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
