import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.scss';
import './styles/App.scss';
import './i18n';
import App from './App.tsx';
import { configureUiKitRuntime } from '@baby-toys/ui-kit';

configureUiKitRuntime({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  isDev: import.meta.env.DEV,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
