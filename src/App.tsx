import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.tsx';
import Layout from './components/layout/Layout/Layout.tsx';
import ScrollToTop from './components/common/ScrollToTop.tsx';
import './App.scss';
import { BreadcrumbProvider } from './context/BreadcrumbContext.tsx';
import ShopPage from './pages/ShopPage/ShopPage.tsx';
import ProductDetailsPage from './pages/ProductDetailsPage/ProductDetailsPage.tsx';
import ShoppingCartPage from './pages/ShoppingCartPage/ShoppingCartPage.tsx';
import { ToastProvider } from './components/common/Toast/ToastContext.tsx';
import { StoreConfigurationProvider } from './context/StoreConfigurationContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import WishListPage from './pages/WishListPage/WishListPage.tsx';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage.tsx';
import ContactUsPage from './pages/ContactUsPage/ContactUsPage.tsx';
import OrderHistoryPage from './pages/OrderHistoryPage/OrderHistoryPage.tsx';
import PoliciesPage from './pages/PoliciesPage/PoliciesPage.tsx';

const App: React.FC = () => {
  return (
    <StoreConfigurationProvider>
      <AuthProvider>
        <BreadcrumbProvider>
          <ToastProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product-details/:id" element={<ProductDetailsPage />} />
                  <Route path="/shopping-cart" element={<ShoppingCartPage />} />
                  <Route path="/wish-list" element={<WishListPage />} />
                  <Route path="/orders-history" element={<OrderHistoryPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/contact-us" element={<ContactUsPage />} />
                  <Route path="/policies" element={<PoliciesPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </ToastProvider>
        </BreadcrumbProvider>
      </AuthProvider>
    </StoreConfigurationProvider>
  );
};

export default App;
