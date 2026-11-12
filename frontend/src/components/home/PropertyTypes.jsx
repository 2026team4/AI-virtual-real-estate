import { useNavigate } from 'react-router-dom';

const types = [
  { label: 'Apartments',   type: 'apartment', emoji: '🏢', count: '3,200+', bg: 'from-blue-500 to-blue-600',    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&q=80' },
  { label: 'Houses',       type: 'house',     emoji: '🏠', count: '1,800+', bg: 'from-green-500 to-green-600',  img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&q=80' },
  { label: 'Villas',       type: 'villa',     emoji: '🏡', count: '950+',   bg: 'from-purple-500 to-purple-600',img: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=300&q=80' },
  { label: 'Land / Plots', type: 'land',      emoji: '🌳', count: '2,100+', bg: 'from-amber-500 to-orange-500', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80' },
  { label: 'Offices',      type: 'office',    emoji: '🏬', count: '750+',   bg: 'from-sky-500 to-cyan-600',     img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80' },
  { label: 'Shops',        type: 'shop',      emoji: '🏪', count: '620+',   bg: 'from-rose-500 to-pink-600',    img: 'https://images.unsplash.com/photo-1582539987870-1d0aade97c63?w=300&q=80' },
  { label: 'Commercial',   type: 'commercial',emoji: '🏭', count: '400+',   bg: 'from-teal-500 to-emerald-600', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=300&q=80' },
];

export default function PropertyTypes() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Browse by Property Type</h2>
          <p className="section-subtitle">Find exactly what you're looking for</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {types.map((t) => (
            <button
              key={t.type}
              onClick={() => navigate(`/properties?type=${t.type}`)}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
            >
              <img src={t.img} alt={t.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className={`absolute inset-0 bg-gradient-to-t ${t.bg} opacity-70 group-hover:opacity-80 transition-opacity`} />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 px-2 text-white">
                <span className="text-3xl mb-2">{t.emoji}</span>
                <p className="font-semibold text-sm text-center leading-tight">{t.label}</p>
                <p className="text-xs text-white/80 mt-0.5">{t.count}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
