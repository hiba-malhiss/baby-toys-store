import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BouncingDotsLoader } from '@baby-toys/ui-kit/components';
import { USER_ROLE } from '../../api/authApi.ts';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, hasPermission, isLoading } = useAuth();

  if (isLoading) {
    return <BouncingDotsLoader />;
  }

  if (!isAuthenticated || !user || !hasPermission(USER_ROLE.ADMIN)) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
