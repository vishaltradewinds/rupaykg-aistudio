export interface QueuedMutation {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  formType?: string;
  timestamp: number;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed';
  lastError?: string;
}

export interface SyncResult {
  syncedCount: number;
  errors: number;
  remaining: number;
}

const DB_NAME = 'rupaykg-offline-db';
const STORE_NAME = 'pending-mutations';
const DB_VERSION = 2;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return reject(new Error('IndexedDB not supported in current environment'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('status', 'status', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Buffer a form submission or API mutation into IndexedDB when offline or network fails.
 */
export async function queueOfflineMutation(
  url: string,
  method: string,
  body?: any,
  headers?: Record<string, string>,
  formType?: string
): Promise<string> {
  try {
    const db = await openDB();
    const id = `mut_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const item: QueuedMutation = {
      id,
      url,
      method,
      headers: headers || { 'Content-Type': 'application/json' },
      body: typeof body === 'string' ? body : JSON.stringify(body || {}),
      formType: formType || 'general_form',
      timestamp: Date.now(),
      retryCount: 0,
      status: 'pending',
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.add(item);
      req.onsuccess = () => {
        window.dispatchEvent(new CustomEvent('rupaykg:offline-mutation-queued', { detail: item }));
        notifyQueueCountChange();
        resolve(id);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('[OfflineSync] Failed to queue offline mutation into IndexedDB:', err);
    return '';
  }
}

/**
 * Retrieve all pending queued mutations from IndexedDB.
 */
export async function getQueuedMutations(): Promise<QueuedMutation[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const items: QueuedMutation[] = req.result || [];
        items.sort((a, b) => a.timestamp - b.timestamp);
        resolve(items);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('[OfflineSync] Failed to fetch queued mutations:', err);
    return [];
  }
}

/**
 * Get total pending mutations count.
 */
export async function getQueuedCount(): Promise<number> {
  const items = await getQueuedMutations();
  return items.length;
}

/**
 * Remove a specific mutation from IndexedDB queue.
 */
export async function removeQueuedMutation(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => {
        notifyQueueCountChange();
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error(`[OfflineSync] Failed to delete mutation ${id}:`, err);
  }
}

/**
 * Update mutation state in IndexedDB (e.g., after failed retry).
 */
export async function updateQueuedMutation(item: QueuedMutation): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error(`[OfflineSync] Failed to update mutation ${item.id}:`, err);
  }
}

/**
 * Clear all queued offline mutations.
 */
export async function clearAllQueuedMutations(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => {
        notifyQueueCountChange();
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('[OfflineSync] Failed to clear offline queue:', err);
  }
}

/**
 * Universal wrapper for API form submissions with offline buffering fallback.
 */
export async function submitWithOfflineSupport(
  url: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    formType?: string;
  } = {}
): Promise<{ success: boolean; queued: boolean; queueId?: string; data?: any; message: string }> {
  const method = options.method || 'POST';
  const headers = options.headers || { 'Content-Type': 'application/json' };
  const body = options.body;
  const formType = options.formType || 'form_submission';

  if (navigator.onLine) {
    try {
      const res = await fetch(url, {
        method,
        headers,
        body: typeof body === 'string' ? body : JSON.stringify(body || {}),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        return {
          success: true,
          queued: false,
          data,
          message: 'Submission completed online.',
        };
      } else if (res.status >= 500) {
        // Server error - queue for retry
        const queueId = await queueOfflineMutation(url, method, body, headers, formType);
        return {
          success: false,
          queued: true,
          queueId,
          message: 'Server error encountered. Form buffered in IndexedDB for automatic background sync.',
        };
      } else {
        const errorData = await res.json().catch(() => ({}));
        return {
          success: false,
          queued: false,
          message: errorData.error || errorData.message || `Request failed with status ${res.status}`,
        };
      }
    } catch (networkError: any) {
      console.warn('[OfflineSync] Fetch exception caught. Queueing offline form submission into IndexedDB:', networkError);
      const queueId = await queueOfflineMutation(url, method, body, headers, formType);
      return {
        success: true,
        queued: true,
        queueId,
        message: 'Network connection lost. Form saved locally in IndexedDB and will sync when connected.',
      };
    }
  } else {
    // Device is offline
    const queueId = await queueOfflineMutation(url, method, body, headers, formType);
    return {
      success: true,
      queued: true,
      queueId,
      message: 'Offline mode active. Form buffered locally in IndexedDB for auto-sync on re-connection.',
    };
  }
}

/**
 * Replay all pending queued mutations from IndexedDB.
 */
export async function syncOfflineMutations(): Promise<SyncResult> {
  if (!navigator.onLine) {
    return { syncedCount: 0, errors: 0, remaining: (await getQueuedCount()) };
  }

  const mutations = await getQueuedMutations();
  if (mutations.length === 0) {
    return { syncedCount: 0, errors: 0, remaining: 0 };
  }

  console.log(`[OfflineSync] Connection active. Replaying ${mutations.length} buffered IndexedDB mutations...`);
  let syncedCount = 0;
  let errors = 0;

  for (const item of mutations) {
    try {
      item.status = 'syncing';
      await updateQueuedMutation(item);

      const res = await fetch(item.url, {
        method: item.method,
        headers: item.headers,
        body: item.body,
      });

      if (res.ok || (res.status >= 200 && res.status < 400)) {
        await removeQueuedMutation(item.id);
        syncedCount++;
      } else {
        item.retryCount += 1;
        item.status = 'failed';
        item.lastError = `HTTP ${res.status}: ${res.statusText}`;
        await updateQueuedMutation(item);
        errors++;
      }
    } catch (err: any) {
      console.error(`[OfflineSync] Mutation replay failed for item ${item.id}:`, err);
      item.retryCount += 1;
      item.status = 'failed';
      item.lastError = err.message || 'Network fetch error during sync replay';
      await updateQueuedMutation(item);
      errors++;
    }
  }

  const remaining = (await getQueuedMutations()).length;
  const result: SyncResult = { syncedCount, errors, remaining };

  window.dispatchEvent(
    new CustomEvent('rupaykg:offline-sync-complete', {
      detail: result,
    })
  );

  notifyQueueCountChange();
  return result;
}

function notifyQueueCountChange() {
  getQueuedCount().then((count) => {
    window.dispatchEvent(
      new CustomEvent('rupaykg:offline-queue-count', {
        detail: { count },
      })
    );
  });
}

/**
 * Initialize offline event listeners & Service Worker message bridge.
 */
export function initOfflineSyncManager() {
  if (typeof window === 'undefined') return;

  const handleOnline = () => {
    console.log('[OfflineSync] Device connected to network. Triggering background IndexedDB data synchronization.');
    window.dispatchEvent(new CustomEvent('rupaykg:connection-status', { detail: { online: true } }));
    syncOfflineMutations();
  };

  const handleOffline = () => {
    console.warn('[OfflineSync] Device lost network connection. Platform operating in offline-first mode.');
    window.dispatchEvent(new CustomEvent('rupaykg:connection-status', { detail: { online: false } }));
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Listen for Service Worker background sync triggers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'TRIGGER_OFFLINE_SYNC') {
        console.log('[OfflineSync] Received ServiceWorker background sync trigger.');
        syncOfflineMutations();
      }
    });
  }

  // Initial check & periodic sync fallback when online
  if (navigator.onLine) {
    syncOfflineMutations();
    setInterval(() => {
      if (navigator.onLine) {
        getQueuedCount().then((count) => {
          if (count > 0) {
            syncOfflineMutations();
          }
        });
      }
    }, 60000); // Check every 60 seconds
  }
}

