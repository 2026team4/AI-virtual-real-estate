import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyAPI, uploadAPI } from '../services/api';
import { Brain, Upload, X, Plus, MapPin, Home, DollarSign, Info, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const TYPES    = ['house','apartment','villa','land','shop','office','commercial'];
const STATUSES = ['sale','rent'];
const AMENITY_OPTIONS = [
  'Swimming Pool','Gym','Lift/Elevator','Security','Power Backup',
  'Club House','Children Play Area','Garden','Jogging Track',
  'CCTV','Intercom','Visitor Parking','Water Supply 24/7',
  'Modular Kitchen','Air Conditioning','Balcony','Terrace',
];
const STEPS = ['Basic Info','Location','Media','Amenities','Review'];

export default function AddListingPage() {
  const navigate = useNavigate();
  const [step, setStep]     = useState(0);
  const [saving, setSaving] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [estimate,   setEstimate]   = useState(null);

  const [form, setForm] = useState({
    title: '', description: '', type: 'apartment', status: 'sale',
    price: '', area_sqft: '', bedrooms: '', bathrooms: '', floors: '', year_built: '',
    address: '', city: '', state: '', country: 'India', zip_code: '',
    latitude: '', longitude: '',
    images: [], thumbnail: '', video_url: '', virtual_tour_url: '',
    amenities: [], nearby_facilities: [],
    furnished: false, parking: false,
    construction_status: 'ready', ownership_type: 'freehold',
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleAmenity = (a) => set('amenities', form.amenities.includes(a)
    ? form.amenities.filter((x) => x !== a) : [...form.amenities, a]);

  // ── Image upload ─────────────────────────────────────────────────────────
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        setForm((f) => ({
          ...f,
          images: [...f.images, base64],
          thumbnail: f.thumbnail || base64,
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i) => {
    setForm((f) => {
      const imgs = f.images.filter((_, idx) => idx !== i);
      return { ...f, images: imgs, thumbnail: imgs[0] || '' };
    });
  };

  // ── AI Estimate ───────────────────────────────────────────────────────────
  const runEstimate = async () => {
    if (!form.type || !form.city || !form.area_sqft) {
      toast.error('Fill in type, city, and area first'); return;
    }
    setEstimating(true);
    try {
      const { data } = await propertyAPI.aiEstimate({
        type: form.type, city: form.city, area_sqft: form.area_sqft,
        bedrooms: form.bedrooms, furnished: form.furnished,
      });
      setEstimate(data.estimate);
      toast.success('AI estimate ready!');
    } catch { toast.error('Estimate failed'); }
    finally { setEstimating(false); }
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.title || !form.type || !form.status || !form.price || !form.city) {
      toast.error('Please fill all required fields'); return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      // Convert base64 images to URLs via upload API
      const uploadedUrls = [];
      for (const img of form.images) {
        if (img.startsWith('data:')) {
          try {
            const { data } = await uploadAPI.image({ file: img, folder: 'properties' });
            uploadedUrls.push(data.url);
          } catch { uploadedUrls.push(img); } // keep base64 as fallback
        } else {
          uploadedUrls.push(img);
        }
      }
      payload.images    = uploadedUrls;
      payload.thumbnail = uploadedUrls[0] || '';

      const { data } = await propertyAPI.create(payload);
      toast.success('Property listed successfully! 🎉');
      navigate(`/properties/${data.property.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to list property');
    } finally {
      setSaving(false);
    }
  };

  const canNext = () => {
    if (step === 0) return form.title && form.type && form.status && form.price;
    if (step === 1) return form.city;
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900">List Your Property</h1>
          <p className="text-gray-500 mt-1">Fill in the details to reach thousands of buyers</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                i < step ? 'bg-primary-600 text-white' : i === step ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 'bg-gray-200 text-gray-500'
              }`}>
                {i < step ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-1 rounded-full ${i < step ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm font-medium text-gray-600 mb-6">{STEPS[step]}</p>

        <div className="card p-6 sm:p-8">

          {/* Step 0 — Basic Info */}
          {step === 0 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="label">Property Title *</label>
                <input type="text" placeholder="e.g. 3BHK Luxury Apartment in Bandra West"
                  value={form.title} onChange={(e) => set('title', e.target.value)}
                  className="input-field" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Property Type *</label>
                  <select value={form.type} onChange={(e) => set('type', e.target.value)} className="input-field">
                    {TYPES.map((t) => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Listing For *</label>
                  <div className="flex gap-2">
                    {STATUSES.map((s) => (
                      <button key={s} type="button" onClick={() => set('status', s)}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium capitalize transition-colors ${
                          form.status === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}>
                        {s === 'sale' ? 'For Sale' : 'For Rent'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Price (₹) *</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" min="0" placeholder="e.g. 5000000"
                      value={form.price} onChange={(e) => set('price', e.target.value)}
                      className="input-field pl-10" />
                  </div>
                  {estimate && (
                    <button type="button" onClick={() => set('price', estimate.estimated_price)}
                      className="text-xs text-primary-600 hover:underline mt-1">
                      Use AI estimate: ₹{(estimate.estimated_price/100000).toFixed(1)}L
                    </button>
                  )}
                </div>
                <div>
                  <label className="label">Area (sq.ft)</label>
                  <input type="number" min="0" placeholder="e.g. 1200"
                    value={form.area_sqft} onChange={(e) => set('area_sqft', e.target.value)}
                    className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[['bedrooms','Beds'],['bathrooms','Baths'],['floors','Floors'],['year_built','Year Built']].map(([k,l]) => (
                  <div key={k}>
                    <label className="label">{l}</label>
                    <input type="number" min="0" placeholder="—"
                      value={form[k]} onChange={(e) => set(k, e.target.value)}
                      className="input-field" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Construction Status</label>
                  <select value={form.construction_status} onChange={(e) => set('construction_status', e.target.value)} className="input-field">
                    <option value="ready">Ready to Move</option>
                    <option value="under_construction">Under Construction</option>
                    <option value="pre_launch">Pre-Launch</option>
                  </select>
                </div>
                <div>
                  <label className="label">Ownership Type</label>
                  <select value={form.ownership_type} onChange={(e) => set('ownership_type', e.target.value)} className="input-field">
                    <option value="freehold">Freehold</option>
                    <option value="leasehold">Leasehold</option>
                    <option value="cooperative">Cooperative</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {[['furnished','Furnished'],['parking','Parking Available']].map(([k,l]) => (
                  <label key={k} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[k]} onChange={(e) => set(k, e.target.checked)}
                      className="w-4 h-4 rounded accent-primary-600" />
                    <span className="text-sm text-gray-700">{l}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="label">Description</label>
                <textarea rows={4} placeholder="Describe the property — highlights, condition, nearby landmarks…"
                  value={form.description} onChange={(e) => set('description', e.target.value)}
                  className="input-field resize-none" />
              </div>

              {/* AI price estimate button */}
              <div className="bg-primary-50 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Brain size={20} className="text-primary-600" />
                  <div>
                    <p className="text-sm font-semibold text-primary-800">AI Price Suggestion</p>
                    <p className="text-xs text-primary-600">{estimate ? `~₹${(estimate.estimated_price/100000).toFixed(1)}L (${estimate.confidence} confidence)` : 'Get a market-based price estimate'}</p>
                  </div>
                </div>
                <button type="button" onClick={runEstimate} disabled={estimating}
                  className="btn-primary py-2 px-4 text-sm flex-shrink-0">
                  {estimating ? 'Estimating…' : 'Get Estimate'}
                </button>
              </div>
            </div>
          )}

          {/* Step 1 — Location */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="label">Address</label>
                <input type="text" placeholder="Street address, building name…"
                  value={form.address} onChange={(e) => set('address', e.target.value)}
                  className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">City *</label>
                  <input type="text" placeholder="Mumbai"
                    value={form.city} onChange={(e) => set('city', e.target.value)}
                    className="input-field" />
                </div>
                <div>
                  <label className="label">State</label>
                  <input type="text" placeholder="Maharashtra"
                    value={form.state} onChange={(e) => set('state', e.target.value)}
                    className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Zip Code</label>
                  <input type="text" placeholder="400001"
                    value={form.zip_code} onChange={(e) => set('zip_code', e.target.value)}
                    className="input-field" />
                </div>
                <div>
                  <label className="label">Country</label>
                  <input type="text" value={form.country} onChange={(e) => set('country', e.target.value)} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Latitude (optional)</label>
                  <input type="number" step="any" placeholder="19.0760"
                    value={form.latitude} onChange={(e) => set('latitude', e.target.value)}
                    className="input-field" />
                </div>
                <div>
                  <label className="label">Longitude (optional)</label>
                  <input type="number" step="any" placeholder="72.8777"
                    value={form.longitude} onChange={(e) => set('longitude', e.target.value)}
                    className="input-field" />
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-700">
                <Info size={16} className="flex-shrink-0 mt-0.5" />
                <span>Adding coordinates enables the interactive map on your property page. You can find them at maps.google.com by right-clicking your location.</span>
              </div>
            </div>
          )}

          {/* Step 2 — Media */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="label">Photos (up to 15)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer relative">
                  <input type="file" accept="image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageUpload} />
                  <Upload size={32} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-600">Click or drag photos here</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max 5MB each</p>
                </div>
                {form.images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative group aspect-square">
                        <img src={img} className="w-full h-full object-cover rounded-xl" alt={`Photo ${i+1}`} />
                        {i === 0 && <span className="absolute top-1 left-1 text-[10px] bg-primary-600 text-white px-1.5 py-0.5 rounded-md">Main</span>}
                        <button onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="label">Video Tour URL (optional)</label>
                <input type="url" placeholder="https://youtube.com/watch?v=..."
                  value={form.video_url} onChange={(e) => set('video_url', e.target.value)}
                  className="input-field" />
              </div>
              <div>
                <label className="label">360° Virtual Tour URL (optional)</label>
                <input type="url" placeholder="https://matterport.com/... or Kuula link"
                  value={form.virtual_tour_url} onChange={(e) => set('virtual_tour_url', e.target.value)}
                  className="input-field" />
                <p className="text-xs text-gray-400 mt-1">Supports Matterport, Kuula, Google Street View, or any embeddable URL</p>
              </div>
            </div>
          )}

          {/* Step 3 — Amenities */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="label">Select Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map((a) => (
                    <button key={a} type="button" onClick={() => toggleAmenity(a)}
                      className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                        form.amenities.includes(a) ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>
                      {form.amenities.includes(a) && <CheckCircle2 size={13} className="inline mr-1.5" />}{a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Review */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="font-semibold text-gray-900">Review Your Listing</h3>
              <div className="bg-gray-50 rounded-2xl p-5 space-y-3 text-sm">
                {[
                  ['Title',    form.title],
                  ['Type',     form.type],
                  ['Status',   form.status === 'sale' ? 'For Sale' : 'For Rent'],
                  ['Price',    `₹${Number(form.price).toLocaleString('en-IN')}`],
                  ['Area',     form.area_sqft ? `${form.area_sqft} sq.ft` : '—'],
                  ['City',     form.city],
                  ['Amenities', form.amenities.length > 0 ? form.amenities.join(', ') : '—'],
                  ['Photos',   `${form.images.length} uploaded`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <span className="text-gray-400">{k}</span>
                    <span className="font-medium text-gray-800 text-right">{v}</span>
                  </div>
                ))}
              </div>
              {estimate && (
                <div className="bg-primary-50 rounded-xl p-4 text-sm text-primary-700">
                  <Brain size={16} className="inline mr-2" />
                  AI estimates your property at ₹{(estimate.estimated_price/100000).toFixed(1)}L
                  ({estimate.confidence} confidence)
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)}
              className="btn-secondary py-2.5 px-5 disabled:opacity-40 disabled:cursor-not-allowed">
              ← Back
            </button>
            {step < STEPS.length - 1 ? (
              <button type="button" disabled={!canNext()} onClick={() => setStep((s) => s + 1)}
                className="btn-primary py-2.5 px-6 disabled:opacity-40 disabled:cursor-not-allowed">
                Next →
              </button>
            ) : (
              <button type="button" disabled={saving} onClick={handleSubmit}
                className="btn-primary py-2.5 px-6 flex items-center gap-2">
                {saving ? 'Publishing…' : <><CheckCircle2 size={18} />Publish Listing</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
