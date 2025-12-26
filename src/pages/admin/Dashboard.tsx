import { useState } from "react";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import hanzoLogo from "@/assets/hanzo-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  LayoutDashboard, ShoppingCart, Package, Ticket, Key, Settings, 
  LogOut, Menu, Search, Bell, ChevronDown
} from "lucide-react";
import { toast } from "sonner";

// Import admin pages
import DashboardHome from "./DashboardHome";
import OrdersPage from "./OrdersPage";
import ProductsPage from "./ProductsPage";
import CategoriesPage from "./CategoriesPage";
import CouponsPage from "./CouponsPage";
import LicensesPage from "./LicensesPage";
import SettingsPage from "./SettingsPage";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: Package, label: "Categories", path: "/admin/categories" },
  { icon: Ticket, label: "Coupons", path: "/admin/coupons" },
  { icon: Key, label: "Licenses", path: "/admin/licenses" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Sidebar - Fixed */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-[#0d0d0d] border-r border-white/5 transition-all duration-500 flex flex-col fixed left-0 top-0 bottom-0 z-50`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src={hanzoLogo} alt="Hanzo" className="w-10 h-10 rounded-xl transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            {sidebarOpen && (
              <span className="font-display font-bold text-lg bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Hanzo
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  active 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-emerald-400 opacity-100" />
                )}
                <item.icon className={`w-5 h-5 flex-shrink-0 relative z-10 transition-transform duration-300 ${!active && 'group-hover:scale-110'}`} />
                {sidebarOpen && (
                  <span className="font-medium relative z-10">{item.label}</span>
                )}
                {active && sidebarOpen && (
                  <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
            {sidebarOpen && (
              <span className="font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content - With left margin to account for fixed sidebar */}
      <div className={`flex-1 flex flex-col min-w-0 ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-500`}>
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0d0d0d]/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 hover:bg-white/5 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden md:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input 
                placeholder="Search orders, products, customers..." 
                className="pl-10 w-80 bg-white/5 border-white/10 focus:border-primary/50 focus:bg-white/10 transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Store Button - More Prominent */}
            <Link to="/">
              <Button 
                className="gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/30 hover:border-primary transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/20"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>View Store</span>
              </Button>
            </Link>

            {/* Notifications */}
            <button className="relative p-2.5 hover:bg-white/5 rounded-xl transition-all duration-300 hover:scale-105 group">
              <Bell className="w-5 h-5 transition-colors group-hover:text-primary" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-[#0d0d0d] animate-pulse" />
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <div className="relative group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-primary-foreground font-bold transition-transform duration-300 group-hover:scale-105">
                  A
                </div>
                <div className="absolute inset-0 rounded-xl bg-primary/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium">Admin</div>
                <div className="text-xs text-muted-foreground">admin@hanzo.gg</div>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto bg-[#0a0a0a]">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="coupons" element={<CouponsPage />} />
            <Route path="licenses" element={<LicensesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
