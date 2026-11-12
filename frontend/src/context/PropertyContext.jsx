import { createContext, useContext, useState, useCallback } from 'react';
import { propertyAPI, favoriteAPI } from '../services/api';
import toast from 'react-hot-toast';

const PropertyContext = createContext(null);

export const PropertyProvider = ({ children }) => {
  const [favorites,    setFavorites]    = useState(new Set());
  const [compareList,  setCompareList]  = useState([]);   // max 3 properties
  const [searchFilters, setSearchFilters] = useState({});

  // ── Favorites ────────────────────────────────────────────────────────
  const loadFavorites = useCallback(async () => {
    try {
      const { data } = await favoriteAPI.getAll();
      const ids = data.favorites.map((f) => f.property?.id).filter(Boolean);
      setFavorites(new Set(ids));
    } catch {}
  }, []);

  const toggleFavorite = useCallback(async (propertyId) => {
    try {
      const { data } = await favoriteAPI.toggle(propertyId);
      setFavorites((prev) => {
        const next = new Set(prev);
        data.favorited ? next.add(propertyId) : next.delete(propertyId);
        return next;
      });
      toast.success(data.favorited ? 'Added to favorites' : 'Removed from favorites');
      return data.favorited;
    } catch {
      toast.error('Failed to update favorites');
    }
  }, []);

  const isFavorited = useCallback((id) => favorites.has(id), [favorites]);

  // ── Compare ───────────────────────────────────────────────────────────
  const addToCompare = useCallback((property) => {
    setCompareList((prev) => {
      if (prev.find((p) => p.id === property.id)) {
        toast('Already in compare list');
        return prev;
      }
      if (prev.length >= 3) {
        toast.error('You can compare up to 3 properties');
        return prev;
      }
      toast.success(`"${property.title}" added to compare`);
      return [...prev, property];
    });
  }, []);

  const removeFromCompare = useCallback((id) => {
    setCompareList((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearCompare = useCallback(() => setCompareList([]), []);

  const isInCompare = useCallback((id) => compareList.some((p) => p.id === id), [compareList]);

  return (
    <PropertyContext.Provider value={{
      favorites, loadFavorites, toggleFavorite, isFavorited,
      compareList, addToCompare, removeFromCompare, clearCompare, isInCompare,
      searchFilters, setSearchFilters,
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const ctx = useContext(PropertyContext);
  if (!ctx) throw new Error('useProperty must be used inside PropertyProvider');
  return ctx;
};
