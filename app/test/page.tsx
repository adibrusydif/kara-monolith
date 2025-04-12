'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [status, setStatus] = useState('Testing connection...');

  useEffect(() => {
    async function testConnection() {
      try {
        // Simple query to test connection
        const { data, error } = await supabase.from('facilities').select('count');
        
        if (error) {
          console.error('Supabase error:', error);
          setStatus(`Error: ${error.message}`);
        } else {
          setStatus('Connection successful! Data: ' + JSON.stringify(data));
        }
      } catch (e) {
        console.error('Exception:', e);
        setStatus(`Exception: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    
    testConnection();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <div className="p-4 bg-gray-100 rounded">
        <pre>{status}</pre>
      </div>
    </div>
  );
} 