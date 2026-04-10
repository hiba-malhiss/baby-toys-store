import React, { createContext, useContext, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  useAdminAuthToken,
  useFetchAdminProfile,
  useAdminLogout,
  type AdminUser,
  USER_ROLE,
} from '../api/authApi';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminAuthInit } from '../hooks/useAdminAuthInit';

interface AdminAuthContextType {
  user: AdminUser | null;
  logout: () => void;
  hasPermission: (role?: USER_ROLE | USER_ROLE[]) => boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: token } = useAdminAuthToken();
  const { isLoading: isAuthInitLoading } = useAdminAuthInit();
  const { data: user, isLoading: isProfileLoading } = useFetchAdminProfile();
  const { mutate: logout } = useAdminLogout();
  const isAuthenticated = useMemo(() => !!token || !!user, [token, user]);

  const qc = useQueryClient();
  const prevAuthRef = useRef<boolean>(false);

  const hasPermission = useCallback(
    (role?: USER_ROLE | USER_ROLE[]): boolean => {
      const requiredRole = role || USER_ROLE.ADMIN;
      if (!user) return false;
      if (Array.isArray(requiredRole)) return requiredRole.includes(user.role as USER_ROLE);
      return user.role === requiredRole;
    },
    [user]
  );

  // App is initializing if auth init is loading, or if authenticated but profile is loading
  const isInitializing = isAuthInitLoading || (isAuthenticated && isProfileLoading);

  useEffect(() => {
    if (isAuthenticated) {
      // Invalidate and refetch queries after authentication
      qc.invalidateQueries();
    }

    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, qc]);

  return (
    <AdminAuthContext.Provider
      value={{
        user: user ?? null,
        logout,
        hasPermission,
        isAuthenticated,
        isLoading: isProfileLoading,
        isInitializing,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return context;
};
