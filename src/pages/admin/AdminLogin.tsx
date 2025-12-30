import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import hanzoLogo from "@/assets/hanzo-logo.png";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Admin panel is currently disabled
    toast.error("Admin panel is temporarily disabled");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Green Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse delay-500" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Glow Effect Behind Card */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-green-500/20 to-primary/30 rounded-3xl blur-2xl" />
        
        <div className="relative bg-[#0d0d0d]/90 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 shadow-2xl">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-6">
              {/* Logo Glow */}
              <div className="absolute inset-0 bg-emerald-500/30 rounded-2xl blur-2xl animate-pulse" />
              <img 
                src={hanzoLogo} 
                alt="Hanzo" 
                className="relative w-24 h-24 rounded-2xl shadow-2xl shadow-emerald-500/50 ring-2 ring-emerald-500/30"
              />
            </div>
            <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
              Admin Portal
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-foreground/90">
                Username
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-emerald-400" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="pl-11 h-12 bg-white/5 border-white/10 focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground/90">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-emerald-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-11 pr-11 h-12 bg-white/5 border-white/10 focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-emerald-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-center text-xs text-muted-foreground">
              Protected by Hanzo Security
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl animate-pulse delay-700" />
      </div>
    </div>
  );
}
