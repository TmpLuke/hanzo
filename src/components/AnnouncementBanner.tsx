import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [bannerText, setBannerText] = useState("🎄 WINTER SALE! Use code HANZO10 for 10% OFF! 🎁");
  const [showBanner, setShowBanner] = useState(true); // Always show for now

  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('announcementSettings');
      
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          const shouldShow = settings.showAnnouncement === true;
          const text = settings.announcementText || "🎄 WINTER SALE! Use code HANZO10 for 10% OFF! 🎁";
          
          setShowBanner(shouldShow);
          setBannerText(text);
        } catch (e) {
          // Keep default values on error
        }
      }
    };

    loadSettings();

    const handleStorageChange = () => {
      loadSettings();
      setIsVisible(true);
    };

    const handleCustomEvent = () => {
      loadSettings();
      setIsVisible(true);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('announcementUpdate', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('announcementUpdate', handleCustomEvent);
    };
  }, []);

  // Don't show if admin disabled it or user closed it
  if (!showBanner || !isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 w-full bg-gradient-to-r from-[#1DB574] to-emerald-500 border-b border-[#1DB574]/30 py-3 z-[60]">
      <div className="container mx-auto px-4 text-center">
        <span className="text-sm text-white font-medium">
          {bannerText}
        </span>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <button
          onClick={() => setIsVisible(false)}
          className="px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          Ignore
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white"
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
