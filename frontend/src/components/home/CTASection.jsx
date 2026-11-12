import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Plus, ArrowRight } from 'lucide-react';

export default function CTASection() {
  const { isAuthenticated, isSeller } = useAuth();

  return (
    <section className="py-20 bg-gradient-to-br from-primary-700 via-primary-800 to-dark-900 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-4xl lg:text-5xl font-heading font-bold text-white mb-5 leading-tight">
          {isSeller
            ? 'Ready to List Your Property?'
            : 'Ready to Find Your Dream Home?'}
        </h2>
        <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
          {isSeller
            ? 'Reach thousands of verified buyers. List your property in minutes and get AI-powered exposure.'
            : 'Join 50,000+ happy buyers who found their perfect home on AI RealEstate. It\'s free to start.'}
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          {isSeller ? (
            <Link to="/add-listing" className="btn-accent flex items-center gap-2 text-base px-8 py-4">
              <Plus size={20} />List Your Property <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/properties" className="btn-accent flex items-center gap-2 text-base px-8 py-4">
                <Search size={20} />Browse Properties <ArrowRight size={18} />
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold text-base px-8 py-4 rounded-xl transition-all duration-200">
                  Create Free Account
                </Link>
              )}
            </>
          )}
        </div>

        {/* Trust row */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/50 text-sm">
          {['No hidden charges', 'Verified listings', '24/7 Support', 'Secure platform'].map((t) => (
            <span key={t} className="flex items-center gap-1.5"><span className="text-green-400">✓</span>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
