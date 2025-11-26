import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ShopItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  tags: string[];
}

interface CreatorPage {
  id: string;
  name: string;
  tagline: string;
  profile_image_url: string;
  supporters_count: number;
}

interface ShopExtrasPageProps {
  creatorPageId: string;
}

export default function ShopExtrasPage({ creatorPageId }: ShopExtrasPageProps) {
  const [creatorPage, setCreatorPage] = useState<CreatorPage | null>(null);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    loadData();
  }, [creatorPageId]);

  async function loadData() {
    try {
      const { data: pageData } = await supabase
        .from('creator_pages')
        .select('*')
        .eq('id', creatorPageId)
        .single();

      if (pageData) {
        setCreatorPage(pageData);
      }

      const { data: itemsData } = await supabase
        .from('shop_items')
        .select('*')
        .eq('creator_page_id', creatorPageId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (itemsData) {
        setShopItems(itemsData);
      }
    } catch (error) {
      console.error('Error loading shop data:', error);
    } finally {
      setLoading(false);
    }
  }

  const allTags = Array.from(new Set(shopItems.flatMap(item => item.tags)));
  const filters = ['All', ...allTags];

  const filteredItems = selectedFilter === 'All'
    ? shopItems
    : shopItems.filter(item => item.tags.includes(selectedFilter));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={creatorPage?.profile_image_url || 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
                alt={creatorPage?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{creatorPage?.name}</h1>
                <p className="text-sm text-gray-600">{creatorPage?.supporters_count || 0} supporters</p>
              </div>
            </div>
            <nav className="flex items-center gap-8">
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Membership</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Posts</a>
              <a href="#" className="text-sm font-medium text-orange-500 border-b-2 border-orange-500 pb-4">Extras</a>
            </nav>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Extras</h2>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === filter
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Shop Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No items available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
                    <img
                      src={item.image_url || 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-lg font-bold text-gray-900">${item.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
