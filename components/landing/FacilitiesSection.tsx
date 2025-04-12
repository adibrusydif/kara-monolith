'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface Facility {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

export default function FacilitiesSection() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('facilities')
        .select('*');

      if (error) {
        console.error('Error fetching facilities:', error);
      } else if (data) {
        setFacilities(data);
      }
      setLoading(false);
    };

    fetchFacilities();
  }, []);

  if (loading) {
    return (
      <section id="facilities" className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-yellow-500">Our Facilities</h2>
          <div className="flex justify-center">
            <p>Loading facilities...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="facilities" className="py-8 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-yellow-500">
          Our Facilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {facilities.map((facility) => (
            <div 
              key={facility.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48 sm:h-56 lg:h-64">
                <Image
                  src={facility.image_url}
                  alt={facility.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-lg text-yellow-500 md:text-xl font-bold mb-2">{facility.name}</h3>
                <p className="text-black text-sm md:text-base">{facility.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 