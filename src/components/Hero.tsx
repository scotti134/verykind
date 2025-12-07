import { ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeroProps {
  onNavigateToAuth: () => void;
  onNavigateToExplore: () => void;
  onNavigateToDashboard: () => void;
}

export default function Hero({ onNavigateToAuth, onNavigateToExplore, onNavigateToDashboard }: HeroProps) {
  const { user } = useAuth();

  const handleStartPage = () => {
    onNavigateToDashboard();
  };
  return (
    <div className="relative h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="People making a difference"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
          Support people
          <br />
          doing good
        </h1>
        <p className="text-xl sm:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
          Fund their work, support their mission, and help them create positive change in the world.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleStartPage}
            className="px-8 py-3.5 bg-[#E07855] text-white rounded-full font-medium text-base hover:bg-[#D06845] transition-colors shadow-lg border-2 border-transparent whitespace-nowrap flex items-center gap-3"
          >
            Start your FREE Page
            <span className="bg-white/20 rounded-full p-1.5 flex items-center justify-center">
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
          <button
            onClick={onNavigateToExplore}
            className="px-8 py-3.5 bg-transparent border-2 border-white text-white rounded-full font-medium text-base hover:bg-white/10 transition-colors whitespace-nowrap"
          >
            Find Good People
          </button>
        </div>
      </div>
    </div>
  );
}
