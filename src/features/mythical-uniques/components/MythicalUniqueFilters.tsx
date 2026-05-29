import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLiveQuery } from 'dexie-react-hooks';
import { X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { SearchHelpButton } from '@/components/SearchHelpButton';
import { db } from '@/core/db';
import { translateGameText } from '@/core/i18n';
import { useShareUrl } from '../hooks/useShareUrl';
import {
  setSearchText,
  toggleCategory,
  selectAllCategories,
  deselectAllCategories,
  selectSearchText,
  selectSelectedCategories,
  selectIsAllCategoriesSelected,
} from '../store';

const SEARCH_DEBOUNCE_MS = 300;

export function MythicalUniqueFilters() {
  const dispatch = useDispatch();
  const searchText = useSelector(selectSearchText);
  const selectedCategories = useSelector(selectSelectedCategories);
  const isAllSelected = useSelector(selectIsAllCategoriesSelected);
  const getShareUrl = useShareUrl();

  const [localSearchText, setLocalSearchText] = useState(searchText);

  // Get available categories from DB
  const availableCategories = useLiveQuery(async () => {
    const items = await db.mythicalUniques.toArray();
    const cats = new Set(items.map((item) => item.category));
    return Array.from(cats).sort();
  });

  // Sync local state when Redux state changes externally (adjust during render)
  const [prevSearchText, setPrevSearchText] = useState(searchText);
  if (searchText !== prevSearchText) {
    setPrevSearchText(searchText);
    setLocalSearchText(searchText);
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchText(e.target.value);
  };

  const handleClearSearch = () => {
    setLocalSearchText('');
    dispatch(setSearchText(''));
  };

  const handleToggleCategory = (category: string) => {
    if (!availableCategories) return;
    dispatch(toggleCategory({ category, allCategories: availableCategories }));
  };

  const isNoneSelected = selectedCategories.has('__none__');

  const isCategorySelected = (category: string): boolean => {
    if (selectedCategories.has('__all__')) return true;
    return selectedCategories.has(category);
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Search row */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Search input */}
        <div className="flex-1 min-w-64 max-w-md space-y-1">
          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground">
              支持中文/英文关键词，也可用 <code className="bg-muted px-1 rounded">"精确短语"</code>
            </p>
            <SearchHelpButton />
          </div>
          <Label htmlFor="mythical-search" className="sr-only">
            搜索
          </Label>
          <InputGroup>
            <InputGroupInput
              id="mythical-search"
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

        {/* Copy Link button */}
        <CopyLinkButton getShareUrl={getShareUrl} />
      </div>

      {/* Category Filter */}
      {availableCategories && availableCategories.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">类别</span>
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
              disabled={isAllSelected}
              onClick={() => dispatch(selectAllCategories())}
            >
              全选
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
              disabled={isNoneSelected}
              onClick={() => dispatch(deselectAllCategories())}
            >
              全不选
            </Button>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {availableCategories.map((category) => (
              <label key={category} className="flex items-center gap-1.5 text-sm cursor-pointer">
                <Checkbox
                  checked={isCategorySelected(category)}
                  onCheckedChange={() => {
                    handleToggleCategory(category);
                  }}
                />
                {translateGameText(category)}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
