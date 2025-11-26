import { useState } from 'react';
import { ArrowLeft, Eye, Bold, Italic, Underline, List, Link as LinkIcon, Upload, Info, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ShopItemFormProps {
  creatorPageId: string;
  initialCategory?: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function ShopItemForm({ creatorPageId, initialCategory = 'other', onBack, onSuccess }: ShopItemFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [price, setPrice] = useState('10');
  const [successType, setSuccessType] = useState<'message' | 'redirect'>('message');
  const [successMessage, setSuccessMessage] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [contentAgreement, setContentAgreement] = useState(false);
  const [askQuestion, setAskQuestion] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [limitSlots, setLimitSlots] = useState(false);
  const [stockQuantity, setStockQuantity] = useState('');
  const [allowQuantity, setAllowQuantity] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const uploadImage = async (file: File) => {
    try {
      setUploadError('');
      setUploading(true);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file (JPG, PNG, or GIF)');
      }

      // Validate file size (5MB)
      if (file.size > 5242880) {
        throw new Error('File size must be less than 5MB');
      }

      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `shop-${Date.now()}.${fileExt}`;
      const filePath = `${creatorPageId}/${fileName}`;

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

      setFeaturedImageUrl(publicUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
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

  const handleSave = async (asDraft: boolean) => {
    if (!name || !price) return;

    setSaving(true);
    setIsDraft(asDraft);

    try {
      const { error } = await supabase.from('shop_items').insert({
        creator_page_id: creatorPageId,
        title: name,
        description,
        featured_image_url: featuredImageUrl,
        price: parseFloat(price),
        category: initialCategory,
        success_type: successType,
        success_message: successMessage,
        redirect_url: redirectUrl,
        categories,
        ask_question: askQuestion,
        question_text: questionText,
        limit_slots: limitSlots,
        stock_quantity: limitSlots && stockQuantity ? parseInt(stockQuantity) : null,
        allow_quantity: allowQuantity,
        content_agreement: contentAgreement,
        is_active: !asDraft
      });

      if (!error) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating shop item:', error);
    } finally {
      setSaving(false);
    }
  };

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">What are you offering?</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Eye className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Save as draft
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving || !name || !price || !contentAgreement}
              className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (isDraft ? 'Saving...' : 'Publishing...') : 'Publish'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What are you offering?"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-semibold text-gray-900">
                Description
              </label>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="border border-gray-200 rounded-lg">
              <div className="flex items-center gap-1 p-2 border-b border-gray-200">
                <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                  <Bold className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                  <Italic className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                  <Underline className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                  <List className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                  <LinkIcon className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="Perfect for casual outings, creator meet-ups, or just cozying up at home. Your purchase not only gets you a quality T-shirt but also contributes to my ongoing content journey."
                className="w-full px-4 py-3 rounded-b-lg focus:outline-none resize-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Featured image (optional)
            </label>
            <div className="flex items-start gap-4">
              {featuredImageUrl ? (
                <div className="relative flex-shrink-0 w-24 h-24">
                  <img
                    src={featuredImageUrl}
                    alt="Featured"
                    className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                  />
                  <button
                    onClick={() => setFeaturedImageUrl('')}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className={`flex-shrink-0 w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors cursor-pointer ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                  {uploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-600">Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  We recommend an image should be square, at least 1080x1080px, and JPG, PNG or GIF format.
                </p>
                {uploadError && (
                  <p className="mt-1 text-xs text-red-600">{uploadError}</p>
                )}
                <input
                  type="url"
                  value={featuredImageUrl}
                  onChange={(e) => setFeaturedImageUrl(e.target.value)}
                  placeholder="Or paste image URL"
                  className="mt-2 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Price
            </label>
            <div className="relative w-32">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">$</span>
              <input
                type="number"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-semibold text-gray-900">
                Success page
              </label>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={successType === 'message'}
                  onChange={() => setSuccessType('message')}
                  className="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                />
                <span className="text-sm text-gray-900">Confirmation message</span>
              </label>
              {successType === 'message' && (
                <textarea
                  value={successMessage}
                  onChange={(e) => setSuccessMessage(e.target.value)}
                  placeholder="Enter confirmation message here"
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                />
              )}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={successType === 'redirect'}
                  onChange={() => setSuccessType('redirect')}
                  className="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                />
                <span className="text-sm text-gray-900">Redirect to a URL after purchase</span>
              </label>
              {successType === 'redirect' && (
                <input
                  type="url"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              )}
            </div>
            <button className="mt-3 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
              <Upload className="w-4 h-4" />
              Upload file
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Categories
            </label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full flex items-center gap-2"
                >
                  {cat}
                  <button
                    onClick={() => setCategories(categories.filter(c => c !== cat))}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                placeholder="Add category"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
              />
              <button
                onClick={addCategory}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                + Add new categories
              </button>
            </div>
          </div>

          <div className="pt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={contentAgreement}
                onChange={(e) => setContentAgreement(e.target.checked)}
                className="mt-1 w-4 h-4 text-yellow-400 focus:ring-yellow-400 rounded"
              />
              <span className="text-sm text-gray-700">
                I created this and it doesn't contain any illegal, adult, copyrighted or{' '}
                <a href="#" className="text-gray-900 underline">prohibited content</a>.
              </span>
            </label>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Advanced settings</h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-900">
                      Ask a question (optional)
                    </label>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <button
                    onClick={() => setAskQuestion(!askQuestion)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      askQuestion ? 'bg-yellow-400' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        askQuestion ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {askQuestion && (
                  <input
                    type="text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Please enter your shipping address and your T-shirt size."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                  />
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-900">
                      Limit slots (optional)
                    </label>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <button
                    onClick={() => setLimitSlots(!limitSlots)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      limitSlots ? 'bg-yellow-400' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        limitSlots ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {limitSlots && (
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    className="mt-2 w-32 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                  />
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-900">
                    Allow buyer to choose a quantity
                  </label>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <button
                  onClick={() => setAllowQuantity(!allowQuantity)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    allowQuantity ? 'bg-yellow-400' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      allowQuantity ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
