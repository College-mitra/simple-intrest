import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('messmates_user') || 'null'));

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('messmates_token', data.token);
    localStorage.setItem('messmates_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const registerAdmin = async (payload) => {
    const { data } = await api.post('/auth/register-admin', payload);
    localStorage.setItem('messmates_token', data.token);
    localStorage.setItem('messmates_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('messmates_token');
    localStorage.removeItem('messmates_user');
    setUser(null);
  };

  useEffect(() => {
    if (!user) return;
    api.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('messmates_token')}`;
  }, [user]);

  return <AuthContext.Provider value={{ user, login, registerAdmin, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
