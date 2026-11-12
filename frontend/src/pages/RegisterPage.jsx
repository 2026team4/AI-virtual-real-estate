import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES = [
  { id: 'buyer',  label: 'Buyer',  desc: 'Looking to buy or rent',  emoji: '🏠' },
  { id: 'seller', label: 'Seller', desc: 'Want to list properties', emoji: '🏷️' },
  { id: 'agent',  label: 'Agent',  desc: 'Real estate professional', emoji: '🤝' },
];

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', password: '', confirm: '', role: 'buyer',
  });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) { navigate('/'); return null; }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6)       { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register({ full_name: form.full_name, email: form.email, phone: form.phone, password: form.password, role: form.role });
      toast.success('Account created! Welcome 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)  s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/\d/.test(p))    s++;
    if (/[^a-zA-Z0-9]/.test(p)) s++;
    return s;
  };
  const strength = passwordStrength();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500', 'bg-emerald-500'][strength];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85"
          alt="Register"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-dark-900/80" />
        <div className="relative z-10 flex flex-col justify-between p-10 text-white">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Building2 size={22} />
            </div>
            <span className="font-heading font-bold text-xl">AI RealEstate</span>
          </Link>
          <div>
            <h2 className="text-3xl font-heading font-bold mb-4">Join 50,000+ Users</h2>
            <p className="text-white/70 mb-6">Get access to India's smartest property platform.</p>
            <div className="space-y-3">
              {['AI-powered property search','360° virtual tours','Verified listings only','Free forever for buyers'].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-white/80">
                  <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />{f}
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/40 text-sm">© {new Date().getFullYear()} AI RealEstate</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <span className="font-heading font-bold text-gray-900 text-lg">AI RealEstate</span>
          </div>

          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-500 mb-6">Free forever for buyers. Start exploring today.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div>
              <label className="label">I am a…</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button key={r.id} type="button" onClick={() => set('role', r.id)}
                    className={`flex flex-col items-center gap-1.5 p-3.5 rounded-2xl border-2 transition-colors ${
                      form.role === r.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <span className="text-2xl">{r.emoji}</span>
                    <span className={`text-sm font-semibold ${form.role === r.id ? 'text-primary-700' : 'text-gray-700'}`}>{r.label}</span>
                    <span className="text-xs text-gray-400 text-center leading-tight">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Full name */}
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" required placeholder="Rahul Sharma"
                  value={form.full_name} onChange={(e) => set('full_name', e.target.value)}
                  className="input-field pl-10" />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" required placeholder="you@email.com"
                    value={form.email} onChange={(e) => set('email', e.target.value)}
                    className="input-field pl-10 text-sm" />
                </div>
              </div>
              <div>
                <label className="label">Phone (optional)</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" placeholder="+91 98765 43210"
                    value={form.phone} onChange={(e) => set('phone', e.target.value)}
                    className="input-field pl-10 text-sm" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPw ? 'text' : 'password'} required placeholder="Min. 6 characters"
                  value={form.password} onChange={(e) => set('password', e.target.value)}
                  className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{strengthLabel}</p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" required placeholder="Repeat password"
                  value={form.confirm} onChange={(e) => set('confirm', e.target.value)}
                  className={`input-field pl-10 ${form.confirm && form.confirm !== form.password ? 'border-red-400 focus:ring-red-300' : ''}`} />
                {form.confirm && form.confirm === form.password && (
                  <CheckCircle2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500" />
                )}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base mt-2">
              {loading ? 'Creating account…' : <><span>Create Account</span><ArrowRight size={18} /></>}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By signing up, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:underline">Terms</a> and{' '}
              <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>.
            </p>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
