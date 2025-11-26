import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Users, DollarSign, Share2 } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

interface ProfileSetupPageProps {
  onComplete: () => void;
  onNavigateHome: () => void;
}

export default function ProfileSetupPage({ onComplete, onNavigateHome }: ProfileSetupPageProps) {
  const { user } = useAuth();
  const [setupStep, setSetupStep] = useState<'welcome' | 'basic-info'>('welcome');
  const [pageTitle, setPageTitle] = useState('');
  const [pageDescription, setPageDescription] = useState('');
  const [tagline, setTagline] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [socialTwitter, setSocialTwitter] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialWebsite, setSocialWebsite] = useState('');
  const [supportItemName, setSupportItemName] = useState('coffee');
  const [supportItemEmoji, setSupportItemEmoji] = useState('☕');
  const [supportPrice, setSupportPrice] = useState('5.00');
  const [galleryImages, setGalleryImages] = useState<Array<{ url: string; caption?: string }>>([]);
  const [category, setCategory] = useState('people');
  const [subcategory, setSubcategory] = useState('Community');
  const [creatingPage, setCreatingPage] = useState(false);

  const categoryOptions = {
    people: {
      label: 'People',
      subcategories: ['Community', 'Healthcare', 'Education', 'Social Justice']
    },
    animals: {
      label: 'Animals',
      subcategories: ['Wildlife Conservation', 'Animal Rescue', 'Pet Adoption', 'Endangered Species']
    },
    planet: {
      label: 'Environment',
      subcategories: ['Climate Action', 'Ocean Cleanup', 'Reforestation', 'Renewable Energy']
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setSubcategory(categoryOptions[newCategory as keyof typeof categoryOptions].subcategories[0]);
  };

  const createCreatorPage = async () => {
    if (!pageTitle.trim()) return;

    try {
      setCreatingPage(true);

      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (profileCheckError) {
        console.error('Error checking profile:', profileCheckError);
        alert(`Failed to verify profile: ${profileCheckError.message}`);
        return;
      }

      if (!existingProfile) {
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            user_id: user?.id,
            username: user?.email?.split('@')[0] || 'user',
            display_name: user?.email?.split('@')[0] || 'User',
            is_creator: true,
            main_category: category,
            subcategory: subcategory,
            bio: pageDescription,
            avatar_url: profileImageUrl,
            cover_image_url: coverImageUrl
          });

        if (createProfileError) {
          console.error('Error creating profile:', createProfileError);
          alert(`Failed to create profile: ${createProfileError.message}`);
          return;
        }
      } else {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            is_creator: true,
            main_category: category,
            subcategory: subcategory,
            bio: pageDescription,
            avatar_url: profileImageUrl,
            cover_image_url: coverImageUrl
          })
          .eq('user_id', user?.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          alert(`Failed to update profile: ${profileError.message}`);
          return;
        }
      }

      const { data: pageData, error: pageError } = await supabase
        .from('creator_pages')
        .insert({
          user_id: user?.id,
          username: user?.email?.split('@')[0] || 'user',
          display_name: pageTitle,
          title: pageTitle,
          bio: pageDescription,
          description: pageDescription,
          tagline: tagline,
          profile_image_url: profileImageUrl,
          avatar_url: profileImageUrl,
          cover_image_url: coverImageUrl,
          social_twitter: socialTwitter,
          social_instagram: socialInstagram,
          social_website: socialWebsite,
          support_item_name: supportItemName,
          support_item_emoji: supportItemEmoji,
          support_price: parseFloat(supportPrice) || 5.00,
          gallery_images: galleryImages,
          category: categoryOptions[category as keyof typeof categoryOptions].label,
          subcategory: subcategory,
          supporters_count: 0,
          total_raised: 0
        })
        .select()
        .single();

      if (pageError) {
        console.error('Error creating page:', pageError);
        alert(`Failed to create page: ${pageError.message}`);
        return;
      }

      onComplete();
    } catch (err) {
      console.error('Error creating creator page:', err);
      alert('Failed to create page. Please try again.');
    } finally {
      setCreatingPage(false);
    }
  };

  if (setupStep === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">VK</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome to Your Creator Page!</h1>
            <p className="text-lg text-gray-600">
              Let's set up your page so people can start supporting your work
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Build Your Community</h3>
                <p className="text-sm text-gray-600">Connect with supporters who believe in your mission</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Receive Support</h3>
                <p className="text-sm text-gray-600">Accept one-time donations or monthly memberships</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Share2 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Share Your Work</h3>
                <p className="text-sm text-gray-600">Get a beautiful page to share across all platforms</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onNavigateHome}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-lg transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => setSetupStep('basic-info')}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (setupStep === 'basic-info') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 my-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Set up your creator page</h1>
            <p className="text-gray-600">Tell people who you are and what you're working on</p>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                placeholder="Support my work"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="people">People</option>
                  <option value="animals">Animals</option>
                  <option value="planet">Environment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory <span className="text-red-500">*</span>
                </label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  {categoryOptions[category as keyof typeof categoryOptions].subcategories.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Your Work
              </label>
              <textarea
                value={pageDescription}
                onChange={(e) => setPageDescription(e.target.value)}
                placeholder="Tell supporters what you're working on and how their support helps..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUpload
                  label="Profile Picture"
                  value={profileImageUrl}
                  onChange={setProfileImageUrl}
                  userId={user?.id || ''}
                  type="profile"
                  helpText="Use a clear photo of yourself or your logo"
                />

                <ImageUpload
                  label="Cover Image"
                  value={coverImageUrl}
                  onChange={setCoverImageUrl}
                  userId={user?.id || ''}
                  type="cover"
                  helpText="Recommended: 1600px x 400px"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setSetupStep('welcome')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              onClick={createCreatorPage}
              disabled={!pageTitle.trim() || creatingPage}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creatingPage ? 'Creating...' : 'Create Page'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
