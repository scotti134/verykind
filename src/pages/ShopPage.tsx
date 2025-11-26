import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Search, Diamond } from 'lucide-react';
import CreatorNavigationBar from '../components/CreatorNavigationBar';
import Footer from '../components/Footer';

interface ShopItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_member_only: boolean;
  stock_quantity: number;
  sold_count: number;
}

interface ShopPageProps {
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  onNavigateToCreatorHome: () => void;
  onNavigateToMembership: (creatorId: string, creatorName: string) => void;
  onNavigateToPosts: (creatorId: string, creatorName: string, creatorAvatar: string) => void;
  onNavigateHome: () => void;
  onNavigateToAuth: () => void;
  onNavigateToDashboard: () => void;
}

export default function ShopPage({
  creatorId,
  creatorName,
  creatorAvatar,
  onNavigateToCreatorHome,
  onNavigateToMembership,
  onNavigateToPosts,
  onNavigateHome,
  onNavigateToAuth,
  onNavigateToDashboard
}: ShopPageProps) {
  const { user } = useAuth();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'member-only' | 'kofi-rewards'>('all');

  useEffect(() => {
    loadShopItems();
  }, [creatorId]);

  const loadShopItems = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .eq('creator_page_id', creatorId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading shop items:', error);
    }

    if (data) {
      setItems(data);
    }

    setLoading(false);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'member-only') {
      return matchesSearch && item.is_member_only;
    }
    if (selectedFilter === 'kofi-rewards') {
      return matchesSearch && item.category === 'kofi-rewards';
    }
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CreatorNavigationBar
        creatorName={creatorName}
        creatorAvatar={creatorAvatar}
        activeTab="shop"
        onNavigateToHome={onNavigateToCreatorHome}
        onNavigateToMembership={() => onNavigateToMembership(creatorId, creatorName)}
        onNavigateToPosts={() => onNavigateToPosts(creatorId, creatorName, creatorAvatar || '')}
        onNavigateToShop={() => {}}
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToAuth={onNavigateToAuth}
      />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {creatorName}'s shop
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${creatorName}'s shop`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedFilter === 'all'
                      ? 'bg-pink-100 text-pink-700'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedFilter('member-only')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                    selectedFilter === 'member-only'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Diamond className="w-4 h-4" />
                  Member Only
                </button>
                <button
                  onClick={() => setSelectedFilter('kofi-rewards')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedFilter === 'kofi-rewards'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  kofi rewards
                </button>
              </div>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No items found' : 'No items available'}
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? 'Try adjusting your search or filters'
                  : 'This creator hasn\'t added any shop items yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                >
                  <div className="relative">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                        ${item.price}
                        {item.price > 0 && '+'}
                      </span>
                    </div>
                    {item.is_member_only && (
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full uppercase flex items-center gap-1">
                          <Diamond className="w-3 h-3" />
                          Member-Only
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    {item.sold_count > 0 && (
                      <p className="text-xs text-gray-500">
                        {item.sold_count} sold
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
