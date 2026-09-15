import {StrictMode, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import App from './App.tsx';
import MinimalPublicLanding from './components/MinimalPublicLanding.tsx';
import OperatingContextSelector, { OPERATING_CONTEXT_KEY, OperatingContext } from './components/OperatingContextSelector.tsx';
import './index.css';
import i18n from './i18n';
import { initOfflineSyncManager } from './utils/offlineSync.ts';

// VitePWA provides the single canonical service-worker registration.
// Offline mutations are managed by the application IndexedDB sync manager.
initOfflineSyncManager();

function PublicExperience() {
  const [showLanding, setShowLanding] = useState(() => !localStorage.getItem('rupay_token'));
  const [context, setContext] = useState<OperatingContext>(() =>
    localStorage.getItem(OPERATING_CONTEXT_KEY) === 'rural' ? 'rural' : 'urban'
  );

  useEffect(() => {
    const syncAuth = () => setShowLanding(!localStorage.getItem('rupay_token'));
    const syncContext = () => {
      const next = localStorage.getItem(OPERATING_CONTEXT_KEY) === 'rural' ? 'rural' : 'urban';
      setContext(next);
    };
    const applyOperatingContext = () => {
      // App.tsx already derives its complete operating labels, categories and
      // role rules from the persisted operatingContext state. Reloading the
      // application shell here guarantees the existing OS initializes from
      // the newly selected context without duplicating or replacing that logic.
      window.location.reload();
    };

    window.addEventListener('storage', syncAuth);
    window.addEventListener('storage', syncContext);
    window.addEventListener('rupay:operating-context-change', syncContext);
    window.addEventListener('rupay:operating-context-change', applyOperatingContext);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('storage', syncContext);
      window.removeEventListener('rupay:operating-context-change', syncContext);
      window.removeEventListener('rupay:operating-context-change', applyOperatingContext);
    };
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
      <div className={`fixed right-4 z-[1001] ${showLanding ? 'top-20' : 'top-4'}`}>
        <OperatingContextSelector compact />
      </div>
      {showLanding && (
        <MinimalPublicLanding
          onLogin={() => openExistingAuth('Launch OS')}
          onRegister={() => openExistingAuth('Register Stakeholder')}
        />
      )}
      <span className="sr-only" aria-live="polite">Operating context: {context}</span>
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
