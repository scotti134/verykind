import { Smile, Lightbulb, Heart, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: Smile,
    title: 'Create Your Page',
    description: 'Set up your page in minutes and share your story with the world.',
    color: 'bg-amber-100',
    iconColor: 'text-amber-600'
  },
  {
    icon: Lightbulb,
    title: 'Share Your Mission',
    description: 'Tell people about the good work you\'re doing and why it matters.',
    color: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
  {
    icon: Heart,
    title: 'Receive Support',
    description: 'Get one-time or recurring donations from people who believe in your cause.',
    color: 'bg-rose-100',
    iconColor: 'text-rose-600'
  },
  {
    icon: Sparkles,
    title: 'Make Impact',
    description: 'Use the support to create positive change and share your progress.',
    color: 'bg-emerald-100',
    iconColor: 'text-emerald-600'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 max-w-xl">
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              How Very Kind Works
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Simple steps to start making a difference
            </p>

            <div className="space-y-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-14 h-14 ${step.color} rounded-full flex items-center justify-center`}>
                      <Icon className={`w-7 h-7 ${step.iconColor}`} strokeWidth={2} />
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12">
              <button className="px-8 py-4 bg-[#C97132] text-white text-base font-semibold rounded-full hover:bg-[#B5651F] transition-all">
                Start making impact
              </button>
            </div>
          </div>

          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 transform hover:scale-105 transition-transform duration-300">
                <div className="aspect-[9/16] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full mx-auto flex items-center justify-center">
                      <Heart className="w-12 h-12 text-white" fill="white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Mobile-First</h3>
                      <p className="text-gray-600">Connect with supporters anywhere, anytime</p>
                    </div>
                    <div className="space-y-3 pt-4">
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
                          <div className="flex-1 text-left">
                            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-rose-500 rounded-full"></div>
                          <div className="flex-1 text-left">
                            <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                            <div className="h-2 bg-gray-100 rounded w-1/3"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
