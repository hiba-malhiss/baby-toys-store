import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockFetchUserApi, mockLoginApi, mockRegisterApi } from '@mock-data/useMockApi';
import type { User, UserRole } from '@baby-toys/types/src';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (role: UserRole) => boolean;
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
    const { token: newToken, role } = await mockLoginApi(email, password);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('user_role', role);
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

  const hasPermission = (requiredRole: UserRole): boolean => {
    const role = localStorage.getItem('user_role');
    if (!user || !role) {
      return false;
    }
    return role === requiredRole;
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, login, register, logout, hasPermission }}
    >
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
