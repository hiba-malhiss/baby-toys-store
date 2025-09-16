import React, { createContext, useContext, useCallback } from 'react';
import { useFetchProfile, type User, USER_ROLE } from '../api/authApi';
import { getAccessToken } from '../api/axiosConfig';

interface AuthContextType {
  user: User | null;
  logout: () => void;
  hasPermission: (role?: USER_ROLE | USER_ROLE[]) => boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: user, isLoading } = useFetchProfile();

  const hasPermission = useCallback(
    (role?: USER_ROLE | USER_ROLE[]): boolean => {
      const requiredRole = role || USER_ROLE.CUSTOMER;
      if (!user) return false;
      if (Array.isArray(requiredRole)) return requiredRole.includes(user.role as USER_ROLE);
      return user.role === requiredRole;
    },
    [user]
  );

  const token = getAccessToken();

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        hasPermission,
        isAuthenticated: !!token && !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
