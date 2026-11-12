// Format price in INR with lakh/crore notation
export const formatPrice = (price) => {
  if (!price) return '—';
  if (price >= 10_000_000) return `₹${(price / 10_000_000).toFixed(2)} Cr`;
  if (price >= 100_000)    return `₹${(price / 100_000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
};

export const formatArea = (sqft) => {
  if (!sqft) return '—';
  return `${sqft.toLocaleString('en-IN')} sq.ft`;
};

export const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

export const timeAgo = (iso) => {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)      return 'Just now';
  if (diff < 3600)    return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)   return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(iso);
};

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

export const propertyTypeLabel = (type) => {
  const map = {
    land: 'Land / Plot', house: 'House', apartment: 'Apartment',
    villa: 'Villa', shop: 'Shop', office: 'Office', commercial: 'Commercial',
  };
  return map[type] || capitalize(type);
};

export const truncate = (str, max = 120) =>
  str && str.length > max ? str.slice(0, max) + '…' : str;
