import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Ananya Krishnan',
    role: 'First-time Home Buyer',
    city: 'Bangalore',
    avatar: 'https://i.pravatar.cc/80?img=47',
    rating: 5,
    text: 'The 360° virtual tours saved me so much time. I shortlisted 3 properties from my office and only visited the final one. The AI price estimate was spot-on — exactly what my agent quoted!',
  },
  {
    name: 'Vikram Malhotra',
    role: 'Property Investor',
    city: 'Mumbai',
    avatar: 'https://i.pravatar.cc/80?img=52',
    rating: 5,
    text: 'As someone who invests in multiple cities, the AI recommendations and comparison tool are invaluable. I\'ve closed 4 deals through this platform and each time the verified listings gave me confidence.',
  },
  {
    name: 'Sunita Patel',
    role: 'Property Seller',
    city: 'Pune',
    avatar: 'https://i.pravatar.cc/80?img=44',
    rating: 5,
    text: 'I listed my villa and got genuine inquiries within 48 hours. The dashboard makes it easy to manage bookings and communicate with buyers. Sold 20% above my expected price!',
  },
  {
    name: 'Rajesh Menon',
    role: 'NRI Buyer',
    city: 'Hyderabad',
    avatar: 'https://i.pravatar.cc/80?img=67',
    rating: 5,
    text: 'Being based in Dubai, I relied entirely on the virtual tours and AI estimates. The document verification feature gave me the confidence to invest without flying back. Absolutely seamless!',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="section-title">What Our Users Say</h2>
          <p className="section-subtitle">Real stories from buyers, sellers, and investors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="card p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center gap-1">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role} · {t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
