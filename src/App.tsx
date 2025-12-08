import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import NewsSection from './components/NewsSection';
import FeaturedCreators from './components/FeaturedCreators';
import RecurringSupport from './components/RecurringSupport';
import OneTimeSupport from './components/OneTimeSupport';
import HowItWorks from './components/HowItWorks';
import ImpactSection from './components/ImpactSection';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import ClaimYourPage from './components/ClaimYourPage';
import AuthPage from './pages/AuthPage';
import CategoryPage from './pages/CategoryPage';
import CreatorProfilePage from './pages/CreatorProfilePage';
import CreatorDashboard from './pages/CreatorDashboard';
import ExplorePage from './pages/ExplorePage';
import SearchPage from './pages/SearchPage';
import MembershipPage from './pages/MembershipPage';
import PostsPage from './pages/PostsPage';
import ShopPage from './pages/ShopPage';
import ProfileSetupPage from './pages/ProfileSetupPage';

type Page =
  | { type: 'home' }
  | { type: 'auth' }
  | { type: 'fundraise' }
  | { type: 'explore' }
  | { type: 'search' }
  | { type: 'category'; category: string; subcategory?: string }
  | { type: 'creator'; creatorId: string }
  | { type: 'dashboard' }
  | { type: 'profile-setup' }
  | { type: 'membership'; creatorId: string; creatorName: string; creatorAvatar: string; creatorPageId: string }
  | { type: 'posts'; creatorId: string; creatorName: string; creatorAvatar: string; creatorPageId: string }
  | { type: 'shop'; creatorId: string; creatorName: string; creatorAvatar: string; creatorPageId: string };

function App() {
  const [currentPage, setCurrentPage] = useState<Page>({ type: 'home' });

  const navigateToHome = () => setCurrentPage({ type: 'home' });
  const navigateToAuth = () => setCurrentPage({ type: 'auth' });
  const navigateToFundraise = () => setCurrentPage({ type: 'fundraise' });
  const navigateToExplore = () => setCurrentPage({ type: 'explore' });
  const navigateToSearch = () => setCurrentPage({ type: 'search' });
  const navigateToDashboard = () => setCurrentPage({ type: 'dashboard' });
  const navigateToProfileSetup = () => setCurrentPage({ type: 'profile-setup' });
  const navigateToCategory = (category: string, subcategory?: string) => {
    setCurrentPage({ type: 'category', category, subcategory });
  };
  const navigateToCreator = (creatorId: string) => {
    setCurrentPage({ type: 'creator', creatorId });
  };
  const navigateToProfile = () => {
    console.log('Navigate to profile - implementation needed');
  };
  const navigateToMembership = (creatorId: string, creatorName: string, creatorAvatar: string = '', creatorPageId: string = '') => {
    setCurrentPage({ type: 'membership', creatorId, creatorName, creatorAvatar, creatorPageId });
  };
  const navigateToPosts = (creatorId: string, creatorName: string, creatorAvatar: string = '', creatorPageId: string = '') => {
    setCurrentPage({ type: 'posts', creatorId, creatorName, creatorAvatar, creatorPageId });
  };
  const navigateToShop = (creatorPageId: string, creatorName: string, creatorAvatar: string = '', creatorId: string = '') => {
    setCurrentPage({ type: 'shop', creatorId, creatorName, creatorAvatar, creatorPageId });
  };

  return (
    <AuthProvider>
      {currentPage.type === 'auth' ? (
        <AuthPage onNavigateToDashboard={navigateToProfileSetup} />
      ) : currentPage.type === 'profile-setup' ? (
        <ProfileSetupPage onComplete={navigateToDashboard} onNavigateHome={navigateToHome} />
      ) : currentPage.type === 'fundraise' ? (
        <div className="min-h-screen bg-white">
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 z-50">
              <Header
                onNavigateToAuth={navigateToAuth}
                onNavigateToCategory={navigateToCategory}
                onNavigateToDashboard={navigateToDashboard}
                onNavigateToFundraise={navigateToFundraise}
                onNavigateHome={navigateToHome}
                onNavigateToProfile={navigateToProfile}
                onNavigateToSearch={navigateToSearch}
              />
            </div>
            <div className="pt-24">
              <NewsSection />
            </div>
          </div>
          <Footer />
        </div>
      ) : currentPage.type === 'dashboard' ? (
        <CreatorDashboard
          onNavigateToCreator={navigateToCreator}
          onNavigateHome={navigateToHome}
          onNavigateToAuth={navigateToAuth}
          onNavigateToCategory={navigateToCategory}
          onNavigateToDashboard={navigateToDashboard}
          onNavigateToFundraise={navigateToFundraise}
        />
      ) : currentPage.type === 'explore' ? (
        <ExplorePage
          onNavigateHome={navigateToHome}
          onNavigateToAuth={navigateToAuth}
          onNavigateToDashboard={navigateToDashboard}
          onNavigateToFundraise={navigateToFundraise}
          onNavigateToCategory={navigateToCategory}
          onNavigateToCreator={navigateToCreator}
        />
      ) : currentPage.type === 'search' ? (
        <SearchPage
          onNavigateHome={navigateToHome}
          onNavigateToAuth={navigateToAuth}
          onNavigateToDashboard={navigateToDashboard}
          onNavigateToFundraise={navigateToFundraise}
          onNavigateToCategory={navigateToCategory}
          onNavigateToCreator={navigateToCreator}
          onNavigateToProfile={navigateToProfile}
        />
      ) : currentPage.type === 'category' ? (
        <CategoryPage
          category={currentPage.category}
          subcategory={currentPage.subcategory}
          onNavigateToCreator={navigateToCreator}
          onNavigateHome={navigateToHome}
          onNavigateToAuth={navigateToAuth}
          onNavigateToDashboard={navigateToDashboard}
          onNavigateToFundraise={navigateToFundraise}
          onNavigateToCategory={navigateToCategory}
        />
      ) : currentPage.type === 'creator' ? (
        <CreatorProfilePage
          creatorId={currentPage.creatorId}
          onNavigateBack={navigateToHome}
          onNavigateToAuth={navigateToAuth}
          onNavigateToDashboard={navigateToDashboard}
          onNavigateToMembership={navigateToMembership}
          onNavigateToPosts={navigateToPosts}
          onNavigateToShop={navigateToShop}
        />
      ) : currentPage.type === 'membership' ? (
        <MembershipPage
          creatorId={currentPage.creatorId}
          creatorName={currentPage.creatorName}
          creatorAvatar={currentPage.creatorAvatar}
          onNavigateToCreatorHome={() => navigateToCreator(currentPage.creatorId)}
          onNavigateToPosts={(cId, cName, cAvatar) => navigateToPosts(cId, cName, cAvatar, currentPage.creatorPageId)}
          onNavigateToShop={(cpId, cName) => navigateToShop(cpId, cName, currentPage.creatorAvatar, currentPage.creatorId)}
          onNavigateHome={navigateToHome}
          onNavigateToAuth={navigateToAuth}
          onNavigateToDashboard={navigateToDashboard}
        />
      ) : currentPage.type === 'posts' ? (
        <PostsPage
          creatorId={currentPage.creatorId}
          creatorName={currentPage.creatorName}
          creatorAvatar={currentPage.creatorAvatar}
          onNavigateToCreatorHome={() => navigateToCreator(currentPage.creatorId)}
          onNavigateToMembership={(cId, cName) => navigateToMembership(cId, cName, currentPage.creatorAvatar, currentPage.creatorPageId)}
          onNavigateToShop={(cpId, cName) => navigateToShop(cpId, cName, currentPage.creatorAvatar, currentPage.creatorId)}
          onNavigateHome={navigateToHome}
          onNavigateToAuth={navigateToAuth}
          onNavigateToDashboard={navigateToDashboard}
        />
      ) : currentPage.type === 'shop' ? (
        <ShopPage
          creatorId={currentPage.creatorPageId}
          creatorName={currentPage.creatorName}
          creatorAvatar={currentPage.creatorAvatar}
          onNavigateToCreatorHome={() => navigateToCreator(currentPage.creatorId)}
          onNavigateToMembership={(cId, cName) => navigateToMembership(cId, cName, currentPage.creatorAvatar, currentPage.creatorPageId)}
          onNavigateToPosts={(cId, cName, cAvatar) => navigateToPosts(cId, cName, cAvatar, currentPage.creatorPageId)}
          onNavigateHome={navigateToHome}
          onNavigateToAuth={navigateToAuth}
          onNavigateToDashboard={navigateToDashboard}
        />
      ) : (
        <div className="min-h-screen bg-white">
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 z-50">
              <Header
                onNavigateToAuth={navigateToAuth}
                onNavigateToCategory={navigateToCategory}
                onNavigateToDashboard={navigateToDashboard}
                onNavigateToFundraise={navigateToFundraise}
                onNavigateHome={undefined}
                onNavigateToProfile={navigateToProfile}
                onNavigateToSearch={navigateToSearch}
              />
            </div>
            <Hero onNavigateToAuth={navigateToAuth} onNavigateToExplore={navigateToExplore} onNavigateToDashboard={navigateToProfileSetup} />
          </div>
          <FeaturedCreators onNavigateToCreator={navigateToCreator} onNavigateToExplore={navigateToExplore} />
          <ClaimYourPage onNavigateToAuth={navigateToAuth} onNavigateToProfileSetup={navigateToProfileSetup} />
          <RecurringSupport />
          <OneTimeSupport />
          <HowItWorks />
          <NewsSection />
          <ImpactSection />
          <Pricing onNavigateToAuth={navigateToAuth} />
          <Footer />
        </div>
      )}
    </AuthProvider>
  );
}

export default App;
