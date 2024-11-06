import React, { useState } from 'react';
import { X, Upload, Save } from 'lucide-react';
import { ImageMetadata } from '../types';
import ImageSearch from './ImageSearch';
import ImageUploader from './ImageUploader';
import toast from 'react-hot-toast';

interface Props {
  onSubmit: (data: Partial<ImageMetadata>) => void;
  onClose: () => void;
  existingImages: ImageMetadata[];
  initialData?: ImageMetadata;
  onUpload?: (file: File) => void;
}

export default function EntryForm({ onSubmit, onClose, existingImages, initialData, onUpload }: Props) {
  const [formData, setFormData] = useState<Partial<ImageMetadata>>(initialData || {
    title: '',
    description: '',
    tags: [],
    aiPrompt: '',
    aiModel: '',
    aiSettings: {
      negativePrompt: '',
      steps: 20,
      seed: undefined,
      guidanceScale: 7.5,
    }
  });
  const [showUploader, setShowUploader] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleUpload = (file: File) => {
    if (onUpload) {
      onUpload(file);
      setShowUploader(false);
    }
  };

  const handleParentSelect = (parentImage: ImageMetadata) => {
    setFormData({ ...formData, parentImageId: parentImage.id });
  };

  const handleClearParent = () => {
    setFormData({ ...formData, parentImageId: undefined });
  };

  const parentImage = formData.parentImageId 
    ? existingImages.find(img => img.id === formData.parentImageId)
    : undefined;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {initialData ? 'Edit Entry' : 'Create New Entry'}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div>
            {showUploader ? (
              <ImageUploader onUpload={handleUpload} />
            ) : (
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {formData.url ? (
                  <img
                    src={formData.url}
                    alt={formData.title || 'Preview'}
                    className={`w-full h-full object-cover ${formData.isPlaceholder ? 'opacity-50' : ''}`}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">No image uploaded</p>
                    </div>
                  </div>
                )}
                {onUpload && (
                  <button
                    onClick={() => setShowUploader(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity"
                  >
                    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-2 opacity-0 hover:opacity-100">
                      <Upload className="w-6 h-6" />
                      <span>Upload Image</span>
                    </div>
                  </button>
                )}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Image Lineage</h3>
              {parentImage ? (
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={parentImage.url}
                    alt={parentImage.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{parentImage.title}</p>
                    <p className="text-sm text-gray-500">Parent Image</p>
                  </div>
                  <button
                    onClick={handleClearParent}
                    className="p-2 hover:bg-gray-200 rounded-full"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowUploader(false)}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400"
                >
                  Click to select a parent image
                </button>
              )}
              {!parentImage && (
                <div className="mt-2">
                  <ImageSearch
                    images={existingImages}
                    excludeImageId={initialData?.id}
                    onSelect={handleParentSelect}
                    onClear={handleClearParent}
                    selectedImageId={formData.parentImageId}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the desired outcome"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags?.join(', ')}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AI Model
              </label>
              <input
                type="text"
                value={formData.aiModel}
                onChange={(e) => setFormData({ ...formData, aiModel: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Stable Diffusion XL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prompt
              </label>
              <textarea
                value={formData.aiPrompt}
                onChange={(e) => setFormData({ ...formData, aiPrompt: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your AI prompt"
                rows={4}
                required
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Advanced Settings</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Negative Prompt
                </label>
                <textarea
                  value={formData.aiSettings?.negativePrompt}
                  onChange={(e) => setFormData({
                    ...formData,
                    aiSettings: { ...formData.aiSettings, negativePrompt: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter negative prompt"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Steps
                  </label>
                  <input
                    type="number"
                    value={formData.aiSettings?.steps}
                    onChange={(e) => setFormData({
                      ...formData,
                      aiSettings: { ...formData.aiSettings, steps: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seed
                  </label>
                  <input
                    type="number"
                    value={formData.aiSettings?.seed}
                    onChange={(e) => setFormData({
                      ...formData,
                      aiSettings: { ...formData.aiSettings, seed: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Random"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{initialData ? 'Save Changes' : 'Create Entry'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}