'use client';

import BannerUpload from '@/components/dashboard/BannerUpload';
import Link from 'next/link';

export default function BannersManagementPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Banner Management</h1>
          <Link 
            href="/dashboard/admin" 
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Dashboard
          </Link>
        </div>
        <BannerUpload />
      </div>
    </div>
  );
} 