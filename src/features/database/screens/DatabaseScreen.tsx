import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { buildLocalizedSearchText } from '@/core/i18n';
import type { GuidePage, GuidePageGroup } from '@/core/db';
import { parseSearchTerms } from '@/features/runewords/utils/filteringHelpers';
import { GuidePageContent } from '../components/GuidePageContent';
import { useGuidePages } from '../hooks/useGuidePages';
import { getGuidePageBlockSummary } from '../utils/guidePageSummary';

type GroupFilter = 'all' | GuidePageGroup;

const GROUP_FILTERS: readonly { readonly value: GroupFilter; readonly label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'base', label: '基础资料' },
  { value: 'features', label: '机制说明' },
];

function pageMatchesSearch(page: GuidePage, terms: readonly string[]): boolean {
  if (terms.length === 0) return true;
  const searchable = buildLocalizedSearchText([page.title, page.label, page.textIndex]);
  return terms.every((term) => searchable.includes(term));
}

function filterPages(pages: readonly GuidePage[], groupFilter: GroupFilter, searchText: string): GuidePage[] {
  const terms = parseSearchTerms(searchText);
  return pages.filter((page) => (groupFilter === 'all' || page.group === groupFilter) && pageMatchesSearch(page, terms));
}

function getGroupName(group: GuidePageGroup): string {
  return group === 'base' ? '基础资料' : '机制说明';
}

export function DatabaseScreen() {
  const pages = useGuidePages();
  const [groupFilter, setGroupFilter] = useState<GroupFilter>('all');
  const [searchText, setSearchText] = useState('');
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  if (pages === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  const filteredPages = filterPages(pages, groupFilter, searchText);
  const selectedPage = pages.find((page) => page.id === selectedPageId) ?? (filteredPages.length > 0 ? filteredPages[0] : null);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">资料库 ({pages.length})</h1>
          <p className="mt-1 text-sm text-muted-foreground">官方 Base Information 与 Features 子页面的中文整理版。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {GROUP_FILTERS.map((filter) => (
            <Button
              key={filter.value}
              variant={groupFilter === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setGroupFilter(filter.value);
                setSelectedPageId(null);
              }}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="database-search" className="sr-only">
          搜索资料
        </Label>
        <InputGroup className="max-w-xl">
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            id="database-search"
            value={searchText}
            placeholder="搜索资料、机制或词缀..."
            onChange={(event) => {
              setSearchText(event.target.value);
              setSelectedPageId(null);
            }}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {searchText && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                variant="ghost"
                size="icon-xs"
                onClick={() => {
                  setSearchText('');
                  setSelectedPageId(null);
                }}
                aria-label="清空搜索"
              >
                <X className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>

      {pages.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">资料页尚未同步。请在设置中刷新数据。</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="space-y-2">
            <p className="text-sm text-muted-foreground">当前显示 {filteredPages.length} 个资料页</p>
            <div className="max-h-[calc(100vh-14rem)] space-y-2 overflow-y-auto pr-1">
              {filteredPages.map((page) => (
                <GuidePageListButton
                  key={page.id}
                  page={page}
                  isSelected={selectedPage !== null && selectedPage.id === page.id}
                  onSelect={() => {
                    setSelectedPageId(page.id);
                  }}
                />
              ))}
            </div>
          </aside>

          <main className="min-w-0 rounded-md border bg-card p-4 md:p-6">
            {selectedPage !== null ? (
              <GuidePageContent page={selectedPage} />
            ) : (
              <p className="py-10 text-center text-muted-foreground">没有找到资料页。请调整搜索条件。</p>
            )}
          </main>
        </div>
      )}

      <ScrollToTopButton />
    </div>
  );
}

function GuidePageListButton({
  page,
  isSelected,
  onSelect,
}: {
  readonly page: GuidePage;
  readonly isSelected: boolean;
  readonly onSelect: () => void;
}) {
  const summary = getGuidePageBlockSummary(page);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
        isSelected ? 'border-primary bg-accent text-accent-foreground' : 'bg-card hover:bg-muted'
      }`}
    >
      <span className="block font-medium">{page.title}</span>
      <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="px-1 py-0 text-[11px]">
          {getGroupName(page.group)}
        </Badge>
        {page.label}
      </span>
      <span className="mt-2 block text-xs text-muted-foreground">
        {summary.headingCount} 章 / {summary.tableCount} 表 / {summary.tableRowCount} 行
      </span>
    </button>
  );
}
