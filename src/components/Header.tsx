import { Heart, Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserProfileDropdown from './UserProfileDropdown';

const categories = [
  {
    name: 'Helping People',
    description: 'Making life better for humans',
    subcategories: [
      'Community Care',
      'Health & Wellness',
      'Education & Mentorship',
      'Equality & Inclusion',
      'Kind Acts & Mutual Aid',
      'Veterans'
    ]
  },
  {
    name: 'Helping Animals',
    description: 'Improving animal welfare',
    subcategories: [
      'Animal Rescue & Shelters',
      'Wildlife Protection',
      'Farm Animal Sanctuaries',
      'Veterinary Help & Medical Funds',
      'Adoption & Fostering Programs'
    ]
  },
  {
    name: 'Helping the Planet',
    description: 'Sustainability and climate action',
    subcategories: [
      'Reforestation & Conservation',
      'Ocean & Water Protection',
      'Zero-Waste & Recycling',
      'Clean Energy & Innovation',
      'Sustainable Agriculture'
    ]
  },
  {
    name: 'Universal',
    description: 'Explore by theme',
    subcategories: [
      'Innovators & Creators',
      'Nonprofits & Organizations',
      'Everyday Heroes',
      'Emergency Causes',
      'Education & Awareness',
      'Volunteers & Field Workers'
    ]
  }
];

interface HeaderProps {
  onNavigateToAuth: () => void;
  onNavigateToCategory: (category: string, subcategory?: string) => void;
  onNavigateToDashboard: () => void;
  onNavigateToFundraise?: () => void;
  onNavigateHome?: () => void;
  onNavigateToProfile?: () => void;
}

export default function Header({ onNavigateToAuth, onNavigateToCategory, onNavigateToDashboard, onNavigateToFundraise, onNavigateHome, onNavigateToProfile }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="w-full">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-1 flex justify-start items-center space-x-4 relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-4 py-2 text-white hover:text-emerald-300 transition-all font-medium text-base rounded-full flex items-center space-x-1"
            >
              <span>Find Good</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {onNavigateToFundraise && (
              <button
                onClick={onNavigateToFundraise}
                className="px-4 py-2 text-white hover:text-emerald-300 transition-all font-medium text-base rounded-full flex items-center space-x-1"
              >
                <span>Fundraise</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            )}

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-screen max-w-6xl bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="grid grid-cols-4 gap-0">
                  {categories.map((category, index) => {
                    const categorySlug = category.name.toLowerCase().replace('helping ', '').replace(' ', '-');
                    return (
                      <div
                        key={category.name}
                        className="p-6 hover:bg-gray-50 transition-colors border-r last:border-r-0 border-gray-200"
                      >
                        <div className="mb-4 cursor-pointer" onClick={() => {
                          onNavigateToCategory(categorySlug);
                          setIsDropdownOpen(false);
                        }}>
                          <h3 className="text-gray-900 font-bold text-base mb-1 hover:text-emerald-600 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-gray-500 text-xs italic">{category.description}</p>
                        </div>
                        <ul className="space-y-2">
                          {category.subcategories.map((subcategory, idx) => (
                            <li key={idx}>
                              <button
                                onClick={() => {
                                  onNavigateToCategory(categorySlug, subcategory);
                                  setIsDropdownOpen(false);
                                }}
                                className="text-gray-700 text-sm hover:text-emerald-600 transition-colors block text-left w-full"
                              >
                                {subcategory}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 flex justify-center relative z-10">
            {onNavigateHome ? (
              <button
                onClick={onNavigateHome}
                className="text-5xl font-bold text-white hover:text-yellow-400 transition-colors cursor-pointer relative z-10"
              >
                Very Kind
              </button>
            ) : (
              <span className="text-5xl font-bold text-white">Very Kind</span>
            )}
          </div>

          <div className="flex-1 flex justify-end items-center space-x-6">
            <div className="relative">
              <button
                onClick={() => setIsAboutOpen(!isAboutOpen)}
                className="text-white hover:text-emerald-300 transition-colors text-base font-medium flex items-center space-x-1"
              >
                <span>About</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isAboutOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2">
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm">
                    About Us
                  </button>
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm">
                    How It Works
                  </button>
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm">
                    Contact
                  </button>
                </div>
              )}
            </div>
            {isSearchOpen ? (
              <div className="flex items-center space-x-2 h-10">
                <input
                  type="text"
                  placeholder="Search..."
                  autoFocus
                  className="h-10 px-4 py-2 border-2 border-white bg-transparent text-white placeholder-white/70 rounded-full focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 transition-all font-medium text-base"
                  onBlur={() => setIsSearchOpen(false)}
                />
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white hover:text-emerald-300 transition-colors text-base font-medium flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            )}
            <button
              onClick={onNavigateToAuth}
              className="px-4 py-2 border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all font-medium text-base rounded-full whitespace-nowrap"
            >
              Start a Page
            </button>
            {user ? (
              <UserProfileDropdown
                onNavigateToDashboard={onNavigateToDashboard}
                onNavigateToProfile={onNavigateToProfile || (() => {})}
                onLogout={signOut}
              />
            ) : (
              <button
                onClick={onNavigateToAuth}
                className="text-white hover:text-emerald-300 transition-colors text-base font-medium whitespace-nowrap"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
