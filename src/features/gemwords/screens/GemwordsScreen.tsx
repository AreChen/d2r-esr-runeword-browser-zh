import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
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
  const filterSignature = [
    searchText,
    socketCount ?? '',
    maxReqLevel ?? '',
    buildSelectionSignature(selectedItemTypes),
    buildSelectionSignature(selectedGems),
  ].join('\u001f');
  const [previousFilterSignature, setPreviousFilterSignature] = useState(filterSignature);

  if (filterSignature !== previousFilterSignature) {
    setPreviousFilterSignature(filterSignature);
    setVisibleCount(INITIAL_GEMWORD_RENDER_COUNT);
  }

  const totalGemwords = gemwords?.length ?? 0;
  const visibleGemwords = gemwords?.slice(0, visibleCount) ?? [];
  const hasMore = visibleGemwords.length < totalGemwords;

  const handleLoadMore = () => {
    setVisibleCount((current) => getNextVisibleGemwordCount(totalGemwords, current));
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

      <p className="text-sm text-muted-foreground mb-4">
        当前显示 {visibleGemwords.length} / {totalGemwords} 条宝石之语
      </p>

      {totalGemwords === 0 ? (
        <p className="text-muted-foreground py-8 text-center">没有找到宝石之语。请调整筛选条件或先加载数据。</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleGemwords.map((gemword) => (
              <GemwordCard key={`${gemword.name}-${String(gemword.variant)}`} gemword={gemword} />
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
