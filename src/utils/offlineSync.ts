export interface QueuedMutation {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  timestamp: number;
}

const DB_NAME = 'rupaykg-offline-db';
const STORE_NAME = 'pending-mutations';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function queueOfflineMutation(
  url: string, 
  method: string, 
  body?: any, 
  headers?: Record<string, string>
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
      timestamp: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.add(item);
      req.onsuccess = () => {
        window.dispatchEvent(new CustomEvent('rupaykg:offline-mutation-queued', { detail: item }));
        resolve(id);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('[OfflineSync] Failed to queue offline mutation:', err);
    return '';
  }
}

export async function getQueuedMutations(): Promise<QueuedMutation[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('[OfflineSync] Failed to fetch queued mutations:', err);
    return [];
  }
}

export async function removeQueuedMutation(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error(`[OfflineSync] Failed to delete mutation ${id}:`, err);
  }
}

export async function syncOfflineMutations(): Promise<{ syncedCount: number; errors: number }> {
  if (!navigator.onLine) {
    return { syncedCount: 0, errors: 0 };
  }

  const mutations = await getQueuedMutations();
  if (mutations.length === 0) {
    return { syncedCount: 0, errors: 0 };
  }

  console.log(`[OfflineSync] Connection restored. Replaying ${mutations.length} queued mutations...`);
  let syncedCount = 0;
  let errors = 0;

  for (const item of mutations) {
    try {
      const res = await fetch(item.url, {
        method: item.method,
        headers: item.headers,
        body: item.body,
      });

      if (res.ok || res.status < 500) {
        await removeQueuedMutation(item.id);
        syncedCount++;
      } else {
        errors++;
      }
    } catch (err) {
      console.error(`[OfflineSync] Mutation replay failed for ${item.id}:`, err);
      errors++;
    }
  }

  window.dispatchEvent(
    new CustomEvent('rupaykg:offline-sync-complete', {
      detail: { syncedCount, errors, remaining: mutations.length - syncedCount },
    })
  );

  return { syncedCount, errors };
}

export function initOfflineSyncManager() {
  if (typeof window === 'undefined') return;

  const handleOnline = () => {
    console.log('[OfflineSync] Device connected to network. Triggering background data synchronization.');
    window.dispatchEvent(new CustomEvent('rupaykg:connection-status', { detail: { online: true } }));
    syncOfflineMutations();
  };

  const handleOffline = () => {
    console.warn('[OfflineSync] Device lost network connection. Platform operating in offline-first mode.');
    window.dispatchEvent(new CustomEvent('rupaykg:connection-status', { detail: { online: false } }));
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Initial check on load
  if (navigator.onLine) {
    syncOfflineMutations();
  }
}
