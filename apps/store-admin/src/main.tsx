import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/main.scss';
import { configureUiKitRuntime } from '@baby-toys/ui-kit';

configureUiKitRuntime({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  isDev: import.meta.env.DEV,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
