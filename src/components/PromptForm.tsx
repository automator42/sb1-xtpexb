import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ImageMetadata } from '../types';
import ImageSearch from './ImageSearch';

interface Props {
  onSubmit: (data: Partial<ImageMetadata>) => void;
  onClose: () => void;
  existingImages: ImageMetadata[];
}

export default function PromptForm({ onSubmit, onClose, existingImages }: Props) {
  const [formData, setFormData] = useState<Partial<ImageMetadata>>({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Create New Prompt</h2>

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
              placeholder="Enter a title for this prompt"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Image (Optional)
            </label>
            <ImageSearch
              images={existingImages.filter(img => !img.isPlaceholder)}
              onSelect={(image) => setFormData({ ...formData, parentImageId: image.id })}
              onClear={() => setFormData({ ...formData, parentImageId: undefined })}
              selectedImageId={formData.parentImageId}
            />
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
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Prompt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}