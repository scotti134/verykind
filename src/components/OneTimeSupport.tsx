import { Coffee } from 'lucide-react';

export default function OneTimeSupport() {
  return (
    <section className="py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">
            ONE-TIME SUPPORT
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Make supporting
            <br />
            simple and meaningful
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            One-time contributions make it easy for people to support your mission. In just a few taps, supporters can make a donation and share words of encouragement.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="relative px-24 py-12">

            <div className="absolute left-0 top-1/3 bg-white rounded-xl p-3 shadow-lg border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-sm">👤</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Anie donated $50</p>
              </div>
            </div>

            <div className="absolute left-4 bottom-20 bg-white rounded-xl p-3 shadow-lg border border-gray-100 max-w-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm flex-shrink-0">👤</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Cathy G made a donation.</p>
                  <div className="bg-gray-50 rounded-lg p-2 mb-2">
                    <p className="text-xs flex items-center gap-1">
                      <span>👤</span>
                      <span>Thanks Cathy! ❤️</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-8 bg-white rounded-full p-4 shadow-lg border border-gray-100">
              <Heart className="w-8 h-8 text-red-500" />
            </div>

            <div className="absolute right-0 top-1/3 bg-white rounded-xl p-3 shadow-lg border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-sm">👤</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Alex donated $125</p>
                <div className="bg-gray-50 rounded-lg p-2 mt-1">
                  <p className="text-xs flex items-center gap-1">
                    <span>👤</span>
                    <span>Thanks Alex!</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute right-4 bottom-20 bg-white rounded-xl p-4 shadow-lg border border-gray-100 max-w-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-sm flex-shrink-0">👤</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Tony Steel donated $15.</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Love the work you're doing for ocean conservation! Keep making a difference, the world needs more people like you.
              </p>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs flex items-center gap-1">
                  <span>👤</span>
                  <span>Thanks Tony!</span>
                </p>
              </div>
            </div>

            <div className="absolute right-0 top-1/2 bg-white rounded-full p-4 shadow-lg border border-gray-100">
              <div className="text-4xl">🙌</div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 max-w-md mx-auto relative z-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Support this changemaker</h3>

              <div className="flex items-center justify-center gap-4 mb-6">
                <Coffee className="w-10 h-10 text-gray-400" />
                <span className="text-gray-300">×</span>
                <div className="flex gap-2">
                  <button className="w-12 h-12 rounded-full bg-[#C97132] text-white font-semibold hover:bg-[#B5651F] transition-colors">1</button>
                  <button className="w-12 h-12 rounded-full border-2 border-[#C97132] text-gray-900 font-semibold hover:bg-[#F5E6D3] transition-colors">3</button>
                  <button className="w-12 h-12 rounded-full border-2 border-[#C97132] text-gray-900 font-semibold hover:bg-[#F5E6D3] transition-colors">5</button>
                </div>
                <input
                  type="text"
                  placeholder="1"
                  className="w-16 h-12 rounded-full border-2 border-gray-200 text-center font-semibold focus:outline-none focus:border-[#C97132]"
                />
              </div>

              <textarea
                placeholder="Share your support..."
                className="w-full h-24 rounded-xl border border-gray-200 p-4 mb-4 resize-none focus:outline-none focus:border-[#C97132] text-sm"
              />

              <button className="w-full bg-[#C97132] text-white rounded-full py-4 font-semibold text-lg hover:bg-[#B5651F] transition-colors">
                Support $5
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Heart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  );
}
