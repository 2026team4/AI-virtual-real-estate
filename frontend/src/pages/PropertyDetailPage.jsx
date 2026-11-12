import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { propertyAPI, bookingAPI, favoriteAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PropertyMap from '../components/property/PropertyMap';
import VirtualTour from '../components/property/VirtualTour';
import AIEstimateCard from '../components/property/AIEstimateCard';
import BookingModal from '../components/property/BookingModal';
import PropertyCard from '../components/property/PropertyCard';
import {
  Heart, BarChart2, Share2, MapPin, BedDouble, Bath, Maximize2,
  Calendar, Building2, CheckCircle2, Phone, Mail, MessageSquare,
  Eye, ChevronLeft, ChevronRight, Play, RotateCcw, Shield, Star
} from 'lucide-react';
import { formatPrice, formatArea, propertyTypeLabel, formatDate, capitalize } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function PropertyDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, isFavorited, addToCompare } = useProperty();

  const [property,     setProperty]     = useState(null);
  const [similar,      setSimilar]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [activeImg,    setActiveImg]    = useState(0);
  const [showTour,     setShowTour]     = useState(false);
  const [showBooking,  setShowBooking]  = useState(false);
  const [activeTab,    setActiveTab]    = useState('overview'); // overview | amenities | map | virtual

  useEffect(() => {
    setLoading(true);
    propertyAPI.getById(id)
      .then(({ data }) => { setProperty(data.property); setSimilar(data.similar || []); })
      .catch(() => setError('Property not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen text="Loading property..." />;
  if (error || !property) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Building2 size={60} className="text-gray-300" />
      <p className="text-gray-500">{error || 'Property not found'}</p>
      <button onClick={() => navigate('/properties')} className="btn-primary">Browse Properties</button>
    </div>
  );

  const images = property.images?.length ? property.images : [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
  ];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const tabs = [
    { id: 'overview',  label: 'Overview'      },
    { id: 'amenities', label: 'Amenities'     },
    { id: 'map',       label: '📍 Location'   },
    { id: 'virtual',   label: '360° Virtual Tour' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/properties" className="hover:text-primary-600">Properties</Link>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-[200px]">{property.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Left / Main ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image Gallery */}
            <div className="card overflow-hidden">
              <div className="relative aspect-[16/9] bg-gray-100">
                <img
                  src={images[activeImg]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {/* Nav arrows */}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => setActiveImg((i) => (i + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center">
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={property.status === 'sale' ? 'badge-sale' : 'badge-rent'}>
                    For {property.status === 'sale' ? 'Sale' : 'Rent'}
                  </span>
                  {property.is_verified && (
                    <span className="badge bg-white/90 text-primary-700">
                      <CheckCircle2 size={11} className="mr-1" />Verified
                    </span>
                  )}
                </div>
                {/* View count */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 text-white text-xs px-2.5 py-1.5 rounded-lg">
                  <Eye size={13} />{property.views || 0} views
                </div>
                {/* Virtual tour button */}
                {property.virtual_tour_url && (
                  <button onClick={() => setShowTour(true)}
                    className="absolute bottom-4 left-4 flex items-center gap-2 bg-primary-600 text-white text-sm px-4 py-2 rounded-xl shadow-lg hover:bg-primary-700 transition-colors">
                    <RotateCcw size={15} />360° Virtual Tour
                  </button>
                )}
                {property.video_url && (
                  <button className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white text-sm px-4 py-2 rounded-xl transition-colors">
                    <Play size={15} />Watch Video
                  </button>
                )}
                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 text-white text-xs px-3 py-1.5 rounded-full">
                  {activeImg + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-colors ${
                        i === activeImg ? 'border-primary-500' : 'border-transparent hover:border-gray-300'
                      }`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & key info */}
            <div className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge bg-primary-50 text-primary-700">{propertyTypeLabel(property.type)}</span>
                    {property.is_featured && <span className="badge bg-amber-50 text-amber-700">⭐ Featured</span>}
                  </div>
                  <h1 className="text-2xl font-heading font-bold text-gray-900 leading-snug">{property.title}</h1>
                  <div className="flex items-center gap-1.5 text-gray-500 mt-2">
                    <MapPin size={15} className="text-primary-500 flex-shrink-0" />
                    <span className="text-sm">{[property.address, property.city, property.state].filter(Boolean).join(', ')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-heading font-bold text-primary-700">{formatPrice(property.price)}</p>
                  {property.status === 'rent' && <p className="text-sm text-gray-400">/month</p>}
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-100">
                {[
                  { icon: <BedDouble size={18} />, label: 'Bedrooms',   value: property.bedrooms  ?? '—' },
                  { icon: <Bath size={18} />,       label: 'Bathrooms',  value: property.bathrooms ?? '—' },
                  { icon: <Maximize2 size={18} />,  label: 'Area',       value: formatArea(property.area_sqft) },
                  { icon: <Building2 size={18} />,  label: 'Year Built', value: property.year_built ?? '—' },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-primary-500 mb-1">{s.icon}</div>
                    <p className="font-semibold text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 mt-4">
                <button onClick={() => toggleFavorite(property.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    isFavorited(property.id) ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
                  }`}>
                  <Heart size={16} fill={isFavorited(property.id) ? 'currentColor' : 'none'} />
                  {isFavorited(property.id) ? 'Saved' : 'Save'}
                </button>
                <button onClick={() => addToCompare(property)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-colors">
                  <BarChart2 size={16} />Compare
                </button>
                <button onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  <Share2 size={16} />Share
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="card overflow-hidden">
              <div className="flex border-b border-gray-100 overflow-x-auto">
                {tabs.map((t) => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                      activeTab === t.id
                        ? 'border-primary-600 text-primary-700 bg-primary-50/50'
                        : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Overview */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {property.description && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">About this property</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Property Details</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {[
                          ['Type',         propertyTypeLabel(property.type)],
                          ['Status',       property.status === 'sale' ? 'For Sale' : 'For Rent'],
                          ['Area',         formatArea(property.area_sqft)],
                          ['Bedrooms',     property.bedrooms  ?? '—'],
                          ['Bathrooms',    property.bathrooms ?? '—'],
                          ['Floors',       property.floors    ?? '—'],
                          ['Year Built',   property.year_built ?? '—'],
                          ['Construction', capitalize(property.construction_status)],
                          ['Ownership',    capitalize(property.ownership_type)],
                          ['Furnished',    property.furnished ? 'Yes' : 'No'],
                          ['Parking',      property.parking   ? 'Yes' : 'No'],
                          ['Country',      property.country   ?? 'India'],
                        ].map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-gray-500">{k}</span>
                            <span className="font-medium text-gray-800">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {activeTab === 'amenities' && (
                  <div className="space-y-6">
                    {property.amenities?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {property.amenities.map((a) => (
                            <span key={a} className="flex items-center gap-1.5 bg-primary-50 text-primary-700 px-3 py-2 rounded-xl text-sm font-medium">
                              <CheckCircle2 size={14} />{a}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {property.nearby_facilities?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Nearby Facilities</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {property.nearby_facilities.map((f, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-sm">
                              <span className="text-xl">{f.emoji || '📍'}</span>
                              <div>
                                <p className="font-medium text-gray-800">{f.name}</p>
                                {f.distance && <p className="text-xs text-gray-400">{f.distance}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {!property.amenities?.length && !property.nearby_facilities?.length && (
                      <p className="text-gray-400 text-center py-8">No amenities listed for this property.</p>
                    )}
                  </div>
                )}

                {/* Map */}
                {activeTab === 'map' && (
                  <PropertyMap
                    lat={property.latitude}
                    lng={property.longitude}
                    title={property.title}
                    address={[property.address, property.city].filter(Boolean).join(', ')}
                  />
                )}

                {/* Virtual Tour */}
                {activeTab === 'virtual' && (
                  <VirtualTour url={property.virtual_tour_url} title={property.title} />
                )}
              </div>
            </div>

            {/* AI Price Estimate */}
            <AIEstimateCard property={property} />

            {/* Similar Properties */}
            {similar.length > 0 && (
              <div>
                <h2 className="text-xl font-heading font-bold text-gray-900 mb-4">Similar Properties</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {similar.map((p) => <PropertyCard key={p.id} property={p} compact />)}
                </div>
              </div>
            )}
          </div>

          {/* ── Right Sidebar ──────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Owner / Agent Card */}
            {property.owner && (
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-4">
                  {property.owner.avatar_url ? (
                    <img src={property.owner.avatar_url} className="w-14 h-14 rounded-xl object-cover" alt={property.owner.full_name} />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
                      {property.owner.full_name?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{property.owner.full_name}</p>
                    <p className="text-xs text-gray-400 capitalize flex items-center gap-1">
                      <Shield size={11} className="text-primary-500" />
                      {property.owner.role}
                    </p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1,2,3,4,5].map((s) => <Star key={s} size={11} className="fill-amber-400 text-amber-400" />)}
                      <span className="text-xs text-gray-400 ml-1">4.9</span>
                    </div>
                  </div>
                </div>
                {property.owner.bio && (
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">{property.owner.bio}</p>
                )}
                <div className="space-y-2">
                  {property.owner.phone && (
                    <a href={`tel:${property.owner.phone}`}
                      className="flex items-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl text-sm font-medium transition-colors">
                      <Phone size={16} />{property.owner.phone}
                    </a>
                  )}
                  {property.owner.email && (
                    <a href={`mailto:${property.owner.email}`}
                      className="flex items-center gap-2 w-full border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-xl text-sm font-medium transition-colors">
                      <Mail size={16} />Send Email
                    </a>
                  )}
                  <button onClick={() => isAuthenticated ? setShowBooking(true) : navigate('/login')}
                    className="flex items-center gap-2 w-full btn-primary py-3 text-sm justify-center">
                    <Calendar size={16} />Book a Visit
                  </button>
                  <button onClick={() => isAuthenticated ? setShowBooking(true) : navigate('/login')}
                    className="flex items-center gap-2 w-full btn-secondary py-3 text-sm justify-center">
                    <MessageSquare size={16} />Virtual Meeting
                  </button>
                </div>
              </div>
            )}

            {/* Key info summary */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Summary</h3>
              <div className="space-y-3 text-sm">
                {[
                  ['Listed On',   formatDate(property.created_at)],
                  ['Property ID', property.id?.slice(0, 8).toUpperCase()],
                  ['City',        property.city],
                  ['Zip Code',    property.zip_code || '—'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-400">{k}</span>
                    <span className="text-gray-800 font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Virtual Tour overlay */}
      {showTour && (
        <VirtualTour url={property.virtual_tour_url} title={property.title} fullscreen onClose={() => setShowTour(false)} />
      )}

      {/* Booking Modal */}
      {showBooking && (
        <BookingModal
          property={property}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  );
}
