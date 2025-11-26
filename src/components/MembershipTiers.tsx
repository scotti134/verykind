import { Mail, Gift, Globe } from 'lucide-react';

export default function MembershipTiers() {
  return (
    <section className="py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">
            MEMBERSHIPS
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Create memberships for
            <br />
            your biggest supporters
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Build sustainable support with recurring memberships. Share exclusive updates from your work, connect directly with supporters, and give them a way to be part of the positive change you're creating.
          </p>
        </div>

        <div className="flex justify-center items-center gap-6 flex-wrap">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 w-72">
            <div className="bg-orange-50 rounded-xl p-8 mb-4 flex items-center justify-center">
              <Mail className="w-16 h-16 text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1 text-center">Friend</h3>
            <p className="text-sm text-gray-600 mb-4 text-center">$5/month</p>
            <ul className="space-y-2 text-sm text-gray-700 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Weekly impact updates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Community posts access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Support their mission</span>
              </li>
            </ul>
            <button className="w-full bg-[#C97132] text-white rounded-full py-3 font-semibold hover:bg-[#B5651F] transition-colors">
              Join
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-500 w-72 transform scale-105">
            <div className="bg-blue-50 rounded-xl p-8 mb-4 flex items-center justify-center">
              <Gift className="w-16 h-16 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1 text-center">Supporter</h3>
            <p className="text-sm text-gray-600 mb-4 text-center">$15/month</p>
            <ul className="space-y-2 text-sm text-gray-700 mb-6">
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
            </ul>
            <button className="w-full bg-[#C97132] text-white rounded-full py-3 font-semibold hover:bg-[#B5651F] transition-colors">
              Join
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 w-72">
            <div className="bg-green-50 rounded-xl p-8 mb-4 flex items-center justify-center">
              <Globe className="w-16 h-16 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1 text-center">Champion</h3>
            <p className="text-sm text-gray-600 mb-4 text-center">$50/month</p>
            <ul className="space-y-2 text-sm text-gray-700 mb-6">
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
                <span>Impact certificates</span>
              </li>
            </ul>
            <button className="w-full bg-[#C97132] text-white rounded-full py-3 font-semibold hover:bg-[#B5651F] transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
