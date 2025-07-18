import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useMockAdminApi, mockFetchUserApi } from '@mock-data/useMockApi';
import { User } from '@baby-toys/types/src';

export type UserRole = 'admin' | 'customer';

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (role: UserRole) => boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mockAdminLogin } = useMockAdminApi();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!token);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  }, []);

  const fetchUser = useCallback(async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const userData = await mockFetchUserApi(token);
      setUser(userData);
    } catch (error) {
      console.error('Token invalid or expired. Logging out.');
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [token, logout]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { token: newToken } = await mockAdminLogin(email, password);
        localStorage.setItem('auth_token', newToken);
        setToken(newToken);
        const userData = await mockFetchUserApi(newToken);
        setUser(userData);
      } catch (error) {
        console.error('Login failed:', error);
        logout();
        throw error;
      }
    },
    [mockAdminLogin, logout]
  );

  const hasPermission = useCallback(
    (requiredRole: UserRole): boolean => {
      return !!token && user?.role === requiredRole;
    },
    [token, user]
  );

  useEffect(() => {
    if (token && !user) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [token, user, fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        hasPermission,
        isAuthenticated: !!token && !!user,
        isLoading,
      }}
    >
      {isLoading ? null : children}
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
