import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Heart, DollarSign, Users, Settings, Share2, Eye, Plus, X, Home, Grid, Store, Zap, CreditCard, Edit2, Menu, FileText, Star, Rocket, Building2, Megaphone, Microscope, HeartPulse, TrendingUp, GraduationCap, Lightbulb, DollarSign as MoneyIcon, Brain, BookOpen, Target, Sparkles, Leaf, ArrowRight } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import GalleryUpload from '../components/GalleryUpload';
import ShopItemForm from '../components/ShopItemForm';
import UserProfileDropdown from '../components/UserProfileDropdown';

interface DashboardStats {
  totalSupports: number;
  monthlyRevenue: number;
  totalSupporters: number;
  pageViews: number;
}

interface CreatorPage {
  id: string;
  title: string;
  description: string;
  username: string;
  supporters_count: number;
  total_raised: number;
  profile_image_url: string;
}

interface Cause {
  id: string;
  title: string;
  description: string;
  image_url: string;
  target_amount: number;
  current_amount: number;
  category: string;
  status: string;
}

interface CreatorDashboardProps {
  onNavigateToCreator: (creatorId: string) => void;
  onNavigateHome: () => void;
  onNavigateToAuth: () => void;
  onNavigateToCategory: (category: string, subcategory?: string) => void;
  onNavigateToDashboard: () => void;
  onNavigateToNews?: () => void;
}

export default function CreatorDashboard({
  onNavigateToCreator,
  onNavigateHome,
  onNavigateToAuth,
  onNavigateToCategory,
  onNavigateToDashboard,
  onNavigateToNews
}: CreatorDashboardProps) {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [creatorPage, setCreatorPage] = useState<CreatorPage | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalSupports: 0,
    monthlyRevenue: 0,
    totalSupporters: 0,
    pageViews: 0
  });
  const [setupStep, setSetupStep] = useState<'welcome' | 'basic-info' | 'complete'>('welcome');
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
  const [causes, setCauses] = useState<Cause[]>([]);
  const [showCauseForm, setShowCauseForm] = useState(false);
  const [causeTitle, setCauseTitle] = useState('');
  const [causeDescription, setCauseDescription] = useState('');
  const [causeImageUrl, setCauseImageUrl] = useState('');
  const [causeTargetAmount, setCauseTargetAmount] = useState('');
  const [causeCategory, setCauseCategory] = useState('people');
  const [savingCause, setSavingCause] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [earningsFilter, setEarningsFilter] = useState('Last 30 days');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payoutStep, setPayoutStep] = useState<'initial' | 'country' | 'method' | 'stripe'>('initial');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [showShopItemForm, setShowShopItemForm] = useState(false);
  const [shopItemCategory, setShopItemCategory] = useState('other');

  const popularCountries = [
    { name: 'United States', flag: '🇺🇸' },
    { name: 'United Kingdom', flag: '🇬🇧' },
    { name: 'Canada', flag: '🇨🇦' },
    { name: 'India', flag: '🇮🇳' }
  ];

  const allCountries = [
    { name: 'Albania', flag: '🇦🇱' },
    { name: 'Algeria', flag: '🇩🇿' },
    { name: 'Angola', flag: '🇦🇴' },
    { name: 'Antigua & Barbuda', flag: '🇦🇬' },
    { name: 'Argentina', flag: '🇦🇷' },
    { name: 'Armenia', flag: '🇦🇲' },
    { name: 'Australia', flag: '🇦🇺' },
    { name: 'Austria', flag: '🇦🇹' },
    { name: 'Azerbaijan', flag: '🇦🇿' },
    { name: 'Bahamas', flag: '🇧🇸' },
    { name: 'Bahrain', flag: '🇧🇭' },
    { name: 'Belgium', flag: '🇧🇪' },
    { name: 'Benin', flag: '🇧🇯' },
    { name: 'Bhutan', flag: '🇧🇹' },
    { name: 'Bosnia & Herzegovina', flag: '🇧🇦' },
    { name: 'Botswana', flag: '🇧🇼' },
    { name: 'Brazil', flag: '🇧🇷' },
    { name: 'Brunei', flag: '🇧🇳' },
    { name: 'Bulgaria', flag: '🇧🇬' },
    { name: 'Cambodia', flag: '🇰🇭' },
    { name: 'Chile', flag: '🇨🇱' },
    { name: 'Colombia', flag: '🇨🇴' },
    { name: 'Costa Rica', flag: '🇨🇷' },
    { name: 'Croatia', flag: '🇭🇷' },
    { name: 'Cyprus', flag: '🇨🇾' },
    { name: 'Czech Republic', flag: '🇨🇿' },
    { name: "Côte d'Ivoire", flag: '🇨🇮' },
    { name: 'Denmark', flag: '🇩🇰' },
    { name: 'Dominican Republic', flag: '🇩🇴' },
    { name: 'Ecuador', flag: '🇪🇨' },
    { name: 'Egypt', flag: '🇪🇬' },
    { name: 'El Salvador', flag: '🇸🇻' },
    { name: 'Estonia', flag: '🇪🇪' },
    { name: 'Ethiopia', flag: '🇪🇹' },
    { name: 'Finland', flag: '🇫🇮' },
    { name: 'France', flag: '🇫🇷' },
    { name: 'Gabon', flag: '🇬🇦' },
    { name: 'Gambia', flag: '🇬🇲' },
    { name: 'Germany', flag: '🇩🇪' },
    { name: 'Ghana', flag: '🇬🇭' },
    { name: 'Gibraltar', flag: '🇬🇮' },
    { name: 'Greece', flag: '🇬🇷' },
    { name: 'Guatemala', flag: '🇬🇹' },
    { name: 'Guyana', flag: '🇬🇾' },
    { name: 'Hong Kong SAR China', flag: '🇭🇰' },
    { name: 'Hungary', flag: '🇭🇺' },
    { name: 'Iceland', flag: '🇮🇸' },
    { name: 'Ireland', flag: '🇮🇪' },
    { name: 'Israel', flag: '🇮🇱' },
    { name: 'Italy', flag: '🇮🇹' },
    { name: 'Jamaica', flag: '🇯🇲' },
    { name: 'Japan', flag: '🇯🇵' },
    { name: 'Jordan', flag: '🇯🇴' },
    { name: 'Kenya', flag: '🇰🇪' },
    { name: 'Kuwait', flag: '🇰🇼' },
    { name: 'Laos', flag: '🇱🇦' },
    { name: 'Latvia', flag: '🇱🇻' },
    { name: 'Liechtenstein', flag: '🇱🇮' },
    { name: 'Lithuania', flag: '🇱🇹' },
    { name: 'Luxembourg', flag: '🇱🇺' },
    { name: 'Macao SAR China', flag: '🇲🇴' },
    { name: 'Madagascar', flag: '🇲🇬' },
    { name: 'Malaysia', flag: '🇲🇾' },
    { name: 'Malta', flag: '🇲🇹' },
    { name: 'Mauritius', flag: '🇲🇺' },
    { name: 'Mexico', flag: '🇲🇽' },
    { name: 'Moldova', flag: '🇲🇩' },
    { name: 'Monaco', flag: '🇲🇨' },
    { name: 'Mongolia', flag: '🇲🇳' },
    { name: 'Mozambique', flag: '🇲🇿' },
    { name: 'Namibia', flag: '🇳🇦' },
    { name: 'Netherlands', flag: '🇳🇱' },
    { name: 'New Zealand', flag: '🇳🇿' },
    { name: 'Niger', flag: '🇳🇪' },
    { name: 'North Macedonia', flag: '🇲🇰' },
    { name: 'Norway', flag: '🇳🇴' },
    { name: 'Oman', flag: '🇴🇲' },
    { name: 'Panama', flag: '🇵🇦' },
    { name: 'Paraguay', flag: '🇵🇾' },
    { name: 'Peru', flag: '🇵🇪' },
    { name: 'Philippines', flag: '🇵🇭' },
    { name: 'Poland', flag: '🇵🇱' },
    { name: 'Portugal', flag: '🇵🇹' },
    { name: 'Qatar', flag: '🇶🇦' },
    { name: 'Romania', flag: '🇷🇴' },
    { name: 'Rwanda', flag: '🇷🇼' },
    { name: 'San Marino', flag: '🇸🇲' },
    { name: 'Saudi Arabia', flag: '🇸🇦' },
    { name: 'Senegal', flag: '🇸🇳' },
    { name: 'Serbia', flag: '🇷🇸' },
    { name: 'Singapore', flag: '🇸🇬' },
    { name: 'Slovakia', flag: '🇸🇰' },
    { name: 'Slovenia', flag: '🇸🇮' },
    { name: 'South Africa', flag: '🇿🇦' },
    { name: 'South Korea', flag: '🇰🇷' },
    { name: 'Spain', flag: '🇪🇸' },
    { name: 'Sri Lanka', flag: '🇱🇰' },
    { name: 'St. Lucia', flag: '🇱🇨' },
    { name: 'Sweden', flag: '🇸🇪' },
    { name: 'Switzerland', flag: '🇨🇭' },
    { name: 'Taiwan', flag: '🇹🇼' },
    { name: 'Tanzania', flag: '🇹🇿' },
    { name: 'Thailand', flag: '🇹🇭' },
    { name: 'Trinidad & Tobago', flag: '🇹🇹' },
    { name: 'Tunisia', flag: '🇹🇳' },
    { name: 'Türkiye', flag: '🇹🇷' },
    { name: 'United Arab Emirates', flag: '🇦🇪' },
    { name: 'United Kingdom', flag: '🇬🇧' },
    { name: 'United States', flag: '🇺🇸' },
    { name: 'Uruguay', flag: '🇺🇾' },
    { name: 'Vietnam', flag: '🇻🇳' },
    { name: 'Zambia', flag: '🇿🇲' }
  ];

  const filteredCountries = countrySearch
    ? [...popularCountries, ...allCountries].filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase())
      )
    : null;

  const categoryOptions = {
    people: {
      label: 'People',
      subcategories: ['Health', 'Education', 'Community', 'Human Rights']
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

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);

    const { data: pageData } = await supabase
      .from('creator_pages')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (pageData) {
      setCreatorPage(pageData);
      setSetupStep('complete');

      const { data: supportsData } = await supabase
        .from('supporters')
        .select('amount, support_type')
        .eq('creator_id', user?.id);

      if (supportsData) {
        const totalSupports = supportsData.length;
        const monthlyRevenue = supportsData
          .filter(s => s.support_type === 'membership')
          .reduce((sum, s) => sum + Number(s.amount), 0);

        setStats({
          totalSupports,
          monthlyRevenue,
          totalSupporters: pageData.supporters_count || 0,
          pageViews: Math.floor(Math.random() * 1000) + 500
        });
      }

      const { data: causesData } = await supabase
        .from('causes')
        .select('*')
        .eq('creator_id', user?.id)
        .order('created_at', { ascending: false });

      if (causesData) {
        setCauses(causesData);
      }
    }

    setLoading(false);
  };

  const createCreatorPage = async () => {
    if (!pageTitle.trim()) return;

    try {
      setCreatingPage(true);

      const baseUsername = user?.email?.split('@')[0] || 'user';
      let username = baseUsername;

      const { data: existingPage, error: existingPageError } = await supabase
        .from('creator_pages')
        .select('id, username')
        .eq('user_id', user?.id)
        .maybeSingle();

      console.log('Existing page check:', { existingPage, existingPageError, userId: user?.id });

      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('user_id', user?.id)
        .maybeSingle();

      console.log('Existing profile check:', { existingProfile, profileCheckError });

      if (profileCheckError) {
        console.error('Error checking profile:', profileCheckError);
        alert(`Failed to verify profile: ${profileCheckError.message}`);
        return;
      }

      if (existingPageError) {
        console.error('Error checking existing page:', existingPageError);
        alert(`Failed to check existing page: ${existingPageError.message}`);
        return;
      }

      if (existingPage) {
        username = existingPage.username;
      } else if (existingProfile && existingProfile.username) {
        const { data: pageWithUsername } = await supabase
          .from('creator_pages')
          .select('id')
          .eq('username', existingProfile.username)
          .maybeSingle();

        if (!pageWithUsername) {
          username = existingProfile.username;
        } else {
          let isUsernameAvailable = false;
          let attempt = 1;

          while (!isUsernameAvailable && attempt <= 100) {
            const testUsername = `${existingProfile.username}${attempt}`;
            const { data: checkPage } = await supabase
              .from('creator_pages')
              .select('id')
              .eq('username', testUsername)
              .maybeSingle();

            if (!checkPage) {
              username = testUsername;
              isUsernameAvailable = true;
            } else {
              attempt++;
            }
          }

          if (!isUsernameAvailable) {
            username = `user_${user?.id?.substring(0, 8)}`;
          }
        }
      } else {
        let isUsernameAvailable = false;
        let attempt = 0;

        while (!isUsernameAvailable && attempt <= 100) {
          const testUsername = attempt === 0 ? baseUsername : `${baseUsername}${attempt}`;

          const { data: checkPage } = await supabase
            .from('creator_pages')
            .select('id')
            .eq('username', testUsername)
            .maybeSingle();

          const { data: checkProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', testUsername)
            .maybeSingle();

          if (!checkPage && !checkProfile) {
            username = testUsername;
            isUsernameAvailable = true;
          } else {
            attempt++;
          }
        }

        if (!isUsernameAvailable) {
          username = `user_${user?.id?.substring(0, 8)}`;
        }
      }

      if (!existingProfile) {
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user?.id,
            username: username,
            display_name: pageTitle,
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
            display_name: pageTitle,
            is_creator: true,
            main_category: category,
            subcategory: subcategory,
            bio: pageDescription,
            avatar_url: profileImageUrl,
            cover_image_url: coverImageUrl
          })
          .eq('id', user?.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          alert(`Failed to update profile: ${profileError.message}`);
          return;
        }
      }

      let pageData;

      if (existingPage) {
        const { data: updatedPage, error: updateError } = await supabase
          .from('creator_pages')
          .update({
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
            subcategory: subcategory
          })
          .eq('user_id', user?.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating page:', updateError);
          alert(`Failed to update page: ${updateError.message}`);
          return;
        }
        pageData = updatedPage;
      } else {
        const { data: newPage, error: pageError } = await supabase
          .from('creator_pages')
          .insert({
            user_id: user?.id,
            username: username,
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
        pageData = newPage;
      }

      setCreatorPage(pageData);
      setSetupStep('complete');
    } catch (err) {
      console.error('Error creating page:', err);
      alert('Failed to create page. Please try again.');
    } finally {
      setCreatingPage(false);
    }
  };

  const createCause = async () => {
    if (!causeTitle.trim()) return;

    try {
      setSavingCause(true);

      const { data: causeData, error: causeError } = await supabase
        .from('causes')
        .insert({
          creator_id: user?.id,
          title: causeTitle,
          description: causeDescription,
          image_url: causeImageUrl,
          target_amount: parseFloat(causeTargetAmount) || 0,
          current_amount: 0,
          category: causeCategory,
          status: 'active'
        })
        .select()
        .single();

      if (causeError) {
        console.error('Error creating cause:', causeError);
        alert(`Failed to create cause: ${causeError.message}`);
        return;
      }

      setCauses([causeData, ...causes]);
      setShowCauseForm(false);
      setCauseTitle('');
      setCauseDescription('');
      setCauseImageUrl('');
      setCauseTargetAmount('');
      setCauseCategory('people');
    } catch (err) {
      console.error('Error creating cause:', err);
      alert('Failed to create cause. Please try again.');
    } finally {
      setSavingCause(false);
    }
  };

  const deleteCause = async (causeId: string) => {
    if (!confirm('Are you sure you want to delete this cause?')) return;

    try {
      const { error } = await supabase
        .from('causes')
        .delete()
        .eq('id', causeId);

      if (error) {
        console.error('Error deleting cause:', error);
        alert(`Failed to delete cause: ${error.message}`);
        return;
      }

      setCauses(causes.filter(c => c.id !== causeId));
    } catch (err) {
      console.error('Error deleting cause:', err);
      alert('Failed to delete cause. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

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
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Share2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Share Your Work</h3>
                <p className="text-sm text-gray-600">Get a beautiful page to share across all platforms</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSetupStep('basic-info')}
            className="w-full bg-[#E07855] hover:bg-[#D06845] text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            Start your FREE Page
            <ArrowRight className="w-5 h-5" />
          </button>
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
                placeholder={`Support ${profile?.display_name || 'my work'}`}
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

  const pageUrl = `buymeacoffee.com/${creatorPage?.username || profile?.username || 'user'}`;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateHome}
                className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <Heart className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <div className="space-y-1">
              <button
                onClick={() => setActiveSection('home')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'home'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Star className="w-4 h-4" />
                Home
              </button>

              <button
                onClick={() => setActiveSection('my-causes')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'my-causes'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Target className="w-4 h-4" />
                My Causes
              </button>

              <button
                onClick={() => user?.id && onNavigateToCreator(user.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View page
              </button>

              <button
                onClick={() => setActiveSection('explore')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'explore'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Leaf className="w-4 h-4" />
                Explore Causes
              </button>
            </div>

            <div className="mt-6">
              <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Monetize
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveSection('supporters')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'supporters'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  Supporters
                </button>

                <button
                  onClick={() => setActiveSection('memberships')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'memberships'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Memberships
                </button>

                <button
                  onClick={() => setActiveSection('shop')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'shop'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  Shop
                </button>

                <button
                  onClick={() => setActiveSection('publish')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'publish'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Publish
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Settings
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveSection('graphics')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'graphics'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Buttons & Graphics
                </button>

                <button
                  onClick={() => setActiveSection('integrations')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'integrations'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  Integrations
                </button>

                <button
                  onClick={() => setActiveSection('payouts')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'payouts'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Payouts
                </button>

                <button
                  onClick={() => setActiveSection('settings')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'settings'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
            </div>
          </nav>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-600">Please link your payout method, it only takes a few minutes.</span>
              <button
                onClick={() => setActiveSection('payouts')}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-medium rounded-lg transition-colors"
              >
                Complete setup
              </button>
              <UserProfileDropdown
                onNavigateToDashboard={onNavigateToDashboard}
                onNavigateToProfile={() => creatorPage && onNavigateToCreator(user?.id || '')}
                onLogout={() => onNavigateToAuth()}
              />
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-8 max-w-7xl">
          {(activeSection === 'home' || activeSection === 'my-causes') && (
          <div className="flex items-center gap-3 mb-8">
            {creatorPage?.profile_image_url ? (
              <img
                src={creatorPage.profile_image_url}
                alt={creatorPage.username}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hi, {creatorPage?.title || profile?.display_name || 'Creator'}</h1>
              <p className="text-sm text-gray-600">{pageUrl}</p>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(`https://${pageUrl}`)}
              className="ml-auto px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share page
            </button>
          </div>
          )}

          {activeSection === 'home' && (
          <>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Donations</h2>
              <select
                value={earningsFilter}
                onChange={(e) => setEarningsFilter(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>All time</option>
              </select>
            </div>

            <div className="text-6xl font-bold text-gray-900 mb-4">$0</div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span className="text-gray-600">$0 Supporters</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                <span className="text-gray-600">$0 Membership</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-gray-600">$0 Shop</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">You don't have any supporters yet</h3>
            <p className="text-gray-600 mb-6">Share your page with your audience to get started.</p>
          </div>
          </>
          )}

          {activeSection === 'my-causes' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">My Causes</h2>
                  <p className="text-sm text-gray-600 mt-1">Manage your causes and track their progress</p>
                </div>
                <button
                  onClick={() => setShowCauseForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Cause
                </button>
              </div>

              {showCauseForm && (
                <div className="mb-6 p-6 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">New Cause</h4>
                    <button
                      onClick={() => {
                        setShowCauseForm(false);
                        setCauseTitle('');
                        setCauseDescription('');
                        setCauseImageUrl('');
                        setCauseTargetAmount('');
                      }}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cause Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={causeTitle}
                        onChange={(e) => setCauseTitle(e.target.value)}
                        placeholder="e.g., Help feed 100 families"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={causeDescription}
                        onChange={(e) => setCauseDescription(e.target.value)}
                        placeholder="Tell people more about this cause..."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          value={causeCategory}
                          onChange={(e) => setCauseCategory(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        >
                          <option value="people">People</option>
                          <option value="animals">Animals</option>
                          <option value="planet">Environment</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount ($)</label>
                        <input
                          type="number"
                          value={causeTargetAmount}
                          onChange={(e) => setCauseTargetAmount(e.target.value)}
                          placeholder="0"
                          min="0"
                          step="1"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={createCause}
                        disabled={!causeTitle.trim() || savingCause}
                        className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {savingCause ? 'Creating...' : 'Create Cause'}
                      </button>
                      <button
                        onClick={() => setShowCauseForm(false)}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {causes.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No causes yet</h3>
                  <p className="text-gray-600 mb-6">Create your first cause to showcase specific needs</p>
                  <button
                    onClick={() => setShowCauseForm(true)}
                    className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-semibold transition-colors"
                  >
                    Add Your First Cause
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {causes.map((cause) => (
                    <div key={cause.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      {cause.image_url && (
                        <img
                          src={cause.image_url}
                          alt={cause.title}
                          className="w-full h-40 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            {categoryOptions[cause.category as keyof typeof categoryOptions]?.label || cause.category}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{cause.title}</h4>
                        {cause.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{cause.description}</p>
                        )}
                        {cause.target_amount > 0 && (
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">${cause.current_amount}</span>
                              <span className="font-medium text-gray-900">${cause.target_amount}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${Math.min((cause.current_amount / cause.target_amount) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteCause(cause.id)}
                            className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'explore' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore Causes</h2>
              <p className="text-gray-600">Discover causes from other creators in your community.</p>
            </div>
          )}

          {activeSection === 'supporters' && (
            <div>
              <div className="flex items-center gap-6 mb-6 border-b border-gray-200">
                <button className="pb-3 px-1 text-sm font-medium text-gray-900 border-b-2 border-gray-900">
                  One-time
                </button>
                <button className="pb-3 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Settings
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">0</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Heart className="w-4 h-4" />
                    Supporter
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    Last 30 days
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth={2} />
                    </svg>
                    All-time
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">You don't have any supporters yet</h3>
                <p className="text-gray-600">Share your page with your audience to get started.</p>
              </div>
            </div>
          )}

          {activeSection === 'memberships' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Memberships</h2>
              <p className="text-gray-600">Create and manage membership tiers for recurring support.</p>
            </div>
          )}

          {activeSection === 'shop' && (
            <div className="space-y-6">
              {showShopItemForm ? (
                <ShopItemForm
                  creatorPageId={creatorPage?.id || ''}
                  initialCategory={shopItemCategory}
                  onBack={() => setShowShopItemForm(false)}
                  onSuccess={() => {
                    setShowShopItemForm(false);
                    setActiveSection('shop');
                  }}
                />
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Add a new listing</h3>
                    <p className="text-sm text-gray-600">Pick a template or start from scratch</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <button
                      onClick={() => {
                        setShowShopItemForm(true);
                        setShopItemCategory('other');
                      }}
                      className="p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Plus className="w-5 h-5 text-gray-700" />
                        <span className="font-medium text-gray-900">Start from scratch</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setShowShopItemForm(true);
                        setShopItemCategory('digital');
                      }}
                      className="p-6 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-700" />
                        <span className="font-medium text-gray-900">Digital product</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setShowShopItemForm(true);
                        setShopItemCategory('instagram');
                      }}
                      className="p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="font-medium text-gray-900">Instagram close friends access</span>
                      </div>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => {
                        setShowShopItemForm(true);
                        setShopItemCategory('zoom-call');
                      }}
                      className="p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium text-gray-900">1-on-1 Zoom call</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setShowShopItemForm(true);
                        setShopItemCategory('ticket');
                      }}
                      className="p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <span className="font-medium text-gray-900">Ticket for an event</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setShowShopItemForm(true);
                        setShopItemCategory('physical');
                      }}
                      className="p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span className="font-medium text-gray-900">Physical good</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">You haven't added anything yet.</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Shop is a simple and effective way to offer something to your audience. It could be anything. See some examples{' '}
                  <a href="#" className="text-blue-600 hover:underline">here</a>,{' '}
                  <a href="#" className="text-blue-600 hover:underline">here</a>, and{' '}
                  <a href="#" className="text-blue-600 hover:underline">here</a>
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Launch your own shop and start selling<br />your digital and physical creations.
                  </h3>
                </div>
                <div className="ml-8 bg-white rounded-xl p-4 shadow-lg flex-shrink-0">
                  <img
                    src="https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
                    alt="Sell with Buy Me a Coffee"
                    className="w-64 h-32 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'publish' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Publish</h2>
              <p className="text-gray-600">Share updates and content with your supporters.</p>
            </div>
          )}

          {activeSection === 'graphics' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Buttons & Graphics</h2>
              <p className="text-gray-600">Download buttons and widgets to promote your page.</p>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Integrations</h2>
              <p className="text-gray-600">Connect with third-party services and tools.</p>
            </div>
          )}

          {activeSection === 'payouts' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Payout</h1>

              <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-gray-900" />
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">Enter your payout info to start accepting payments</h2>
                <p className="text-gray-600 mb-6">
                  To enable payouts, you'll need to provide your bank details to our payment partner. Rest assured, your information is secure and will not be stored on our servers. Check if your country is supported for payouts{' '}
                  <a href="#" className="text-blue-600 hover:underline">here.</a>
                </p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setPayoutStep('country')}
                    className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors"
                  >
                    Set Up Payouts
                  </button>
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Takes less than 3 mins
                  </span>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Outstanding balance</h3>
                        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-4xl font-bold text-gray-900">$0</div>
                    </div>
                    <button
                      disabled
                      className="px-6 py-2 bg-gray-200 text-gray-400 rounded-lg font-medium cursor-not-allowed"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payout history</h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={3} className="py-12">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-4">
                              <CreditCard className="w-8 h-8 text-gray-900" />
                            </div>
                            <p className="text-gray-900 font-medium">You haven't received any payouts so far.</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
              <p className="text-gray-600">Configure your account and page settings.</p>
            </div>
          )}
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {payoutStep === 'country' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Select your country</h2>
                <button
                  onClick={() => setPayoutStep('initial')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {!filteredCountries && (
                <>
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Popular</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {popularCountries.map((country) => (
                        <button
                          key={country.name}
                          onClick={() => setSelectedCountry(country.name)}
                          className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                            selectedCountry === country.name
                              ? 'border-gray-900 bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{country.flag}</span>
                            <span className="font-medium text-gray-900">{country.name}</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 ${
                            selectedCountry === country.name
                              ? 'border-gray-900 bg-gray-900'
                              : 'border-gray-300'
                          }`}>
                            {selectedCountry === country.name && (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Countries</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {allCountries.map((country) => (
                        <button
                          key={country.name}
                          onClick={() => setSelectedCountry(country.name)}
                          className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                            selectedCountry === country.name
                              ? 'border-gray-900 bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{country.flag}</span>
                            <span className="font-medium text-gray-900">{country.name}</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 ${
                            selectedCountry === country.name
                              ? 'border-gray-900 bg-gray-900'
                              : 'border-gray-300'
                          }`}>
                            {selectedCountry === country.name && (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {filteredCountries && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.name}
                      onClick={() => setSelectedCountry(country.name)}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                        selectedCountry === country.name
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.flag}</span>
                        <span className="font-medium text-gray-900">{country.name}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        selectedCountry === country.name
                          ? 'border-gray-900 bg-gray-900'
                          : 'border-gray-300'
                      }`}>
                        {selectedCountry === country.name && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  if (selectedCountry) {
                    setPayoutStep('method');
                  }
                }}
                disabled={!selectedCountry}
                className="w-full mt-8 px-6 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Next
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {payoutStep === 'method' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setPayoutStep('country')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setPayoutStep('initial')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Set up your payout method</h2>
                <p className="text-gray-600 mb-4">
                  Good news — we support bank deposits in {selectedCountry}, thanks to our partner Stripe Express. Just to clarify, you're setting up an Express Payout account through Buy Me a Coffee, not a full Stripe account.
                </p>
                <p className="text-gray-600">
                  Up next: you'll enter your bank details so we can send you payments. And don't worry, we never store your personal or bank details.
                </p>
              </div>

              <button
                onClick={() => setPayoutStep('stripe')}
                className="w-full px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mb-4"
              >
                Enter my bank info
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="text-center">
                <span className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Takes less than 3 mins
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {payoutStep === 'stripe' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-8">
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setPayoutStep('initial')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Add information to start accepting money</h2>
                <p className="text-gray-600 mb-8">
                  Buy Me a Coffee partners with Stripe to help you receive payments and keep your personal bank and details secure.
                </p>

                <button
                  onClick={() => {
                    window.open('https://stripe.com', '_blank');
                    setPayoutStep('initial');
                  }}
                  className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors"
                >
                  Add information
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
