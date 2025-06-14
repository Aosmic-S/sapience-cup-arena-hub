
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

  // Load banner settings from localStorage (simulating admin settings)
  useEffect(() => {
    const savedBanner = localStorage.getItem('bannerSettings');
    if (savedBanner) {
      setBannerData(JSON.parse(savedBanner));
    }
  }, []);

  if (!isVisible || !bannerData.isActive) return null;

  return (
    <div className={`${bannerData.color} text-white py-3 px-4 relative`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 text-center">
          <p className={`font-bold text-lg ${bannerData.isBlinking ? 'animate-pulse' : ''}`}>
            {bannerData.text}
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
