import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { SearchHelpButton } from '@/components/SearchHelpButton';
import { useShareUrl } from '../hooks/useShareUrl';
import {
  toggleCategory,
  setSearchText,
  selectAllCategories,
  toggleOnlyHighestQuality,
  selectEnabledCategories,
  selectSearchText,
  selectOnlyHighestQuality,
  type EnabledCategories,
} from '../store/socketablesSlice';

const CATEGORY_LABELS: Record<keyof EnabledCategories, string> = {
  gems: '宝石',
  esrRunes: 'ESR 符文',
  lodRunes: 'LoD 符文',
  kanjiRunes: '汉字符文',
  crystals: '水晶',
};

const SEARCH_DEBOUNCE_MS = 300;

const SEARCH_EXAMPLES = [
  { query: '抗性', description: '包含“抗性”的物品' },
  { query: '"格挡几率"', description: '精确短语' },
  { query: '"所有抗性" 法力', description: '短语和关键词组合' },
];

export function SocketableFilters() {
  const dispatch = useDispatch();
  const enabledCategories = useSelector(selectEnabledCategories);
  const searchText = useSelector(selectSearchText);
  const onlyHighestQuality = useSelector(selectOnlyHighestQuality);
  const getShareUrl = useShareUrl();

  // Local state for immediate input feedback
  const [localSearchText, setLocalSearchText] = useState(searchText);

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

  const handleCategoryToggle = (category: keyof EnabledCategories) => {
    dispatch(toggleCategory(category));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchText(e.target.value);
  };

  const handleClearSearch = () => {
    setLocalSearchText('');
    dispatch(setSearchText(''));
  };

  const handleSelectAll = () => {
    dispatch(selectAllCategories());
  };

  const allSelected = Object.values(enabledCategories).every(Boolean);

  return (
    <div className="space-y-4 mb-6">
      {/* Category checkboxes */}
      <div className="flex flex-wrap items-center gap-4">
        {(Object.keys(CATEGORY_LABELS) as Array<keyof EnabledCategories>).map((category) => (
          <label key={category} className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={enabledCategories[category]}
              onCheckedChange={() => {
                handleCategoryToggle(category);
              }}
            />
            <span className="text-sm">{CATEGORY_LABELS[category]}</span>
          </label>
        ))}
        <Button variant="outline" size="sm" onClick={handleSelectAll} disabled={allSelected}>
          全选
        </Button>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={onlyHighestQuality}
            onCheckedChange={() => {
              dispatch(toggleOnlyHighestQuality());
            }}
          />
          <span className="text-sm">仅最高级宝石/水晶</span>
        </label>
        <CopyLinkButton getShareUrl={getShareUrl} />
      </div>

      {/* Search input */}
      <div className="max-w-md space-y-1">
        <div className="flex items-center gap-1">
          <p className="text-xs text-muted-foreground">
            支持中文/英文关键词，也可用 <code className="bg-muted px-1 rounded">"精确短语"</code>
          </p>
          <SearchHelpButton examples={SEARCH_EXAMPLES} />
        </div>
        <Label htmlFor="search" className="sr-only">
          搜索
        </Label>
        <InputGroup>
          <InputGroupInput id="search" type="text" placeholder="搜索名称或加成..." value={localSearchText} onChange={handleSearchChange} />
          {localSearchText && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="ghost" size="icon-xs" onClick={handleClearSearch} aria-label="清空搜索">
                <X className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>
    </div>
  );
}
