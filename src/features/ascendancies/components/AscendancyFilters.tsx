import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { SearchHelpButton } from '@/components/SearchHelpButton';
import { useShareUrl } from '../hooks/useShareUrl';
import { setSearchText, selectSearchText } from '../store';

const SEARCH_DEBOUNCE_MS = 300;

const SEARCH_EXAMPLES = [
  { query: '法术伤害', description: '包含“法术伤害”的升华' },
  { query: '"职业技能"', description: '精确短语匹配' },
  { query: '抗性 力量', description: '同时包含“抗性”和“力量”' },
];

export function AscendancyFilters() {
  const dispatch = useDispatch();
  const searchText = useSelector(selectSearchText);
  const getShareUrl = useShareUrl();

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchText(e.target.value);
  };

  const handleClearSearch = () => {
    setLocalSearchText('');
    dispatch(setSearchText(''));
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap items-end gap-4">
        {/* Search input */}
        <div className="flex-1 min-w-64 max-w-md space-y-1">
          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground">
              支持中文/英文关键词，也可用 <code className="bg-muted px-1 rounded">"精确短语"</code>
            </p>
            <SearchHelpButton examples={SEARCH_EXAMPLES} />
          </div>
          <Label htmlFor="ascendancy-search" className="sr-only">
            搜索
          </Label>
          <InputGroup>
            <InputGroupInput
              id="ascendancy-search"
              type="text"
              placeholder="搜索名称或加成..."
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
    </div>
  );
}
