import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AnimalIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" fill="#FFB84D"/>
    <ellipse cx="11" cy="14" rx="2.5" ry="3" fill="#1A1A1A"/>
    <ellipse cx="21" cy="14" rx="2.5" ry="3" fill="#1A1A1A"/>
    <path d="M11 20C11 20 13 23 16 23C19 23 21 20 21 20" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 10L6 8C5 7 4 7 3 8" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M24 10L26 8C27 7 28 7 29 8" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const PeopleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="10" r="6" fill="#FF6B6B"/>
    <path d="M6 28C6 21 10 18 16 18C22 18 26 21 26 28" fill="#FF6B6B"/>
    <circle cx="11" cy="9" r="1.5" fill="#FFFFFF"/>
    <circle cx="21" cy="9" r="1.5" fill="#FFFFFF"/>
    <path d="M13 13C13 13 14 14 16 14C18 14 19 13 19 13" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const EnvironmentIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="12" fill="#4ECDC4"/>
    <path d="M8 16C8 20 10 24 16 24C22 24 24 20 24 16" fill="#95E1D3"/>
    <circle cx="12" cy="14" r="2" fill="#FFFFFF"/>
    <circle cx="20" cy="14" r="2" fill="#FFFFFF"/>
    <path d="M10 12C10 12 8 10 6 10" stroke="#2D6A5F" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M22 12C22 12 24 10 26 10" stroke="#2D6A5F" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const categories = [
  { name: 'Animals', icon: AnimalIcon },
  { name: 'People', icon: PeopleIcon },
  { name: 'Environment', icon: EnvironmentIcon }
];

interface Creator {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  subcategory: string;
  monthly_supporters: number;
}

interface FeaturedCreatorsProps {
  onNavigateToCreator: (creatorId: string) => void;
  onNavigateToExplore: () => void;
}

const subcategories = [
  'All',
  'Health',
  'Education',
  'Community',
  'Human Rights',
  'Wildlife Conservation',
  'Animal Rescue',
  'Pet Adoption',
  'Endangered Species',
  'Climate Action',
  'Ocean Cleanup',
  'Reforestation',
  'Renewable Energy'
];

export default function FeaturedCreators({ onNavigateToCreator, onNavigateToExplore }: FeaturedCreatorsProps) {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');

  useEffect(() => {
    loadCreators();
  }, [selectedSubcategory]);

  const loadCreators = async () => {
    try {
      let query = supabase
        .from('profiles')
        .select('id, username, display_name, bio, avatar_url, subcategory, monthly_supporters')
        .eq('is_creator', true);

      if (selectedSubcategory !== 'All') {
        query = query.eq('subcategory', selectedSubcategory);
      }

      const { data, error } = await query
        .order('monthly_supporters', { ascending: false })
        .limit(1);

      if (!error && data) {
        setCreators(data);
      }
    } catch (err) {
      console.error('Error loading creators:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="creators" className="py-20 bg-[#E8E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading creators...</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="creators" className="py-20 bg-[#E8E4DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
            People of all kinds, all kind!
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            People making a difference. Support these amazing individuals doing good in the world.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {subcategories.map((subcategory) => {
            const isSelected = selectedSubcategory === subcategory;
            return (
              <button
                key={subcategory}
                onClick={() => setSelectedSubcategory(subcategory)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-white border-3 border-blue-600 text-gray-900 shadow-md hover:shadow-lg'
                    : 'bg-white text-gray-900 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {subcategory}
              </button>
            );
          })}
        </div>

        <p className="text-center text-gray-600 italic mb-8">
          People using Very Kind
        </p>

        <div className="flex justify-center">
          {creators.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No creators yet. Be the first to create a page!</p>
            </div>
          ) : (
            <div
              onClick={() => onNavigateToCreator(creators[0].username)}
              className="w-80 aspect-square rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              <img
                src={creators[0].avatar_url || 'https://images.pexels.com/photos/1029896/pexels-photo-1029896.jpeg?auto=compress&cs=tinysrgb&w=800'}
                alt={creators[0].display_name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="text-center mt-14">
          <button
            onClick={onNavigateToExplore}
            className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-all font-medium"
          >
            Find Good People
          </button>
        </div>
      </div>
    </section>
  );
}
