import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import App from './App.tsx';
import './index.css';
import i18n from './i18n';
import { registerSW } from 'virtual:pwa-register';
import { initOfflineSyncManager } from './utils/offlineSync.ts';

// Register Service Worker for critical asset caching & PWA
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[SW] New system version available. Refreshing cached assets...');
    updateSW(true);
  },
  onOfflineReady() {
    console.log('[SW] Platform assets cached. Ready for offline operation.');
  },
});

// Fallback direct Service Worker registration for custom /sw.js routing
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.log('[ServiceWorker] Custom SW active with scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[ServiceWorker] Custom SW registration fallback notice:', err);
      });
  });
}

// Initialize Offline-First Data Synchronization Manager
initOfflineSyncManager();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </StrictMode>,
);
