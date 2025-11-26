import { useAuth } from '../contexts/AuthContext';

interface ClaimYourPageProps {
  onNavigateToAuth: () => void;
  onNavigateToProfileSetup: () => void;
}

export default function ClaimYourPage({ onNavigateToAuth, onNavigateToProfileSetup }: ClaimYourPageProps) {
  const { user } = useAuth();

  const handleClaim = () => {
    if (user) {
      onNavigateToProfileSetup();
    } else {
      onNavigateToAuth();
    }
  };
  return (
    <section className="py-20 bg-[#B8D4F1]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
            Get Support
            <br />
            Doing What You Love
          </h2>
        </div>

        <div className="bg-white rounded-full shadow-lg p-4 flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center gap-2 px-4">
            <span className="text-gray-900 text-lg font-medium">Verykind.org/</span>
            <span className="text-gray-400 text-lg">MyPage</span>
          </div>
          <button
            onClick={handleClaim}
            className="bg-gray-900 text-white px-12 py-4 rounded-full text-xl font-bold hover:bg-gray-800 transition-colors"
          >
            Claim
          </button>
        </div>
      </div>
    </section>
  );
}
