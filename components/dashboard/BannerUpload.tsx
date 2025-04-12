'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface Banner {
  id: number;
  title: string;
  image_url: string;
  active: boolean;
  created_at: string;
  type: 'mobile' | 'desktop';
}

export default function BannerUpload() {
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [bannerType, setBannerType] = useState<'mobile' | 'desktop'>('desktop');
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching banners:', error);
    } else {
      setBanners(data || []);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || !title) return;

    try {
      setUploading(true);

      const timestamp = new Date().getTime();
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `banner-${bannerType}-${timestamp}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(fileName, selectedImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('banners')
        .insert([{ 
          title,
          image_url: publicUrl,
          active: true,
          type: bannerType
        }]);

      if (insertError) throw insertError;

      setSelectedImage(null);
      setPreview(null);
      setTitle('');
      fetchBanners();
      alert('Banner uploaded successfully!');

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to upload banner. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const toggleBannerStatus = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchBanners();
    } catch (error) {
      console.error('Error toggling banner status:', error);
      alert('Failed to update banner status.');
    }
  };

  const deleteBanner = async (id: number, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    try {
      // Get filename from URL
      const fileName = imageUrl.split('/').pop();
      if (!fileName) throw new Error('Could not get filename from URL');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('banners')
        .remove([fileName]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // Refresh banners list
      fetchBanners();
      alert('Banner deleted successfully');

    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Failed to delete banner. Please try again.');
    }
  };

  const getBannersByType = (type: 'mobile' | 'desktop') => {
    return banners.filter(banner => banner.type === type);
  };

  const BannerCard = ({ banner }: { banner: Banner }) => (
    <div key={banner.id} className="border rounded-lg overflow-hidden">
      <div className={`relative ${banner.type === 'desktop' ? 'h-48' : 'h-64'}`}>
        <Image
          src={banner.image_url}
          alt={banner.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-black">{banner.title}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-sm font-medium ${banner.active ? 'text-green-600' : 'text-red-600'}`}>
            {banner.active ? 'Active' : 'Inactive'}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => toggleBannerStatus(banner.id, banner.active)}
              className={`px-3 py-1 rounded ${
                banner.active 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
            >
              {banner.active ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => deleteBanner(banner.id, banner.image_url)}
              className="px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-black">Upload New Banner</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Banner Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
              placeholder="Enter banner title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Banner Type
            </label>
            <select
              value={bannerType}
              onChange={(e) => setBannerType(e.target.value as 'mobile' | 'desktop')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            >
              <option value="desktop">Desktop Banner (1920x1080 recommended)</option>
              <option value="mobile">Mobile Banner (750x1334 recommended)</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="w-full cursor-pointer text-black"
            />
          </div>

          {preview && (
            <div className={`relative ${bannerType === 'desktop' ? 'h-48' : 'h-64'}`}>
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedImage || !title || uploading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload Banner'}
          </button>
        </div>
      </div>

      {/* Desktop Banners Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-black">Desktop Banners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getBannersByType('desktop').map((banner) => (
            <BannerCard key={banner.id} banner={banner} />
          ))}
          {getBannersByType('desktop').length === 0 && (
            <p className="text-gray-500">No desktop banners available</p>
          )}
        </div>
      </div>

      {/* Mobile Banners Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-black">Mobile Banners</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {getBannersByType('mobile').map((banner) => (
            <BannerCard key={banner.id} banner={banner} />
          ))}
          {getBannersByType('mobile').length === 0 && (
            <p className="text-gray-500">No mobile banners available</p>
          )}
        </div>
      </div>
    </div>
  );
} 