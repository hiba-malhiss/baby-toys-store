import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useMockAdminApi, mockFetchUserApi } from '@mock-data/useMockApi';
import { User } from '@baby-toys/types/src';
export type UserRole = 'admin' | 'customer';
interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mockAdminLogin } = useMockAdminApi();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [user, setUser] = useState<User | null>(null);

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
    const { token: newToken } = await mockAdminLogin(email, password);
    localStorage.setItem('auth_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    const role = localStorage.getItem('user_role');
    if (!user || !role) {
      return false;
    }
    return role === requiredRole;
  };

  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token, fetchUser]);

  return (
    <AuthContext.Provider value={{ token, login, logout, hasPermission }}>
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
