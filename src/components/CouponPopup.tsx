import { useState, useEffect } from "react";
import { X, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CouponPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ minutes: 4, seconds: 59 });
  const [couponData, setCouponData] = useState({ code: "HANZO10", discount: 10 });

  useEffect(() => {
    // Load coupon from localStorage
    const loadCoupon = () => {
      const savedCoupon = localStorage.getItem('popupCoupon');
      if (savedCoupon) {
        try {
          const parsed = JSON.parse(savedCoupon);
          setCouponData({ code: parsed.code, discount: parsed.discount });
          return true;
        } catch (e) {
          console.error('Failed to parse popup coupon', e);
          return false;
        }
      }
      // Return true to show default coupon even if none saved
      return true;
    };

    const hasCoupon = loadCoupon();

    // Show popup after 3 seconds
    const timer = setTimeout(() => {
      if (hasCoupon) {
        setIsOpen(true);
      }
    }, 3000);

    // Listen for storage changes (when admin toggles popup)
    const handleStorageChange = () => {
      const hasCoupon = loadCoupon();
      if (hasCoupon) {
        setIsOpen(true);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    // Removed sessionStorage - popup will show again on next page load
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(couponData.code);
    setCopied(true);
    toast.success(`Copied ${couponData.code} to clipboard!`);
    setTimeout(() => {
      setCopied(false);
      handleClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="relative bg-[#1a1f1a] border-2 border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-500/10 max-w-md w-full p-8 pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="relative text-center space-y-6">
            {/* Badge with Gift Icon */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <Gift className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Special Offer</span>
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                Sign up and
              </h2>
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                GET {couponData.discount}% OFF
              </h3>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Sign up for our email newsletter for special discounts and exclusive offers.
            </p>

            {/* Timer */}
            <div className="flex items-center justify-center gap-3 text-4xl font-bold font-mono">
              <span className="text-white">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-gray-500 text-xl">M</span>
              <span className="text-gray-500">:</span>
              <span className="text-white">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-gray-500 text-xl">S</span>
            </div>

            {/* Coupon Code Display */}
            <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Your Coupon Code</p>
              <div className="flex items-center justify-center">
                <span className="text-3xl font-mono font-bold text-emerald-400 tracking-widest">
                  {couponData.code}
                </span>
              </div>
            </div>

            {/* Copy Button */}
            <Button
              onClick={handleCopy}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-6 text-base rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {copied ? "Copied!" : "Copy Coupon"}
            </Button>

            {/* No Thanks */}
            <button
              onClick={handleClose}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              No thanks
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
