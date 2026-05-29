import { RunewordFilters } from '../components/RunewordFilters';
import { RunewordCard } from '../components/RunewordCard';
import { useFilteredRunewords } from '../hooks/useFilteredRunewords';
import { useUrlInitialize } from '../hooks/useUrlInitialize';
import { Spinner } from '@/components/ui/spinner';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';

export function RunewordsScreen() {
  useUrlInitialize();
  const runewords = useFilteredRunewords();

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
      <h1 className="text-2xl font-bold mb-4">符文之语 ({runewords.length})</h1>
      <RunewordFilters />

      <p className="text-sm text-muted-foreground mb-4">当前显示 {runewords.length} 条符文之语</p>

      {runewords.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">没有找到符文之语。请调整筛选条件或先加载数据。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {runewords.map((runeword) => (
            <RunewordCard key={`${runeword.name}-${String(runeword.variant)}-${runeword.allowedItems.join(',')}`} runeword={runeword} />
          ))}
        </div>
      )}

      <ScrollToTopButton />
    </div>
  );
}
