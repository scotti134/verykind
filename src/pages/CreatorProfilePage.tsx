import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Heart, Share2, ChevronLeft, ChevronRight, Shield, Flag } from 'lucide-react';
import UserProfileDropdown from '../components/UserProfileDropdown';
import DonationModal from '../components/DonationModal';

interface CreatorPage {
  id: string;
  user_id: string;
  username: string;
  title: string;
  description: string;
  profile_image_url: string;
  cover_image_url: string;
  gallery_images: string[];
  tagline: string;
  social_twitter: string;
  social_instagram: string;
  social_website: string;
  show_supporter_count: boolean;
  support_item_name: string;
  support_item_emoji: string;
  support_price: number;
}

interface SupportTier {
  id: string;
  name: string;
  description: string;
  amount: number;
  benefits: string[];
}

interface RecentSupporter {
  supporter_name: string;
  amount: number;
  message?: string;
  created_at: string;
  is_anonymous: boolean;
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

interface CreatorProfilePageProps {
  creatorId: string;
  onNavigateBack: () => void;
  onNavigateToAuth: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToMembership?: (creatorId: string, creatorName: string, creatorAvatar: string, creatorPageId: string) => void;
  onNavigateToPosts?: (creatorId: string, creatorName: string, creatorAvatar: string, creatorPageId: string) => void;
  onNavigateToShop?: (creatorPageId: string, creatorName: string, creatorAvatar: string, creatorId: string) => void;
}

export default function CreatorProfilePage({
  creatorId,
  onNavigateBack,
  onNavigateToAuth,
  onNavigateToDashboard,
  onNavigateToMembership,
  onNavigateToPosts,
  onNavigateToShop
}: CreatorProfilePageProps) {
  const [creatorPage, setCreatorPage] = useState<CreatorPage | null>(null);
  const [tiers, setTiers] = useState<SupportTier[]>([]);
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'membership' | 'posts' | 'shop'>('home');
  const [selectedAmount, setSelectedAmount] = useState(1);
  const [customAmount, setCustomAmount] = useState('');
  const [supportName, setSupportName] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [makeMonthly, setMakeMonthly] = useState(false);
  const [recentSupporters, setRecentSupporters] = useState<RecentSupporter[]>([]);
  const [supporterCount, setSupporterCount] = useState(0);
  const [veryKindTip, setVeryKindTip] = useState('');
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadCreatorData();
    loadRecentSupporters();
  }, [creatorId]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [creatorPage?.id]);

  const loadCreatorData = async () => {
    setLoading(true);

    // Handle mock creator IDs
    if (creatorId.startsWith('mock-user-')) {
      const mockIndex = parseInt(creatorId.replace('mock-user-', ''));
      const mockData = {
        id: `mock-${mockIndex}`,
        user_id: creatorId,
        username: 'sample_creator',
        title: 'Sample Creator',
        description: 'This is a sample creator profile. Sign up to create your own page!',
        profile_image_url: 'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=400',
        cover_image_url: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1200',
        gallery_images: [],
        tagline: 'Making a difference in the world',
        social_twitter: '',
        social_instagram: '',
        social_website: '',
        show_supporter_count: true,
        support_item_name: 'coffee',
        support_item_emoji: '☕',
        support_price: 5
      };
      setCreatorPage(mockData as CreatorPage);
      setLoading(false);
      return;
    }

    // Try to find creator by username first, then fall back to user_id
    let { data: pageData, error: pageError } = await supabase
      .from('creator_pages')
      .select('*')
      .eq('username', creatorId)
      .maybeSingle();

    // If not found by username, try by user_id
    if (!pageData && !pageError) {
      const result = await supabase
        .from('creator_pages')
        .select('*')
        .eq('user_id', creatorId)
        .maybeSingle();
      pageData = result.data;
      pageError = result.error;
    }

    if (!pageError && pageData) {
      setCreatorPage(pageData);

      const { data: tiersData } = await supabase
        .from('support_tiers')
        .select('*')
        .eq('creator_page_id', pageData.id)
        .order('amount', { ascending: true });

      if (tiersData) {
        setTiers(tiersData.map(tier => ({
          ...tier,
          benefits: Array.isArray(tier.benefits) ? tier.benefits : []
        })));
      }

      const { data: causesData } = await supabase
        .from('causes')
        .select('*')
        .eq('creator_id', creatorId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (causesData) {
        setCauses(causesData);
      }

      const { count } = await supabase
        .from('supporters')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', creatorId);

      if (count !== null) {
        setSupporterCount(count);
      }
    }

    setLoading(false);
  };

  const loadRecentSupporters = async () => {
    const { data, error } = await supabase
      .from('supporters')
      .select('supporter_name, amount, message, created_at, is_anonymous')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data && !error) {
      setRecentSupporters(data);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!creatorPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Creator not found</p>
        </div>
      </div>
    );
  }

  const unitPrice = creatorPage.support_price || 5;
  const displayAmount = customAmount ? parseFloat(customAmount) : selectedAmount * unitPrice;
  const goalAmount = 1500;
  const raisedAmount = 1583;
  const donationCount = recentSupporters.length || 30;
  const progressPercentage = Math.min((raisedAmount / goalAmount) * 100, 100);

  const displayImages = creatorPage.gallery_images && creatorPage.gallery_images.length > 0
    ? creatorPage.gallery_images
    : creatorPage.cover_image_url
    ? [creatorPage.cover_image_url]
    : [];

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onNavigateBack}
            className="text-2xl font-bold text-gray-900 hover:text-[#02A95C] transition-colors"
          >
            VK
          </button>

          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Search
            </button>
            <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Start a fundraiser
            </button>
            <UserProfileDropdown
              onNavigateToDashboard={onNavigateToDashboard}
              onNavigateToProfile={() => {}}
              onLogout={onNavigateToAuth}
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {creatorPage.title || creatorPage.username}
            </h1>

            {displayImages.length > 0 && (
              <div className="mb-6 rounded-xl overflow-hidden relative group">
                <img
                  src={displayImages[currentImageIndex]}
                  alt="Cover"
                  className="w-full h-[600px] object-cover"
                />
                {displayImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePreviousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-900" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-900" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {displayImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex
                              ? 'bg-white w-8'
                              : 'bg-white/60 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                {creatorPage.profile_image_url ? (
                  <img
                    src={creatorPage.profile_image_url}
                    alt={creatorPage.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <Heart className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{creatorPage.username}</span> for {creatorPage.tagline || 'a good cause'}
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5 mb-6">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Donation protected</span>
            </div>

            {creatorPage.description && (
              <div className="text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap">
                {creatorPage.description}
              </div>
            )}

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Updates <span className="ml-2 text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">2</span></h2>
              </div>
              <div className="border border-gray-200 rounded-lg p-6 mb-4">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {creatorPage.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{creatorPage.username}</span>
                      <span className="text-gray-500">·</span>
                      <span className="text-sm text-gray-600">Organizer</span>
                    </div>
                    <p className="text-sm text-gray-500">Apr 15, 2021</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We are over 75% of the way there!! Thanks everyone who has graciously donated so far. Please consider giving if you can.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  There is another way you can help. We will be physically picking up trash along the banks of the Charles River on Saturday April 24th from 11-2PM. Lunch will be provided. Email me at [email redacted] for more details!
                </p>
                <button className="text-sm text-gray-700 font-medium hover:text-gray-900 mb-4">
                  See 1 more
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDonationModalOpen(true)}
                    className="flex-1 py-2 px-4 border-2 border-gray-300 rounded-full font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    Donate
                  </button>
                  <button className="flex-1 py-2 px-4 border-2 border-gray-300 rounded-full font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                    Share
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Organizer</h2>
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    {creatorPage.profile_image_url ? (
                      <img
                        src={creatorPage.profile_image_url}
                        alt={creatorPage.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <Heart className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      {creatorPage.username}
                      <span className="text-gray-400">→</span>
                    </h3>
                    <p className="text-sm text-gray-600">Organizer</p>
                    <p className="text-sm text-gray-600">Boston, MA</p>
                    <button className="mt-3 px-6 py-2 border-2 border-gray-300 rounded-full font-medium text-gray-900 hover:bg-gray-50 transition-colors text-sm">
                      Contact
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{creatorPage.tagline || 'Beneficiary'}</h3>
                    <p className="text-sm text-gray-600">Beneficiary</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Words of support <span className="ml-2 text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">1</span></h2>
              <p className="text-gray-600 mb-6">Please donate to share words of support.</p>
              {recentSupporters.length > 0 && (
                <div className="space-y-4 mb-6">
                  {recentSupporters.slice(0, 1).map((supporter, idx) => {
                    const displayName = supporter.is_anonymous ? 'Someone' : supporter.supporter_name;
                    return (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-600 text-sm font-semibold">
                            {displayName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{displayName}</h3>
                          <p className="text-sm text-gray-600 mb-2">${supporter.amount} · 5 yrs</p>
                          {supporter.message && (
                            <p className="text-gray-700">{supporter.message}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-8 mb-8">
              <p className="text-sm text-gray-600 mb-4">Created March 20th, 2021 · <a href="#" className="text-blue-600 hover:underline">Non-Profits & Charities</a></p>
            </div>

            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Flag className="w-4 h-4" />
              <span className="text-sm font-medium">Report fundraiser</span>
            </button>
          </div>

          <div className="lg:w-96 flex-shrink-0 lg:sticky lg:top-24 self-start">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  ${raisedAmount.toLocaleString()} <span className="text-lg font-normal text-gray-600">raised of {goalAmount.toLocaleString()}</span>
                </h2>
                <p className="text-gray-600">{donationCount} donations</p>
              </div>

              <button
                onClick={() => setIsDonationModalOpen(true)}
                className="w-full bg-[#C97132] hover:bg-[#B5651F] text-white font-bold py-4 px-6 rounded-full transition-colors mb-3"
              >
                Donate now
              </button>

              <button className="w-full bg-[#D9986B] hover:bg-[#C97132] text-white font-bold py-4 px-6 rounded-full transition-colors mb-6 flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Share
              </button>

              <div className="space-y-4">
                {recentSupporters.length > 0 ? (
                  recentSupporters.map((supporter, idx) => {
                    const displayName = supporter.is_anonymous ? 'Someone' : supporter.supporter_name;
                    return (
                      <div key={idx} className="flex items-start gap-3 py-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <Heart className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900">{displayName}</p>
                          <p className="text-sm text-gray-600">${supporter.amount} · 5 yrs</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    {['Annahid Beheshti', 'Chris Jordan', 'Olya Kudriavtseva', 'Catherine Sobchuk', 'Katie Larkin'].map((name, idx) => (
                      <div key={idx} className="flex items-start gap-3 py-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <Heart className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900">{name}</p>
                          <p className="text-sm text-gray-600">${[20, 10, 150, 50, 50][idx]} · 5 yrs</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button className="flex-1 py-2 px-4 border-2 border-gray-300 rounded-full font-medium text-gray-900 hover:bg-gray-50 transition-colors text-sm">
                  See all
                </button>
                <button className="flex-1 py-2 px-4 border-2 border-gray-300 rounded-full font-medium text-gray-900 hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-1">
                  ★ See top
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-gray-50 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600 flex-wrap">
            <a href="#" className="hover:text-gray-900">About</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
            <a href="#" className="hover:text-gray-900">Privacy</a>
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="#" className="hover:text-gray-900">Help Center</a>
          </div>
          <p className="text-center text-sm text-gray-600 mt-6">
            © 2025 Very Kind
          </p>
        </div>
      </footer>

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        creatorName={creatorPage.title || creatorPage.username}
        amount={displayAmount}
        platformTip={veryKindTip ? parseFloat(veryKindTip) : 0}
        message={supportMessage}
        isMonthly={makeMonthly}
      />
    </div>
  );
}
