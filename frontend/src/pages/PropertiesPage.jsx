import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyAPI } from '../services/api';
import PropertyCard from '../components/property/PropertyCard';
import PropertyFilters from '../components/property/PropertyFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { SlidersHorizontal, LayoutGrid, List, Building2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties,  setProperties]   = useState([]);
  const [pagination,  setPagination]   = useState({});
  const [loading,     setLoading]      = useState(true);
  const [view,        setView]         = useState('grid');   // grid | list
  const [filtersOpen, setFiltersOpen]  = useState(false);

  const buildParams = useCallback(() => {
    const p = {};
    for (const [k, v] of searchParams.entries()) if (v) p[k] = v;
    if (!p.page)  p.page  = 1;
    if (!p.limit) p.limit = 12;
    return p;
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    propertyAPI.getAll(buildParams())
      .then(({ data }) => {
        setProperties(data.properties || []);
        setPagination(data.pagination || {});
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, [buildParams]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  const goPage = (p) => updateParam('page', p);

  const sortOptions = [
    { label: 'Newest First',     value: 'created_at:desc' },
    { label: 'Oldest First',     value: 'created_at:asc'  },
    { label: 'Price: Low–High',  value: 'price:asc'       },
    { label: 'Price: High–Low',  value: 'price:desc'      },
    { label: 'Most Viewed',      value: 'views:desc'       },
  ];
  const currentSort = `${searchParams.get('sort') || 'created_at'}:${searchParams.get('order') || 'desc'}`;

  const handleSort = (val) => {
    const [sort, order] = val.split(':');
    const next = new URLSearchParams(searchParams);
    next.set('sort', sort); next.set('order', order); next.set('page', '1');
    setSearchParams(next);
  };

  const totalPages = pagination.pages || 1;
  const currentPage = Number(searchParams.get('page') || 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">
              {searchParams.get('search')
                ? `Results for "${searchParams.get('search')}"`
                : searchParams.get('type')
                  ? `${searchParams.get('type').charAt(0).toUpperCase() + searchParams.get('type').slice(1)}s`
                  : 'All Properties'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {loading ? 'Loading…' : `${pagination.total || 0} properties found`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              value={currentSort}
              onChange={(e) => handleSort(e.target.value)}
              className="input-field py-2 text-sm max-w-[180px]"
            >
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* View toggle */}
            <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setView('grid')}
                className={`p-2.5 ${view === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                <LayoutGrid size={18} />
              </button>
              <button onClick={() => setView('list')}
                className={`p-2.5 ${view === 'list' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                <List size={18} />
              </button>
            </div>

            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="lg:hidden flex items-center gap-2 btn-secondary py-2.5 px-4 text-sm"
            >
              <SlidersHorizontal size={16} />Filters
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className={`
            lg:block lg:w-72 lg:flex-shrink-0
            ${filtersOpen
              ? 'fixed inset-0 z-40 bg-black/40 lg:static lg:bg-transparent'
              : 'hidden'}
          `} onClick={(e) => e.target === e.currentTarget && setFiltersOpen(false)}>
            <div className={`
              ${filtersOpen ? 'absolute right-0 top-0 h-full w-80 overflow-y-auto' : ''}
              lg:sticky lg:top-24 lg:w-72 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto
            `}>
              <PropertyFilters
                searchParams={searchParams}
                onUpdate={updateParam}
                onClose={() => setFiltersOpen(false)}
              />
            </div>
          </aside>

          {/* Main grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <LoadingSpinner text="Finding properties..." />
            ) : properties.length === 0 ? (
              <EmptyState
                icon={<Building2 size={64} />}
                title="No properties found"
                description="Try adjusting your filters or search terms to find more results."
              />
            ) : (
              <>
                <div className={view === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'flex flex-col gap-4'
                }>
                  {properties.map((p) => (
                    <PropertyCard key={p.id} property={p} compact={view === 'list'} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => goPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                      const p = i + 1;
                      return (
                        <button key={p} onClick={() => goPage(p)}
                          className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                            p === currentPage
                              ? 'bg-primary-600 text-white'
                              : 'border border-gray-200 hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => goPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
