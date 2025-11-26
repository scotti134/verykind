import { useState, useEffect, useRef } from 'react';
import { Bell, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileDropdownProps {
  onNavigateToDashboard: () => void;
  onNavigateToProfile: () => void;
  onLogout: () => void;
}

export default function UserProfileDropdown({
  onNavigateToDashboard,
  onNavigateToProfile,
  onLogout
}: UserProfileDropdownProps) {
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!user) return null;

  const profileImageUrl = profile?.avatar_url || 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop';

  return (
    <div className="flex items-center gap-3" ref={dropdownRef}>
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
        <Bell className="w-5 h-5 text-gray-600" />
      </button>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
          <img
            src={profileImageUrl}
            alt={profile?.display_name || 'User'}
            className="w-8 h-8 rounded-full object-cover"
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <button
              onClick={() => {
                onNavigateToProfile();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
            >
              View my page
            </button>

            <button
              onClick={() => {
                onNavigateToDashboard();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Dashboard
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              My account
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Refer a creator
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              What's New
            </button>

            <div className="border-t border-gray-200 my-2"></div>

            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
