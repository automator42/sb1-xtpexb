import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { ImageMetadata } from '../types';
import { useDebounce } from '../hooks/useDebounce';

interface Props {
  images: ImageMetadata[];
  excludeImageId?: string;
  onSelect: (image: ImageMetadata) => void;
  onClear: () => void;
  selectedImageId?: string;
  initialSelectedImage?: ImageMetadata;
}

export default function ImageSearch({ 
  images, 
  excludeImageId, 
  onSelect, 
  onClear, 
  selectedImageId,
  initialSelectedImage 
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (initialSelectedImage) {
      setSearchTerm(initialSelectedImage.title);
    }
  }, [initialSelectedImage]);

  const filteredImages = images
    .filter(image => 
      image.id !== excludeImageId &&
      (image.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
       image.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
       image.tags.some(tag => tag.toLowerCase().includes(debouncedSearch.toLowerCase())))
    )
    .slice(0, 5);

  useEffect(() => {
    if (debouncedSearch) {
      setIsOpen(true);
    }
  }, [debouncedSearch]);

  const handleSelect = (image: ImageMetadata) => {
    onSelect(image);
    setSearchTerm(image.title);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    onClear();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search for parent image..."
        />
        {(searchTerm || selectedImageId) && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && searchTerm && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {filteredImages.length > 0 ? (
            filteredImages.map((image) => (
              <button
                key={image.id}
                onClick={() => handleSelect(image)}
                className="w-full p-2 hover:bg-gray-50 flex items-center space-x-3 border-b last:border-b-0"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 text-left">
                  <p className="font-medium truncate">{image.title}</p>
                  <p className="text-sm text-gray-500 truncate">{image.description}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No images found
            </div>
          )}
        </div>
      )}

      {selectedImageId && !isOpen && (
        <div className="mt-2 p-2 bg-gray-50 rounded-lg flex items-center space-x-3">
          <img
            src={images.find(img => img.id === selectedImageId)?.url}
            alt="Selected parent"
            className="w-16 h-16 object-cover rounded"
          />
          <div className="flex-1">
            <p className="font-medium truncate">
              {images.find(img => img.id === selectedImageId)?.title}
            </p>
            <p className="text-sm text-gray-500">Selected as parent</p>
          </div>
          <button
            onClick={handleClear}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      )}
    </div>
  );
}