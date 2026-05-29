import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { CopyLinkHelpButton } from '@/components/CopyLinkHelpButton';
import { SearchHelpButton } from '@/components/SearchHelpButton';
import { RuneCheckboxGroup } from './RuneCheckboxGroup';
import { ItemTypeFilter } from './ItemTypeFilter';
import { TierPointsFilter } from './TierPointsFilter';
import { useShareUrl } from '../hooks/useShareUrl';
import {
  setSearchText,
  setSocketCount,
  setMaxReqLevel,
  selectSearchText,
  selectSocketCount,
  selectMaxReqLevel,
  selectAllRunes,
  deselectAllRunes,
  selectSelectedRunes,
} from '../store/runewordsSlice';

const SEARCH_DEBOUNCE_MS = 300;
const INPUT_DEBOUNCE_MS = 300;

export function RunewordFilters() {
  const dispatch = useDispatch();
  const searchText = useSelector(selectSearchText);
  const socketCount = useSelector(selectSocketCount);
  const maxReqLevel = useSelector(selectMaxReqLevel);
  const selectedRunes = useSelector(selectSelectedRunes);
  const getShareUrl = useShareUrl();

  const [localSearchText, setLocalSearchText] = useState(searchText);
  const [localSocketCount, setLocalSocketCount] = useState(socketCount);
  const [localMaxReqLevel, setLocalMaxReqLevel] = useState(maxReqLevel);

  // Sync local state when Redux state changes externally (adjust during render)
  const [prevSearchText, setPrevSearchText] = useState(searchText);
  if (searchText !== prevSearchText) {
    setPrevSearchText(searchText);
    setLocalSearchText(searchText);
  }

  const [prevSocketCount, setPrevSocketCount] = useState(socketCount);
  if (socketCount !== prevSocketCount) {
    setPrevSocketCount(socketCount);
    setLocalSocketCount(socketCount);
  }

  const [prevMaxReqLevel, setPrevMaxReqLevel] = useState(maxReqLevel);
  if (maxReqLevel !== prevMaxReqLevel) {
    setPrevMaxReqLevel(maxReqLevel);
    setLocalMaxReqLevel(maxReqLevel);
  }

  // Debounce dispatch to Redux
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchText !== searchText) {
        dispatch(setSearchText(localSearchText));
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [localSearchText, searchText, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSocketCount !== socketCount) {
        dispatch(setSocketCount(localSocketCount));
      }
    }, INPUT_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [localSocketCount, socketCount, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localMaxReqLevel !== maxReqLevel) {
        dispatch(setMaxReqLevel(localMaxReqLevel));
      }
    }, INPUT_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [localMaxReqLevel, maxReqLevel, dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchText(e.target.value);
  };

  const handleClearSearch = () => {
    setLocalSearchText('');
    dispatch(setSearchText(''));
  };

  const handleSocketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setLocalSocketCount(null);
    } else {
      const num = parseInt(value, 10);
      if (num >= 1 && num <= 6) {
        setLocalSocketCount(num);
      }
    }
  };

  const handleClearSockets = () => {
    setLocalSocketCount(null);
    dispatch(setSocketCount(null));
  };

  const handleMaxReqLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setLocalMaxReqLevel(null);
    } else {
      const num = parseInt(value, 10);
      if (num >= 1 && num <= 999) {
        setLocalMaxReqLevel(num);
      }
    }
  };

  const handleClearMaxReqLevel = () => {
    setLocalMaxReqLevel(null);
    dispatch(setMaxReqLevel(null));
  };

  const allRunesSelected = Object.keys(selectedRunes).length > 0 && Object.values(selectedRunes).every(Boolean);
  const noRunesSelected = Object.keys(selectedRunes).length > 0 && Object.values(selectedRunes).every((v) => !v);

  return (
    <div className="space-y-4 mb-6">
      {/* Search and Socket row */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Search input */}
        <div className="flex-1 min-w-64 max-w-md space-y-1">
          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground">
              支持中文/英文关键词，也可用 <code className="bg-muted px-1 rounded">"精确短语"</code>
            </p>
            <SearchHelpButton />
          </div>
          <Label htmlFor="search" className="sr-only">
            搜索
          </Label>
          <InputGroup>
            <InputGroupInput
              id="search"
              type="text"
              placeholder="搜索名称或属性..."
              value={localSearchText}
              onChange={handleSearchChange}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {localSearchText && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton variant="ghost" size="icon-xs" onClick={handleClearSearch} aria-label="清空搜索">
                  <X className="size-4" />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
        </div>

        {/* Socket count */}
        <div className="w-32 space-y-1">
          <p className="text-xs text-muted-foreground">按孔数筛选。</p>
          <Label htmlFor="sockets" className="sr-only">
            孔数
          </Label>
          <InputGroup>
            <InputGroupInput
              id="sockets"
              type="number"
              min={1}
              max={6}
              placeholder="孔数"
              value={localSocketCount ?? ''}
              onChange={handleSocketChange}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {localSocketCount !== null && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton variant="ghost" size="icon-xs" onClick={handleClearSockets} aria-label="清空孔数">
                  <X className="size-4" />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
        </div>

        {/* Max Required Level */}
        <div className="w-32 space-y-1">
          <p className="text-xs text-muted-foreground">最高所需等级。</p>
          <Label htmlFor="maxReqLevel" className="sr-only">
            最高所需等级
          </Label>
          <InputGroup>
            <InputGroupInput
              id="maxReqLevel"
              type="number"
              min={1}
              max={999}
              placeholder="最高等级"
              value={localMaxReqLevel ?? ''}
              onChange={handleMaxReqLevelChange}
              autoComplete="off"
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {localMaxReqLevel !== null && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton variant="ghost" size="icon-xs" onClick={handleClearMaxReqLevel} aria-label="清空最高所需等级">
                  <X className="size-4" />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
        </div>

        {/* Copy Link button */}
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground">分享当前筛选条件。</p>
            <CopyLinkHelpButton />
          </div>
          <CopyLinkButton getShareUrl={getShareUrl} />
        </div>
      </div>

      {/* Item Type Filter */}
      <ItemTypeFilter />

      {/* Tier Points Filter */}
      <TierPointsFilter />

      {/* Rune Filter with All/None toggles */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">符文:</span>
          <Button variant="outline" size="sm" onClick={() => dispatch(selectAllRunes())} disabled={allRunesSelected}>
            全选
          </Button>
          <Button variant="outline" size="sm" onClick={() => dispatch(deselectAllRunes())} disabled={noRunesSelected}>
            全不选
          </Button>
        </div>
        <RuneCheckboxGroup />
      </div>
    </div>
  );
}
