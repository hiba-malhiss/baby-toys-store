import React from 'react';
import './styles/App.scss';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.tsx';
import Layout from './components/Layout/Layout.tsx';
import { ScrollToTop } from '@baby-toys/ui-kit';
import { BreadcrumbProvider } from '@baby-toys/ui-kit/hooks';
import ShopPage from './pages/ShopPage/ShopPage.tsx';
import ProductDetailsPage from './pages/ProductDetailsPage/ProductDetailsPage.tsx';
import ShoppingCartPage from './pages/ShoppingCartPage/ShoppingCartPage.tsx';
import { ToastProvider } from '@baby-toys/ui-kit';
import WishListPage from './pages/WishListPage/WishListPage.tsx';
import AdminRedirect from './components/features/AdminRedirect/AdminRedirect.tsx';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage.tsx';
import ContactUsPage from './pages/ContactUsPage/ContactUsPage.tsx';
import OrderHistoryPage from './pages/OrderHistoryPage/OrderHistoryPage.tsx';
import PoliciesPage from './pages/PoliciesPage/PoliciesPage.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext.tsx';
import VerifyEmailPage from './pages/VerifyEmailPage/VerifyEmailPage.tsx';
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage';
import LocationAwareToast from './components/LocationAwareToast.tsx';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BreadcrumbProvider>
          <ToastProvider>
            <BrowserRouter>
              <LocationAwareToast>
                <ScrollToTop />
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product-details/:id" element={<ProductDetailsPage />} />
                    <Route path="/shopping-cart" element={<ShoppingCartPage />} />
                    <Route path="/wish-list" element={<WishListPage />} />
                    <Route path="/admin" element={<AdminRedirect />} />
                    <Route path="/orders-history" element={<OrderHistoryPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/contact-us" element={<ContactUsPage />} />
                    <Route path="/policies" element={<PoliciesPage />} />
                    <Route path="/verify-email" element={<VerifyEmailPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </LocationAwareToast>
            </BrowserRouter>
          </ToastProvider>
        </BreadcrumbProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
