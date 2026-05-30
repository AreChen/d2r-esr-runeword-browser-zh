import { GemwordFilters } from '../components/GemwordFilters';
import { GemwordCard } from '../components/GemwordCard';
import { useFilteredGemwords } from '../hooks/useFilteredGemwords';
import { useUrlInitialize } from '../hooks/useUrlInitialize';
import { Spinner } from '@/components/ui/spinner';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';

export function GemwordsScreen() {
  useUrlInitialize();
  const gemwords = useFilteredGemwords();

  if (gemwords === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">宝石之语 ({gemwords.length})</h1>
      <GemwordFilters />

      <p className="text-sm text-muted-foreground mb-4">当前显示 {gemwords.length} 条宝石之语</p>

      {gemwords.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">没有找到宝石之语。请调整筛选条件或先加载数据。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gemwords.map((gemword) => (
            <GemwordCard key={`${gemword.name}-${String(gemword.variant)}`} gemword={gemword} />
          ))}
        </div>
      )}

      <ScrollToTopButton />
    </div>
  );
}
