import React, { useState } from 'react';
import { X, Heart, Share2, Clock, User as UserIcon, Upload, Edit2 } from 'lucide-react';
import { ImageLineage, User, ImageMetadata } from '../types';
import ImageLineageView from './ImageLineageView';
import EntryForm from './EntryForm';
import toast from 'react-hot-toast';

interface Props {
  lineage: ImageLineage;
  onClose: () => void;
  currentUser: User | null;
  onLike: () => void;
  onUpdate: (image: ImageMetadata) => void;
  onUpload?: (file: File) => void;
  allImages?: ImageMetadata[];
}

export default function ImageDetails({ 
  lineage, 
  onClose, 
  currentUser, 
  onLike, 
  onUpdate, 
  onUpload,
  allImages = [] // Provide default empty array
}: Props) {
  const { current: image } = lineage;
  const [isEditing, setIsEditing] = useState(false);
  const canEdit = currentUser && currentUser.uid === image.userId;

  const handleUpdate = (updatedData: Partial<ImageMetadata>) => {
    onUpdate({ ...image, ...updatedData });
    setIsEditing(false);
    toast.success('Changes saved successfully');
  };

  if (isEditing) {
    return (
      <EntryForm
        initialData={image}
        onSubmit={handleUpdate}
        onClose={() => setIsEditing(false)}
        existingImages={allImages}
        onUpload={onUpload}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex space-x-4">
              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-100"
                >
                  <Edit2 className="w-5 h-5" />
                  <span>Edit</span>
                </button>
              )}
              <button
                onClick={onLike}
                className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-100"
              >
                <Heart className={`w-5 h-5 ${image.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{image.likes}</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative">
              <img
                src={image.url}
                alt={image.title}
                className={`w-full h-full object-cover ${image.isPlaceholder ? 'opacity-50' : ''}`}
                style={{ maxHeight: '80vh' }}
              />
              {image.isPlaceholder && onUpload && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-opacity"
                >
                  <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-2">
                    <Upload className="w-6 h-6" />
                    <span>Upload Image</span>
                  </div>
                </button>
              )}
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{image.title}</h1>
                <p className="text-gray-600">{image.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {image.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {(image.aiPrompt || image.aiModel) && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">AI Generation Details</h3>
                  {image.aiModel && (
                    <p className="text-sm">
                      <span className="font-medium">Model:</span> {image.aiModel}
                    </p>
                  )}
                  {image.aiPrompt && (
                    <p className="text-sm">
                      <span className="font-medium">Prompt:</span> {image.aiPrompt}
                    </p>
                  )}
                  {image.aiSettings?.negativePrompt && (
                    <p className="text-sm">
                      <span className="font-medium">Negative Prompt:</span>{' '}
                      {image.aiSettings.negativePrompt}
                    </p>
                  )}
                  {image.aiSettings?.seed && (
                    <p className="text-sm">
                      <span className="font-medium">Seed:</span> {image.aiSettings.seed}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(image.uploadDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-4 h-4" />
                  <span>Created by {currentUser?.displayName || 'Anonymous'}</span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Image Lineage</h3>
                <ImageLineageView lineage={lineage} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}