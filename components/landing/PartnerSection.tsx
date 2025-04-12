'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const PARTNERS = [
  {
    name: "Aloft Jakarta",
    logo: "/images/partners/aloft.png"
  },
  {
    name: "Artotel",
    logo: "/images/partners/artotel.png"
  },
  {
    name: "Artotel Mangkuluhur",
    logo: "/images/partners/artotel-mangkuluhur.png"
  },
  {
    name: "Grand Mercure Jakarta",
    logo: "/images/partners/grand-mercure.png"
  },
  {
    name: "Harris Suites FX Sudirman Jakarta",
    logo: "/images/partners/harris.png"
  },
  {
    name: "Holiday Inn Express",
    logo: "/images/partners/holiday-inn.png"
  },
  {
    name: "Ibis Styles Jakarta",
    logo: "/images/partners/ibis.png"
  },
  {
    name: "JW Marriott Hotel Lampung",
    logo: "/images/partners/jw-marriott-lampung.png"
  },
  {
    name: "The Langham Jakarta",
    logo: "/images/partners/langham.png"
  },
  {
    name: "Mandarin Oriental Jakarta",
    logo: "/images/partners/mandarin.png"
  },
  {
    name: "Movenpick Hotel Jakarta",
    logo: "/images/partners/movenpick.png"
  },
  {
    name: "Pan Pacific Jakarta",
    logo: "/images/partners/pan-pacific.png"
  },
  {
    name: "Pullman Jakarta",
    logo: "/images/partners/pullman.png"
  },
  {
    name: "The Ritz-Carlton Jakarta",
    logo: "/images/partners/ritz-carlton.png"
  },
  {
    name: "Saint Regis Jakarta",
    logo: "/images/partners/st-regis.png"
  },
  {
    name: "Twenty Five Hours Hotel",
    logo: "/images/partners/twenty-five.png"
  },
  {
    name: "Vertu Hotel",
    logo: "/images/partners/vertu.png"
  },
  {
    name: "The Westin Jakarta",
    logo: "/images/partners/westin.png"
  },
  {
    name: "Yello Hotel",
    logo: "/images/partners/yello.png"
  }
  
];

export default function PartnerSection() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        const newPosition = prev + 1;
        if (newPosition >= PARTNERS.length * 200) return 0;
        return newPosition;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 md:py-24 bg-black overflow-hidden w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-16 text-yellow-500">
        Our Partners
      </h2>
      <div className="relative w-full md:w-screen overflow-hidden">
        {/* Partner logos container */}
        <div 
          className="flex items-center space-x-8 md:space-x-20 whitespace-nowrap px-4 md:px-12"
          style={{
            transform: `translateX(-${scrollPosition}px)`,
            transition: 'transform 0.5s linear'
          }}
        >
          {/* Duplicate list for seamless scrolling */}
          {[...PARTNERS, ...PARTNERS].map((partner, index) => (
            <div 
              key={`${partner.name}-${index}`}
              className="inline-flex flex-col items-center"
            >
              <div className="relative w-32 h-32 md:w-48 md:h-48 bg-white rounded-xl md:rounded-2xl shadow-2xl p-4 md:p-8 flex items-center justify-center border border-gray-800 hover:border-gray-700 transition-all">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={100}
                  height={100}
                  style={{ objectFit: 'contain' }}
                  className="filter brightness-110 w-20 h-20 md:w-32 md:h-32"
                />
              </div>
              <p className="mt-2 md:mt-4 text-sm md:text-base text-gray-400">{partner.name}</p>
            </div>
          ))}
        </div>

        {/* Gradient overlays for smooth fade effect */}
        <div className="absolute left-0 top-0 h-full w-20 md:w-64 bg-gradient-to-r from-black via-black to-transparent z-10"></div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-64 bg-gradient-to-l from-black via-black to-transparent z-10"></div>
      </div>
    </section>
  );
} 