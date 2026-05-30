import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Star } from 'lucide-react';
import { RunewordFilters } from '../components/RunewordFilters';
import { RunewordCard } from '../components/RunewordCard';
import { useFilteredRunewords } from '../hooks/useFilteredRunewords';
import { useUrlInitialize } from '../hooks/useUrlInitialize';
import {
  selectMaxReqLevel,
  selectMaxTierPoints,
  selectSearchText,
  selectSelectedItemTypes,
  selectSelectedRunes,
  selectSocketCount,
} from '../store/runewordsSlice';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { usePersistentState } from '@/core/hooks/usePersistentState';
import { getNextVisibleCardCount, INITIAL_CARD_RENDER_COUNT } from '@/core/utils/progressiveRendering';
import { buildRecipeFavoriteId, filterFavoriteRecipes, isStringArray, toggleRecipeFavoriteId } from '@/core/utils/recipeFavorites';
import { cn } from '@/lib/utils';
import type { Runeword } from '@/core/db/models';

const RUNEWORD_FAVORITES_STORAGE_KEY = 'd2r-esr.runewords.favoriteRecipes.v1';
const RUNEWORD_SHOW_FAVORITES_STORAGE_KEY = 'd2r-esr.runewords.showFavoriteRecipesOnly.v1';

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function buildBooleanRecordSignature(selection: Record<string, boolean>): string {
  return Object.keys(selection)
    .sort()
    .map((key) => `${key}:${selection[key] ? '1' : '0'}`)
    .join('|');
}

function buildNullableNumberRecordSignature(selection: Record<string, number | null>): string {
  return Object.keys(selection)
    .sort()
    .map((key) => `${key}:${String(selection[key] ?? '')}`)
    .join('|');
}

export function RunewordsScreen() {
  useUrlInitialize();
  const runewords = useFilteredRunewords();
  const searchText = useSelector(selectSearchText);
  const socketCount = useSelector(selectSocketCount);
  const maxReqLevel = useSelector(selectMaxReqLevel);
  const selectedItemTypes = useSelector(selectSelectedItemTypes);
  const selectedRunes = useSelector(selectSelectedRunes);
  const maxTierPoints = useSelector(selectMaxTierPoints);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_CARD_RENDER_COUNT);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = usePersistentState<readonly string[]>(
    RUNEWORD_FAVORITES_STORAGE_KEY,
    [],
    isStringArray
  );
  const [showFavoritesOnly, setShowFavoritesOnly] = usePersistentState<boolean>(RUNEWORD_SHOW_FAVORITES_STORAGE_KEY, false, isBoolean);
  const [previousFilterSignature, setPreviousFilterSignature] = useState('');
  const filterSignature = [
    searchText,
    socketCount ?? '',
    maxReqLevel ?? '',
    buildBooleanRecordSignature(selectedItemTypes),
    buildBooleanRecordSignature(selectedRunes),
    buildNullableNumberRecordSignature(maxTierPoints),
    showFavoritesOnly ? 'favorites' : 'all',
    showFavoritesOnly ? favoriteRecipeIds.join('|') : '',
  ].join('\u001f');

  if (filterSignature !== previousFilterSignature) {
    setPreviousFilterSignature(filterSignature);
    setVisibleCount(INITIAL_CARD_RENDER_COUNT);
  }

  const filteredRunewords =
    runewords === undefined ? [] : showFavoritesOnly ? filterFavoriteRecipes(runewords, 'runeword', favoriteRecipeIds) : runewords;
  const visibleRunewords = filteredRunewords.slice(0, visibleCount);
  const totalRunewords = filteredRunewords.length;
  const hasMore = visibleRunewords.length < totalRunewords;
  const favoriteIdSet = new Set(favoriteRecipeIds);

  const toggleFavorite = (runeword: Runeword) => {
    const favoriteId = buildRecipeFavoriteId('runeword', runeword);
    setFavoriteRecipeIds((current) => toggleRecipeFavoriteId(favoriteId, current));
  };

  const handleLoadMore = () => {
    setVisibleCount((current) => getNextVisibleCardCount(totalRunewords, current));
  };

  useEffect(() => {
    if (!hasMore) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((current) => getNextVisibleCardCount(totalRunewords, current));
        }
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, totalRunewords]);

  // Loading state
  if (runewords === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">符文之语 ({totalRunewords})</h1>
      <RunewordFilters />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          当前显示 {visibleRunewords.length} / {totalRunewords} 条符文之语
        </p>
        <Button
          type="button"
          variant={showFavoritesOnly ? 'default' : 'outline'}
          size="sm"
          disabled={favoriteRecipeIds.length === 0 && !showFavoritesOnly}
          onClick={() => {
            setShowFavoritesOnly((current) => !current);
          }}
        >
          <Star className={cn('size-4', showFavoritesOnly && 'fill-current')} />
          只看收藏
          {favoriteRecipeIds.length > 0 && <span className="text-xs opacity-80">({favoriteRecipeIds.length})</span>}
        </Button>
      </div>

      {totalRunewords === 0 ? (
        <p className="text-muted-foreground py-8 text-center">没有找到符文之语。请调整筛选条件或先加载数据。</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleRunewords.map((runeword) => (
              <RunewordCard
                key={`${runeword.name}-${String(runeword.variant)}-${runeword.allowedItems.join(',')}`}
                runeword={runeword}
                isFavorite={favoriteIdSet.has(buildRecipeFavoriteId('runeword', runeword))}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center py-6">
              <Button variant="outline" onClick={handleLoadMore}>
                显示更多
              </Button>
            </div>
          )}
        </>
      )}

      <ScrollToTopButton />
    </div>
  );
}
