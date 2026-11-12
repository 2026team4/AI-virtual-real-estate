import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, ChevronDown } from 'lucide-react';

const PROPERTY_TYPES = ['All Types', 'House', 'Apartment', 'Villa', 'Land', 'Shop', 'Office', 'Commercial'];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad'];

export default function HeroSection() {
  const navigate = useNavigate();
  const [tab,    setTab]    = useState('sale');  // sale | rent
  const [query,  setQuery]  = useState('');
  const [type,   setType]   = useState('All Types');
  const [city,   setCity]   = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ status: tab });
    if (query)               params.set('search', query);
    if (type !== 'All Types') params.set('type', type.toLowerCase());
    if (city)                params.set('city', city);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=85')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900/85 via-dark-900/65 to-primary-900/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          AI-Powered Real Estate Platform
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-5 animate-slide-up">
          Find Your Dream
          <span className="text-primary-400"> Property </span>
          with AI
        </h1>
        <p className="text-lg text-white/75 max-w-2xl mx-auto mb-10 animate-slide-up">
          Explore thousands of properties with 360° virtual tours, AI price estimates,
          and smart search — all from the comfort of your home.
        </p>

        {/* Search box */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {['sale', 'rent'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3.5 text-sm font-semibold transition-colors capitalize ${
                  tab === t
                    ? 'text-primary-700 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'sale' ? '🏠 Buy' : '🔑 Rent'}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <form onSubmit={handleSearch} className="p-4 flex flex-col sm:flex-row gap-3">
            {/* Location / keyword */}
            <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
              <MapPin size={18} className="text-primary-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search city, area or keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Property type */}
            <div className="relative flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 min-w-[160px]">
              <Home size={16} className="text-primary-500 mr-2 flex-shrink-0" />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 appearance-none cursor-pointer"
              >
                {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              <ChevronDown size={14} className="text-gray-400 absolute right-3 pointer-events-none" />
            </div>

            {/* City */}
            <div className="relative flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 min-w-[140px]">
              <MapPin size={16} className="text-primary-500 mr-2 flex-shrink-0" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 appearance-none cursor-pointer"
              >
                <option value="">Any City</option>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} className="text-gray-400 absolute right-3 pointer-events-none" />
            </div>

            <button type="submit" className="btn-primary flex items-center gap-2 px-6 whitespace-nowrap">
              <Search size={18} />Search
            </button>
          </form>

          {/* Quick filters */}
          <div className="px-4 pb-4 flex flex-wrap gap-2">
            {['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Villas', 'New Projects'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/properties?search=${tag}&status=${tab}`)}
                className="text-xs bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-gray-600 px-3 py-1.5 rounded-full transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-white/70 text-sm">
          {['10,000+ Properties', '50,000+ Happy Buyers', '360° Virtual Tours', 'AI Price Estimation'].map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <span className="text-green-400">✓</span>{t}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce-slow">
        <ChevronDown size={24} />
      </div>
    </section>
  );
}
