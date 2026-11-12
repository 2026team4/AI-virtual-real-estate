import { useState, useEffect, useCallback } from 'react';
import { propertyAPI } from '../services/api';

export const useProperties = (initialParams = {}) => {
  const [properties, setProperties]   = useState([]);
  const [pagination, setPagination]   = useState({});
  const [loading,    setLoading]      = useState(false);
  const [error,      setError]        = useState(null);
  const [params,     setParams]       = useState(initialParams);

  const fetch = useCallback(async (overrideParams) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await propertyAPI.getAll(overrideParams || params);
      setProperties(data.properties || []);
      setPagination(data.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateParams = useCallback((newParams) => {
    setParams((prev) => ({ ...prev, ...newParams, page: 1 }));
  }, []);

  const nextPage = useCallback(() => {
    if (pagination.page < pagination.pages) {
      setParams((p) => ({ ...p, page: p.page + 1 }));
    }
  }, [pagination]);

  return { properties, pagination, loading, error, params, updateParams, nextPage, refetch: fetch };
};

export const useProperty = (id) => {
  const [property,  setProperty]  = useState(null);
  const [similar,   setSimilar]   = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    propertyAPI.getById(id)
      .then(({ data }) => {
        setProperty(data.property);
        setSimilar(data.similar || []);
      })
      .catch((err) => setError(err.response?.data?.message || 'Not found'))
      .finally(() => setLoading(false));
  }, [id]);

  return { property, similar, loading, error };
};
