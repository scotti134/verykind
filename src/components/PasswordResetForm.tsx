import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface PasswordResetFormProps {
  onCancel: () => void;
}

export default function PasswordResetForm({ onCancel }: PasswordResetFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="absolute top-8 left-8">
          <a href="/" className="text-2xl font-bold text-gray-900">
            VK
          </a>
        </div>

        <div className="max-w-lg mx-auto pt-24">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Check your email</h1>
            <p className="text-gray-700 text-base">
              We've sent a password reset link to <strong>{email}</strong>. Click the link in the email to reset your password.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <button
              onClick={onCancel}
              className="w-full bg-[#C97132] text-white py-3.5 text-base rounded-full font-semibold hover:bg-[#B5651F] transition-all"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="absolute top-8 left-8">
        <a href="/" className="text-2xl font-bold text-gray-900">
          VK
        </a>
      </div>

      <div className="max-w-lg mx-auto pt-24">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Sign in without a password</h1>
          <p className="text-gray-700 text-base">
            Please enter the email address you use on Verykind.org
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSendCode} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C97132] text-white py-3.5 text-base rounded-full font-semibold hover:bg-[#B5651F] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Code'}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-white text-gray-900 py-3.5 text-base rounded-full font-semibold border border-gray-300 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700">
              Prefer to use a password?{' '}
              <button
                onClick={onCancel}
                className="text-gray-900 font-semibold hover:underline"
              >
                Reset My Password
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
