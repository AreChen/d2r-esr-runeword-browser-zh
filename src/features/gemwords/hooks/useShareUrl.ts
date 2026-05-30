import { useSelector } from 'react-redux';
import {
  selectSearchText,
  selectSocketCount,
  selectMaxReqLevel,
  selectSelectedItemTypes,
  selectSelectedGems,
} from '../store/gemwordsSlice';

const URL_PARAM_KEYS = {
  SEARCH: 'search',
  SOCKETS: 'sockets',
  MAXLVL: 'maxlvl',
  ITEMS: 'items',
  GEMS: 'gems',
} as const;

export function useShareUrl(): () => string {
  const searchText = useSelector(selectSearchText);
  const socketCount = useSelector(selectSocketCount);
  const maxReqLevel = useSelector(selectMaxReqLevel);
  const selectedItemTypes = useSelector(selectSelectedItemTypes);
  const selectedGems = useSelector(selectSelectedGems);

  return () => {
    const params = new URLSearchParams();

    if (searchText) {
      params.set(URL_PARAM_KEYS.SEARCH, searchText);
    }

    if (socketCount !== null) {
      params.set(URL_PARAM_KEYS.SOCKETS, String(socketCount));
    }

    if (maxReqLevel !== null) {
      params.set(URL_PARAM_KEYS.MAXLVL, String(maxReqLevel));
    }

    const itemKeys = Object.keys(selectedItemTypes);
    if (itemKeys.length > 0 && !Object.values(selectedItemTypes).every(Boolean)) {
      const selectedItems = itemKeys.filter((key) => selectedItemTypes[key]);
      if (selectedItems.length > 0) {
        params.set(URL_PARAM_KEYS.ITEMS, selectedItems.join(','));
      }
    }

    const gemKeys = Object.keys(selectedGems);
    if (gemKeys.length > 0 && !Object.values(selectedGems).every(Boolean)) {
      const selectedGemNames = gemKeys.filter((key) => selectedGems[key]);
      if (selectedGemNames.length > 0) {
        params.set(URL_PARAM_KEYS.GEMS, selectedGemNames.join(','));
      }
    }

    const basePath = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/gemwords`;
    const base = `${window.location.origin}${basePath}`;
    return params.toString() ? `${base}?${params.toString()}` : base;
  };
}
