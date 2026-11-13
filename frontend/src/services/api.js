import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data)   => api.post('/auth/register', data),
  login:    (data)   => api.post('/auth/login', data),
  logout:   ()       => api.post('/auth/logout'),
  getMe:    ()       => api.get('/auth/me'),
  updateProfile: (d) => api.put('/auth/profile', d),
  changePassword:(d) => api.put('/auth/change-password', d),
};

// ── Properties ────────────────────────────────────────────────────────────
export const propertyAPI = {
  getAll:      (params) => api.get('/properties', { params }),
  getFeatured: ()       => api.get('/properties/featured'),
  getStats:    ()       => api.get('/properties/stats'),
  getById:     (id)     => api.get(`/properties/${id}`),
  getMyListings: ()     => api.get('/properties/user/my-listings'),
  create:      (data)   => api.post('/properties', data),
  update:      (id, d)  => api.put(`/properties/${id}`, d),
  delete:      (id)     => api.delete(`/properties/${id}`),
  aiEstimate:  (data)   => api.post('/properties/ai-estimate', data),
};

// ── Bookings ──────────────────────────────────────────────────────────────
export const bookingAPI = {
  create:       (data)        => api.post('/bookings', data),
  getMy:        (role)        => api.get('/bookings/my', { params: { role } }),
  updateStatus: (id, data)    => api.patch(`/bookings/${id}/status`, data),
};

// ── Favorites ─────────────────────────────────────────────────────────────
export const favoriteAPI = {
  getAll:  ()    => api.get('/favorites'),
  toggle:  (pid) => api.post('/favorites/toggle', { property_id: pid }),
  check:   (pid) => api.get(`/favorites/check/${pid}`),
};

// ── Chatbot ───────────────────────────────────────────────────────────────
export const chatbotAPI = {
  send:        (message, context) => api.post('/chatbot/message', { message, context }),
  suggestions: ()                 => api.get('/chatbot/suggestions'),
};

// ── Notifications ─────────────────────────────────────────────────────────
export const notificationAPI = {
  getAll:  ()   => api.get('/notifications'),
  markRead:(id) => api.patch(`/notifications/${id}/read`),
  delete:  (id) => api.delete(`/notifications/${id}`),
};

// ── Upload ────────────────────────────────────────────────────────────────
export const uploadAPI = {
  image:  (data) => api.post('/upload/image', data),
  delete: (path) => api.delete('/upload/image', { data: { path } }),
};
