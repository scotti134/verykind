import { Check, ArrowRight } from 'lucide-react';

interface PricingProps {
  onNavigateToAuth: () => void;
}

export default function Pricing({ onNavigateToAuth }: PricingProps) {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We only succeed when you succeed. Keep more of what you earn.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-12">
              <div className="text-center mb-8">
                <div className="inline-block px-4 py-2 bg-[#F5E6D3] text-gray-900 rounded-full font-semibold mb-4">
                  Creator Plan
                </div>
                <div className="flex items-baseline justify-center space-x-2 mb-4">
                  <span className="text-6xl font-bold text-gray-900">5%</span>
                  <span className="text-2xl text-gray-600">platform fee</span>
                </div>
                <p className="text-gray-600">+ payment processing fees</p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  'Unlimited supporters',
                  'Custom creator page',
                  'One-time and recurring donations',
                  'Thank you messages',
                  'Supporter wall',
                  'Analytics and insights',
                  'Mobile-friendly dashboard',
                  'Email support'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#C97132] rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={onNavigateToAuth}
                  className="w-full sm:w-auto px-12 py-4 bg-[#E07855] text-white text-lg font-semibold rounded-full hover:bg-[#D06845] transition-all transform hover:scale-105 shadow-lg inline-flex items-center justify-center gap-2"
                >
                  Start your FREE Page
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-gray-500 mt-4 text-sm">
                  No monthly fees. No setup costs. Start earning from day one.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 text-lg">
              For supporters: Donating is always free. 100% of your donation goes to the creator (minus standard payment processing fees).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
