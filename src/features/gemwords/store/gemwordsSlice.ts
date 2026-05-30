import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import type { RootState } from '@/core/store/store';

interface GemwordsState {
  readonly searchText: string;
  readonly socketCount: number | null;
  readonly maxReqLevel: number | null;
  readonly selectedItemTypes: Record<string, boolean>;
  readonly selectedGems: Record<string, boolean>;
}

const initialState: GemwordsState = {
  searchText: '',
  socketCount: null,
  maxReqLevel: null,
  selectedItemTypes: {},
  selectedGems: {},
};

const gemwordsSlice = createSlice({
  name: 'gemwords',
  initialState,
  reducers: {
    setSearchText(state, action: PayloadAction<string>) {
      state.searchText = action.payload;
    },
    setSocketCount(state, action: PayloadAction<number | null>) {
      state.socketCount = action.payload;
    },
    setMaxReqLevel(state, action: PayloadAction<number | null>) {
      state.maxReqLevel = action.payload;
    },
    toggleItemType(state, action: PayloadAction<string>) {
      const itemType = action.payload;
      state.selectedItemTypes[itemType] = !state.selectedItemTypes[itemType];
    },
    setAllItemTypes(state, action: PayloadAction<Record<string, boolean>>) {
      state.selectedItemTypes = action.payload;
    },
    selectAllItemTypes(state) {
      for (const key of Object.keys(state.selectedItemTypes)) {
        state.selectedItemTypes[key] = true;
      }
    },
    deselectAllItemTypes(state) {
      for (const key of Object.keys(state.selectedItemTypes)) {
        state.selectedItemTypes[key] = false;
      }
    },
    toggleItemTypeGroup(state, action: PayloadAction<{ itemTypes: readonly string[]; selected: boolean }>) {
      const { itemTypes, selected } = action.payload;
      for (const itemType of itemTypes) {
        state.selectedItemTypes[itemType] = selected;
      }
    },
    toggleGem(state, action: PayloadAction<string>) {
      const gem = action.payload;
      state.selectedGems[gem] = !state.selectedGems[gem];
    },
    setAllGems(state, action: PayloadAction<Record<string, boolean>>) {
      state.selectedGems = action.payload;
    },
    selectAllGems(state) {
      for (const key of Object.keys(state.selectedGems)) {
        state.selectedGems[key] = true;
      }
    },
    deselectAllGems(state) {
      for (const key of Object.keys(state.selectedGems)) {
        state.selectedGems[key] = false;
      }
    },
    toggleGemGroup(state, action: PayloadAction<{ gems: readonly string[]; selected: boolean }>) {
      const { gems, selected } = action.payload;
      for (const gem of gems) {
        state.selectedGems[gem] = selected;
      }
    },
  },
});

export const {
  setSearchText,
  setSocketCount,
  setMaxReqLevel,
  toggleItemType,
  setAllItemTypes,
  selectAllItemTypes,
  deselectAllItemTypes,
  toggleItemTypeGroup,
  toggleGem,
  setAllGems,
  selectAllGems,
  deselectAllGems,
  toggleGemGroup,
} = gemwordsSlice.actions;

export default gemwordsSlice.reducer;

const selectGemwordsState = (state: RootState) => state.gemwords;

export const selectSearchText = createSelector([selectGemwordsState], (gemwords) => gemwords.searchText);

export const selectSocketCount = createSelector([selectGemwordsState], (gemwords) => gemwords.socketCount);

export const selectMaxReqLevel = createSelector([selectGemwordsState], (gemwords) => gemwords.maxReqLevel);

export const selectSelectedItemTypes = createSelector([selectGemwordsState], (gemwords) => gemwords.selectedItemTypes);

export const selectSelectedGems = createSelector([selectGemwordsState], (gemwords) => gemwords.selectedGems);
