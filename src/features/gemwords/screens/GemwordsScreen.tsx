import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Star } from 'lucide-react';
import { GemwordFilters } from '../components/GemwordFilters';
import { GemwordCard } from '../components/GemwordCard';
import { useFilteredGemwords } from '../hooks/useFilteredGemwords';
import { useUrlInitialize } from '../hooks/useUrlInitialize';
import {
  selectMaxReqLevel,
  selectSearchText,
  selectSelectedGems,
  selectSelectedItemTypes,
  selectSocketCount,
} from '../store/gemwordsSlice';
import { getNextVisibleGemwordCount, INITIAL_GEMWORD_RENDER_COUNT } from '../utils/progressiveLoading';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { usePersistentState } from '@/core/hooks/usePersistentState';
import { buildRecipeFavoriteId, filterFavoriteRecipes, isStringArray, toggleRecipeFavoriteId } from '@/core/utils/recipeFavorites';
import { cn } from '@/lib/utils';
import type { Gemword } from '@/core/db/models';

const GEMWORD_FAVORITES_STORAGE_KEY = 'd2r-esr.gemwords.favoriteRecipes.v1';
const GEMWORD_SHOW_FAVORITES_STORAGE_KEY = 'd2r-esr.gemwords.showFavoriteRecipesOnly.v1';

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function buildSelectionSignature(selection: Record<string, boolean>): string {
  return Object.keys(selection)
    .sort()
    .map((key) => `${key}:${selection[key] ? '1' : '0'}`)
    .join('|');
}

export function GemwordsScreen() {
  useUrlInitialize();
  const gemwords = useFilteredGemwords();
  const searchText = useSelector(selectSearchText);
  const socketCount = useSelector(selectSocketCount);
  const maxReqLevel = useSelector(selectMaxReqLevel);
  const selectedItemTypes = useSelector(selectSelectedItemTypes);
  const selectedGems = useSelector(selectSelectedGems);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_GEMWORD_RENDER_COUNT);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = usePersistentState<readonly string[]>(GEMWORD_FAVORITES_STORAGE_KEY, [], isStringArray);
  const [showFavoritesOnly, setShowFavoritesOnly] = usePersistentState<boolean>(GEMWORD_SHOW_FAVORITES_STORAGE_KEY, false, isBoolean);
  const filterSignature = [
    searchText,
    socketCount ?? '',
    maxReqLevel ?? '',
    buildSelectionSignature(selectedItemTypes),
    buildSelectionSignature(selectedGems),
    showFavoritesOnly ? 'favorites' : 'all',
    favoriteRecipeIds.join('|'),
  ].join('\u001f');
  const [previousFilterSignature, setPreviousFilterSignature] = useState(filterSignature);

  if (filterSignature !== previousFilterSignature) {
    setPreviousFilterSignature(filterSignature);
    setVisibleCount(INITIAL_GEMWORD_RENDER_COUNT);
  }

  const filteredGemwords = gemwords ? (showFavoritesOnly ? filterFavoriteRecipes(gemwords, 'gemword', favoriteRecipeIds) : gemwords) : [];
  const favoriteIdSet = new Set(favoriteRecipeIds);
  const totalGemwords = filteredGemwords.length;
  const visibleGemwords = filteredGemwords.slice(0, visibleCount);
  const hasMore = visibleGemwords.length < totalGemwords;

  const handleLoadMore = () => {
    setVisibleCount((current) => getNextVisibleGemwordCount(totalGemwords, current));
  };

  const toggleFavorite = (gemword: Gemword) => {
    const favoriteId = buildRecipeFavoriteId('gemword', gemword);
    setFavoriteRecipeIds((current) => toggleRecipeFavoriteId(favoriteId, current));
  };

  useEffect(() => {
    if (!hasMore) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((current) => getNextVisibleGemwordCount(totalGemwords, current));
        }
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, totalGemwords]);

  if (gemwords === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">宝石之语 ({totalGemwords})</h1>
      <GemwordFilters />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          当前显示 {visibleGemwords.length} / {totalGemwords} 条宝石之语
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

      {totalGemwords === 0 ? (
        <p className="text-muted-foreground py-8 text-center">没有找到宝石之语。请调整筛选条件或先加载数据。</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleGemwords.map((gemword) => (
              <GemwordCard
                key={`${gemword.name}-${String(gemword.variant)}-${gemword.allowedItems.join(',')}`}
                gemword={gemword}
                isFavorite={favoriteIdSet.has(buildRecipeFavoriteId('gemword', gemword))}
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
