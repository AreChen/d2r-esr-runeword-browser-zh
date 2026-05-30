import { call, put } from 'redux-saga/effects';
import { db } from '@/core/db';
import type { Metadata } from '@/core/db';
import { fetchLatestVersion, type ChangelogVersion } from '@/core/api';
import { isVersionDifferent } from '@/core/utils';
import { startupUseCached, startupNeedsFetch, setNetworkWarning, fatalError, initDataLoad } from './dataSyncSlice';
import appVersion from '@/assets/version.json';
import { DATA_CACHE_VERSION, DATA_CACHE_VERSION_METADATA_KEY } from '../constants/dataCacheVersion';

interface CachedDataCheck {
  hasData: boolean;
  storedVersion: string | null;
  storedAppVersion: string | null;
  storedDataCacheVersion: string | null;
}

function* checkCachedData(): Generator<unknown, CachedDataCheck, unknown> {
  // Check if we have any runewords in the DB (primary indicator of data presence)
  const count: number = (yield call(() => db.runewords.count())) as number;

  // Get stored version
  const versionMeta = (yield call(() => db.metadata.get('esrVersion'))) as Metadata | undefined;
  const appVersionMeta = (yield call(() => db.metadata.get('appVersion'))) as Metadata | undefined;
  const dataCacheVersionMeta = (yield call(() => db.metadata.get(DATA_CACHE_VERSION_METADATA_KEY))) as Metadata | undefined;

  // Get last updated timestamp for logging
  const lastUpdatedMeta = (yield call(() => db.metadata.get('lastUpdated'))) as Metadata | undefined;

  console.log('[HTML] Cache check - runewords count:', count, 'stored version:', versionMeta?.value ?? 'none');
  if (lastUpdatedMeta) {
    console.log('[HTML] Last updated:', lastUpdatedMeta.value);
  }

  return {
    hasData: count > 0,
    storedVersion: versionMeta?.value ?? null,
    storedAppVersion: appVersionMeta?.value ?? null,
    storedDataCacheVersion: dataCacheVersionMeta?.value ?? null,
  };
}

function cachedDataNeedsRefresh(cached: CachedDataCheck): boolean {
  return cached.storedAppVersion !== appVersion.version || cached.storedDataCacheVersion !== DATA_CACHE_VERSION;
}

export function* handleStartupCheck() {
  try {
    console.log('[HTML] Startup check initiated');

    // Step 1: Check what we have cached
    const cached: CachedDataCheck = (yield call(checkCachedData)) as CachedDataCheck;

    // Step 2: Try to fetch latest version from changelog
    let remoteVersion: ChangelogVersion | null = null;

    try {
      console.log('[HTML] Fetching remote version from changelog...');
      remoteVersion = (yield call(fetchLatestVersion)) as ChangelogVersion;
      console.log('[HTML] Remote ESR version:', remoteVersion.version);
    } catch {
      // Network error during version check
      console.log('[HTML] Network error during version check');
      if (cached.hasData && !cachedDataNeedsRefresh(cached)) {
        // We have cached data, use it with a warning
        console.log('[HTML] Using cached data (network unavailable)');
        yield put(setNetworkWarning('无法检查更新，正在使用缓存数据。'));
        yield put(startupUseCached());
        return;
      } else if (cached.hasData) {
        console.log('[HTML] Cached data is stale and version check failed - attempting full refetch');
        yield put(startupNeedsFetch());
        yield put(initDataLoad({ force: false }));
        return;
      } else {
        // No cached data and no network - fatal error
        console.log('[HTML] Fatal: No cached data and no network');
        yield put(fatalError('无法加载数据。请检查网络连接后重试。'));
        return;
      }
    }

    // Step 3: Compare versions
    const needsFetch = isVersionDifferent(cached.storedVersion, remoteVersion.version);
    console.log('[HTML] Startup check - stored:', cached.storedVersion, 'remote:', remoteVersion.version, 'needsFetch:', needsFetch);

    if (!needsFetch && cached.hasData) {
      // Check if htmUniqueItems table is empty (new table migration)
      const htmUniqueItemsCount: number = (yield call(() => db.htmUniqueItems.count())) as number;

      if (htmUniqueItemsCount === 0) {
        console.log('[HTML] Migration needed: htmUniqueItems table empty, refetching...');
        yield put(startupNeedsFetch());
        yield put(initDataLoad({ force: false }));
        return;
      }

      const gemwordsCount: number = (yield call(() => db.gemwords.count())) as number;

      if (gemwordsCount === 0) {
        console.log('[HTML] Migration needed: gemwords table empty, refetching...');
        yield put(startupNeedsFetch());
        yield put(initDataLoad({ force: false }));
        return;
      }

      // Check if mythicalUniques table is empty (new table migration)
      const mythicalUniquesCount: number = (yield call(() => db.mythicalUniques.count())) as number;

      if (mythicalUniquesCount === 0) {
        console.log('[HTML] Migration needed: mythicalUniques table empty, refetching...');
        yield put(startupNeedsFetch());
        yield put(initDataLoad({ force: false }));
        return;
      }

      // Check if ascendancies table is empty (new table migration)
      const ascendanciesCount: number = (yield call(() => db.ascendancies.count())) as number;

      if (ascendanciesCount === 0) {
        console.log('[HTML] Migration needed: ascendancies table empty, refetching...');
        yield put(startupNeedsFetch());
        yield put(initDataLoad({ force: false }));
        return;
      }

      // Check if guidePages table is empty (new table migration)
      const guidePagesCount: number = (yield call(() => db.guidePages.count())) as number;

      if (guidePagesCount === 0) {
        console.log('[HTML] Migration needed: guidePages table empty, refetching...');
        yield put(startupNeedsFetch());
        yield put(initDataLoad({ force: false }));
        return;
      }

      // Check if app version changed (catches data model changes and logic fixes)
      const currentVersion = appVersion.version;

      if (cached.storedAppVersion !== currentVersion) {
        console.log('[HTML] App version changed:', cached.storedAppVersion ?? undefined, '→', currentVersion, '- refetching...');
        yield put(startupNeedsFetch());
        yield put(initDataLoad({ force: false }));
        return;
      }

      if (cached.storedDataCacheVersion !== DATA_CACHE_VERSION) {
        console.log(
          '[HTML] Data cache version changed:',
          cached.storedDataCacheVersion ?? undefined,
          '→',
          DATA_CACHE_VERSION,
          '- refetching...'
        );
        yield put(startupNeedsFetch());
        yield put(initDataLoad({ force: false }));
        return;
      }

      // Version matches and we have data - use cached
      console.log('[HTML] Using cached data - version matches');
      yield put(startupUseCached());
      return;
    }

    // Step 4: Need to fetch - trigger the data load saga
    console.log('[HTML] Version mismatch or no data - triggering fetch');
    yield put(startupNeedsFetch());
    yield put(initDataLoad({ force: false }));
  } catch (error) {
    console.error('[HTML] Startup error:', error);
    yield put(fatalError(error instanceof Error ? error.message : '启动失败'));
  }
}
