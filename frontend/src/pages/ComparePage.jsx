import { Link } from 'react-router-dom';
import { useProperty } from '../context/PropertyContext';
import { formatPrice, formatArea, propertyTypeLabel } from '../utils/formatters';
import EmptyState from '../components/common/EmptyState';
import {
  BarChart2, X, MapPin, BedDouble, Bath, Maximize2,
  CheckCircle2, XCircle, Building2, Search, ExternalLink,
  TrendingUp, Shield, Star
} from 'lucide-react';

// Rows to compare
const COMPARE_ROWS = [
  { key: 'price',               label: 'Price',              format: (v) => formatPrice(v), icon: '💰' },
  { key: 'area_sqft',           label: 'Area',               format: (v) => formatArea(v),  icon: '📐' },
  { key: 'bedrooms',            label: 'Bedrooms',           format: (v) => v ?? '—',       icon: '🛏️' },
  { key: 'bathrooms',           label: 'Bathrooms',          format: (v) => v ?? '—',       icon: '🚿' },
  { key: 'floors',              label: 'Floors',             format: (v) => v ?? '—',       icon: '🏢' },
  { key: 'year_built',          label: 'Year Built',         format: (v) => v ?? '—',       icon: '📅' },
  { key: 'type',                label: 'Property Type',      format: (v) => propertyTypeLabel(v), icon: '🏠' },
  { key: 'status',              label: 'Listing',            format: (v) => v === 'sale' ? 'For Sale' : 'For Rent', icon: '📋' },
  { key: 'furnished',           label: 'Furnished',          format: (v) => v ? '✅ Yes' : '❌ No', icon: '🛋️' },
  { key: 'parking',             label: 'Parking',            format: (v) => v ? '✅ Yes' : '❌ No', icon: '🚗' },
  { key: 'construction_status', label: 'Construction',       format: (v) => v ? v.replace('_',' ') : '—', icon: '🔨' },
  { key: 'ownership_type',      label: 'Ownership',          format: (v) => v ?? '—', icon: '📜' },
  { key: 'is_verified',         label: 'Verified',           format: (v) => v ? '✅ Yes' : '❌ No', icon: '🛡️' },
  { key: 'views',               label: 'Total Views',        format: (v) => (v || 0).toLocaleString(), icon: '👁️' },
];

// Highlight best value in a row
function bestValue(row, properties) {
  if (!['price','area_sqft','bedrooms','bathrooms','views'].includes(row.key)) return null;
  const vals = properties.map((p) => Number(p[row.key] || 0));
  const best = row.key === 'price' ? Math.min(...vals) : Math.max(...vals);
  return vals.indexOf(best);
}

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useProperty();

  const placeholders = [...compareList, ...Array(3 - compareList.length).fill(null)];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 flex items-center gap-3">
              <BarChart2 size={28} className="text-primary-600" />
              Compare Properties
            </h1>
            <p className="text-gray-500 mt-1">Compare up to 3 properties side by side</p>
          </div>
          {compareList.length > 0 && (
            <button onClick={clearCompare} className="btn-secondary py-2 px-4 text-sm flex items-center gap-2">
              <X size={16} />Clear All
            </button>
          )}
        </div>

        {compareList.length === 0 ? (
          <EmptyState
            icon={<BarChart2 size={64} className="text-gray-200" />}
            title="Nothing to compare yet"
            description="Browse properties and click the compare icon (⊞) on any property card to add it here."
            action={
              <Link to="/properties" className="btn-primary flex items-center gap-2">
                <Search size={18} />Browse Properties
              </Link>
            }
          />
        ) : (
          <div className="card overflow-hidden">
            {/* Property header cards */}
            <div className="grid gap-0" style={{ gridTemplateColumns: `200px repeat(${placeholders.length}, 1fr)` }}>
              {/* Empty corner */}
              <div className="bg-gray-50 border-b border-r border-gray-100 p-4 flex items-center">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Feature</span>
              </div>

              {placeholders.map((p, i) => (
                <div key={i} className={`border-b border-gray-100 ${i < placeholders.length - 1 ? 'border-r' : ''} ${p ? 'bg-white' : 'bg-gray-50/50'}`}>
                  {p ? (
                    <div className="p-4">
                      <div className="relative">
                        <button onClick={() => removeFromCompare(p.id)}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-red-100 hover:bg-red-200 text-red-500 rounded-full flex items-center justify-center z-10">
                          <X size={12} />
                        </button>
                        <img
                          src={p.thumbnail || p.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&q=70'}
                          alt={p.title}
                          className="w-full aspect-video object-cover rounded-xl mb-3"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1.5">{p.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                        <MapPin size={11} className="text-primary-400" />
                        <span className="truncate">{p.city}{p.state ? `, ${p.state}` : ''}</span>
                      </div>
                      <p className="text-primary-700 font-bold text-lg">{formatPrice(p.price)}</p>
                      <div className="flex gap-2 mt-3">
                        <Link to={`/properties/${p.id}`}
                          className="flex-1 flex items-center justify-center gap-1 text-xs bg-primary-50 hover:bg-primary-100 text-primary-700 py-2 rounded-xl font-medium transition-colors">
                          <ExternalLink size={12} />View
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 flex flex-col items-center justify-center min-h-[200px] gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Building2 size={20} className="text-gray-300" />
                      </div>
                      <p className="text-xs text-gray-400 text-center">Add a property to compare</p>
                      <Link to="/properties" className="text-xs text-primary-600 hover:underline font-medium">Browse →</Link>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Comparison rows */}
            {COMPARE_ROWS.map((row, ri) => {
              const best = bestValue(row, compareList);
              return (
                <div key={row.key}
                  className={`grid ${ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
                  style={{ gridTemplateColumns: `200px repeat(${placeholders.length}, 1fr)` }}>
                  {/* Label */}
                  <div className="px-4 py-3.5 border-r border-gray-100 flex items-center gap-2">
                    <span className="text-base">{row.icon}</span>
                    <span className="text-sm font-medium text-gray-600">{row.label}</span>
                  </div>

                  {placeholders.map((p, pi) => (
                    <div key={pi}
                      className={`px-4 py-3.5 text-sm text-center ${pi < placeholders.length - 1 ? 'border-r border-gray-100' : ''} ${
                        p && best === pi ? 'bg-green-50 font-semibold text-green-700' : 'text-gray-700'
                      }`}>
                      {p ? (
                        <span className="flex items-center justify-center gap-1.5">
                          {p && best === pi && <Star size={12} className="text-green-500 fill-green-500" />}
                          {row.format(p[row.key])}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}

            {/* Amenities row */}
            <div className="grid border-t border-gray-100"
              style={{ gridTemplateColumns: `200px repeat(${placeholders.length}, 1fr)` }}>
              <div className="px-4 py-3.5 border-r border-gray-100 flex items-center gap-2 bg-gray-50">
                <span className="text-base">✨</span>
                <span className="text-sm font-medium text-gray-600">Amenities</span>
              </div>
              {placeholders.map((p, pi) => (
                <div key={pi} className={`px-4 py-3.5 ${pi < placeholders.length - 1 ? 'border-r border-gray-100' : ''}`}>
                  {p ? (
                    p.amenities?.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {p.amenities.slice(0, 6).map((a) => (
                          <span key={a} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">{a}</span>
                        ))}
                        {p.amenities.length > 6 && (
                          <span className="text-xs text-gray-400">+{p.amenities.length - 6} more</span>
                        )}
                      </div>
                    ) : <span className="text-gray-400 text-sm text-center block">—</span>
                  ) : (
                    <span className="text-gray-300 text-sm text-center block">—</span>
                  )}
                </div>
              ))}
            </div>

            {/* Footer CTA row */}
            <div className="grid border-t border-gray-100 bg-gray-50"
              style={{ gridTemplateColumns: `200px repeat(${placeholders.length}, 1fr)` }}>
              <div className="px-4 py-4 border-r border-gray-100" />
              {placeholders.map((p, pi) => (
                <div key={pi} className={`px-4 py-4 ${pi < placeholders.length - 1 ? 'border-r border-gray-100' : ''}`}>
                  {p && (
                    <Link to={`/properties/${p.id}`} className="btn-primary w-full text-sm py-2.5 flex items-center justify-center gap-2">
                      View Property <ExternalLink size={14} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        {compareList.length > 0 && (
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
            <Star size={12} className="text-green-500 fill-green-500" />
            <span>Green highlight = best value in that category</span>
          </div>
        )}
      </div>
    </div>
  );
}
