import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('borkha_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('borkha_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('borkha_user', JSON.stringify(data));
    setUser(data);
    toast.success(`Successfully logged in! Welcome back, ${data.name}.`);
    return data;
  };

  const signup = async (form) => {
    const { data } = await api.post('/auth/signup', form);
    localStorage.setItem('borkha_user', JSON.stringify(data));
    setUser(data);
    toast.success(`Successfully signed up! Welcome, ${data.name}.`);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('borkha_user');
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
