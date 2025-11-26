import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { sampleCreators } from '../lib/seedData';
import { Heart, MapPin, TrendingUp, Users } from 'lucide-react';
import Footer from '../components/Footer';
import UserProfileDropdown from '../components/UserProfileDropdown';

interface Creator {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  cover_image_url: string;
  main_category: string;
  subcategory: string;
  location: string;
  organization_type: string;
  monthly_supporters: number;
  current_amount: number;
  goal_amount: number;
}

interface CategoryPageProps {
  category: string;
  subcategory?: string;
  onNavigateToCreator: (creatorId: string) => void;
  onNavigateHome: () => void;
  onNavigateToAuth: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToNews: () => void;
  onNavigateToCategory: (category: string, subcategory?: string) => void;
}

export default function CategoryPage({ category, subcategory, onNavigateToCreator, onNavigateHome, onNavigateToAuth, onNavigateToDashboard, onNavigateToNews, onNavigateToCategory }: CategoryPageProps) {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCreators();
  }, [category, subcategory]);

  const loadCreators = async () => {
    setLoading(true);

    // Try to load from database first
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('is_creator', true);

    if (category && category !== 'universal') {
      query = query.eq('main_category', category);
    }

    if (subcategory) {
      query = query.eq('subcategory', subcategory);
    }

    const { data, error } = await query.order('monthly_supporters', { ascending: false });

    // If database query succeeds and has data, use it
    if (!error && data && data.length > 0) {
      setCreators(data);
    } else {
      // Otherwise, use mock data
      let filteredCreators = sampleCreators.map((creator, index) => ({
        ...creator,
        id: `mock-${index}`,
        user_id: `mock-user-${index}`,
        created_at: new Date().toISOString()
      }));

      if (category && category !== 'universal') {
        filteredCreators = filteredCreators.filter(c => c.main_category === category);
      }

      if (subcategory) {
        filteredCreators = filteredCreators.filter(c => c.subcategory === subcategory);
      }

      filteredCreators.sort((a, b) => b.monthly_supporters - a.monthly_supporters);
      setCreators(filteredCreators);
    }

    setLoading(false);
  };

  const getCategoryTitle = () => {
    if (subcategory) {
      return subcategory;
    }

    switch (category) {
      case 'people':
        return 'Helping People';
      case 'animals':
        return 'Helping Animals';
      case 'planet':
        return 'Helping the Planet';
      case 'universal':
        return 'All Changemakers';
      default:
        return 'Changemakers';
    }
  };

  const getCategoryDescription = () => {
    if (subcategory) {
      return `Discover changemakers working in ${subcategory.toLowerCase()}`;
    }

    switch (category) {
      case 'people':
        return 'Making life better for humans around the world';
      case 'animals':
        return 'Improving animal welfare and protecting wildlife';
      case 'planet':
        return 'Creating a sustainable future for our planet';
      case 'universal':
        return 'Browse all changemakers making a positive impact';
      default:
        return 'Making positive change in the world';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading changemakers...</p>
        </div>
      </div>
    );
  }

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

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={onNavigateHome}
            className="text-emerald-600 hover:text-emerald-700 font-medium mb-4 flex items-center gap-2"
          >
            ← Back to home
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {getCategoryTitle()}
          </h1>
          <p className="text-xl text-gray-600">
            {getCategoryDescription()}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {creators.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No changemakers found in this category yet.</p>
            <p className="text-gray-400 mt-2">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map((creator) => (
              <div
                key={creator.id}
                onClick={() => onNavigateToCreator(creator.user_id || creator.id)}
                className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-8 border-[#8CB4E8]"
              >
                <div className="relative h-48 bg-gradient-to-br from-emerald-400 to-blue-500">
                  {creator.cover_image_url ? (
                    <img
                      src={creator.cover_image_url}
                      alt={creator.display_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden -mt-10 border-4 border-white">
                      {creator.avatar_url ? (
                        <img
                          src={creator.avatar_url}
                          alt={creator.display_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-emerald-100">
                          <span className="text-emerald-600 text-2xl font-bold">
                            {creator.display_name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 mt-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {creator.display_name}
                      </h3>
                      {creator.location && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{creator.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {creator.bio || 'Making a positive impact in the world.'}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-700">
                      <Users className="w-4 h-4" />
                      <span className="font-semibold">{creator.monthly_supporters}</span>
                      <span className="text-gray-500">supporters</span>
                    </div>

                    {creator.goal_amount > 0 && (
                      <div className="flex items-center gap-1 text-emerald-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-semibold">
                          ${Math.round((creator.current_amount / creator.goal_amount) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {creator.goal_amount > 0 && (
                    <div className="mt-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all"
                          style={{
                            width: `${Math.min((creator.current_amount / creator.goal_amount) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>${Math.round(creator.current_amount)}</span>
                        <span>of ${Math.round(creator.goal_amount)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
