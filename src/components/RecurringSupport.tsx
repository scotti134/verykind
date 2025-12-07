import { Sprout, Heart, Globe, DollarSign } from 'lucide-react';

export default function RecurringSupport() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">
            RECURRING SUPPORT
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Build sustainable support
            <br />
            with recurring memberships
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Share exclusive updates from your work, connect directly with supporters, and give them a way to be part of the positive change you're creating.
          </p>
        </div>

        <div className="flex justify-center items-stretch gap-6 flex-wrap">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 w-80 flex flex-col">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Sprout className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Friend</h3>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              </div>
            </div>
            <div className="mb-6 flex-grow">
              <p className="text-3xl font-bold text-gray-900 mb-2">428</p>
              <p className="text-sm text-gray-500 mb-4">Active members</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Weekly impact updates</li>
                <li>• Community posts access</li>
                <li>• Early news updates</li>
              </ul>
            </div>
            <button className="w-full bg-[#C97132] text-white rounded-full py-3 font-semibold hover:bg-[#B5651F] transition-colors mt-auto">
              Become a Friend
            </button>
          </div>

          <div className="bg-blue-50 rounded-2xl p-8 shadow-sm border-2 border-blue-300 w-80 flex flex-col">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Supporter</h3>
            <p className="text-sm text-gray-600 mb-6">$15/month</p>
            <div className="mb-6 flex-grow">
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Everything in Friend</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Monthly video updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Direct message access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Supporter badge</span>
                </li>
              </ul>
            </div>
            <button className="w-full bg-[#C97132] text-white rounded-full py-3 font-semibold hover:bg-[#B5651F] transition-colors mt-auto">
              Become a Supporter
            </button>
          </div>

          <div className="bg-yellow-50 rounded-2xl p-8 shadow-sm border border-yellow-200 w-80 flex flex-col">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Champion</h3>
            <p className="text-sm text-gray-600 mb-6">$50/month</p>
            <div className="mb-6 flex-grow">
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Everything in Supporter</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Quarterly video calls</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Name in credits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Impact certificates</span>
                </li>
              </ul>
            </div>
            <button className="w-full bg-[#C97132] text-white rounded-full py-3 font-semibold hover:bg-[#B5651F] transition-colors mt-auto">
              Become a Champion
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
