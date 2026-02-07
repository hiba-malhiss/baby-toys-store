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
import CustomersPage from './pages/CustomersPage/CustomersPage';
import ReviewsPage from './pages/ReviewsPage/ReviewsPage';
import AdminAuditLogsPage from './pages/AdminAuditLogsPage/AdminAuditLogsPage';
import HomePageContent from './pages/HomePageContent/HomePageContent';
import ProductAnalyticsPage from './pages/ProductAnalyticsPage/ProductAnalyticsPage';
import TownAnalyticsPage from './pages/TownAnalyticsPage/TownAnalyticsPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import DeliveryTownsPage from './pages/DeliveryTownsPage/DeliveryTownsPage';
import DeliveryZonesPage from './pages/DeliveryZonesPage/DeliveryZonesPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { BouncingDotsLoader, Toast, ToastProvider } from '@baby-toys/ui-kit';
import CouponsPage from './pages/CouponsPage/CouponsPage.tsx';
import ContactMessagesPage from './pages/ContactMessagesPage/ContactMessagesPage';
import FinancePage from './pages/FinancePage/FinancePage';
import MonthDetailPage from './pages/MonthDetailPage/MonthDetailPage';
import ExpensesPage from './pages/ExpensesPage/ExpensesPage';
import OptionsPage from './pages/OptionsPage/OptionsPage.tsx';
import AttributesPage from './pages/AttributesPage/AttributesPage.tsx';
import ProductVariationsPage from './pages/ProductVariationsPage/ProductVariationsPage';

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
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/finance"
          element={
            <PrivateRoute>
              <FinancePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/finance/:yearMonth"
          element={
            <PrivateRoute>
              <MonthDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <PrivateRoute>
              <ExpensesPage />
            </PrivateRoute>
          }
        />
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
          path="/edit-product/:id/variations"
          element={
            <PrivateRoute>
              <ProductVariationsPage />
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
          path="/coupons"
          element={
            <PrivateRoute>
              <CouponsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/delivery/zones"
          element={
            <PrivateRoute>
              <DeliveryZonesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/delivery/towns"
          element={
            <PrivateRoute>
              <DeliveryTownsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/attributes"
          element={
            <PrivateRoute>
              <AttributesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/options"
          element={
            <PrivateRoute>
              <OptionsPage />
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
          path="/audit-logs"
          element={
            <PrivateRoute>
              <AdminAuditLogsPage />
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
          path="/analytics/products"
          element={
            <PrivateRoute>
              <ProductAnalyticsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics/towns"
          element={
            <PrivateRoute>
              <TownAnalyticsPage />
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
