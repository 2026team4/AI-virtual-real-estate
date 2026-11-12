import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { favoriteAPI } from '../services/api';
import { useProperty } from '../context/PropertyContext';
import PropertyCard from '../components/property/PropertyCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { Heart, Search } from 'lucide-react';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const { loadFavorites }         = useProperty();

  useEffect(() => {
    favoriteAPI.getAll()
      .then(({ data }) => {
        // Extract the nested property objects
        const props = (data.favorites || [])
          .map((f) => f.property)
          .filter(Boolean);
        setFavorites(props);
        loadFavorites(); // sync context
      })
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 flex items-center gap-3">
              <Heart size={28} className="text-red-500 fill-red-500" />
              Saved Properties
            </h1>
            <p className="text-gray-500 mt-1">
              {loading ? 'Loading…' : `${favorites.length} saved propert${favorites.length === 1 ? 'y' : 'ies'}`}
            </p>
          </div>
          <Link to="/properties" className="btn-secondary flex items-center gap-2 py-2.5 px-4 text-sm">
            <Search size={16} />Browse More
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading your favorites…" />
        ) : favorites.length === 0 ? (
          <EmptyState
            icon={<Heart size={64} className="text-gray-200" />}
            title="No saved properties yet"
            description="Browse properties and click the heart icon to save your favorites here."
            action={
              <Link to="/properties" className="btn-primary flex items-center gap-2">
                <Search size={18} />Browse Properties
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
