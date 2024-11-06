import React, { useState } from 'react';
import { ImageMetadata, User } from '../types';
import { Heart, Edit2, Tag, Settings, X, ExternalLink, Upload } from 'lucide-react';
import ImageSearch from './ImageSearch';

interface Props {
  image: ImageMetadata;
  onUpdate: (image: ImageMetadata) => void;
  onDelete: (id: string) => void;
  currentUser: User | null;
  onViewDetails: () => void;
  allImages: ImageMetadata[];
  onUpload?: (file: File) => void;
}

export default function ImageCard({ image, onUpdate, onDelete, currentUser, onViewDetails, allImages, onUpload }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedImage, setEditedImage] = useState(image);

  const canEdit = currentUser && currentUser.uid === image.userId;

  const handleLike = () => {
    onUpdate({ ...image, likes: image.likes + 1 });
  };

  const handleSave = () => {
    onUpdate(editedImage);
    setIsEditing(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${image.isPlaceholder ? 'border-2 border-dashed border-purple-300' : ''}`}>
      <div className="relative group">
        <img
          src={image.url}
          alt={image.title}
          className={`w-full h-48 object-cover cursor-pointer ${image.isPlaceholder ? 'opacity-50' : ''}`}
          onClick={onViewDetails}
        />
        {image.isPlaceholder && onUpload && (
          <div className="absolute inset-0 flex items-center justify-center">
            <label className="cursor-pointer bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Upload Image</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity">
          <button
            onClick={onViewDetails}
            className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editedImage.title}
              onChange={(e) => setEditedImage({ ...editedImage, title: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              placeholder="Title"
            />
            <textarea
              value={editedImage.description}
              onChange={(e) => setEditedImage({ ...editedImage, description: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              placeholder="Description"
            />
            <input
              type="text"
              value={editedImage.tags.join(', ')}
              onChange={(e) => setEditedImage({ ...editedImage, tags: e.target.value.split(',').map(t => t.trim()) })}
              className="w-full px-3 py-2 border rounded"
              placeholder="Tags (comma separated)"
            />
            <div className="space-y-2">
              <p className="font-medium">AI Settings</p>
              <input
                type="text"
                value={editedImage.aiPrompt || ''}
                onChange={(e) => setEditedImage({ ...editedImage, aiPrompt: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="AI Prompt"
              />
              <input
                type="text"
                value={editedImage.aiModel || ''}
                onChange={(e) => setEditedImage({ ...editedImage, aiModel: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="AI Model"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-lg cursor-pointer hover:text-blue-500" onClick={onViewDetails}>
                {image.title}
              </h3>
              {canEdit && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(image.id)}
                    className="p-1 text-gray-500 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-2">{image.description}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {image.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-sm rounded-full text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
            {(image.aiPrompt || image.aiModel) && (
              <div className="border-t pt-2 mt-2">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">AI Model:</span> {image.aiModel}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Prompt:</span> {image.aiPrompt}
                </p>
              </div>
            )}
            <div className="flex justify-between items-center mt-3 pt-3 border-t">
              <button
                onClick={handleLike}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-500"
              >
                <Heart className="w-4 h-4" />
                <span>{image.likes}</span>
              </button>
              <span className="text-sm text-gray-500">
                {new Date(image.uploadDate).toLocaleDateString()}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}