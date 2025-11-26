import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Heart, Coffee, MoreHorizontal, Globe, Info } from 'lucide-react';
import UserProfileDropdown from '../components/UserProfileDropdown';

interface CreatorPage {
  id: string;
  user_id: string;
  username: string;
  title: string;
  description: string;
  profile_image_url: string;
  cover_image_url: string;
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

  useEffect(() => {
    loadCreatorData();
    loadRecentSupporters();
  }, [creatorId]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
          <button
            onClick={onNavigateBack}
            className="text-2xl font-bold text-gray-900 hover:text-[#FFD54F] transition-colors"
          >
            VK
          </button>

          <div className="flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2">
            {creatorPage.profile_image_url ? (
              <img
                src={creatorPage.profile_image_url}
                alt={creatorPage.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-gray-400" />
              </div>
            )}
            <div>
              <h1 className="font-bold text-gray-900">{creatorPage.title || creatorPage.username}</h1>
              {creatorPage.show_supporter_count && (
                <p className="text-sm text-gray-600">{supporterCount.toLocaleString()} supporters</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <UserProfileDropdown
              onNavigateToDashboard={onNavigateToDashboard}
              onNavigateToProfile={() => {}}
              onLogout={onNavigateToAuth}
            />
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('home')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'home'
                  ? 'border-red-400 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                if (onNavigateToMembership && creatorPage) {
                  onNavigateToMembership(creatorPage.user_id, creatorPage.title, creatorPage.profile_image_url, creatorPage.id);
                } else {
                  setActiveTab('membership');
                }
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'membership'
                  ? 'border-red-400 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Membership
            </button>
            <button
              onClick={() => {
                if (onNavigateToPosts && creatorPage) {
                  onNavigateToPosts(creatorPage.user_id, creatorPage.title, creatorPage.profile_image_url, creatorPage.id);
                } else {
                  setActiveTab('posts');
                }
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'posts'
                  ? 'border-red-400 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => {
                if (onNavigateToShop && creatorPage) {
                  onNavigateToShop(creatorPage.id, creatorPage.title, creatorPage.profile_image_url, creatorPage.user_id);
                } else {
                  setActiveTab('shop');
                }
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'shop'
                  ? 'border-red-400 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Shop
            </button>
          </nav>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {creatorPage.cover_image_url && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <img
                  src={creatorPage.cover_image_url}
                  alt="Cover"
                  className="w-full h-80 object-cover"
                />
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                About {creatorPage.title || creatorPage.username}
              </h2>
              <p className="text-gray-600 mb-4">{creatorPage.tagline}</p>

              {creatorPage.description && (
                <>
                  <h3 className="font-semibold text-gray-900 mb-2">Hello! Thanks for stopping by!</h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
                    {creatorPage.description}
                  </div>
                </>
              )}

              {(creatorPage.social_website || creatorPage.social_twitter || creatorPage.social_instagram) && (
                <div className="flex gap-3 mb-6">
                  {creatorPage.social_website && (
                    <a
                      href={creatorPage.social_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Globe className="w-4 h-4 text-gray-600" />
                    </a>
                  )}
                </div>
              )}

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Recent supporters</h3>
                {recentSupporters.length > 0 ? (
                  <div className="space-y-4">
                    {recentSupporters.map((supporter, idx) => {
                      const displayName = supporter.is_anonymous ? 'Someone' : supporter.supporter_name;
                      return (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-orange-600 text-sm font-semibold">
                              {displayName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">{displayName}</span>
                              {supporter.message ? (
                                <span className="text-gray-600"> {supporter.message}</span>
                              ) : (
                                <span className="text-gray-600"> is now a member.</span>
                              )}
                            </p>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Be the first to support!</p>
                )}
              </div>
            </div>

            {causes.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">My Causes</h2>
                <div className="space-y-6">
                  {causes.map((cause) => (
                    <div key={cause.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                      <div className="mb-4 rounded-xl overflow-hidden bg-gray-100">
                        {cause.image_url ? (
                          <img
                            src={cause.image_url}
                            alt={cause.title}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 flex items-center justify-center text-gray-400">
                            <Heart className="w-12 h-12" />
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold text-gray-900 text-base mb-2">{cause.title}</h4>
                      {cause.description && (
                        <p className="text-sm text-gray-600 mb-4">{cause.description}</p>
                      )}
                      {cause.target_amount > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">${cause.current_amount.toLocaleString()} raised</span>
                            <span className="font-medium text-gray-900">${cause.target_amount.toLocaleString()} goal</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full transition-all"
                              style={{ width: `${Math.min((cause.current_amount / cause.target_amount) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-96 flex-shrink-0">
            {tiers.length > 0 && activeTab === 'home' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Become a member</h3>
                <p className="text-sm text-gray-600 mb-6">
                  {tiers[0]?.benefits.length || 0} members • {tiers.length} exclusive posts
                </p>
                <div className="space-y-4">
                  {tiers.map((tier) => (
                    <div key={tier.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                          {tier.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{tier.name}</h4>
                          <p className="text-sm font-semibold text-gray-900">
                            ${tier.amount}
                            <span className="text-gray-600 font-normal">/month</span>
                          </p>
                        </div>
                      </div>
                      <button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mb-3">
                        Join
                      </button>
                      <div className="flex items-start gap-2 text-xs text-gray-600 mb-3">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Includes discord benefits</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        {tier.description}
                      </p>
                      {tier.benefits && tier.benefits.length > 0 && (
                        <ul className="space-y-1.5">
                          {tier.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-gray-400 mt-0.5">•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <button className="mt-3 text-sm text-gray-600 hover:text-gray-900 font-medium">
                        See more ∨
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                Support {creatorPage.title || creatorPage.username}
                <Info className="w-4 h-4 text-gray-400" />
              </h3>
              <div className="mt-6">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => { setCustomAmount('5'); setSelectedAmount(0); }}
                    className={`py-4 px-4 rounded-lg font-medium text-sm transition-all border ${
                      customAmount === '5'
                        ? 'bg-orange-400 text-white border-orange-400'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    ☕ Buy a Coffee
                    <div className="text-xs mt-1">$5</div>
                  </button>
                  <button
                    onClick={() => { setCustomAmount('10'); setSelectedAmount(0); }}
                    className={`py-4 px-4 rounded-lg font-medium text-sm transition-all border ${
                      customAmount === '10'
                        ? 'bg-orange-400 text-white border-orange-400'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    🍕 Buy a Meal
                    <div className="text-xs mt-1">$10</div>
                  </button>
                  <button
                    onClick={() => { setCustomAmount('15'); setSelectedAmount(0); }}
                    className={`py-4 px-4 rounded-lg font-medium text-sm transition-all border ${
                      customAmount === '15'
                        ? 'bg-orange-400 text-white border-orange-400'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    ❤️ Kindness Gift
                    <div className="text-xs mt-1">$15</div>
                  </button>
                  <button
                    onClick={() => { setCustomAmount('25'); setSelectedAmount(0); }}
                    className={`py-4 px-4 rounded-lg font-medium text-sm transition-all border ${
                      customAmount === '25'
                        ? 'bg-orange-400 text-white border-orange-400'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    🎨 Supplies / Equipment
                    <div className="text-xs mt-1">$25</div>
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or enter custom amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(0); }}
                      placeholder="0"
                      min="1"
                      className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  value={supportName}
                  onChange={(e) => setSupportName(e.target.value)}
                  placeholder="Name or @yoursocial"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm mb-3"
                />

                <textarea
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Say something nice..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm resize-none mb-3"
                />

                <div className="flex items-center gap-2 mb-4">
                  <Coffee className="w-4 h-4 text-gray-600" />
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={makeMonthly}
                      onChange={(e) => setMakeMonthly(e.target.checked)}
                      className="w-4 h-4 text-orange-400 border-gray-300 rounded focus:ring-orange-400"
                    />
                    Make this monthly
                    <Info className="w-4 h-4 text-gray-400" />
                  </label>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Tip Very Kind</p>
                      <p className="text-xs text-gray-600 mt-0.5">Support our work and operations</p>
                    </div>
                    <Heart className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setVeryKindTip('1')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                        veryKindTip === '1'
                          ? 'bg-red-400 text-white border-red-400'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      $1
                    </button>
                    <button
                      onClick={() => setVeryKindTip('2')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                        veryKindTip === '2'
                          ? 'bg-red-400 text-white border-red-400'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      $2
                    </button>
                    <button
                      onClick={() => setVeryKindTip('5')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                        veryKindTip === '5'
                          ? 'bg-red-400 text-white border-red-400'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      $5
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      value={veryKindTip}
                      onChange={(e) => setVeryKindTip(e.target.value)}
                      placeholder="Custom amount"
                      min="0"
                      className="w-full pl-7 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Support ${displayAmount}{veryKindTip && parseFloat(veryKindTip) > 0 ? ` + $${parseFloat(veryKindTip)} tip` : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <button className="hover:text-gray-900">🌐 English</button>
            <button className="hover:text-gray-900">Privacy</button>
            <button className="hover:text-gray-900">Terms</button>
            <button className="hover:text-gray-900">Report</button>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            Start your{' '}
            <span className="text-orange-500 hover:text-orange-600 font-medium cursor-pointer">
              Buy Me a Coffee page
            </span>{' '}
            →
          </p>
        </div>
      </footer>
    </div>
  );
}
