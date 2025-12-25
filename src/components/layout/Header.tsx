import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { IconMenu, IconX } from "@/components/icons/HanzoIcons";
import { Button } from "@/components/ui/button";
import { Package, MessageCircle, CreditCard, Activity, Home } from "lucide-react";
import hanzoLogo from "@/assets/hanzo-logo.png";
import { CartSheet } from "@/components/cart/CartSheet";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Products", href: "/products", icon: Package },
  { label: "Discord", href: "/discord", icon: MessageCircle },
  { label: "Payment Methods", href: "/payment-methods", icon: CreditCard },
  { label: "Status", href: "/status", icon: Activity },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [onlineCount, setOnlineCount] = useState<number>(() => Math.floor(50 + Math.random() * 100));
  useEffect(() => {
    const id = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.round((Math.random() * 12) - 6);
        const next = prev + delta;
        return Math.min(150, Math.max(50, next));
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="fixed top-12 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={hanzoLogo}
              alt="Hanzo"
              className="w-10 h-10 rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-xl font-display font-bold text-foreground">
              Hanzo
            </span>
            <span className="hidden md:inline-flex items-center gap-2 ml-2 px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs">
              <span className={`w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.7)] animate-pulse`} style={{ animationDuration: "2s" }} />
              <span>{onlineCount} online</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`nav-link text-sm font-medium transition-colors flex items-center gap-2 ${location.pathname === item.href ? "nav-link-active" : ""
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <CartSheet />

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <IconX className="w-5 h-5" />
              ) : (
                <IconMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${location.pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}

            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
