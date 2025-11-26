import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer';
import UserProfileDropdown from '../components/UserProfileDropdown';
import { sampleCreators } from '../lib/seedData';

interface Creator {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  category: string;
  subcategory: string;
}

interface Category {
  name: string;
  subcategories: string[];
}

interface ExplorePageProps {
  onNavigateHome: () => void;
  onNavigateToAuth: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToNews: () => void;
  onNavigateToCategory: (category: string, subcategory?: string) => void;
  onNavigateToCreator: (creatorId: string) => void;
}

const categories: Category[] = [
  {
    name: 'People',
    subcategories: ['Health', 'Education', 'Community', 'Human Rights']
  },
  {
    name: 'Animals',
    subcategories: ['Wildlife Conservation', 'Animal Rescue', 'Pet Adoption', 'Endangered Species']
  },
  {
    name: 'Environment',
    subcategories: ['Climate Action', 'Ocean Cleanup', 'Reforestation', 'Renewable Energy']
  }
];

export default function ExplorePage({
  onNavigateHome,
  onNavigateToAuth,
  onNavigateToDashboard,
  onNavigateToNews,
  onNavigateToCategory,
  onNavigateToCreator
}: ExplorePageProps) {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  useEffect(() => {
    loadCreators();
  }, [selectedCategory, selectedSubcategory]);

  const loadCreators = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('creator_pages')
      .select('id, user_id, username, display_name, bio, avatar_url, category, subcategory')
      .order('created_at', { ascending: false });

    if (data && !error) {
      let filteredCreators = data;

      if (selectedCategory) {
        filteredCreators = filteredCreators.filter(c => c.category === selectedCategory);
      }

      if (selectedSubcategory) {
        filteredCreators = filteredCreators.filter(c => c.subcategory === selectedSubcategory);
      }

      const mockCreatorsWithIds = sampleCreators.map((creator, idx) => ({
        ...creator,
        id: `mock-${idx}`,
        user_id: `mock-user-${idx}`,
        username: creator.username || creator.display_name,
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
      }));

      let allCreators = [...mockCreatorsWithIds, ...filteredCreators];

      if (selectedCategory) {
        allCreators = allCreators.filter(c => c.category === selectedCategory);
      }

      if (selectedSubcategory) {
        allCreators = allCreators.filter(c => c.subcategory === selectedSubcategory);
      }

      setCreators(allCreators);
    } else {
      const mockCreatorsWithIds = sampleCreators.map((creator, idx) => ({
        ...creator,
        id: `mock-${idx}`,
        user_id: `mock-user-${idx}`,
        username: creator.username || creator.display_name,
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
      }));

      setCreators(mockCreatorsWithIds);
    }

    setLoading(false);
  };

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(category);
      setSelectedSubcategory(null);
    }
  };

  const handleSubcategoryClick = (subcategory: string) => {
    if (selectedSubcategory === subcategory) {
      setSelectedSubcategory(null);
    } else {
      setSelectedSubcategory(subcategory);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="text-2xl font-bold text-gray-900 hover:text-[#FFD54F] transition-colors"
          >
            VK
          </button>

          <div className="flex items-center gap-4">
            <UserProfileDropdown
              onNavigateToDashboard={onNavigateToDashboard}
              onNavigateToProfile={() => {}}
              onLogout={onNavigateToAuth}
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Explore Good People</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
                {(selectedCategory || selectedSubcategory) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.name}>
                    <button
                      onClick={() => handleCategoryClick(category.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category.name
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {category.name}
                    </button>

                    <div className="ml-4 mt-2 space-y-1">
                      {category.subcategories.map((subcategory) => (
                        <button
                          key={subcategory}
                          onClick={() => handleSubcategoryClick(subcategory)}
                          className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                            selectedSubcategory === subcategory
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {subcategory}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading creators...</p>
              </div>
            ) : creators.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No creators found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {creators.map((creator) => (
                  <button
                    key={creator.id}
                    onClick={() => onNavigateToCreator(creator.user_id)}
                    className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition-shadow text-left border-8 border-[#8CB4E8]"
                  >
                    <div className="aspect-square relative">
                      <img
                        src={creator.avatar_url}
                        alt={creator.display_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{creator.display_name}</h3>
                      <p className="text-sm text-gray-600 mb-2">@{creator.username}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{creator.bio}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                          {creator.category}
                        </span>
                        {creator.subcategory && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {creator.subcategory}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
