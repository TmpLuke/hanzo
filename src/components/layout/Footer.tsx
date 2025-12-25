import { Link } from "react-router-dom";
import { Headphones, ShoppingBag, ShieldCheck } from "lucide-react";
import hanzoLogo from "@/assets/hanzo-logo.png";

const supportLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy", href: "https://discord.gg/hanzo", external: true },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Support", href: "https://discord.gg/hanzo", external: true },
];

const supportedCheats = [
  { label: "Rust", href: "/products?q=Rust" },
  { label: "Apex Legends", href: "/products?q=Apex Legends" },
  { label: "Black Ops 6", href: "/products?q=Black Ops 6" },
  { label: "HWID Spoofers", href: "/products?q=HWID Spoofer" },
  { label: "Valorant Cheats", href: "/products?q=Valorant" },
  { label: "Battlefield 6 Cheats", href: "/products?q=Battlefield 6" },
  { label: "Marvel Rivals", href: "/products?q=Marvel Rivals" },
  { label: "Fortnite", href: "/products?q=Fortnite" },
  { label: "Rainbow Six Siege", href: "/products?q=Rainbow Six Siege" },
  { label: "Escape From Tarkov", href: "/products?q=Escape From Tarkov" },
  { label: "Delta Force", href: "/products?q=Delta Force" },
];

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      {/* Why Choose Section */}
      <div className="bg-gradient-to-b from-background to-card/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Why Choose <span className="text-gradient">Hanzo Cheats</span>?
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Unlock the full potential of every game with our Undetected Cheats. Enjoy our premium hacks with unmatched performance, 24/7 365 Support, and elite security to ensure you play without limits.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* 24/7 Support */}
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Headphones className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">24/7 - 365 Support</h3>
              <p className="text-muted-foreground text-sm">
                Our dedicated support team is available 24/7, 365 days a year.
              </p>
            </div>

            {/* Instant Delivery */}
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Instant Delivery</h3>
              <p className="text-muted-foreground text-sm">
                No need to wait for delivery, products are delivered instantly after purchase.
              </p>
            </div>

            {/* Secure Transactions */}
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Secure transactions</h3>
              <p className="text-muted-foreground text-sm">
                Ensure your transactions are safe and hassle-free with our robust payment system.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src={hanzoLogo}
                alt="Hanzo Cheats"
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-xl font-display font-bold">Hanzo Cheats</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              At Hanzo Cheats, we specialize in developing elite cheats and hacks for a variety of online PC games. We prioritize customer satisfaction, offering round-the-clock support so you never miss a beat. Ready to dominate the game without limits? Get started with Hanzo Cheats today!
            </p>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-lg">SUPPORT & CONTACT</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported Cheats */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-lg">SUPPORTED CHEATS</h4>
            <ul className="space-y-3">
              {supportedCheats.map((cheat) => (
                <li key={cheat.label}>
                  <Link
                    to={{ pathname: "/products", search: `?q=${encodeURIComponent(cheat.label)}` }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {cheat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
