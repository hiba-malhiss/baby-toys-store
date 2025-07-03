import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockFetchUserApi, mockLoginApi, mockRegisterApi } from '../mock-data/useMockProductsApi';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [user, setUser] = useState<User | null>(null);
  const isLoggedIn = !!token && !!user;

  const fetchUser = useCallback(async () => {
    if (!token) return;
    try {
      const userData = await mockFetchUserApi(token);
      setUser(userData);
    } catch (err) {
      console.error('Auth error:', err);
      logout();
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const { token: newToken } = await mockLoginApi(email, password);
    localStorage.setItem('auth_token', newToken);
    setToken(newToken);
  };

  const register = async (email: string, password: string) => {
    const { token: newToken } = await mockRegisterApi(email, password);
    localStorage.setItem('auth_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token, fetchUser]);

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
