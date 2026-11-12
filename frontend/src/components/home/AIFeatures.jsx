import { Brain, Globe, TrendingUp, ShieldCheck, Bell, BarChart2 } from 'lucide-react';

const features = [
  {
    icon: <Brain size={24} />,
    title: 'AI Property Recommendations',
    desc: 'Our AI learns your preferences — budget, location, lifestyle — and surfaces the most relevant properties automatically.',
    color: 'text-purple-600 bg-purple-50',
  },
  {
    icon: <Globe size={24} />,
    title: '360° Virtual Walkthroughs',
    desc: 'Step inside any property with immersive 360° tours. Explore every room and corner without physically visiting.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: <TrendingUp size={24} />,
    title: 'AI Price Estimation',
    desc: 'Get instant price estimates powered by real market data from thousands of comparable properties in the same area.',
    color: 'text-green-600 bg-green-50',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Fraud Detection & Verification',
    desc: 'AI scans every listing for fraud patterns and verifies documents to ensure every property you see is legitimate.',
    color: 'text-red-600 bg-red-50',
  },
  {
    icon: <Bell size={24} />,
    title: 'Smart Alerts',
    desc: 'Set your criteria once and get instant notifications when a matching property is listed — never miss a deal.',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    icon: <BarChart2 size={24} />,
    title: 'Property Comparison',
    desc: 'Compare up to 3 properties side-by-side on price, features, location score, and AI-calculated value index.',
    color: 'text-teal-600 bg-teal-50',
  },
];

export default function AIFeatures() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85"
                alt="AI Real Estate Features"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/40 to-transparent" />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-hover p-5 max-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <Brain size={18} className="text-primary-600" />
                <span className="text-xs font-semibold text-gray-900">AI Estimate</span>
              </div>
              <p className="text-2xl font-heading font-bold text-primary-600">₹1.2 Cr</p>
              <p className="text-xs text-gray-500 mt-0.5">Confidence: High 🟢</p>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-primary-500 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right — features */}
          <div>
            <div className="text-primary-600 text-sm font-semibold mb-2 flex items-center gap-2">
              <Brain size={16} />AI-Powered Platform
            </div>
            <h2 className="section-title mb-4">
              Smart Features that Give You an Edge
            </h2>
            <p className="text-gray-500 mb-10 leading-relaxed">
              We combine cutting-edge artificial intelligence with real estate expertise to make your
              property journey faster, smarter, and more transparent than ever before.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                  <div className={`w-11 h-11 ${f.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{f.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
