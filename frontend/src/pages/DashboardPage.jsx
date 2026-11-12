import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { propertyAPI, bookingAPI, authAPI } from '../services/api';
import PropertyCard from '../components/property/PropertyCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatPrice, formatDate, capitalize } from '../utils/formatters';
import {
  Building2, Calendar, Heart, BarChart2, User, Plus,
  Edit3, Trash2, Eye, CheckCircle2, Clock, XCircle,
  TrendingUp, Bell, Settings, LogOut, Home
} from 'lucide-react';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'overview',  label: 'Overview',       icon: <Home size={16} /> },
  { id: 'listings',  label: 'My Listings',     icon: <Building2 size={16} /> },
  { id: 'bookings',  label: 'Bookings',        icon: <Calendar size={16} /> },
  { id: 'profile',   label: 'Profile',         icon: <User size={16} /> },
];

export default function DashboardPage() {
  const { user, isSeller, updateUser, logout } = useAuth();
  const [tab,         setTab]         = useState('overview');
  const [listings,    setListings]    = useState([]);
  const [bookings,    setBookings]    = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [profileForm, setProfileForm] = useState({ full_name: user?.full_name || '', phone: user?.phone || '', bio: user?.bio || '' });
  const [saving,      setSaving]      = useState(false);

  useEffect(() => {
    if (tab === 'listings' && isSeller) {
      setLoading(true);
      propertyAPI.getMyListings()
        .then(({ data }) => setListings(data.properties || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
    if (tab === 'bookings') {
      setLoading(true);
      const role = isSeller ? 'seller' : 'buyer';
      bookingAPI.getMy(role)
        .then(({ data }) => setBookings(data.bookings || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [tab, isSeller]);

  const handleDeleteListing = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await propertyAPI.delete(id);
      setListings((prev) => prev.filter((p) => p.id !== id));
      toast.success('Listing deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleUpdateBooking = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, { status });
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
      toast.success(`Booking ${status}`);
    } catch { toast.error('Failed to update booking'); }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(profileForm);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to save profile'); }
    finally { setSaving(false); }
  };

  const stats = [
    { label: 'My Listings',  value: listings.length,  icon: <Building2 size={22} />, color: 'bg-blue-50 text-blue-600',   show: isSeller },
    { label: 'Total Views',   value: listings.reduce((a, p) => a + (p.views || 0), 0), icon: <Eye size={22} />, color: 'bg-purple-50 text-purple-600', show: isSeller },
    { label: 'Bookings',      value: bookings.length,  icon: <Calendar size={22} />, color: 'bg-green-50 text-green-600',  show: true },
    { label: 'Profile',       value: user?.role ? capitalize(user.role) : '—', icon: <User size={22} />, color: 'bg-amber-50 text-amber-600', show: true, isText: true },
  ].filter((s) => s.show);

  const statusIcon = { pending: <Clock size={14} className="text-amber-500" />, confirmed: <CheckCircle2 size={14} className="text-green-500" />, cancelled: <XCircle size={14} className="text-red-500" />, completed: <CheckCircle2 size={14} className="text-blue-500" /> };
  const statusClass = { pending: 'bg-amber-50 text-amber-700', confirmed: 'bg-green-50 text-green-700', cancelled: 'bg-red-50 text-red-700', completed: 'bg-blue-50 text-blue-700' };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* User card */}
            <div className="card p-5 mb-4">
              <div className="flex items-center gap-3 mb-4">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} className="w-14 h-14 rounded-xl object-cover" alt={user.full_name} />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl">
                    {user?.full_name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{user?.full_name}</p>
                  <span className="badge bg-primary-50 text-primary-700 capitalize">{user?.role}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">Member since {formatDate(user?.created_at)}</p>
            </div>

            {/* Nav */}
            <div className="card overflow-hidden">
              {TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-3 w-full px-5 py-3.5 text-sm font-medium transition-colors border-b border-gray-50 last:border-0 ${
                    tab === t.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                  <span className={tab === t.id ? 'text-primary-500' : 'text-gray-400'}>{t.icon}</span>
                  {t.label}
                </button>
              ))}
              <button onClick={logout}
                className="flex items-center gap-3 w-full px-5 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={16} className="text-red-400" />Logout
              </button>
            </div>

            {isSeller && (
              <Link to="/add-listing" className="btn-primary w-full mt-4 flex items-center justify-center gap-2 py-3">
                <Plus size={18} />Add Listing
              </Link>
            )}
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">

            {/* Overview */}
            {tab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-2xl font-heading font-bold text-gray-900">
                    Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.full_name?.split(' ')[0]}! 👋
                  </h1>
                  <p className="text-gray-500 mt-1">Here's what's happening with your account.</p>
                </div>
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                  {stats.map((s) => (
                    <div key={s.label} className="card p-5">
                      <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center mb-3`}>{s.icon}</div>
                      <p className="text-2xl font-bold text-gray-900">{s.isText ? s.value : s.value.toLocaleString()}</p>
                      <p className="text-sm text-gray-400">{s.label}</p>
                    </div>
                  ))}
                </div>

                {isSeller && listings.length === 0 && (
                  <div className="card p-10 text-center">
                    <Building2 size={48} className="text-gray-200 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-700 mb-2">No listings yet</h3>
                    <p className="text-gray-400 text-sm mb-5">Start listing your properties to reach thousands of buyers.</p>
                    <Link to="/add-listing" className="btn-primary inline-flex items-center gap-2">
                      <Plus size={16} />Add Your First Listing
                    </Link>
                  </div>
                )}

                {isSeller && listings.length > 0 && (
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-3">Recent Listings</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {listings.slice(0, 2).map((p) => <PropertyCard key={p.id} property={p} />)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* My Listings */}
            {tab === 'listings' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-heading font-bold text-gray-900">My Listings ({listings.length})</h2>
                  <Link to="/add-listing" className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
                    <Plus size={16} />Add New
                  </Link>
                </div>
                {loading ? <LoadingSpinner /> : listings.length === 0 ? (
                  <div className="card p-10 text-center">
                    <Building2 size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400">No listings yet</p>
                    <Link to="/add-listing" className="btn-primary mt-4 inline-flex items-center gap-2">
                      <Plus size={16} />Add Listing
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {listings.map((p) => (
                      <div key={p.id} className="card p-4 flex items-center gap-4">
                        <img src={p.thumbnail || p.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=80'} className="w-20 h-16 rounded-xl object-cover flex-shrink-0" alt={p.title} />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{p.title}</h3>
                          <p className="text-sm text-primary-600 font-semibold">{formatPrice(p.price)}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                            <span>{p.city}</span>
                            <span className={`badge capitalize ${p.status === 'sale' ? 'badge-sale' : 'badge-rent'}`}>{p.status === 'sale' ? 'For Sale' : 'For Rent'}</span>
                            <span className="flex items-center gap-1"><Eye size={11} />{p.views || 0}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link to={`/properties/${p.id}`} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500"><Eye size={16} /></Link>
                          <button onClick={() => handleDeleteListing(p.id)} className="p-2 rounded-xl hover:bg-red-50 text-red-400"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bookings */}
            {tab === 'bookings' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-heading font-bold text-gray-900 mb-5">
                  {isSeller ? 'Received Bookings' : 'My Bookings'} ({bookings.length})
                </h2>
                {loading ? <LoadingSpinner /> : bookings.length === 0 ? (
                  <div className="card p-10 text-center">
                    <Calendar size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400">No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((b) => (
                      <div key={b.id} className="card p-5">
                        <div className="flex items-start gap-4">
                          {b.property?.thumbnail && (
                            <img src={b.property.thumbnail} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" alt={b.property.title} />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-semibold text-gray-900 truncate">{b.property?.title}</h3>
                              <span className={`badge capitalize flex items-center gap-1 ${statusClass[b.status]}`}>
                                {statusIcon[b.status]}{b.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-3">
                              <span className="capitalize">📌 {b.booking_type}</span>
                              <span>📅 {formatDate(b.visit_date)}</span>
                              {b.visit_time && <span>🕐 {b.visit_time}</span>}
                            </div>
                            {b.message && <p className="text-xs text-gray-400 mt-2 bg-gray-50 rounded-lg p-2">"{b.message}"</p>}
                            {/* Seller actions */}
                            {isSeller && b.status === 'pending' && (
                              <div className="flex gap-2 mt-3">
                                <button onClick={() => handleUpdateBooking(b.id, 'confirmed')}
                                  className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-lg">
                                  <CheckCircle2 size={13} />Confirm
                                </button>
                                <button onClick={() => handleUpdateBooking(b.id, 'cancelled')}
                                  className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-xs px-3 py-1.5 rounded-lg">
                                  <XCircle size={13} />Decline
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile */}
            {tab === 'profile' && (
              <div className="card p-6 animate-fade-in max-w-2xl">
                <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">Edit Profile</h2>
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div>
                    <label className="label">Full Name</label>
                    <input type="text" required value={profileForm.full_name}
                      onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                      className="input-field" />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input type="tel" value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="input-field" placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="label">Bio</label>
                    <textarea rows={4} value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="input-field resize-none"
                      placeholder="Tell buyers/sellers about yourself..." />
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm">
                    <p className="text-gray-400 mb-1">Email (cannot be changed)</p>
                    <p className="font-medium text-gray-700">{user?.email}</p>
                  </div>
                  <button type="submit" disabled={saving} className="btn-primary py-3">
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
