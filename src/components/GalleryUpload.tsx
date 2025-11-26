import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface GalleryImage {
  url: string;
  caption?: string;
}

interface GalleryUploadProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  userId: string;
  maxImages?: number;
}

export default function GalleryUpload({ images, onChange, userId, maxImages = 10 }: GalleryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const uploadImage = async (file: File) => {
    try {
      setError('');
      setUploading(true);

      if (images.length >= maxImages) {
        throw new Error(`Maximum ${maxImages} images allowed`);
      }

      // Validate file type
      if (!file.type.startsWith('image/jpeg') && !file.type.startsWith('image/jpg')) {
        throw new Error('Only JPEG images are allowed');
      }

      // Validate file size (5MB)
      if (file.size > 5242880) {
        throw new Error('File size must be less than 5MB');
      }

      // Create unique file name
      const fileExt = 'jpg';
      const fileName = `gallery-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('creator-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('creator-images')
        .getPublicUrl(filePath);

      onChange([...images, { url: publicUrl, caption: '' }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
    // Reset input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const updateCaption = (index: number, caption: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], caption };
    onChange(newImages);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Gallery Images ({images.length}/{maxImages})
      </label>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image.url}
              alt={`Gallery ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg border-2 border-gray-300"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={image.caption || ''}
              onChange={(e) => updateCaption(index, e.target.value)}
              placeholder="Add caption (optional)"
              className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-2 py-1.5 rounded-b-lg border-0 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        ))}

        {images.length < maxImages && (
          <label className={`flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-yellow-400 transition-colors ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}>
            <div className="flex flex-col items-center justify-center">
              {uploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-600 font-medium">Upload Image</p>
                  <p className="text-xs text-gray-500 mt-1">JPEG, Max 5MB</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/jpeg,image/jpg"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600 mb-2">{error}</p>
      )}

      <p className="text-xs text-gray-500">
        Upload up to {maxImages} images showcasing your work or cause. Add captions to provide context.
      </p>
    </div>
  );
}
