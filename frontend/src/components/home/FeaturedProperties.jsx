import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { propertyAPI } from '../../services/api';
import PropertyCard from '../property/PropertyCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { ArrowRight, Sparkles } from 'lucide-react';

// Fallback demo properties when DB is empty
const DEMO_PROPERTIES = [
  { id: 'd1', title: '3BHK Luxury Apartment in Bandra', type: 'apartment', status: 'sale', price: 15000000, area_sqft: 1800, bedrooms: 3, bathrooms: 2, city: 'Mumbai', state: 'Maharashtra', thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80', is_verified: true, is_featured: true, views: 342, created_at: new Date().toISOString(), owner: { id: 'o1', full_name: 'Rahul Sharma', avatar_url: null } },
  { id: 'd2', title: 'Modern Villa with Pool — Whitefield', type: 'villa', status: 'sale', price: 45000000, area_sqft: 4200, bedrooms: 5, bathrooms: 4, city: 'Bangalore', state: 'Karnataka', thumbnail: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500&q=80', is_verified: true, is_featured: true, views: 521, created_at: new Date().toISOString(), owner: { id: 'o2', full_name: 'Priya Nair', avatar_url: null } },
  { id: 'd3', title: 'Prime Commercial Plot — Gurgaon', type: 'land', status: 'sale', price: 8500000, area_sqft: 3000, bedrooms: null, bathrooms: null, city: 'Delhi', state: 'Delhi', thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80', is_verified: false, is_featured: true, views: 189, created_at: new Date().toISOString(), owner: { id: 'o3', full_name: 'Amit Gupta', avatar_url: null } },
  { id: 'd4', title: '2BHK Sea-View Apartment — Marine Drive', type: 'apartment', status: 'rent', price: 85000, area_sqft: 1200, bedrooms: 2, bathrooms: 2, city: 'Mumbai', state: 'Maharashtra', thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80', is_verified: true, is_featured: true, views: 430, created_at: new Date().toISOString(), owner: { id: 'o4', full_name: 'Sneha Reddy', avatar_url: null } },
];

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    propertyAPI.getFeatured()
      .then(({ data }) => {
        setProperties(data.properties?.length ? data.properties : DEMO_PROPERTIES);
      })
      .catch(() => setProperties(DEMO_PROPERTIES))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 text-primary-600 text-sm font-semibold mb-2">
              <Sparkles size={16} />Featured Properties
            </div>
            <h2 className="section-title">Hand-Picked for You</h2>
            <p className="section-subtitle">Explore our curated selection of premium properties</p>
          </div>
          <Link to="/properties?is_featured=true" className="btn-secondary flex items-center gap-2 whitespace-nowrap">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading featured properties..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.slice(0, 8).map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
