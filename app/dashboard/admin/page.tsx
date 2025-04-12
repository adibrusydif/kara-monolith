'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminDashboard() {
  const [students, setStudents] = useState<User[]>([]);
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

      // Check if user is an admin
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.session.user.id)
        .single();

      if (error || userData.role !== 'admin') {
        await supabase.auth.signOut();
        router.push('/login');
        return;
      }

      setUser(data.session.user);
      fetchStudents();
    };

    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'student');

      if (error) {
        console.error('Error fetching students:', error);
      } else if (data) {
        setStudents(data);
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
          <h1 className="text-2xl text-yellow-500 font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user?.email}</span>
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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl text-yellow-500 font-bold">Admin Panel</h2>
          <div className="flex space-x-4">
            <Link href="/dashboard/admin/banners" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Manage Banners
            </Link>
            <Link href="/dashboard/admin/modules" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Manage Modules
            </Link>
            <Link href="/dashboard/admin/services" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Manage Services
            </Link>
            <Link href="/dashboard/admin/facilities" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Manage Facilities
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl text-yellow-500 font-bold mb-4">Student List</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                          View Details
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {students.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-700">No students registered yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 