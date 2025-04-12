'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface Module {
  id: number;
  title: string;
  description: string;
  image_url: string;
}

export default function StudentDashboard() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        router.push('/login');
        return;
      }

      // Check if user is a student
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.session.user.id)
        .single();

      if (error || userData.role !== 'student') {
        await supabase.auth.signOut();
        router.push('/login');
        return;
      }

      setUser(data.session.user);
      fetchModules();
    };

    const fetchModules = async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*');

      if (error) {
        console.error('Error fetching modules:', error);
      } else if (data) {
        setModules(data);
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="container mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Knowledge Modules</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <div key={module.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={module.image_url}
                  alt={module.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                <p className="text-gray-700 mb-4">{module.description}</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  View Module
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {modules.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-700">No modules available at the moment.</p>
          </div>
        )}
      </main>
    </div>
  );
} 