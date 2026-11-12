import { useEffect, useState } from 'react';
import { propertyAPI } from '../../services/api';
import { Building2, Users, TrendingUp, Award } from 'lucide-react';

function CountUp({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      setCount((c) => {
        if (c + step >= target) { clearInterval(timer); return target; }
        return c + step;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count.toLocaleString('en-IN')}{suffix}</>;
}

const defaultStats = [
  { label: 'Properties Listed',  value: 12500, suffix: '+', icon: <Building2 size={28} />, color: 'bg-blue-50 text-blue-600' },
  { label: 'Happy Clients',      value: 50000, suffix: '+', icon: <Users size={28} />,     color: 'bg-green-50 text-green-600' },
  { label: 'Cities Covered',     value: 120,   suffix: '+', icon: <TrendingUp size={28} />,color: 'bg-orange-50 text-orange-600' },
  { label: 'Awards Won',         value: 25,    suffix: '',  icon: <Award size={28} />,      color: 'bg-purple-50 text-purple-600' },
];

export default function StatsSection() {
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    propertyAPI.getStats()
      .then(({ data }) => {
        const s = data.stats;
        setStats([
          { ...defaultStats[0], value: s.total_properties || defaultStats[0].value },
          { ...defaultStats[1], value: s.happy_clients    || defaultStats[1].value },
          { ...defaultStats[2], value: 120 },
          { ...defaultStats[3], value: 25 },
        ]);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="card p-6 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-300">
              <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
              <p className="text-3xl font-heading font-bold text-gray-900 mb-1">
                <CountUp target={s.value} suffix={s.suffix} />
              </p>
              <p className="text-sm text-gray-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
