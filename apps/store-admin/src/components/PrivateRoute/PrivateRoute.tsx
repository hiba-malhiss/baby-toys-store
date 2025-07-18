import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, hasPermission } = useAuth();
  return token && hasPermission('admin') ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
