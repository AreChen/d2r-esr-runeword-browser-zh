import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { readPersistentJson } from '@/core/hooks/usePersistentState';
import { useAvailableItemTypes } from './useAvailableItemTypes';
import { useGemGroups } from './useGemGroups';
import { setSearchText, setSocketCount, setMaxReqLevel, setAllItemTypes, setAllGems } from '../store/gemwordsSlice';

export const GEMWORD_FILTER_STORAGE_KEY = 'd2r-esr.gemwords.filters.v1';

const URL_PARAM_KEYS = {
  SEARCH: 'search',
  SOCKETS: 'sockets',
  MAXLVL: 'maxlvl',
  ITEMS: 'items',
  GEMS: 'gems',
} as const;

interface PersistedGemwordFilters {
  readonly searchText: string;
  readonly socketCount: number | null;
  readonly maxReqLevel: number | null;
  readonly selectedItemTypes: Record<string, boolean>;
  readonly selectedGems: Record<string, boolean>;
}

const DEFAULT_PERSISTED_FILTERS: PersistedGemwordFilters = {
  searchText: '',
  socketCount: null,
  maxReqLevel: null,
  selectedItemTypes: {},
  selectedGems: {},
};

function isBooleanRecord(value: unknown): value is Record<string, boolean> {
  return typeof value === 'object' && value !== null && Object.values(value).every((entry) => typeof entry === 'boolean');
}

function isPersistedGemwordFilters(value: unknown): value is PersistedGemwordFilters {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<PersistedGemwordFilters>;

  return (
    typeof candidate.searchText === 'string' &&
    (candidate.socketCount === null || typeof candidate.socketCount === 'number') &&
    (candidate.maxReqLevel === null || typeof candidate.maxReqLevel === 'number') &&
    isBooleanRecord(candidate.selectedItemTypes) &&
    isBooleanRecord(candidate.selectedGems)
  );
}

function readStoredGemwordFilters(): PersistedGemwordFilters {
  return readPersistentJson(
    typeof window === 'undefined' ? null : window.localStorage,
    GEMWORD_FILTER_STORAGE_KEY,
    DEFAULT_PERSISTED_FILTERS,
    isPersistedGemwordFilters
  );
}

export function useUrlInitialize(): void {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const itemTypes = useAvailableItemTypes();
  const gemGroups = useGemGroups();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    if (!itemTypes || itemTypes.length === 0) return;
    if (!gemGroups || gemGroups.length === 0) return;

    initializedRef.current = true;

    const allGemNames = gemGroups.flatMap((group) => group.gems.map((gem) => gem.name));
    const urlSearch = searchParams.get(URL_PARAM_KEYS.SEARCH);
    const urlSockets = searchParams.get(URL_PARAM_KEYS.SOCKETS);
    const urlMaxLvl = searchParams.get(URL_PARAM_KEYS.MAXLVL);
    const urlItems = searchParams.get(URL_PARAM_KEYS.ITEMS);
    const urlGems = searchParams.get(URL_PARAM_KEYS.GEMS);
    const hasUrlParams = urlSearch !== null || urlSockets !== null || urlMaxLvl !== null || urlItems !== null || urlGems !== null;

    if (hasUrlParams) {
      if (urlSearch !== null) {
        dispatch(setSearchText(urlSearch));
      }

      if (urlSockets !== null) {
        const parsed = parseInt(urlSockets, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 6) {
          dispatch(setSocketCount(parsed));
        }
      }

      if (urlMaxLvl !== null) {
        const parsed = parseInt(urlMaxLvl, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 999) {
          dispatch(setMaxReqLevel(parsed));
        }
      }

      const urlItemSet = urlItems ? new Set(urlItems.split(',')) : null;
      const decodedItemTypes: Record<string, boolean> = {};
      for (const type of itemTypes) {
        decodedItemTypes[type] = urlItemSet ? urlItemSet.has(type) : true;
      }
      dispatch(setAllItemTypes(decodedItemTypes));

      const urlGemSet = urlGems ? new Set(urlGems.split(',')) : null;
      const decodedGems: Record<string, boolean> = {};
      for (const gem of allGemNames) {
        decodedGems[gem] = urlGemSet ? urlGemSet.has(gem) : true;
      }
      dispatch(setAllGems(decodedGems));

      window.history.replaceState({}, '', window.location.pathname);
    } else {
      const storedFilters = readStoredGemwordFilters();

      dispatch(setSearchText(storedFilters.searchText));
      dispatch(setSocketCount(storedFilters.socketCount));
      dispatch(setMaxReqLevel(storedFilters.maxReqLevel));

      const allItemTypes: Record<string, boolean> = {};
      for (const type of itemTypes) {
        allItemTypes[type] = storedFilters.selectedItemTypes[type] ?? true;
      }
      dispatch(setAllItemTypes(allItemTypes));

      const allGems: Record<string, boolean> = {};
      for (const gem of allGemNames) {
        allGems[gem] = storedFilters.selectedGems[gem] ?? true;
      }
      dispatch(setAllGems(allGems));
    }
  }, [itemTypes, gemGroups, searchParams, dispatch]);
}
