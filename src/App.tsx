import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.tsx';
import Layout from './components/layout/Layout/Layout.tsx';
import './App.scss';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.tsx';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
