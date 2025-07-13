import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import ProductFormPage from './pages/ProductFormPage/ProductFormPage';
import OrderDetailsPage from './pages/OrderDetailsPage/OrderDetailsPage';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import DashboardPage from './pages/DashboardPage/DashboardPage.tsx';
import ProductsPage from './pages/ProductsPage/ProductsPage.tsx';
import OrdersPage from './pages/OrdersPage/OrdersPage.tsx';
import { AdminStoreConfigurationProvider } from './context/StoreConfigurationContext.tsx';

const App: React.FC = () => {
  return (
    <AdminStoreConfigurationProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/products"
              element={
                <PrivateRoute>
                  <ProductsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <OrdersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/product-form/:id"
              element={
                <PrivateRoute>
                  <ProductFormPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/order-details/:id"
              element={
                <PrivateRoute>
                  <OrderDetailsPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </AdminStoreConfigurationProvider>
  );
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" />;
};

export default App;
