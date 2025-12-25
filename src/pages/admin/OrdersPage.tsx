import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, Filter, Download, Eye, MoreHorizontal, CheckCircle, 
  Clock, XCircle, ChevronLeft, ChevronRight, Calendar
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getCheckoutSessionInfo } from "@/lib/moneymotion";

interface Order {
  id: string;
  customer: string;
  email: string;
  product: string;
  amount: number;
  status: "completed" | "pending" | "failed" | "refunded";
  date: string;
  paymentMethod: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("orders" as any)
          .select("*")
          .order("created_at", { ascending: false });
        if (error) {
          console.error("Orders fetch error:", error);
          toast.error("Failed to load orders");
          return;
        }
        const mapped: Order[] = (data || []).map((o: any) => ({
          id: o.order_number || `ORD-${o.id}`,
          customer: o.customer_name || "Customer",
          email: o.customer_email || "",
          product: o.product_name || "",
          amount: Number(o.amount) || 0,
          status: (o.status as any) || "pending",
          date: o.created_at ? new Date(o.created_at).toLocaleString() : "",
          paymentMethod: o.payment_method || "Card",
        }));
        setOrders(mapped);
      } catch (e) {
        console.error(e);
        toast.error("Error loading orders");
      }
    };
    load();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      if (newStatus === "completed") {
        const { data, error } = await supabase
          .from("orders" as any)
          .select("payment_id, amount")
          .eq("order_number", orderId)
          .maybeSingle();
        if (error || !data?.payment_id) {
          toast.error("Cannot complete: missing payment session");
          return;
        }
        try {
          const info = await getCheckoutSessionInfo(data.payment_id);
          if (info.status !== "completed") {
            toast.error("Payment not verified as completed");
            return;
          }
          const verifiedAmount = info.totalCents / 100;
          const { error: updErr } = await supabase
            .from("orders" as any)
            .update({ status: "completed", amount: verifiedAmount })
            .eq("order_number", orderId);
          if (updErr) {
            toast.error("Failed to update order after verification");
            return;
          }
        } catch (e) {
          console.error(e);
          toast.error("Payment verification failed");
          return;
        }
      } else {
        const { error } = await supabase
          .from("orders" as any)
          .update({ status: newStatus })
          .eq("order_number", orderId);
        if (error) {
          toast.error("Failed to update order status");
          return;
        }
      }
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success(`Order ${orderId} marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update order");
    }
  };

  const getStatusBadge = (status: Order["status"]) => {
    const styles = {
      completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
      refunded: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    };
    const icons = {
      completed: <CheckCircle className="w-3.5 h-3.5" />,
      pending: <Clock className="w-3.5 h-3.5" />,
      failed: <XCircle className="w-3.5 h-3.5" />,
      refunded: <XCircle className="w-3.5 h-3.5" />,
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
          <h1 className="text-2xl font-display font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage and track all customer orders</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, customer, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <Calendar className="w-4 h-4" />
          Date Range
        </Button>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/30">
                <th className="px-5 py-4 font-medium">Order ID</th>
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Product</th>
                <th className="px-5 py-4 font-medium">Amount</th>
                <th className="px-5 py-4 font-medium">Payment</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4 font-mono text-sm font-medium text-primary">{order.id}</td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm">{order.product}</td>
                  <td className="px-5 py-4 text-sm font-semibold">${order.amount.toFixed(2)}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{order.paymentMethod}</td>
                  <td className="px-5 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{order.date}</td>
                  <td className="px-5 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info(`Viewing order ${order.id}`)}>
                          <Eye className="w-4 h-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "completed")}>
                          <CheckCircle className="w-4 h-4 mr-2" /> Mark Completed
                        </DropdownMenuItem>
                        {/* Refund removed per requirement */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ordersPerPage) + 1} to {Math.min(currentPage * ordersPerPage, filteredOrders.length)} of {filteredOrders.length} orders
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
