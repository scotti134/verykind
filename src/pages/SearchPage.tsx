import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer';
import Header from '../components/Header';

interface Fundraiser {
  id: string;
  title: string;
  image_url: string;
  amount_raised: number;
  goal_amount: number;
  creator_name: string;
  category: string;
}

interface SearchPageProps {
  onNavigateHome: () => void;
  onNavigateToAuth: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToFundraise: () => void;
  onNavigateToCategory: (category: string, subcategory?: string) => void;
  onNavigateToCreator: (creatorId: string) => void;
  onNavigateToProfile?: () => void;
}

const mockFundraisers: Fundraiser[] = [
  {
    id: '1',
    title: 'The $1M Dollar Backpacking Trip',
    image_url: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=800',
    amount_raised: 1492760,
    goal_amount: 1500000,
    creator_name: 'Adventure Team',
    category: 'Helping People'
  },
  {
    id: '2',
    title: '88 & Still Working: Let\'s Support Veteran Ed Bambas',
    image_url: 'https://images.pexels.com/photos/2899097/pexels-photo-2899097.jpeg?auto=compress&cs=tinysrgb&w=800',
    amount_raised: 1883040,
    goal_amount: 2000000,
    creator_name: 'Community Support',
    category: 'Helping People'
  },
  {
    id: '3',
    title: 'Navajo & Hopi Families COVID-19 Relief Fund',
    image_url: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800',
    amount_raised: 8205980,
    goal_amount: 10000000,
    creator_name: 'Relief Organization',
    category: 'Helping People'
  },
  {
    id: '4',
    title: 'Support a Family\'s Journey to Stability',
    image_url: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=800',
    amount_raised: 74813,
    goal_amount: 100000,
    creator_name: 'Family Friends',
    category: 'Helping People'
  },
  {
    id: '5',
    title: 'Support for Sahaja\'s Family After a Tragic Fire Accident',
    image_url: 'https://images.pexels.com/photos/6942070/pexels-photo-6942070.jpeg?auto=compress&cs=tinysrgb&w=800',
    amount_raised: 174193,
    goal_amount: 200000,
    creator_name: 'Community Care',
    category: 'Helping People'
  },
  {
    id: '6',
    title: 'Help Save Our Local Animal Shelter',
    image_url: 'https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=800',
    amount_raised: 245600,
    goal_amount: 300000,
    creator_name: 'Animal Lovers United',
    category: 'Helping Animals'
  },
  {
    id: '7',
    title: 'Ocean Cleanup Initiative 2024',
    image_url: 'https://images.pexels.com/photos/3800471/pexels-photo-3800471.jpeg?auto=compress&cs=tinysrgb&w=800',
    amount_raised: 567890,
    goal_amount: 750000,
    creator_name: 'Ocean Warriors',
    category: 'Helping the Planet'
  },
  {
    id: '8',
    title: 'Medical Support for Children in Need',
    image_url: 'https://images.pexels.com/photos/8612992/pexels-photo-8612992.jpeg?auto=compress&cs=tinysrgb&w=800',
    amount_raised: 892340,
    goal_amount: 1000000,
    creator_name: 'Healthcare Heroes',
    category: 'Helping People'
  }
];

export default function SearchPage({
  onNavigateHome,
  onNavigateToAuth,
  onNavigateToDashboard,
  onNavigateToFundraise,
  onNavigateToCategory,
  onNavigateToCreator,
  onNavigateToProfile
}: SearchPageProps) {
  const [activeTab, setActiveTab] = useState<'trending' | 'near-you'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>(mockFundraisers);

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-[#FBF7F4]">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 z-50">
          <Header
            onNavigateToAuth={onNavigateToAuth}
            onNavigateToCategory={onNavigateToCategory}
            onNavigateToDashboard={onNavigateToDashboard}
            onNavigateToFundraise={onNavigateToFundraise}
            onNavigateHome={onNavigateHome}
            onNavigateToProfile={onNavigateToProfile}
          />
        </div>

        <div className="pt-32 pb-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Find fundraisers</h1>
            <p className="text-xl text-gray-600 mb-8">
              Find fundraisers by person's name, location, title, or keyword
            </p>

            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 text-base bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-6 py-2.5 rounded-full font-semibold text-base transition-all ${
              activeTab === 'trending'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Trending
          </button>
          <button
            onClick={() => setActiveTab('near-you')}
            className={`px-6 py-2.5 rounded-full font-semibold text-base transition-all ${
              activeTab === 'near-you'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Near you
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:row-span-2 group cursor-pointer" onClick={() => {}}>
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4">
              <img
                src={fundraisers[0].image_url}
                alt={fundraisers[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
              {fundraisers[0].title}
            </h3>
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#02A95C] h-full rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(fundraisers[0].amount_raised, fundraisers[0].goal_amount)}%` }}
                />
              </div>
              <p className="text-base font-bold text-gray-900">
                {formatAmount(fundraisers[0].amount_raised)} raised
              </p>
            </div>
          </div>

          {fundraisers.slice(1).map((fundraiser, index) => (
            <div
              key={fundraiser.id}
              className="group cursor-pointer"
              onClick={() => {}}
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
                <img
                  src={fundraiser.image_url}
                  alt={fundraiser.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2.5 line-clamp-2">
                {fundraiser.title}
              </h3>
              <div className="space-y-1.5">
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#02A95C] h-full rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(fundraiser.amount_raised, fundraiser.goal_amount)}%` }}
                  />
                </div>
                <p className="text-base font-bold text-gray-900">
                  {formatAmount(fundraiser.amount_raised)} raised
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
