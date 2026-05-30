import { Star } from 'lucide-react';
import { RunewordFilters } from '../components/RunewordFilters';
import { RunewordCard } from '../components/RunewordCard';
import { useFilteredRunewords } from '../hooks/useFilteredRunewords';
import { useUrlInitialize } from '../hooks/useUrlInitialize';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { usePersistentState } from '@/core/hooks/usePersistentState';
import { buildRecipeFavoriteId, filterFavoriteRecipes, isStringArray, toggleRecipeFavoriteId } from '@/core/utils/recipeFavorites';
import { cn } from '@/lib/utils';
import type { Runeword } from '@/core/db/models';

const RUNEWORD_FAVORITES_STORAGE_KEY = 'd2r-esr.runewords.favoriteRecipes.v1';
const RUNEWORD_SHOW_FAVORITES_STORAGE_KEY = 'd2r-esr.runewords.showFavoriteRecipesOnly.v1';

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function RunewordsScreen() {
  useUrlInitialize();
  const runewords = useFilteredRunewords();
  const [favoriteRecipeIds, setFavoriteRecipeIds] = usePersistentState<readonly string[]>(
    RUNEWORD_FAVORITES_STORAGE_KEY,
    [],
    isStringArray
  );
  const [showFavoritesOnly, setShowFavoritesOnly] = usePersistentState<boolean>(RUNEWORD_SHOW_FAVORITES_STORAGE_KEY, false, isBoolean);

  // Loading state
  if (runewords === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  const visibleRunewords = showFavoritesOnly ? filterFavoriteRecipes(runewords, 'runeword', favoriteRecipeIds) : runewords;
  const favoriteIdSet = new Set(favoriteRecipeIds);

  const toggleFavorite = (runeword: Runeword) => {
    const favoriteId = buildRecipeFavoriteId('runeword', runeword);
    setFavoriteRecipeIds((current) => toggleRecipeFavoriteId(favoriteId, current));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">符文之语 ({visibleRunewords.length})</h1>
      <RunewordFilters />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">当前显示 {visibleRunewords.length} 条符文之语</p>
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

      {visibleRunewords.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">没有找到符文之语。请调整筛选条件或先加载数据。</p>
      ) : (
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
      )}

      <ScrollToTopButton />
    </div>
  );
}
