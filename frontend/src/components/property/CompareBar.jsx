import { Link } from 'react-router-dom';
import { useProperty } from '../../context/PropertyContext';
import { formatPrice } from '../../utils/formatters';
import { X, BarChart2 } from 'lucide-react';

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useProperty();
  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-dark-900 text-white shadow-2xl border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 mr-2">
          <BarChart2 size={18} className="text-primary-400" />
          <span className="text-sm font-semibold">Compare</span>
          <span className="text-xs bg-primary-600 px-2 py-0.5 rounded-full">{compareList.length}/3</span>
        </div>

        <div className="flex items-center gap-3 flex-1 overflow-x-auto">
          {compareList.map((p) => (
            <div key={p.id} className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2 flex-shrink-0">
              <img
                src={p.thumbnail || p.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=60&q=60'}
                alt={p.title}
                className="w-8 h-8 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <p className="text-xs font-medium truncate max-w-[120px]">{p.title}</p>
                <p className="text-xs text-primary-400">{formatPrice(p.price)}</p>
              </div>
              <button onClick={() => removeFromCompare(p.id)} className="text-gray-400 hover:text-white ml-1">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {compareList.length >= 2 && (
            <Link to="/compare" className="btn-primary py-2 px-4 text-sm">
              Compare Now
            </Link>
          )}
          <button onClick={clearCompare} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
