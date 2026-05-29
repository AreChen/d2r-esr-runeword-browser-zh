import { SocketableFilters } from '../components/SocketableFilters';
import { SocketableCard } from '../components/SocketableCard';
import { useFilteredSocketables } from '../hooks/useFilteredSocketables';
import { useUrlInitialize } from '../hooks/useUrlInitialize';
import { Spinner } from '@/components/ui/spinner';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';

export function SocketablesScreen() {
  useUrlInitialize();
  const socketables = useFilteredSocketables();

  // Loading state
  if (socketables === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">镶嵌物</h1>
      <SocketableFilters />

      {socketables.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">没有找到镶嵌物。请调整筛选条件或先加载数据。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {socketables.map((socketable) => (
            <SocketableCard key={`${socketable.category}-${socketable.name}`} socketable={socketable} />
          ))}
        </div>
      )}

      <ScrollToTopButton />
    </div>
  );
}
