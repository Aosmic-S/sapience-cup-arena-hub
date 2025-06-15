
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [bannerData, setBannerData] = useState<any>(null);

  useEffect(() => {
    const fetchBannerSettings = async () => {
      const { data, error } = await supabase
        .from('banner_settings')
        .select('*')
        .single();
      
      if (error) {
        console.error("Error fetching banner settings:", error.message);
      } else if (data) {
        setBannerData(data);
      }
    };

    fetchBannerSettings();

    const channel = supabase
      .channel('banner-settings-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'banner_settings', filter: 'id=eq.1' },
        (payload) => {
          setBannerData(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!isVisible || !bannerData || !bannerData.is_active) return null;

  return (
    <div className={`${bannerData.color} text-white relative`}>
      {/* Mobile Design - Compact vertical layout */}
      <div className="block md:hidden py-2 px-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-2">
            <p className={`font-semibold text-sm leading-tight ${bannerData.is_blinking ? 'animate-pulse' : ''}`}>
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
            <p className={`font-bold text-base ${bannerData.is_blinking ? 'animate-pulse' : ''}`}>
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
            <p className={`font-bold text-xl ${bannerData.is_blinking ? 'animate-pulse' : ''}`}>
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
