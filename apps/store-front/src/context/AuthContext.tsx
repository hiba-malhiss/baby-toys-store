import React, { createContext, useContext, useCallback, useEffect, useMemo, useRef } from 'react';
import { useFetchProfile, useLogout, type User, USER_ROLE } from '../api/authApi';
import { getAccessToken } from '../api/axiosConfig';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateAfterAuthenticated, refetchAfterAuthenticated } from '../api/queryInvalidation';
import { useMergeCart } from '../api/cartApi';
import { hasGuestCartToken, clearGuestCartToken } from '../utils/guestCart';
import { useAuthInit } from '../hooks/useAuthInit';

interface AuthContextType {
  user: User | null;
  logout: () => void;
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
  const { mutate: logout } = useLogout();

  const qc = useQueryClient();
  const { mutate: mergeCart } = useMergeCart();
  const prevAuthRef = useRef<boolean>(false);

  const hasPermission = useCallback(
    (role?: USER_ROLE | USER_ROLE[]): boolean => {
      const requiredRole = role || USER_ROLE.CUSTOMER;
      if(!user) return false;
      if(Array.isArray(requiredRole)) return requiredRole.includes(user.role as USER_ROLE);
      return user.role === requiredRole;
    },
    [user]
  );

  console.log(isAuthInitLoading,(isAuthenticated && isProfileLoading) )
  // App is initializing if auth init is loading, or if authenticated but profile is loading
  const isInitializing = isAuthInitLoading || (isAuthenticated && isProfileLoading);

  useEffect(() => {
    if(isAuthenticated) {
      invalidateAfterAuthenticated(qc);
      setTimeout(() => refetchAfterAuthenticated(qc), 0);

      // Merge guest cart into user cart on first authentication
      if(!prevAuthRef.current && hasGuestCartToken()) {
        mergeCart(undefined, {
          onSuccess: () => {
            clearGuestCartToken();
          },
          onError: () => {
            clearGuestCartToken();
          },
        });
      }
    }

    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, qc, mergeCart]);

  return (
    <AuthContext.Provider
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
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if(!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
