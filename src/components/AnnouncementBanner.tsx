
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [bannerData, setBannerData] = useState({
    text: "🔥 Registration Open - Sapience Esports Cup 2024! 🔥",
    isBlinking: true,
    color: "bg-gradient-to-r from-red-600 to-orange-600",
    isActive: true
  });

  // Load banner settings from localStorage
  useEffect(() => {
    const loadBannerSettings = () => {
      const savedBanner = localStorage.getItem('bannerSettings');
      if (savedBanner) {
        setBannerData(JSON.parse(savedBanner));
      }
    };

    // Load initial settings
    loadBannerSettings();

    // Listen for localStorage changes (when admin updates banner)
    const handleStorageChange = (e) => {
      if (e.key === 'bannerSettings') {
        loadBannerSettings();
      }
    };

    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events (for same-tab updates)
    const handleBannerUpdate = () => {
      loadBannerSettings();
    };

    window.addEventListener('bannerUpdated', handleBannerUpdate);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bannerUpdated', handleBannerUpdate);
    };
  }, []);

  if (!isVisible || !bannerData.isActive) return null;

  return (
    <div className={`${bannerData.color} text-white relative`}>
      {/* Mobile Design - Compact vertical layout */}
      <div className="block md:hidden py-2 px-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-2">
            <p className={`font-semibold text-sm leading-tight ${bannerData.isBlinking ? 'animate-pulse' : ''}`}>
              {bannerData.text}
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/80 hover:text-white transition-colors flex-shrink-0 mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tablet Design - Medium layout */}
      <div className="hidden md:block lg:hidden py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex-1 text-center">
            <p className={`font-bold text-base ${bannerData.isBlinking ? 'animate-pulse' : ''}`}>
              {bannerData.text}
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/90 hover:text-white transition-colors ml-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop Design - Full layout with extra padding */}
      <div className="hidden lg:block py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex-1 text-center">
            <p className={`font-bold text-xl ${bannerData.isBlinking ? 'animate-pulse' : ''}`}>
              {bannerData.text}
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-200 transition-colors ml-6"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
