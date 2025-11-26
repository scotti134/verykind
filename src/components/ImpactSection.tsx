export default function ImpactSection() {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Community impact"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/80"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-white">
          <div>
            <div className="text-6xl font-bold mb-2">$8M+</div>
            <div className="text-xl text-white/90">Donated to good causes</div>
          </div>
          <div>
            <div className="text-6xl font-bold mb-2">125K+</div>
            <div className="text-xl text-white/90">Kind supporters</div>
          </div>
          <div>
            <div className="text-6xl font-bold mb-2">5,000+</div>
            <div className="text-xl text-white/90">Changemakers funded</div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-5xl font-bold text-white mb-6">
            Every act of kindness matters
          </h3>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Join thousands of people supporting changemakers who are making the world a better place
          </p>
          <button className="px-8 py-4 bg-[#C97132] text-white rounded-full hover:bg-[#B5651F] transition-all font-semibold text-lg">
            Start supporting today
          </button>
        </div>
      </div>
    </section>
  );
}
