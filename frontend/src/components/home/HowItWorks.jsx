import { Search, Eye, MessageSquare, Key } from 'lucide-react';

const steps = [
  {
    icon: <Search size={28} />,
    step: '01',
    title: 'Search & Filter',
    desc: 'Use our smart search to find properties by location, budget, type, and 20+ filters.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: <Eye size={28} />,
    step: '02',
    title: 'Explore Virtually',
    desc: 'Take AI-powered 360° virtual tours and walkthroughs without leaving your home.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: <MessageSquare size={28} />,
    step: '03',
    title: 'Connect & Negotiate',
    desc: 'Message sellers, request visits, compare properties, and get AI price guidance.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: <Key size={28} />,
    step: '04',
    title: 'Close the Deal',
    desc: 'Complete document verification, secure payments, and get your keys — digitally.',
    color: 'bg-orange-50 text-orange-600',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Your journey from search to ownership in 4 simple steps</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 via-green-200 to-orange-200 z-0" />

          {steps.map((s, i) => (
            <div key={i} className="card p-8 text-center relative z-10 group hover:-translate-y-2 transition-transform duration-300">
              <div className="relative inline-block mb-5">
                <div className={`w-16 h-16 ${s.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                  {s.icon}
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
