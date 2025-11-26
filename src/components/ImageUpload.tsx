import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  userId: string;
  type: 'profile' | 'cover' | 'gallery';
  helpText?: string;
}

export default function ImageUpload({ label, value, onChange, userId, type, helpText }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const uploadImage = async (file: File) => {
    try {
      setError('');
      setUploading(true);

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
      const fileName = `${type}-${Date.now()}.${fileExt}`;
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

      onChange(publicUrl);
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
  };

  const clearImage = () => {
    onChange('');
    setError('');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {value ? (
        <div className="relative">
          <img
            src={value}
            alt={label}
            className={`w-full object-cover rounded-lg border-2 border-gray-300 ${
              type === 'profile' ? 'h-32' : type === 'cover' ? 'h-40' : 'h-48'
            }`}
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className={`flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-yellow-400 transition-colors ${
          type === 'profile' ? 'h-32' : type === 'cover' ? 'h-40' : 'h-48'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <div className="flex flex-col items-center justify-center py-4">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 font-medium">Upload JPEG Image</p>
                <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
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

      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
