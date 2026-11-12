import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-heading font-bold text-primary-100 mb-4">404</div>
      <h1 className="text-3xl font-heading font-bold text-gray-900 mb-3">Page Not Found</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/" className="btn-primary flex items-center gap-2">
          <Home size={18} />Go Home
        </Link>
        <Link to="/properties" className="btn-secondary flex items-center gap-2">
          <Search size={18} />Browse Properties
        </Link>
      </div>
    </div>
  );
}
