import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BouncingDotsLoader } from '@baby-toys/ui-kit/src/components';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user, hasPermission, isLoading } = useAuth();

  if (isLoading) {
    return <BouncingDotsLoader />;
  }

  if (!token || !user || !hasPermission('admin')) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
