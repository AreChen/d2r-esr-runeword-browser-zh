import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { HtmUniqueItemFilters } from '../components/HtmUniqueItemFilters';
import { HtmUniqueItemCard } from '../components/HtmUniqueItemCard';
import { useFilteredHtmUniqueItems } from '../hooks/useFilteredHtmUniqueItems';
import { useUrlInitialize } from '../hooks/useUrlInitialize';
import { selectIncludeCouponItems, selectMaxReqLevel, selectSearchText, selectSelectedCategoriesRaw } from '../store';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { getNextVisibleCardCount, INITIAL_CARD_RENDER_COUNT } from '@/core/utils/progressiveRendering';

export function HtmUniqueItemsScreen() {
  useUrlInitialize();
  const items = useFilteredHtmUniqueItems();
  const searchText = useSelector(selectSearchText);
  const maxReqLevel = useSelector(selectMaxReqLevel);
  const selectedCategories = useSelector(selectSelectedCategoriesRaw);
  const includeCouponItems = useSelector(selectIncludeCouponItems);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_CARD_RENDER_COUNT);
  const [previousFilterSignature, setPreviousFilterSignature] = useState('');
  const filterSignature = [searchText, maxReqLevel ?? '', selectedCategories.join('|'), includeCouponItems ? 'coupons' : 'no-coupons'].join(
    '\u001f'
  );

  if (filterSignature !== previousFilterSignature) {
    setPreviousFilterSignature(filterSignature);
    setVisibleCount(INITIAL_CARD_RENDER_COUNT);
  }

  const visibleItems = items?.slice(0, visibleCount) ?? [];
  const totalItems = items?.length ?? 0;
  const hasMore = visibleItems.length < totalItems;

  const handleLoadMore = () => {
    setVisibleCount((current) => getNextVisibleCardCount(totalItems, current));
  };

  useEffect(() => {
    if (!hasMore) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((current) => getNextVisibleCardCount(totalItems, current));
        }
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, totalItems]);

  // Loading state
  if (items === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">暗金物品 ({totalItems})</h1>
      <HtmUniqueItemFilters />

      <p className="text-sm text-muted-foreground mb-4">
        当前显示 {visibleItems.length} / {totalItems} 件暗金物品
      </p>

      {totalItems === 0 ? (
        <p className="text-muted-foreground py-8 text-center">没有找到暗金物品。请调整筛选条件。</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleItems.map((item) => (
              <HtmUniqueItemCard key={item.id} item={item} />
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
