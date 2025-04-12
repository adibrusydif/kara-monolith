'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

interface Facility {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

export default function FacilitiesManagement() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [newFacility, setNewFacility] = useState({
    name: '',
    description: '',
    image_url: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<File | null>(null);
  const [editingImagePreview, setEditingImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching facilities:', error);
    } else {
      setFacilities(data || []);
    }
    setLoading(false);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = false) => {
    const file = event.target.files?.[0];
    if (file) {
      if (isEditing) {
        setEditingImage(file);
        setEditingImagePreview(URL.createObjectURL(file));
      } else {
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const uploadImage = async (file: File) => {
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const fileName = `facility-${timestamp}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('facilities')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('facilities')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleAddFacility = async () => {
    if (!newFacility.name || !newFacility.description || !selectedImage) {
      alert('Please fill in all fields and select an image');
      return;
    }

    try {
      setUploading(true);

      // Upload image and get URL
      const imageUrl = await uploadImage(selectedImage);

      // Add facility to database
      const { error } = await supabase
        .from('facilities')
        .insert([{
          name: newFacility.name,
          description: newFacility.description,
          image_url: imageUrl
        }]);

      if (error) throw error;

      // Reset form
      setNewFacility({ name: '', description: '', image_url: '' });
      setSelectedImage(null);
      setImagePreview(null);
      fetchFacilities();
      alert('Facility added successfully');

    } catch (error) {
      console.error('Error adding facility:', error);
      alert('Failed to add facility');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateFacility = async (id: number) => {
    if (!editingFacility) return;

    try {
      setUploading(true);

      let imageUrl = editingFacility.image_url;

      // If new image is selected, upload it
      if (editingImage) {
        // Delete old image if it exists
        const oldFileName = editingFacility.image_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('facilities')
            .remove([oldFileName]);
        }

        // Upload new image
        imageUrl = await uploadImage(editingImage);
      }

      // Update facility in database
      const { error } = await supabase
        .from('facilities')
        .update({
          name: editingFacility.name,
          description: editingFacility.description,
          image_url: imageUrl
        })
        .eq('id', id);

      if (error) throw error;

      setEditingFacility(null);
      setEditingImage(null);
      setEditingImagePreview(null);
      fetchFacilities();
      alert('Facility updated successfully');

    } catch (error) {
      console.error('Error updating facility:', error);
      alert('Failed to update facility');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFacility = async (id: number, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this facility?')) return;

    try {
      // Delete image from storage
      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('facilities')
          .remove([fileName]);
      }

      // Delete from database
      const { error } = await supabase
        .from('facilities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchFacilities();
      alert('Facility deleted successfully');

    } catch (error) {
      console.error('Error deleting facility:', error);
      alert('Failed to delete facility');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Manage Facilities</h1>
          <Link 
            href="/dashboard/admin"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Add New Facility Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-black">Add New Facility</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Facility Name
              </label>
              <input
                type="text"
                value={newFacility.name}
                onChange={(e) => setNewFacility({...newFacility, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                placeholder="Enter facility name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Description
              </label>
              <textarea
                value={newFacility.description}
                onChange={(e) => setNewFacility({...newFacility, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                rows={3}
                placeholder="Enter facility description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(e)}
                className="w-full text-black"
              />
              {imagePreview && (
                <div className="mt-2 relative h-48 w-full">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
            </div>
            <button
              onClick={handleAddFacility}
              disabled={uploading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {uploading ? 'Adding...' : 'Add Facility'}
            </button>
          </div>
        </div>

        {/* Existing Facilities Grid */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-black">Existing Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilities.map((facility) => (
              <div key={facility.id} className="border rounded-lg overflow-hidden">
                {editingFacility?.id === facility.id ? (
                  // Edit Form
                  <div className="p-4 space-y-4">
                    <input
                      type="text"
                      value={editingFacility.name}
                      onChange={(e) => setEditingFacility({...editingFacility, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                    />
                    <textarea
                      value={editingFacility.description}
                      onChange={(e) => setEditingFacility({...editingFacility, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                      rows={3}
                    />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageSelect(e, true)}
                        className="w-full text-black"
                      />
                      <div className="mt-2 relative h-48 w-full">
                        <Image
                          src={editingImagePreview || editingFacility.image_url}
                          alt="Preview"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateFacility(facility.id)}
                        disabled={uploading}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                      >
                        {uploading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingFacility(null);
                          setEditingImage(null);
                          setEditingImagePreview(null);
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Facility
                  <div>
                    <div className="relative h-48 w-full">
                      <Image
                        src={facility.image_url}
                        alt={facility.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-black">{facility.name}</h3>
                      <p className="text-black mt-2">{facility.description}</p>
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() => setEditingFacility(facility)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteFacility(facility.id, facility.image_url)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 