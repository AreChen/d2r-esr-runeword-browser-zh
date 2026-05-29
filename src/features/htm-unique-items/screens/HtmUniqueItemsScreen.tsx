import { HtmUniqueItemFilters } from '../components/HtmUniqueItemFilters';
import { HtmUniqueItemCard } from '../components/HtmUniqueItemCard';
import { useFilteredHtmUniqueItems } from '../hooks/useFilteredHtmUniqueItems';
import { useUrlInitialize } from '../hooks/useUrlInitialize';
import { Spinner } from '@/components/ui/spinner';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';

export function HtmUniqueItemsScreen() {
  useUrlInitialize();
  const items = useFilteredHtmUniqueItems();

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
      <h1 className="text-2xl font-bold mb-4">暗金物品 ({items.length})</h1>
      <HtmUniqueItemFilters />

      <p className="text-sm text-muted-foreground mb-4">当前显示 {items.length} 件暗金物品</p>

      {items.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">没有找到暗金物品。请调整筛选条件。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <HtmUniqueItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <ScrollToTopButton />
    </div>
  );
}
