import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Heart, Handshake } from 'lucide-react';

export default function NewsSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 leading-tight">
          Good news, kindness stories,
          <br />
          and uplifting content
        </h2>

        {/* First Story - Full Width with Image */}
        <div className="bg-[#F5F1EA] rounded-xl overflow-hidden mb-4">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src="https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="A simple hug makes a difference"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                A simple hug makes a difference
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Discover the beautiful story of a woman who brightened someone's day with the power of a hug.
              </p>
              <div>
                <button className="px-6 py-2.5 bg-[#C97132] text-white rounded-md hover:bg-[#B5651F] transition-all font-medium text-sm">
                  Read more
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Second Story - Good news roundup */}
        <div className="bg-[#F5F1EA] rounded-xl p-8 mb-4">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-[#FFF9E6] rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-[#C97132]" fill="#C97132" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Good news roundup
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                From a generous donation to a community effort, here are some feel-good stories for you.
              </p>
              <button className="px-6 py-2.5 bg-[#C97132] text-white rounded-md hover:bg-[#B5651F] transition-all font-medium text-sm">
                Read more
              </button>
            </div>
          </div>
        </div>

        {/* Third Story - Small acts of kindness */}
        <div className="bg-[#F5F1EA] rounded-xl p-8 mb-12">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-[#FFF9E6] rounded-full flex items-center justify-center">
              <Handshake className="w-8 h-8 text-[#C97132]" />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Small acts of kindness
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Learn about easy ways to spread kindness in your everyday life.
                </p>
                <button className="px-6 py-2.5 bg-[#C97132] text-white rounded-md hover:bg-[#B5651F] transition-all font-medium text-sm">
                  Read more
                </button>
              </div>
              <button className="ml-4 px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-all font-medium text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-[#FFF9E6] rounded-xl p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Get Good News in Your Inbox
            </h3>
            <p className="text-gray-700">
              Subscribe to receive uplifting stories, kindness inspiration, and positive updates.
            </p>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setStatus('loading');
              setMessage('');

              try {
                const { error } = await supabase
                  .from('newsletter_signups')
                  .insert([{ email, source: 'news_section' }]);

                if (error) {
                  if (error.code === '23505') {
                    setMessage('This email is already subscribed!');
                    setStatus('error');
                  } else {
                    throw error;
                  }
                } else {
                  setMessage('Thank you for subscribing! Check your inbox for updates.');
                  setStatus('success');
                  setEmail('');
                }
              } catch (error) {
                console.error('Newsletter signup error:', error);
                setMessage('Something went wrong. Please try again.');
                setStatus('error');
              }
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === 'loading'}
              className="flex-1 px-5 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#C97132] text-gray-900 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-3 bg-[#C97132] text-white rounded-lg hover:bg-[#B5651F] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          {message && (
            <div
              className={`mt-4 text-sm font-medium ${
                status === 'success' ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
