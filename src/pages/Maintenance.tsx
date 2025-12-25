import { useEffect, useState } from "react";
import { Wrench, Clock, MessageCircle } from "lucide-react";
import hanzoLogo from "@/assets/hanzo-logo.png";

export default function Maintenance() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img src={hanzoLogo} alt="Hanzo" className="w-24 h-24 rounded-2xl" />
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-2xl" />
          </div>
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
              <Wrench className="w-16 h-16 text-primary animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold">
            Under Maintenance
          </h1>
          <p className="text-xl text-muted-foreground">
            We're currently performing scheduled maintenance{dots}
          </p>
        </div>

        {/* Description */}
        <div className="space-y-4 max-w-md mx-auto">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
            <Clock className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-sm text-muted-foreground text-left">
              Our team is working hard to improve your experience. We'll be back online shortly.
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
            <MessageCircle className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-sm text-muted-foreground text-left">
              For urgent inquiries, join our{" "}
              <a href="https://discord.gg/hanzo" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                Discord Server
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 text-sm text-muted-foreground">
          <p>Thank you for your patience!</p>
        </div>
      </div>
    </div>
  );
}
