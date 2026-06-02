import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store, fatalError, registerSaga, runSagas, startupCheck } from '@/core/store';
import { ThemeInitializer } from '@/features/settings';
import { router } from '@/core/router';
import './index.css';

// Clean up legacy TXT data database if it exists
const LEGACY_TXT_DB = 'd2r-esr-txt-data';
if (typeof indexedDB.databases === 'function') {
  indexedDB
    .databases()
    .then((dbs) => {
      if (dbs.some((db) => db.name === LEGACY_TXT_DB)) {
        const req = indexedDB.deleteDatabase(LEGACY_TXT_DB);
        req.onsuccess = () => {
          console.log(`Deleted legacy IndexedDB "${LEGACY_TXT_DB}"`);
        };
        req.onerror = () => {
          console.warn(`Failed to delete legacy IndexedDB "${LEGACY_TXT_DB}"`);
        };
      }
    })
    .catch(() => {
      // Silently ignore — legacy cleanup is best-effort
    });
}

function getStartupErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error) return error;
  return '未知错误';
}

async function startDataSync(): Promise<void> {
  try {
    const { dataSyncSaga } = await import('@/features/data-sync');
    registerSaga(dataSyncSaga);
    runSagas();
    store.dispatch(startupCheck());
  } catch (error) {
    console.error('[Startup] Failed to load data sync module', error);
    store.dispatch(fatalError(`无法加载数据同步模块，请刷新页面重试：${getStartupErrorMessage(error)}`));
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeInitializer />
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);

void startDataSync();
