'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface Banner {
  id: number;
  title: string;
  image_url: string;
  type: 'mobile' | 'desktop';
}

export default function BannerSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize and initial mobile check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical mobile breakpoint
    };

    // Check initial
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('active', true)
        .eq('type', isMobile ? 'mobile' : 'desktop');

      if (error) {
        console.error('Error fetching banners:', error);
        return;
      }

      if (data) {
        setBanners(data);
        setCurrentBanner(0); // Reset to first banner when switching types
      }
    };

    fetchBanners();
  }, [isMobile]); // Refetch when screen size changes between mobile/desktop

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <div className={`w-full ${isMobile ? 'h-[400px]' : 'h-[600px]'} bg-gray-200 flex items-center justify-center`}>
        <p className="text-gray-500">No banners available</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${isMobile ? 'h-[420px]' : 'h-[750px]'}`}>
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentBanner ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={banner.image_url}
            alt={banner.title}
            fill
            style={{ objectFit: 'cover' }}
            priority={index === 0}
          />
          <div className="absolute inset-0 flex flex-col justify-end items-start p-4 md:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="max-w-2xl mb-4 md:mb-8">
              <h2 className={`${
                isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'
              } font-bold text-white mb-3 drop-shadow-lg`}>
                {banner.title}
              </h2>
              <div className="h-0.5 w-16 bg-yellow-500 rounded"></div>
            </div>
          </div>
        </div>
      ))}
      
      {banners.length > 1 && (
        <div className="absolute bottom-8 md:bottom-16 left-0 right-0 flex justify-center space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-2 md:w-3 h-2 md:h-3 rounded-full ${
                index === currentBanner ? 'bg-white' : 'bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
} 