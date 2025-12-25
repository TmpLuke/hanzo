import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, Plus, Copy, Trash2, MoreHorizontal, Key, RefreshCw,
  CheckCircle, XCircle, User, Package, Calendar
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
import { toast } from "sonner";

interface License {
  id: string;
  key: string;
  product: string;
  customer: string;
  email: string;
  status: "active" | "expired" | "revoked";
  activatedAt: string;
  expiresAt: string;
  hwid?: string;
}

const initialLicenses: License[] = [
  { id: "1", key: "HNZO-XXXX-1234-ABCD", product: "Neon Pulse Pack", customer: "Alex Rivers", email: "alex@gmail.com", status: "active", activatedAt: "2024-12-20", expiresAt: "2025-12-20", hwid: "A1B2C3D4E5F6" },
  { id: "2", key: "HNZO-XXXX-5678-EFGH", product: "Creator Bundle Pro", customer: "Maya Chen", email: "maya@outlook.com", status: "active", activatedAt: "2024-12-18", expiresAt: "2025-12-18", hwid: "F6E5D4C3B2A1" },
  { id: "3", key: "HNZO-XXXX-9012-IJKL", product: "Stream Tools Suite", customer: "Jake Martinez", email: "jake@gmail.com", status: "expired", activatedAt: "2023-12-15", expiresAt: "2024-12-15" },
  { id: "4", key: "HNZO-XXXX-3456-MNOP", product: "Animated Emotes", customer: "Sara Wilson", email: "sara@yahoo.com", status: "active", activatedAt: "2024-12-10", expiresAt: "2025-12-10", hwid: "G7H8I9J0K1L2" },
  { id: "5", key: "HNZO-XXXX-7890-QRST", product: "Alert Pack", customer: "Mike Brown", email: "mike@gmail.com", status: "revoked", activatedAt: "2024-11-01", expiresAt: "2025-11-01" },
  { id: "6", key: "HNZO-XXXX-2345-UVWX", product: "Retro Wave Overlay", customer: "Emma Davis", email: "emma@gmail.com", status: "active", activatedAt: "2024-12-22", expiresAt: "2025-12-22", hwid: "M3N4O5P6Q7R8" },
];

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>(initialLicenses);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newLicense, setNewLicense] = useState({ product: "", email: "", duration: "365" });

  const filteredLicenses = licenses.filter((license) => {
    const matchesSearch = 
      license.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || license.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const generateKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const segments = [];
    segments.push("HNZO");
    for (let i = 0; i < 3; i++) {
      let segment = "";
      for (let j = 0; j < 4; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      segments.push(segment);
    }
    return segments.join("-");
  };

  const handleCreateLicense = () => {
    const license: License = {
      id: Date.now().toString(),
      key: generateKey(),
      product: newLicense.product || "Unknown Product",
      customer: "New Customer",
      email: newLicense.email,
      status: "active",
      activatedAt: new Date().toISOString().split("T")[0],
      expiresAt: new Date(Date.now() + parseInt(newLicense.duration) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    };
    setLicenses([license, ...licenses]);
    toast.success(`License key generated: ${license.key}`);
    setDialogOpen(false);
    setNewLicense({ product: "", email: "", duration: "365" });
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("License key copied to clipboard!");
  };

  const revokeLicense = (id: string) => {
    setLicenses(licenses.map(l => l.id === id ? { ...l, status: "revoked" as const } : l));
    toast.success("License revoked!");
  };

  const resetHwid = (id: string) => {
    setLicenses(licenses.map(l => l.id === id ? { ...l, hwid: undefined } : l));
    toast.success("HWID reset successfully!");
  };

  const getStatusBadge = (status: License["status"]) => {
    const styles = {
      active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      expired: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      revoked: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    const icons = {
      active: <CheckCircle className="w-3.5 h-3.5" />,
      expired: <XCircle className="w-3.5 h-3.5" />,
      revoked: <XCircle className="w-3.5 h-3.5" />,
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">License Keys</h1>
          <p className="text-muted-foreground">Generate and manage product licenses</p>
        </div>
        <Button className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Generate License
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by key, customer, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="revoked">Revoked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Licenses Table */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/30">
                <th className="px-5 py-4 font-medium">License Key</th>
                <th className="px-5 py-4 font-medium">Product</th>
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Expires</th>
                <th className="px-5 py-4 font-medium">HWID</th>
                <th className="px-5 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLicenses.map((license) => (
                <tr key={license.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{license.key}</code>
                      <button onClick={() => copyKey(license.key)} className="p-1 hover:bg-muted rounded">
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm">{license.product}</td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium">{license.customer}</p>
                      <p className="text-xs text-muted-foreground">{license.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">{getStatusBadge(license.status)}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{license.expiresAt}</td>
                  <td className="px-5 py-4">
                    {license.hwid ? (
                      <code className="text-xs font-mono bg-muted px-2 py-1 rounded">{license.hwid.slice(0, 8)}...</code>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not bound</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => copyKey(license.key)}>
                          <Copy className="w-4 h-4 mr-2" /> Copy Key
                        </DropdownMenuItem>
                        {license.hwid && (
                          <DropdownMenuItem onClick={() => resetHwid(license.id)}>
                            <RefreshCw className="w-4 h-4 mr-2" /> Reset HWID
                          </DropdownMenuItem>
                        )}
                        {license.status === "active" && (
                          <DropdownMenuItem className="text-destructive" onClick={() => revokeLicense(license.id)}>
                            <XCircle className="w-4 h-4 mr-2" /> Revoke
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate License Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate License</DialogTitle>
            <DialogDescription>Create a new license key for a customer</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Product</Label>
              <Select value={newLicense.product} onValueChange={(v) => setNewLicense({ ...newLicense, product: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Neon Pulse Pack">Neon Pulse Pack</SelectItem>
                  <SelectItem value="Creator Bundle Pro">Creator Bundle Pro</SelectItem>
                  <SelectItem value="Stream Tools Suite">Stream Tools Suite</SelectItem>
                  <SelectItem value="Animated Emotes">Animated Emotes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Customer Email</Label>
              <Input 
                type="email"
                value={newLicense.email} 
                onChange={(e) => setNewLicense({ ...newLicense, email: e.target.value })}
                placeholder="customer@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={newLicense.duration} onValueChange={(v) => setNewLicense({ ...newLicense, duration: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                  <SelectItem value="180">180 Days</SelectItem>
                  <SelectItem value="365">1 Year</SelectItem>
                  <SelectItem value="3650">Lifetime</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateLicense}>Generate Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
