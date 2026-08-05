import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Database, CheckCircle2, AlertCircle, CloudUpload, Trash2, ShieldCheck } from 'lucide-react';
import { 
  getQueuedCount, 
  getQueuedMutations, 
  syncOfflineMutations, 
  clearAllQueuedMutations, 
  QueuedMutation 
} from '../utils/offlineSync';
import { useTranslation } from 'react-i18next';

export const OfflineStatusBadge: React.FC = () => {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [queueCount, setQueueCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [mutationsList, setMutationsList] = useState<QueuedMutation[]>([]);
  const [lastSyncResult, setLastSyncResult] = useState<{ syncedCount: number; errors: number; timestamp: string } | null>(null);

  const refreshState = async () => {
    const count = await getQueuedCount();
    setQueueCount(count);
  };

  useEffect(() => {
    refreshState();

    const handleOnline = () => {
      setIsOnline(true);
      refreshState();
    };

    const handleOffline = () => {
      setIsOnline(false);
      refreshState();
    };

    const handleQueueCount = (e: any) => {
      if (e.detail?.count !== undefined) {
        setQueueCount(e.detail.count);
      } else {
        refreshState();
      }
    };

    const handleSyncComplete = (e: any) => {
      setIsSyncing(false);
      refreshState();
      if (e.detail) {
        setLastSyncResult({
          syncedCount: e.detail.syncedCount || 0,
          errors: e.detail.errors || 0,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('rupaykg:offline-queue-count', handleQueueCount);
    window.addEventListener('rupaykg:offline-mutation-queued', refreshState);
    window.addEventListener('rupaykg:offline-sync-complete', handleSyncComplete);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('rupaykg:offline-queue-count', handleQueueCount);
      window.removeEventListener('rupaykg:offline-mutation-queued', refreshState);
      window.removeEventListener('rupaykg:offline-sync-complete', handleSyncComplete);
    };
  }, []);

  const handleManualSync = async () => {
    if (!isOnline) return;
    setIsSyncing(true);
    const result = await syncOfflineMutations();
    setIsSyncing(false);
    setLastSyncResult({
      syncedCount: result.syncedCount,
      errors: result.errors,
      timestamp: new Date().toLocaleTimeString(),
    });
    refreshState();
  };

  const handleToggleDetails = async () => {
    if (!showDetails) {
      const list = await getQueuedMutations();
      setMutationsList(list);
    }
    setShowDetails(!showDetails);
  };

  const handleClearQueue = async () => {
    if (window.confirm('Are you sure you want to clear all pending offline buffered records?')) {
      await clearAllQueuedMutations();
      setMutationsList([]);
      refreshState();
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Primary Header Badge Trigger */}
      <button
        onClick={handleToggleDetails}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-sm ${
          !isOnline
            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 animate-pulse'
            : queueCount > 0
            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
            : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
        }`}
        title={isOnline ? 'Network Connected' : 'Working Offline - Data Buffered'}
      >
        {isSyncing ? (
          <RefreshCw size={14} className="animate-spin text-emerald-400" />
        ) : !isOnline ? (
          <WifiOff size={14} className="text-amber-400" />
        ) : (
          <Wifi size={14} className="text-emerald-400" />
        )}

        <span>
          {!isOnline ? (
            <span className="flex items-center gap-1.5">
              <span>{t('Offline Mode')}</span>
              {queueCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500/30 text-amber-200 text-[10px] font-bold rounded-full border border-amber-400/30">
                  {queueCount} {t('buffered')}
                </span>
              )}
            </span>
          ) : isSyncing ? (
            <span>{t('Syncing IndexedDB...')}</span>
          ) : queueCount > 0 ? (
            <span className="flex items-center gap-1.5">
              <span>{t('Online')}</span>
              <span className="px-1.5 py-0.2 bg-emerald-500/30 text-emerald-200 text-[10px] font-bold rounded-full border border-emerald-400/30">
                {queueCount} {t('queued')}
              </span>
            </span>
          ) : (
            <span>{t('Online')}</span>
          )}
        </span>
      </button>

      {/* Popover / Modal Detail Card */}
      {showDetails && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-[#0e1626] border border-white/15 rounded-2xl shadow-2xl z-50 p-4 text-white text-xs backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Database size={16} className="text-emerald-400" />
              <h4 className="font-bold text-sm text-white">{t('Offline Data Engine')}</h4>
            </div>
            <button
              onClick={() => setShowDetails(false)}
              className="text-white/40 hover:text-white text-sm font-bold px-1"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 space-y-2.5">
            {/* Connection Status Row */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-white/60">{t('Connection Status')}</span>
              <span className={`flex items-center gap-1.5 font-bold ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                {isOnline ? t('Connected to RupayKg') : t('Offline (Disconnected)')}
              </span>
            </div>

            {/* IndexedDB Buffer Status */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-white/60">{t('IndexedDB Local Buffer')}</span>
              <span className="font-mono font-bold text-emerald-300">
                {queueCount} {t('Form Submissions')}
              </span>
            </div>

            {/* Service Worker Shell State */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-white/60">{t('PWA Shell & Cache')}</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck size={14} />
                {t('Active (sw.js v1)')}
              </span>
            </div>

            {/* Sync Notifications */}
            {lastSyncResult && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-[11px]">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span>{t('Last Sync Completed')} ({lastSyncResult.timestamp})</span>
                </div>
                <p>
                  {t('Successfully replayed')} {lastSyncResult.syncedCount} {t('records to RupayKg API')}
                  {lastSyncResult.errors > 0 && ` (${lastSyncResult.errors} errors)`}.
                </p>
              </div>
            )}

            {/* Queued Mutations Preview List */}
            {mutationsList.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-[11px] text-white/50 mb-1.5">
                  <span>{t('Pending Submissions in Queue')}</span>
                  <button
                    onClick={handleClearQueue}
                    className="text-red-400/80 hover:text-red-300 flex items-center gap-1"
                  >
                    <Trash2 size={11} />
                    {t('Clear Queue')}
                  </button>
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                  {mutationsList.map((m) => (
                    <div key={m.id} className="p-2 rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono flex items-center justify-between">
                      <div className="truncate max-w-[200px]">
                        <span className="text-emerald-400 font-bold mr-1">{m.method}</span>
                        <span className="text-white/80">{m.url}</span>
                      </div>
                      <span className="text-white/40 text-[10px]">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sync Action Button */}
            <div className="pt-2">
              <button
                onClick={handleManualSync}
                disabled={!isOnline || isSyncing || queueCount === 0}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-bold transition-all shadow-md ${
                  !isOnline || queueCount === 0
                    ? 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-white cursor-pointer'
                }`}
              >
                <CloudUpload size={15} className={isSyncing ? 'animate-spin' : ''} />
                <span>
                  {isSyncing
                    ? t('Syncing with RupayKg Server...')
                    : queueCount > 0
                    ? `${t('Sync Now')} (${queueCount} ${t('Pending')})`
                    : t('All Data Synced')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
