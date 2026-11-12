import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

const TYPES    = ['house','apartment','villa','land','shop','office','commercial'];
const STATUSES = ['sale','rent'];
const CITIES   = ['Mumbai','Delhi','Bangalore','Hyderabad','Pune','Chennai','Kolkata','Ahmedabad','Jaipur','Surat'];

export default function PropertyFilters({ searchParams, onUpdate, onClose }) {
  const get = (k) => searchParams.get(k) || '';

  const [minPrice, setMinPrice] = useState(get('min_price'));
  const [maxPrice, setMaxPrice] = useState(get('max_price'));
  const [minArea,  setMinArea]  = useState(get('min_area'));

  const applyPrice = () => {
    onUpdate('min_price', minPrice);
    onUpdate('max_price', maxPrice);
  };
  const applyArea = () => onUpdate('min_area', minArea);

  const clearAll = () => {
    ['type','status','city','min_price','max_price','min_area','bedrooms','bathrooms','furnished','parking'].forEach((k) => onUpdate(k, ''));
    setMinPrice(''); setMaxPrice(''); setMinArea('');
  };

  const hasFilters = ['type','status','city','min_price','max_price','min_area','bedrooms','bathrooms','furnished','parking']
    .some((k) => !!get(k));

  return (
    <div className="bg-white rounded-2xl shadow-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <SlidersHorizontal size={18} className="text-primary-600" />Filters
          {hasFilters && (
            <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">!</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700 font-medium">Clear all</button>
          )}
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-gray-100"><X size={18} /></button>
          )}
        </div>
      </div>

      {/* Status */}
      <FilterSection title="For">
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => onUpdate('status', get('status') === s ? '' : s)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                get('status') === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              {s === 'sale' ? 'Buy' : 'Rent'}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Property Type */}
      <FilterSection title="Property Type">
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button key={t} onClick={() => onUpdate('type', get('type') === t ? '' : t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${
                get('type') === t ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              {t === 'land' ? 'Land/Plot' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* City */}
      <FilterSection title="City">
        <select value={get('city')} onChange={(e) => onUpdate('city', e.target.value)} className="input-field text-sm py-2">
          <option value="">Any City</option>
          {CITIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range (₹)">
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={applyPrice}
            className="input-field text-sm py-2 flex-1 min-w-0" />
          <input type="number" placeholder="Max" value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={applyPrice}
            className="input-field text-sm py-2 flex-1 min-w-0" />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {[['< 30L','','3000000'],['30–80L','3000000','8000000'],['80L–2Cr','8000000','20000000'],['2Cr+','20000000','']].map(([l,mn,mx]) => (
            <button key={l} onClick={() => { onUpdate('min_price', mn); onUpdate('max_price', mx); setMinPrice(mn); setMaxPrice(mx); }}
              className="text-xs bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-gray-600 px-2 py-1 rounded-lg">
              {l}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Area */}
      <FilterSection title="Min Area (sq.ft)">
        <input type="number" placeholder="e.g. 1000" value={minArea}
          onChange={(e) => setMinArea(e.target.value)}
          onBlur={applyArea}
          className="input-field text-sm py-2" />
      </FilterSection>

      {/* Bedrooms */}
      <FilterSection title="Bedrooms">
        <div className="flex gap-2">
          {['1','2','3','4','5+'].map((b) => (
            <button key={b} onClick={() => onUpdate('bedrooms', get('bedrooms') === b ? '' : b)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                get('bedrooms') === b ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              {b}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Bathrooms */}
      <FilterSection title="Bathrooms">
        <div className="flex gap-2">
          {['1','2','3','4+'].map((b) => (
            <button key={b} onClick={() => onUpdate('bathrooms', get('bathrooms') === b ? '' : b)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                get('bathrooms') === b ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              {b}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Amenities */}
      <FilterSection title="Amenities">
        <div className="flex gap-3">
          {[{k:'furnished',l:'Furnished'},{k:'parking',l:'Parking'}].map(({k,l}) => (
            <label key={k} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox"
                checked={get(k) === 'true'}
                onChange={(e) => onUpdate(k, e.target.checked ? 'true' : '')}
                className="w-4 h-4 rounded accent-primary-600" />
              <span className="text-sm text-gray-700">{l}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

function FilterSection({ title, children }) {
  return (
    <div className="mb-5 pb-5 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{title}</p>
      {children}
    </div>
  );
}
