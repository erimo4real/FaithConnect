import { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin, fetchMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fc_token');
    if (token) {
      fetchMe()
        .then((u) => setUser(u))
        .catch(() => localStorage.removeItem('fc_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { user: u, token } = await loginAdmin(email, password);
    localStorage.setItem('fc_token', token);
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('fc_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
