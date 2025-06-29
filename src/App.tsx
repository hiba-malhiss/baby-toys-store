import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.tsx';
import Layout from './components/layout/Layout/Layout.tsx';
import './App.scss';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.tsx';
import { BreadcrumbProvider } from './context/BreadcrumbContext.tsx';
import ShopPage from './pages/ShopPage/ShopPage.tsx';
import ProductDetailsPage from './pages/ProductDetailsPage/ProductDetailsPage.tsx';
import ShoppingCartPage from './pages/ShoppingCartPage/ShoppingCartPage.tsx';
import { ToastProvider } from './components/common/Toast/ToastContext.tsx';
import { StoreConfigurationProvider } from './context/StoreConfigurationContext.tsx';

const App: React.FC = () => {
  return (
    <StoreConfigurationProvider>
      <BreadcrumbProvider>
        <ToastProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product-details/:id" element={<ProductDetailsPage />} />
                <Route path="/shopping-cart" element={<ShoppingCartPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </ToastProvider>
      </BreadcrumbProvider>
    </StoreConfigurationProvider>
  );
};

export default App;
