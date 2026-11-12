import { useState } from 'react';
import { propertyAPI } from '../../services/api';
import { Brain, TrendingUp, RefreshCw, Info } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function AIEstimateCard({ property }) {
  const [estimate,  setEstimate]  = useState(null);
  const [loading,   setLoading]   = useState(false);

  const runEstimate = async () => {
    setLoading(true);
    try {
      const { data } = await propertyAPI.aiEstimate({
        type:      property.type,
        city:      property.city,
        state:     property.state,
        area_sqft: property.area_sqft,
        bedrooms:  property.bedrooms,
        bathrooms: property.bathrooms,
        year_built: property.year_built,
        furnished: property.furnished,
      });
      setEstimate(data.estimate);
    } catch {
      toast.error('Could not run AI estimate right now');
    } finally {
      setLoading(false);
    }
  };

  const confidenceColor = {
    high:   'text-green-600 bg-green-50',
    medium: 'text-amber-600 bg-amber-50',
    low:    'text-red-500  bg-red-50',
  };

  const priceDiff = estimate
    ? ((property.price - estimate.estimated_price) / estimate.estimated_price * 100).toFixed(1)
    : null;

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <Brain size={20} className="text-primary-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">AI Price Estimation</h3>
          <p className="text-xs text-gray-400">Based on comparable market data</p>
        </div>
      </div>

      {!estimate ? (
        <div className="flex flex-col items-center py-6 gap-4">
          <p className="text-sm text-gray-500 text-center max-w-sm">
            Get an AI-powered fair market value estimate for this property based on real transaction data.
          </p>
          <button onClick={runEstimate} disabled={loading}
            className="btn-primary flex items-center gap-2 py-2.5">
            {loading
              ? <><RefreshCw size={16} className="animate-spin" />Analyzing…</>
              : <><Brain size={16} />Get AI Estimate</>}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Main estimate */}
          <div className="bg-primary-50 rounded-2xl p-5 text-center">
            <p className="text-xs text-primary-500 font-medium uppercase tracking-wide mb-1">AI Estimated Value</p>
            <p className="text-4xl font-heading font-bold text-primary-700">{formatPrice(estimate.estimated_price)}</p>
            <p className="text-xs text-primary-400 mt-1">
              Range: {formatPrice(estimate.range_low)} – {formatPrice(estimate.range_high)}
            </p>
          </div>

          {/* Confidence + diff */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Confidence</p>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full capitalize ${confidenceColor[estimate.confidence]}`}>
                {estimate.confidence}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">vs. Listed Price</p>
              <p className={`text-sm font-semibold ${priceDiff > 0 ? 'text-red-500' : 'text-green-600'}`}>
                {priceDiff > 0 ? `+${priceDiff}%` : `${priceDiff}%`}
                <span className="ml-1">{priceDiff > 0 ? '⬆ Overpriced' : '⬇ Good Deal'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
            <Info size={13} className="flex-shrink-0 mt-0.5" />
            <span>
              Based on {estimate.comparable_count} comparable properties.
              {estimate.basis === 'city_average' && ' City-average rates used (limited local data).'}
              {' '}This is a guide only — not a professional valuation.
            </span>
          </div>

          <button onClick={runEstimate} disabled={loading}
            className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />Refresh Estimate
          </button>
        </div>
      )}
    </div>
  );
}
