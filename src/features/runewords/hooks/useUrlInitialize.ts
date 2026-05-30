import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { readPersistentJson } from '@/core/hooks/usePersistentState';
import { useRuneGroups } from './useRuneGroups';
import { useAvailableItemTypes } from './useAvailableItemTypes';
import { setSearchText, setSocketCount, setMaxReqLevel, setAllRunes, setAllItemTypes, setMaxTierPoints } from '../store/runewordsSlice';

export const RUNEWORD_FILTER_STORAGE_KEY = 'd2r-esr.runewords.filters.v1';

const URL_PARAM_KEYS = {
  SEARCH: 'search',
  SOCKETS: 'sockets',
  MAXLVL: 'maxlvl',
  ITEMS: 'items',
  RUNES: 'runes',
  TIERPTS: 'tierpts',
} as const;

interface PersistedRunewordFilters {
  readonly searchText: string;
  readonly socketCount: number | null;
  readonly maxReqLevel: number | null;
  readonly selectedItemTypes: Record<string, boolean>;
  readonly selectedRunes: Record<string, boolean>;
  readonly maxTierPoints: Record<string, number | null>;
}

const DEFAULT_PERSISTED_FILTERS: PersistedRunewordFilters = {
  searchText: '',
  socketCount: null,
  maxReqLevel: null,
  selectedItemTypes: {},
  selectedRunes: {},
  maxTierPoints: {},
};

function isBooleanRecord(value: unknown): value is Record<string, boolean> {
  return typeof value === 'object' && value !== null && Object.values(value).every((entry) => typeof entry === 'boolean');
}

function isNumberOrNullRecord(value: unknown): value is Record<string, number | null> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value).every((entry) => entry === null || (typeof entry === 'number' && Number.isFinite(entry)))
  );
}

function isPersistedRunewordFilters(value: unknown): value is PersistedRunewordFilters {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<PersistedRunewordFilters>;

  return (
    typeof candidate.searchText === 'string' &&
    (candidate.socketCount === null || typeof candidate.socketCount === 'number') &&
    (candidate.maxReqLevel === null || typeof candidate.maxReqLevel === 'number') &&
    isBooleanRecord(candidate.selectedItemTypes) &&
    isBooleanRecord(candidate.selectedRunes) &&
    isNumberOrNullRecord(candidate.maxTierPoints)
  );
}

function readStoredRunewordFilters(): PersistedRunewordFilters {
  return readPersistentJson(
    typeof window === 'undefined' ? null : window.localStorage,
    RUNEWORD_FILTER_STORAGE_KEY,
    DEFAULT_PERSISTED_FILTERS,
    isPersistedRunewordFilters
  );
}

/**
 * Initializes runeword filter state from URL query parameters (one-time on mount).
 * After initialization, cleans the URL to keep it tidy while browsing.
 * Use useShareUrl() to generate shareable URLs with current filter state.
 */
export function useUrlInitialize(): void {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // Available options from DB
  const runeGroups = useRuneGroups();
  const itemTypes = useAvailableItemTypes();

  // Track initialization state
  const initializedRef = useRef(false);

  // URL → Redux (on mount, once data is loaded)
  useEffect(() => {
    // Skip if already initialized
    if (initializedRef.current) return;
    // Wait for data to load
    if (!runeGroups || runeGroups.length === 0) return;
    if (!itemTypes || itemTypes.length === 0) return;

    initializedRef.current = true;

    // Build all possible rune keys
    const allRuneKeys: string[] = [];
    for (const group of runeGroups) {
      for (const rune of group.runes) {
        allRuneKeys.push(`${group.category}:${rune}`);
      }
    }

    // Parse URL params
    const urlSearch = searchParams.get(URL_PARAM_KEYS.SEARCH);
    const urlSockets = searchParams.get(URL_PARAM_KEYS.SOCKETS);
    const urlMaxLvl = searchParams.get(URL_PARAM_KEYS.MAXLVL);
    const urlItems = searchParams.get(URL_PARAM_KEYS.ITEMS);
    const urlRunes = searchParams.get(URL_PARAM_KEYS.RUNES);
    const urlTierPts = searchParams.get(URL_PARAM_KEYS.TIERPTS);

    const hasUrlParams =
      urlSearch !== null || urlSockets !== null || urlMaxLvl !== null || urlItems !== null || urlRunes !== null || urlTierPts !== null;

    if (hasUrlParams) {
      // Initialize from URL params
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

      // Item types: if param exists, only those items are selected; otherwise all selected
      const urlItemSet = urlItems ? new Set(urlItems.split(',')) : null;
      const decodedItemTypes: Record<string, boolean> = {};
      for (const type of itemTypes) {
        decodedItemTypes[type] = urlItemSet ? urlItemSet.has(type) : true;
      }
      dispatch(setAllItemTypes(decodedItemTypes));

      // Runes: if param exists, only those runes are selected; otherwise all selected
      const urlRuneSet = urlRunes ? new Set(urlRunes.split(',')) : null;
      const decodedRunes: Record<string, boolean> = {};
      for (const key of allRuneKeys) {
        decodedRunes[key] = urlRuneSet ? urlRuneSet.has(key) : true;
      }
      dispatch(setAllRunes(decodedRunes));

      // Tier points: parse "esrRunes:1=64,lodRunes:2=128" format
      if (urlTierPts) {
        for (const entry of urlTierPts.split(',')) {
          const eqIndex = entry.indexOf('=');
          if (eqIndex === -1) continue;
          const tierKey = entry.substring(0, eqIndex);
          const value = parseInt(entry.substring(eqIndex + 1), 10);
          if (!isNaN(value) && value >= 0) {
            dispatch(setMaxTierPoints({ tierKey, value }));
          }
        }
      }

      // Clean the URL after initialization
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      const storedFilters = readStoredRunewordFilters();

      dispatch(setSearchText(storedFilters.searchText));
      dispatch(setSocketCount(storedFilters.socketCount));
      dispatch(setMaxReqLevel(storedFilters.maxReqLevel));

      const allItemTypes: Record<string, boolean> = {};
      for (const type of itemTypes) {
        allItemTypes[type] = storedFilters.selectedItemTypes[type] ?? true;
      }
      dispatch(setAllItemTypes(allItemTypes));

      const allRunes: Record<string, boolean> = {};
      for (const key of allRuneKeys) {
        allRunes[key] = storedFilters.selectedRunes[key] ?? true;
      }
      dispatch(setAllRunes(allRunes));

      for (const [tierKey, value] of Object.entries(storedFilters.maxTierPoints)) {
        dispatch(setMaxTierPoints({ tierKey, value }));
      }
    }
  }, [runeGroups, itemTypes, searchParams, dispatch]);
}
