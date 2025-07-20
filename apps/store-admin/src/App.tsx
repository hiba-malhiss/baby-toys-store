import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import ProductFormPage from './pages/ProductFormPage/ProductFormPage';
import OrderDetailsPage from './pages/OrderDetailsPage/OrderDetailsPage';
import { AuthProvider } from './context/AuthContext.tsx';
import DashboardPage from './pages/DashboardPage/DashboardPage.tsx';
import ProductsPage from './pages/ProductsPage/ProductsPage.tsx';
import OrdersPage from './pages/OrdersPage/OrdersPage.tsx';
import CategoriesPage from './pages/CategoriesPage/CategoriesPage.tsx';
import BrandsPage from './pages/BrandsPage/BrandsPage.tsx';
import ColorsPage from './pages/ColorsPage/ColorsPage';
import MaterialsPage from './pages/MaterialsPage/MaterialsPage';
import CustomersPage from './pages/CustomersPage/CustomersPage';
import { AdminStoreConfigurationProvider } from './context/StoreConfigurationContext.tsx';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { ToastProvider } from '@baby-toys/ui-kit/components';

const App: React.FC = () => {
  return (
    <AdminStoreConfigurationProvider>
      <ToastProvider>
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
              <Route
                path="/order-edit/:id"
                element={
                  <PrivateRoute>
                    <OrderDetailsPage isEdit />
                  </PrivateRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <PrivateRoute>
                    <CategoriesPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/brands"
                element={
                  <PrivateRoute>
                    <BrandsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/colors"
                element={
                  <PrivateRoute>
                    <ColorsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/materials"
                element={
                  <PrivateRoute>
                    <MaterialsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <PrivateRoute>
                    <CustomersPage />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </AdminStoreConfigurationProvider>
  );
};

export default App;
