import { ShoppingBag, Star, Truck, Building } from 'lucide-react';

export default function ShopSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">
            SHOP
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Share your work,
            <br />
            inspire supporters
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Offer digital products, consulting sessions, or exclusive experiences to your community. Whether it's educational resources, virtual meetups, or custom creations, make your expertise accessible to those who want to learn from your mission.
          </p>
        </div>

        <div className="flex justify-center items-center gap-8 flex-wrap">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 w-48 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Truck className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900">One-tap checkout</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 w-48 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <ShoppingBag className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">753</p>
            <p className="text-sm text-gray-500">Sales</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 w-80 overflow-hidden">
            <div className="bg-yellow-400 h-48 flex items-center justify-center relative">
              <div className="absolute top-4 left-4 bg-white rounded px-2 py-1 text-xs font-semibold">
                .PDF
              </div>
              <div className="text-6xl">📕</div>
              <div className="absolute top-4 right-4 text-2xl">✨</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Impact Guide</h3>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-lg font-semibold text-gray-900">$200</p>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">4.9</span>
                  <span className="text-sm text-gray-500">(36)</span>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-2 bg-gray-200 rounded-full w-full"></div>
                <div className="h-2 bg-gray-200 rounded-full w-2/3"></div>
              </div>
              <button className="w-full bg-yellow-500 text-gray-900 rounded-full py-3 font-semibold hover:bg-yellow-400 transition-colors">
                Buy
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 w-72">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-4 mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Liked it? give rating</p>
              <div className="flex gap-1 mb-2">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <Star className="w-6 h-6 text-gray-300" />
              </div>
              <div className="bg-gray-900 text-white text-xs font-semibold px-2 py-1 rounded inline-block">
                +4
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 w-64 flex flex-col items-center">
            <Building className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-4xl font-bold text-gray-900 mb-1">$244</p>
            <p className="text-sm text-gray-500">Earnings</p>
          </div>
        </div>
      </div>
    </section>
  );
}
