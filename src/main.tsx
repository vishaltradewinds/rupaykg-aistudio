import {StrictMode, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import App from './App.tsx';
import MinimalPublicLanding from './components/MinimalPublicLanding.tsx';
import './index.css';
import i18n from './i18n';
import { initOfflineSyncManager } from './utils/offlineSync.ts';

// VitePWA provides the single canonical service-worker registration.
// Offline mutations are managed by the application IndexedDB sync manager.
initOfflineSyncManager();

function PublicExperience() {
  const [showLanding, setShowLanding] = useState(() => !localStorage.getItem('rupay_token'));

  useEffect(() => {
    const syncAuth = () => setShowLanding(!localStorage.getItem('rupay_token'));
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  const openExistingAuth = (preferredText: string) => {
    setShowLanding(false);
    window.setTimeout(() => {
      const button = Array.from(document.querySelectorAll('button')).find((el) =>
        el.textContent?.replace(/\s+/g, ' ').trim().toLowerCase().includes(preferredText.toLowerCase())
      ) as HTMLButtonElement | undefined;
      if (button) button.click();
      else setShowLanding(true);
    }, 50);
  };

  return (
    <>
      <App />
      {showLanding && (
        <MinimalPublicLanding
          onLogin={() => openExistingAuth('Launch OS')}
          onRegister={() => openExistingAuth('Register Stakeholder')}
        />
      )}
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <PublicExperience />
    </I18nextProvider>
  </StrictMode>,
);
