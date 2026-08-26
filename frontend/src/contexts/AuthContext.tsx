import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          const response = await api.get('/users/me');
          setUser(response.data);
          setToken(savedToken);
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    });
    const { user: loggedUser, token: newToken } = response.data;
    if (!loggedUser || !newToken) {
      throw new Error('Resposta inválida do servidor');
    }
    localStorage.setItem('token', newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setUser(loggedUser);
    setToken(newToken);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    const { user: newUser, token: newToken } = response.data;
    if (!newUser || !newToken) {
      throw new Error('Resposta inválida do servidor');
    }
    localStorage.setItem('token', newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setUser(newUser);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
