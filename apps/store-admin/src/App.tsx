import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import ProductFormPage from './pages/ProductFormPage/ProductFormPage';
import OrderDetailsPage from './pages/OrderDetailsPage/OrderDetailsPage';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import DashboardPage from './pages/DashboardPage/DashboardPage.tsx';
import ProductsPage from './pages/ProductsPage/ProductsPage.tsx';
import ProductViewPage from './pages/ProductViewPage/ProductViewPage';
import OrdersPage from './pages/OrdersPage/OrdersPage.tsx';
import CategoriesPage from './pages/CategoriesPage/CategoriesPage.tsx';
import BrandsPage from './pages/BrandsPage/BrandsPage.tsx';
import ColorsPage from './pages/ColorsPage/ColorsPage';
import MaterialsPage from './pages/MaterialsPage/MaterialsPage';
import CustomersPage from './pages/CustomersPage/CustomersPage';
import ReviewsPage from './pages/ReviewsPage/ReviewsPage';
import HomePageContent from './pages/HomePageContent/HomePageContent';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import ShippingOptionsPage from './pages/ShippingOptionsPage/ShippingOptionsPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { BouncingDotsLoader, Toast, ToastProvider } from '@baby-toys/ui-kit';
import CouponsPage from './pages/CouponsPage/CouponsPage.tsx';
import ContactMessagesPage from './pages/ContactMessagesPage/ContactMessagesPage';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent: React.FC = () => {
  const { isInitializing } = useAuth();

  if (isInitializing) {
    return <BouncingDotsLoader />;
  }

  return (
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
          path="/add-product"
          element={
            <PrivateRoute>
              <ProductFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-product/:id"
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
          path="/product/:id"
          element={
            <PrivateRoute>
              <ProductViewPage />
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
          path="/coupons"
          element={
            <PrivateRoute>
              <CouponsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/shipping-options"
          element={
            <PrivateRoute>
              <ShippingOptionsPage />
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
        <Route
          path="/reviews"
          element={
            <PrivateRoute>
              <ReviewsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/contact-messages"
          element={
            <PrivateRoute>
              <ContactMessagesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/homepage"
          element={
            <PrivateRoute>
              <HomePageContent />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <Toast />
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
