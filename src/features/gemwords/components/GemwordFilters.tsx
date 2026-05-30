import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { CopyLinkHelpButton } from '@/components/CopyLinkHelpButton';
import { SearchHelpButton } from '@/components/SearchHelpButton';
import { ItemTypeFilter } from './ItemTypeFilter';
import { GemCheckboxGroup } from './GemCheckboxGroup';
import { useShareUrl } from '../hooks/useShareUrl';
import {
  setSearchText,
  setSocketCount,
  setMaxReqLevel,
  selectSearchText,
  selectSocketCount,
  selectMaxReqLevel,
  selectAllGems,
  deselectAllGems,
  selectSelectedGems,
} from '../store/gemwordsSlice';

const SEARCH_DEBOUNCE_MS = 300;
const INPUT_DEBOUNCE_MS = 300;

export function GemwordFilters() {
  const dispatch = useDispatch();
  const searchText = useSelector(selectSearchText);
  const socketCount = useSelector(selectSocketCount);
  const maxReqLevel = useSelector(selectMaxReqLevel);
  const selectedGems = useSelector(selectSelectedGems);
  const getShareUrl = useShareUrl();

  const [localSearchText, setLocalSearchText] = useState(searchText);
  const [localSocketCount, setLocalSocketCount] = useState(socketCount);
  const [localMaxReqLevel, setLocalMaxReqLevel] = useState(maxReqLevel);

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

  const allGemsSelected = Object.keys(selectedGems).length > 0 && Object.values(selectedGems).every(Boolean);
  const noGemsSelected = Object.keys(selectedGems).length > 0 && Object.values(selectedGems).every((value) => !value);

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-64 max-w-md space-y-1">
          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground">
              支持中文/英文关键词，也可用 <code className="bg-muted px-1 rounded">"精确短语"</code>
            </p>
            <SearchHelpButton />
          </div>
          <Label htmlFor="gemword-search" className="sr-only">
            搜索
          </Label>
          <InputGroup>
            <InputGroupInput
              id="gemword-search"
              type="text"
              placeholder="搜索名称、宝石或属性..."
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

        <div className="w-32 space-y-1">
          <p className="text-xs text-muted-foreground">按孔数筛选。</p>
          <Label htmlFor="gemword-sockets" className="sr-only">
            孔数
          </Label>
          <InputGroup>
            <InputGroupInput
              id="gemword-sockets"
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

        <div className="w-32 space-y-1">
          <p className="text-xs text-muted-foreground">最高所需等级。</p>
          <Label htmlFor="gemword-maxReqLevel" className="sr-only">
            最高所需等级
          </Label>
          <InputGroup>
            <InputGroupInput
              id="gemword-maxReqLevel"
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

        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground">分享当前筛选条件。</p>
            <CopyLinkHelpButton />
          </div>
          <CopyLinkButton getShareUrl={getShareUrl} />
        </div>
      </div>

      <ItemTypeFilter />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">宝石:</span>
          <Button variant="outline" size="sm" onClick={() => dispatch(selectAllGems())} disabled={allGemsSelected}>
            全选
          </Button>
          <Button variant="outline" size="sm" onClick={() => dispatch(deselectAllGems())} disabled={noGemsSelected}>
            全不选
          </Button>
        </div>
        <GemCheckboxGroup />
      </div>
    </div>
  );
}
