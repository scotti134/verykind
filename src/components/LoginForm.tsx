import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Eye } from 'lucide-react';

interface LoginFormProps {
  onSwitchToSignUp: () => void;
  onSwitchToPasswordReset?: () => void;
  onSuccess?: () => void;
}

export default function LoginForm({ onSwitchToSignUp, onSwitchToPasswordReset, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleOAuthLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      setError('');
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setError(error.message || `Failed to sign in with ${provider}`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      setError(error.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="absolute top-8 left-8">
        <a href="/" className="text-2xl font-bold text-gray-900">
          VK
        </a>
      </div>
      <div className="absolute top-8 right-8">
        <a href="#help" className="text-gray-900 text-base font-medium hover:underline">
          Help
        </a>
      </div>

      <div className="max-w-lg mx-auto pt-12">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Sign in</h1>
          <p className="text-gray-700 text-base">
            Choose an option below to sign in. Don't have an account?{' '}
            <button
              onClick={onSwitchToSignUp}
              className="text-gray-900 font-semibold hover:underline"
            >
              Create a free account
            </button>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              className="w-full flex items-center justify-between px-5 py-3.5 bg-[#F5F3EF] border border-gray-300 rounded-lg hover:bg-[#EBE8E3] transition-all text-gray-900 text-base font-medium"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </div>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin('facebook')}
              className="w-full flex items-center justify-between px-5 py-3.5 bg-[#F5F3EF] border border-gray-300 rounded-lg hover:bg-[#EBE8E3] transition-all text-gray-900 text-base font-medium"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Sign in with Facebook
              </div>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">Or sign in with your Verykind.org account</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 pr-10 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={onSwitchToPasswordReset}
                  className="text-sm text-gray-900 font-semibold hover:underline"
                >
                  Forgot your password? Email me a one-time code
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C97132] text-white py-3.5 text-base rounded-full font-semibold hover:bg-[#B5651F] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
