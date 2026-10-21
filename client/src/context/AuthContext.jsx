import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const { data } = await api.get('/users/me');
      setUser(data.data.user);
    } catch {
      setUser(null);
      localStorage.removeItem('civora_token');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function login(payload) {
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem('civora_token', data.data.token);
    setUser(data.data.user);
    return data.data.user;
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('civora_token', data.data.token);
    setUser(data.data.user);
    return data.data.user;
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore */
    }
    localStorage.removeItem('civora_token');
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loading, login, register, logout, setUser, refresh }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
