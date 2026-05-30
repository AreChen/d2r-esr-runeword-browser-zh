import { Search, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { translateGuideText } from '@/core/i18n/guideTranslation';
import {
  DEFAULT_GUIDE_TABLE_FILTERS,
  NO_SECTION_SELECTED,
  isGuideTableSectionSelected,
  type GuideTableFilterState,
  type GuideTableSection,
} from '../utils/guideTableFilters';

interface GuideTableFilterControlsProps {
  readonly sections: readonly GuideTableSection[];
  readonly filters: GuideTableFilterState;
  readonly visibleRowCount: number;
  readonly totalRowCount: number;
  readonly onFiltersChange: (filters: GuideTableFilterState | ((current: GuideTableFilterState) => GuideTableFilterState)) => void;
}

function getSectionLabel(section: GuideTableSection): string {
  const tierMatch = /^Tier\s+(\d+)$/iu.exec(section.label);
  if (tierMatch) return `第 ${tierMatch[1]} 阶`;
  if (section.label === 'Completion') return '完成';
  return translateGuideText(section.label);
}

function getSelectedSectionsAfterToggle(
  key: string,
  sections: readonly GuideTableSection[],
  selectedSections: readonly string[]
): readonly string[] {
  const allKeys = sections.map((section) => section.key);
  const selectedSet = new Set(
    selectedSections.length === 0 ? allKeys : selectedSections.filter((sectionKey) => sectionKey !== NO_SECTION_SELECTED)
  );

  if (selectedSet.has(key)) {
    selectedSet.delete(key);
  } else {
    selectedSet.add(key);
  }

  if (selectedSet.size === 0) return [NO_SECTION_SELECTED];
  if (selectedSet.size === allKeys.length) return [];
  return allKeys.filter((sectionKey) => selectedSet.has(sectionKey));
}

function toggleFavoriteSection(sectionKey: string, favoriteSections: readonly string[]): readonly string[] {
  if (favoriteSections.includes(sectionKey)) return favoriteSections.filter((favorite) => favorite !== sectionKey);
  return [...favoriteSections, sectionKey];
}

function hasFavorites(filters: GuideTableFilterState): boolean {
  return filters.favoriteSections.length > 0;
}

export function GuideTableFilterControls({
  sections,
  filters,
  visibleRowCount,
  totalRowCount,
  onFiltersChange,
}: GuideTableFilterControlsProps) {
  if (sections.length === 0) return null;

  const allSelected = filters.selectedSections.length === 0;
  const noneSelected = filters.selectedSections.includes(NO_SECTION_SELECTED);

  return (
    <section className="space-y-3 rounded-md border bg-muted/20 p-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-64 flex-1 space-y-1">
          <Label htmlFor="guide-table-search" className="text-xs text-muted-foreground">
            在当前资料页内搜索
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              id="guide-table-search"
              value={filters.searchText}
              placeholder="搜索表格、物品、属性或公式..."
              onChange={(event) => {
                onFiltersChange((current) => ({ ...current, searchText: event.target.value }));
              }}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {filters.searchText && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  variant="ghost"
                  size="icon-xs"
                  aria-label="清空页内搜索"
                  onClick={() => {
                    onFiltersChange((current) => ({ ...current, searchText: '' }));
                  }}
                >
                  <X className="size-4" />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
        </div>

        <div className="w-32 space-y-1">
          <Label htmlFor="guide-max-req-level" className="text-xs text-muted-foreground">
            最高需求等级
          </Label>
          <InputGroup>
            <InputGroupInput
              id="guide-max-req-level"
              type="number"
              min={0}
              max={999}
              placeholder="等级"
              value={filters.maxReqLevel ?? ''}
              onChange={(event) => {
                const value = event.target.value;
                const parsedValue = Number.parseInt(value, 10);
                onFiltersChange((current) => ({
                  ...current,
                  maxReqLevel: value === '' || Number.isNaN(parsedValue) ? null : Math.max(0, Math.min(999, parsedValue)),
                }));
              }}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {filters.maxReqLevel !== null && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  variant="ghost"
                  size="icon-xs"
                  aria-label="清空最高需求等级"
                  onClick={() => {
                    onFiltersChange((current) => ({ ...current, maxReqLevel: null }));
                  }}
                >
                  <X className="size-4" />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onFiltersChange((current) => ({ ...current, selectedSections: [] }));
            }}
            disabled={allSelected}
          >
            全选
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onFiltersChange((current) => ({ ...current, selectedSections: [NO_SECTION_SELECTED] }));
            }}
            disabled={noneSelected}
          >
            全不选
          </Button>
          <Button
            variant={filters.showFavoritesOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              onFiltersChange((current) => ({ ...current, showFavoritesOnly: !current.showFavoritesOnly }));
            }}
            disabled={!hasFavorites(filters)}
          >
            <Star className={cn('size-4', filters.showFavoritesOnly && 'fill-current')} />
            收藏
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onFiltersChange(DEFAULT_GUIDE_TABLE_FILTERS);
            }}
          >
            重置
          </Button>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        当前匹配 {visibleRowCount} / {totalRowCount} 行。星标会保存在本机，可用“收藏”快速只看常用部件或公式阶级。
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const selected = isGuideTableSectionSelected(section.key, filters.selectedSections);
          const favorite = filters.favoriteSections.includes(section.key);

          return (
            <div
              key={section.key}
              className={cn(
                'flex min-h-9 items-center justify-between gap-2 rounded-md border bg-card px-2 py-1.5',
                selected ? 'border-border' : 'border-muted bg-muted/40 text-muted-foreground'
              )}
            >
              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
                <Checkbox
                  checked={selected}
                  onCheckedChange={() => {
                    onFiltersChange((current) => ({
                      ...current,
                      selectedSections: getSelectedSectionsAfterToggle(section.key, sections, current.selectedSections),
                    }));
                  }}
                />
                <span className="truncate text-sm font-medium">{getSectionLabel(section)}</span>
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{section.rowCount}</span>
              </label>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-7"
                aria-label={favorite ? `取消收藏 ${getSectionLabel(section)}` : `收藏 ${getSectionLabel(section)}`}
                title={favorite ? '取消收藏' : '收藏'}
                onClick={() => {
                  onFiltersChange((current) => ({
                    ...current,
                    favoriteSections: toggleFavoriteSection(section.key, current.favoriteSections),
                    showFavoritesOnly:
                      current.showFavoritesOnly && current.favoriteSections.length === 1 && favorite ? false : current.showFavoritesOnly,
                  }));
                }}
              >
                <Star className={cn('size-4', favorite ? 'fill-amber-400 text-amber-500' : 'text-muted-foreground')} />
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
