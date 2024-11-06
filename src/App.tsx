import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { ImagePlus, Search, LogIn, LogOut, User as UserIcon, Plus } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import ImageCard from './components/ImageCard';
import ImageDetails from './components/ImageDetails';
import AuthModal from './components/AuthModal';
import PromptForm from './components/PromptForm';
import { ImageMetadata, User } from './types';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export function App() {
  const [images, setImages] = useState<ImageMetadata[]>(() => {
    const saved = localStorage.getItem('images');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploader, setShowUploader] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('images', JSON.stringify(images));
  }, [images]);

  const getImageLineage = (image: ImageMetadata) => {
    return {
      parent: image.parentImageId ? images.find(img => img.id === image.parentImageId) : undefined,
      current: image,
      children: images.filter(img => img.parentImageId === image.id)
    };
  };

  const handleUpload = async (file: File) => {
    if (!user) {
      toast.error('Please sign in to upload images');
      setShowAuthModal(true);
      return;
    }

    try {
      const url = URL.createObjectURL(file);
      const newImage: ImageMetadata = {
        id: Date.now().toString(),
        url,
        title: file.name.split('.')[0],
        description: '',
        tags: [],
        uploadDate: new Date().toISOString(),
        likes: 0,
        userId: user.uid,
        childImageIds: [],
        isPlaceholder: false
      };
      setImages(prev => [newImage, ...prev]);
      setShowUploader(false);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleCreatePlaceholder = (promptData: Partial<ImageMetadata>) => {
    if (!user) {
      toast.error('Please sign in to create prompts');
      setShowAuthModal(true);
      return;
    }

    const newPlaceholder: ImageMetadata = {
      id: Date.now().toString(),
      url: '/placeholder-image.png',
      title: promptData.title || 'Untitled Prompt',
      description: promptData.description || '',
      tags: promptData.tags || [],
      aiPrompt: promptData.aiPrompt || '',
      aiModel: promptData.aiModel || '',
      aiSettings: promptData.aiSettings || {},
      uploadDate: new Date().toISOString(),
      likes: 0,
      userId: user.uid,
      parentImageId: promptData.parentImageId,
      isPlaceholder: true,
      childImageIds: []
    };
    setImages(prev => [newPlaceholder, ...prev]);
    setShowPromptForm(false);
    toast.success('Prompt placeholder created!');
  };

  const handleUpdateImage = (updatedImage: ImageMetadata) => {
    if (!user || user.uid !== updatedImage.userId) {
      toast.error('You can only edit your own images');
      return;
    }

    if (updatedImage.parentImageId) {
      setImages(prev => prev.map(img => 
        img.id === updatedImage.parentImageId
          ? { ...img, childImageIds: [...new Set([...img.childImageIds, updatedImage.id])] }
          : img
      ));
    }

    setImages(prev => prev.map(img => {
      if (img.id === updatedImage.id) {
        // Remove this image from previous parent's children if parent changed
        if (img.parentImageId && img.parentImageId !== updatedImage.parentImageId) {
          const oldParent = prev.find(p => p.id === img.parentImageId);
          if (oldParent) {
            setImages(current => current.map(i => 
              i.id === oldParent.id
                ? { ...i, childImageIds: i.childImageIds.filter(cid => cid !== img.id) }
                : i
            ));
          }
        }
        return updatedImage;
      }
      return img;
    }));
    toast.success('Image updated successfully!');
  };

  const handleDeleteImage = (id: string) => {
    const image = images.find(img => img.id === id);
    if (!user || user.uid !== image?.userId) {
      toast.error('You can only delete your own images');
      return;
    }
    setImages(prev => prev.filter(img => img.id !== id));
    toast.success('Image deleted successfully!');
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleNewPrompt = () => {
    if (!user) {
      toast.error('Please sign in to create prompts');
      setShowAuthModal(true);
      return;
    }
    setShowPromptForm(true);
  };

  const filteredImages = images.filter(image => 
    image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      
      {showPromptForm && (
        <PromptForm
          onSubmit={handleCreatePlaceholder}
          onClose={() => setShowPromptForm(false)}
          existingImages={images}
        />
      )}
      
      {selectedImage && (
        <ImageDetails
          lineage={getImageLineage(selectedImage)}
          onClose={() => setSelectedImage(null)}
          currentUser={user}
          onLike={() => handleUpdateImage({ ...selectedImage, likes: selectedImage.likes + 1 })}
          onUpdate={handleUpdateImage}
          onUpload={handleUpload}
          allImages={images}
        />
      )}

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Prompt Manager</h1>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <UserIcon className="w-8 h-8 p-1 bg-gray-100 rounded-full text-gray-600" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {user.displayName || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </button>
              )}
              <button
                onClick={handleNewPrompt}
                className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Prompt
              </button>
              <button
                onClick={() => setShowUploader(prev => !prev)}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <ImagePlus className="w-5 h-5 mr-2" />
                Upload Image
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search prompts and images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {showUploader && (
          <div className="mb-8">
            <ImageUploader onUpload={handleUpload} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Placeholders Column */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Prompts to Generate</h2>
            <div className="space-y-4">
              {filteredImages
                .filter(img => img.isPlaceholder)
                .map(image => (
                  <div key={image.id} className="mb-4">
                    <ImageCard
                      image={image}
                      onUpdate={handleUpdateImage}
                      onDelete={handleDeleteImage}
                      currentUser={user}
                      onViewDetails={() => setSelectedImage(image)}
                      allImages={images}
                      onUpload={handleUpload}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Generated Images Column */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Generated Images</h2>
            <div className="space-y-4">
              {filteredImages
                .filter(img => !img.isPlaceholder)
                .map(image => (
                  <div key={image.id} className="mb-4">
                    <ImageCard
                      image={image}
                      onUpdate={handleUpdateImage}
                      onDelete={handleDeleteImage}
                      currentUser={user}
                      onViewDetails={() => setSelectedImage(image)}
                      allImages={images}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}