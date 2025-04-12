'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

interface Service {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    image_url: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<File | null>(null);
  const [editingImagePreview, setEditingImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching services:', error);
    } else {
      setServices(data || []);
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
    const fileName = `service-${timestamp}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('services')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('services')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleAddService = async () => {
    if (!newService.name || !newService.description || !selectedImage) {
      alert('Please fill in all fields and select an image');
      return;
    }

    try {
      setUploading(true);

      // Upload image and get URL
      const imageUrl = await uploadImage(selectedImage);

      // Add service to database
      const { error } = await supabase
        .from('services')
        .insert([{
          name: newService.name,
          description: newService.description,
          image_url: imageUrl
        }]);

      if (error) throw error;

      // Reset form
      setNewService({ name: '', description: '', image_url: '' });
      setSelectedImage(null);
      setImagePreview(null);
      fetchServices();
      alert('Service added successfully');

    } catch (error) {
      console.error('Error adding service:', error);
      alert('Failed to add service');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateService = async (id: number) => {
    if (!editingService) return;

    try {
      setUploading(true);

      let imageUrl = editingService.image_url;

      // If new image is selected, upload it
      if (editingImage) {
        // Delete old image if it exists
        const oldFileName = editingService.image_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('services')
            .remove([oldFileName]);
        }

        // Upload new image
        imageUrl = await uploadImage(editingImage);
      }

      // Update service in database
      const { error } = await supabase
        .from('services')
        .update({
          name: editingService.name,
          description: editingService.description,
          image_url: imageUrl
        })
        .eq('id', id);

      if (error) throw error;

      setEditingService(null);
      setEditingImage(null);
      setEditingImagePreview(null);
      fetchServices();
      alert('Service updated successfully');

    } catch (error) {
      console.error('Error updating service:', error);
      alert('Failed to update service');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteService = async (id: number, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      // Delete image from storage
      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('services')
          .remove([fileName]);
      }

      // Delete from database
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchServices();
      alert('Service deleted successfully');

    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Manage Services</h1>
          <Link 
            href="/dashboard/admin"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Add New Service Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-black">Add New Service</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Service Name
              </label>
              <input
                type="text"
                value={newService.name}
                onChange={(e) => setNewService({...newService, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                placeholder="Enter service name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Description
              </label>
              <textarea
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                rows={3}
                placeholder="Enter service description"
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
                <div className="mt-2 relative h-40 w-full">
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
              onClick={handleAddService}
              disabled={uploading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {uploading ? 'Adding...' : 'Add Service'}
            </button>
          </div>
        </div>

        {/* Existing Services List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-black">Existing Services</h2>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="border rounded-lg p-4">
                {editingService?.id === service.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editingService.name}
                      onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                    />
                    <textarea
                      value={editingService.description}
                      onChange={(e) => setEditingService({...editingService, description: e.target.value})}
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
                      <div className="mt-2 relative h-40 w-full">
                        <Image
                          src={editingImagePreview || editingService.image_url}
                          alt="Preview"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateService(service.id)}
                        disabled={uploading}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                      >
                        {uploading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingService(null);
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
                  // Display Service
                  <div>
                    <h3 className="text-lg font-semibold text-black">{service.name}</h3>
                    <p className="text-black mt-2">{service.description}</p>
                    <div className="mt-2 relative h-40 w-full">
                      <Image
                        src={service.image_url}
                        alt={service.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => setEditingService(service)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id, service.image_url)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
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