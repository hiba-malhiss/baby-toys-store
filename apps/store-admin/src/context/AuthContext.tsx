import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useFetchProfile, type User, USER_ROLE } from '../api/authApi';
import { getAccessToken } from '../api/axiosConfig';
import { useAuthInit } from '../hooks/useAuthInit';

interface AuthContextType {
  user: User | null;
  hasPermission: (role?: USER_ROLE | USER_ROLE[]) => boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = getAccessToken();
  const isAuthenticated = useMemo(() => !!token, [token]);
  const { isLoading: isAuthInitLoading } = useAuthInit();
  const { data: user, isLoading: isProfileLoading } = useFetchProfile(isAuthenticated);

  const hasPermission = useCallback(
    (role?: USER_ROLE | USER_ROLE[]): boolean => {
      const requiredRole = role || USER_ROLE.CUSTOMER;
      if (!user) return false;
      if (Array.isArray(requiredRole)) return requiredRole.includes(user.role as USER_ROLE);
      return user.role === requiredRole;
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        hasPermission,
        isAuthenticated,
        isLoading: isProfileLoading,
        isInitializing: isAuthInitLoading || (isAuthenticated && isProfileLoading),
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
