import { Heart, MoreHorizontal } from 'lucide-react';
import UserProfileDropdown from './UserProfileDropdown';

interface CreatorNavigationBarProps {
  creatorName: string;
  creatorAvatar?: string;
  supporterCount?: number;
  showSupporterCount?: boolean;
  activeTab: 'home' | 'membership' | 'posts' | 'shop';
  onNavigateToHome: () => void;
  onNavigateToMembership: () => void;
  onNavigateToPosts: () => void;
  onNavigateToShop: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToAuth: () => void;
}

export default function CreatorNavigationBar({
  creatorName,
  creatorAvatar,
  supporterCount = 0,
  showSupporterCount = false,
  activeTab,
  onNavigateToHome,
  onNavigateToMembership,
  onNavigateToPosts,
  onNavigateToShop,
  onNavigateToDashboard,
  onNavigateToAuth
}: CreatorNavigationBarProps) {
  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={onNavigateToHome} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            {creatorAvatar ? (
              <img
                src={creatorAvatar}
                alt={creatorName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-gray-400" />
              </div>
            )}
            <div className="text-left">
              <h1 className="font-bold text-gray-900">{creatorName}</h1>
              {showSupporterCount && (
                <p className="text-sm text-gray-600">{supporterCount.toLocaleString()} supporters</p>
              )}
            </div>
          </button>
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
              onClick={onNavigateToHome}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'home'
                  ? 'border-red-400 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={onNavigateToMembership}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'membership'
                  ? 'border-red-400 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Membership
            </button>
            <button
              onClick={onNavigateToPosts}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'posts'
                  ? 'border-red-400 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Posts
            </button>
            <button
              onClick={onNavigateToShop}
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
    </>
  );
}
