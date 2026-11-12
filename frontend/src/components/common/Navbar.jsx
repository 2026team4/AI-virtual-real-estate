import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { notificationAPI } from '../../services/api';
import {
  Home, Search, Heart, BarChart2, Bell, User, LogOut,
  Menu, X, Plus, ChevronDown, Building2
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isSeller, logout } = useAuth();
  const { compareList } = useProperty();
  const navigate = useNavigate();

  const [menuOpen,    setMenuOpen]    = useState(false);
  const [userOpen,    setUserOpen]    = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [notifs,      setNotifs]      = useState([]);
  const [unread,      setUnread]      = useState(0);
  const [scrolled,    setScrolled]    = useState(false);
  const userRef  = useRef();
  const notifRef = useRef();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    notificationAPI.getAll().then(({ data }) => {
      setNotifs(data.notifications?.slice(0, 5) || []);
      setUnread(data.unread || 0);
    }).catch(() => {});
  }, [isAuthenticated]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserOpen(false);
  };

  const navLinks = [
    { to: '/',           label: 'Home',       icon: <Home size={16} /> },
    { to: '/properties', label: 'Properties', icon: <Building2 size={16} /> },
    { to: '/compare',    label: `Compare${compareList.length ? ` (${compareList.length})` : ''}`, icon: <BarChart2 size={16} /> },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-md group-hover:bg-primary-700 transition-colors">
              <Building2 size={20} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-gray-900 text-lg leading-none">AI</span>
              <span className="font-heading font-bold text-primary-600 text-lg leading-none"> RealEstate</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {l.icon}{l.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <Heart size={16} />Favorites
              </NavLink>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {isSeller && (
              <Link to="/add-listing" className="hidden md:flex items-center gap-1.5 btn-primary py-2 px-4 text-sm">
                <Plus size={16} />List Property
              </Link>
            )}

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifOpen((v) => !v)}
                    className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell size={20} />
                    {unread > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unread > 9 ? '9+' : unread}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-hover border border-gray-100 z-50 animate-fade-in">
                      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Notifications</span>
                        {unread > 0 && (
                          <button
                            className="text-xs text-primary-600 hover:text-primary-700"
                            onClick={() => {
                              notificationAPI.markRead('all');
                              setUnread(0);
                              setNotifs((n) => n.map((x) => ({ ...x, is_read: true })));
                            }}
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifs.length === 0 ? (
                          <p className="text-center text-gray-400 py-8 text-sm">No notifications</p>
                        ) : notifs.map((n) => (
                          <div key={n.id} className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 ${!n.is_read ? 'bg-primary-50/40' : ''}`}>
                            <p className="text-sm font-medium text-gray-800">{n.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => setUserOpen((v) => !v)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name} className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
                        {user?.full_name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                      {user?.full_name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${userOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userOpen && (
                    <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-hover border border-gray-100 z-50 animate-fade-in overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.full_name}</p>
                        <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                      </div>
                      <div className="py-1">
                        <Link to="/dashboard" onClick={() => setUserOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <User size={15} />Dashboard
                        </Link>
                        {isSeller && (
                          <Link to="/add-listing" onClick={() => setUserOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                            <Plus size={15} />Add Listing
                          </Link>
                        )}
                        <Link to="/favorites" onClick={() => setUserOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <Heart size={15} />Favorites
                        </Link>
                        <button onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                          <LogOut size={15} />Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"    className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors">Login</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100"
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 animate-slide-up">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {l.icon}{l.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <NavLink to="/favorites" onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <Heart size={16} />Favorites
            </NavLink>
          )}
          {isSeller && (
            <Link to="/add-listing" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-primary-700 bg-primary-50">
              <Plus size={16} />List a Property
            </Link>
          )}
          {!isAuthenticated && (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 btn-secondary py-2.5 text-sm text-center">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 btn-primary py-2.5 text-sm text-center">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
