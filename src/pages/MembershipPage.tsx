import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Check } from 'lucide-react';
import CreatorNavigationBar from '../components/CreatorNavigationBar';
import Footer from '../components/Footer';

interface MembershipTier {
  id: string;
  name: string;
  description: string;
  price: number;
  benefits: string[];
  member_count: number;
}

interface MembershipPageProps {
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  onNavigateToCreatorHome: () => void;
  onNavigateToPosts: (creatorId: string, creatorName: string, creatorAvatar: string) => void;
  onNavigateToShop: (creatorPageId: string, creatorName: string) => void;
  onNavigateHome: () => void;
  onNavigateToAuth: () => void;
  onNavigateToDashboard: () => void;
}

export default function MembershipPage({
  creatorId,
  creatorName,
  creatorAvatar,
  onNavigateToCreatorHome,
  onNavigateToPosts,
  onNavigateToShop,
  onNavigateHome,
  onNavigateToAuth,
  onNavigateToDashboard
}: MembershipPageProps) {
  const { user } = useAuth();
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembershipTiers();
  }, [creatorId]);

  const loadMembershipTiers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('membership_tiers')
      .select('*')
      .eq('creator_id', creatorId)
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (data && !error) {
      setTiers(data.map(tier => ({
        ...tier,
        benefits: Array.isArray(tier.benefits) ? tier.benefits : []
      })));
    }

    setLoading(false);
  };

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
        activeTab="membership"
        onNavigateToHome={onNavigateToCreatorHome}
        onNavigateToMembership={() => {}}
        onNavigateToPosts={() => onNavigateToPosts(creatorId, creatorName, creatorAvatar || '')}
        onNavigateToShop={() => onNavigateToShop(creatorId, creatorName)}
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToAuth={onNavigateToAuth}
      />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Support {creatorName}
            </h1>
            <p className="text-xl text-gray-600">
              Choose a membership tier and get exclusive benefits
            </p>
          </div>

          {tiers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No membership tiers available yet
              </h3>
              <p className="text-gray-600">
                This creator hasn't set up membership tiers yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="bg-white rounded-2xl border-2 border-gray-200 hover:border-yellow-400 transition-all p-8 flex flex-col"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${tier.price}
                    </span>
                    <span className="text-gray-600 ml-2">/ month</span>
                  </div>
                  {tier.description && (
                    <p className="text-gray-600 mb-6">{tier.description}</p>
                  )}
                  <div className="flex-1 mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                      Benefits
                    </h4>
                    <ul className="space-y-3">
                      {tier.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    {tier.member_count} {tier.member_count === 1 ? 'member' : 'members'}
                  </div>
                  <button className="w-full py-4 px-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl transition-colors">
                    Select tier
                  </button>
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
