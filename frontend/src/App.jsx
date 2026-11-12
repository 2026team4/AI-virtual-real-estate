import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import HomePage        from './pages/HomePage';
import PropertiesPage  from './pages/PropertiesPage';
import PropertyDetail  from './pages/PropertyDetailPage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import DashboardPage   from './pages/DashboardPage';
import AddListingPage  from './pages/AddListingPage';
import FavoritesPage   from './pages/FavoritesPage';
import ComparePage     from './pages/ComparePage';
import NotFoundPage    from './pages/NotFoundPage';

// Layout
import Layout          from './components/common/Layout';
import LoadingSpinner  from './components/common/LoadingSpinner';

// Protected route wrapper
const ProtectedRoute = ({ children, sellerOnly = false }) => {
  const { isAuthenticated, isSeller, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (sellerOnly && !isSeller) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"              element={<HomePage />} />
        <Route path="/properties"    element={<PropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/favorites"     element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
        <Route path="/compare"       element={<ComparePage />} />
        <Route path="/dashboard"     element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/add-listing"   element={<ProtectedRoute sellerOnly><AddListingPage /></ProtectedRoute>} />
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/register"      element={<RegisterPage />} />
        <Route path="*"              element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
