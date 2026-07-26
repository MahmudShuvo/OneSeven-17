import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token if present
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('borkha_user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
    } catch (_) {}
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err?.response?.data?.message || err.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);

export default api;
