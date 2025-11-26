import { Heart, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-8 h-8 text-emerald-500 fill-emerald-500" />
              <span className="text-2xl font-bold text-white">Very Kind</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Empowering people to make a positive difference in the world, one supporter at a time.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-emerald-500 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Creator Guide</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-emerald-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            2025 Very Kind. Made with love for changemakers everywhere.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-emerald-500 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-emerald-500 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-emerald-500 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-emerald-500 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
