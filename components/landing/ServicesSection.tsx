'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface Service {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*');

      if (error) {
        console.error('Error fetching services:', error);
      } else if (data) {
        setServices(data);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section id="services" className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-yellow-500">Our Services</h2>
          <div className="flex justify-center">
            <p>Loading services...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-8 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-yellow-500">
          Our Services
        </h2>
        <div className="grid grid-cols-1 gap-6 md:gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative w-full md:w-1/3 h-64 md:h-[200px]">
                <Image
                  src={service.image_url}
                  alt={service.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 md:w-2/3">
                <h3 className="text-xl text-yellow-500 font-bold mb-2">{service.name}</h3>
                <p className="text-black">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 