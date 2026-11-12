import { Link } from 'react-router-dom';
import { Heart, BedDouble, Bath, Maximize2, MapPin, BarChart2, CheckCircle2, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { formatPrice, formatArea, propertyTypeLabel, timeAgo } from '../../utils/formatters';

export default function PropertyCard({ property, compact = false }) {
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, isFavorited, addToCompare, isInCompare } = useProperty();

  const {
    id, title, type, status, price, area_sqft, bedrooms, bathrooms,
    city, state, thumbnail, images, is_verified, is_featured, views, created_at, owner,
  } = property;

  const img = thumbnail || images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80';

  const handleFav = (e) => {
    e.preventDefault();
    if (!isAuthenticated) { window.location.href = '/login'; return; }
    toggleFavorite(id);
  };

  const handleCompare = (e) => {
    e.preventDefault();
    addToCompare(property);
  };

  return (
    <Link to={`/properties/${id}`} className="card group block overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={img}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={status === 'sale' ? 'badge-sale' : 'badge-rent'}>
            For {status === 'sale' ? 'Sale' : 'Rent'}
          </span>
          {is_featured && <span className="badge bg-accent-100 text-accent-600">⭐ Featured</span>}
          {is_verified && (
            <span className="badge bg-white/90 text-primary-700">
              <CheckCircle2 size={11} className="mr-0.5" />Verified
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={handleFav}
            className={`w-8 h-8 rounded-lg flex items-center justify-center shadow transition-all duration-200 ${
              isFavorited(id)
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-500 hover:bg-red-50 hover:text-red-500'
            }`}
            aria-label="Save to favorites"
          >
            <Heart size={15} fill={isFavorited(id) ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleCompare}
            className={`w-8 h-8 rounded-lg flex items-center justify-center shadow transition-all duration-200 ${
              isInCompare(id)
                ? 'bg-primary-600 text-white'
                : 'bg-white/90 text-gray-500 hover:bg-primary-50 hover:text-primary-600'
            }`}
            aria-label="Add to compare"
          >
            <BarChart2 size={15} />
          </button>
        </div>

        {/* Property type */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xs font-medium bg-black/50 text-white px-2 py-1 rounded-lg">
            {propertyTypeLabel(type)}
          </span>
        </div>

        {/* Views */}
        {views > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white text-xs bg-black/40 rounded-lg px-2 py-1">
            <Eye size={12} />{views}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 flex-1">{title}</h3>
        </div>

        <p className="text-primary-700 font-bold text-xl mb-3">{formatPrice(price)}</p>

        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
          <MapPin size={13} className="flex-shrink-0 text-primary-400" />
          <span className="truncate">{city}{state ? `, ${state}` : ''}</span>
        </div>

        {/* Stats */}
        {!compact && (
          <div className="flex items-center gap-4 text-sm text-gray-500 pt-3 border-t border-gray-100">
            {bedrooms != null && (
              <div className="flex items-center gap-1">
                <BedDouble size={14} className="text-gray-400" />
                <span>{bedrooms} Beds</span>
              </div>
            )}
            {bathrooms != null && (
              <div className="flex items-center gap-1">
                <Bath size={14} className="text-gray-400" />
                <span>{bathrooms} Baths</span>
              </div>
            )}
            {area_sqft && (
              <div className="flex items-center gap-1 ml-auto">
                <Maximize2 size={13} className="text-gray-400" />
                <span>{formatArea(area_sqft)}</span>
              </div>
            )}
          </div>
        )}

        {/* Owner & time */}
        {owner && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {owner.avatar_url ? (
                <img src={owner.avatar_url} className="w-6 h-6 rounded-full object-cover" alt={owner.full_name} />
              ) : (
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                  {owner.full_name?.[0]}
                </div>
              )}
              <span className="text-xs text-gray-500 truncate max-w-[100px]">{owner.full_name}</span>
            </div>
            <span className="text-xs text-gray-400">{timeAgo(created_at)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
