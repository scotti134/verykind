import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Heart, MessageCircle, MoreHorizontal, Lock } from 'lucide-react';
import CreatorNavigationBar from '../components/CreatorNavigationBar';
import Footer from '../components/Footer';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  is_member_only: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface PostsPageProps {
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  onNavigateToCreatorHome: () => void;
  onNavigateToMembership: (creatorId: string, creatorName: string) => void;
  onNavigateToShop: (creatorPageId: string, creatorName: string) => void;
  onNavigateHome: () => void;
  onNavigateToAuth: () => void;
  onNavigateToDashboard: () => void;
}

export default function PostsPage({
  creatorId,
  creatorName,
  creatorAvatar,
  onNavigateToCreatorHome,
  onNavigateToMembership,
  onNavigateToShop,
  onNavigateHome,
  onNavigateToAuth,
  onNavigateToDashboard
}: PostsPageProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [creatorId]);

  const loadPosts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });

    if (data && !error) {
      setPosts(data);
    }

    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 30) return `${diffInDays} days ago`;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
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
        activeTab="posts"
        onNavigateToHome={onNavigateToCreatorHome}
        onNavigateToMembership={() => onNavigateToMembership(creatorId, creatorName)}
        onNavigateToPosts={() => {}}
        onNavigateToShop={() => onNavigateToShop(creatorId, creatorName)}
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToAuth={onNavigateToAuth}
      />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {posts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No posts yet
                  </h3>
                  <p className="text-gray-600">
                    This creator hasn't published any posts yet.
                  </p>
                </div>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">
                          {formatDate(post.created_at)}
                        </span>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>

                      {post.image_url && (
                        <div className="mb-6 rounded-xl overflow-hidden bg-yellow-50">
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-80 object-cover"
                          />
                        </div>
                      )}

                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {post.title}
                        {post.is_member_only && (
                          <Lock className="inline-block w-5 h-5 ml-2 text-yellow-500" />
                        )}
                      </h2>

                      {post.excerpt && (
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}

                      <button className="text-gray-900 font-medium hover:text-gray-700 transition-colors mb-6">
                        Read more
                      </button>

                      <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                          <Heart className="w-5 h-5" />
                          <span className="text-sm font-medium">{post.likes_count}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">{post.comments_count}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Latest posts</h3>
                <div className="space-y-4">
                  {posts.slice(0, 10).map((post) => (
                    <button
                      key={post.id}
                      className="flex gap-3 w-full text-left hover:bg-gray-50 rounded-lg p-2 transition-colors"
                    >
                      {post.image_url && (
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {formatDate(post.created_at)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                {posts.length > 10 && (
                  <button className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                    See all
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
