'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function InstagramFeed() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
    setLoading(false);
  }, []);

  return (
    <section id="instagram" className="py-8 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-yellow-500">
          Latest Updates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Instagram Feed Container */}
          <div className="col-span-full">
            <iframe
              src="https://www.instagram.com/karaakademiindonesia/embed"
              width="100%"
              height="750"
              frameBorder="0"
              scrolling="no"
              allow="transparency"
            ></iframe>
          </div>
        </div>
        <div className="text-center mt-8">
          <a 
            href="https://www.instagram.com/karaakademiindonesia/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Follow Us on Instagram
          </a>
        </div>
      </div>
      <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
    </section>
  );
} 