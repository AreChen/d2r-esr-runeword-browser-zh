import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { usePersistentState } from '@/core/hooks/usePersistentState';
import { GuidePageContent } from '@/features/database/components/GuidePageContent';
import { GuideTableFilterControls } from '@/features/database/components/GuideTableFilterControls';
import { useGuidePages } from '@/features/database/hooks/useGuidePages';
import {
  DEFAULT_GUIDE_TABLE_FILTERS,
  filterGuidePageTables,
  getGuideTableSections,
  isGuideTableFilterState,
  type GuideTableFilterState,
} from '@/features/database/utils/guideTableFilters';

const VESSEL_OF_SOULS_PAGE_ID = 'vesselOfSouls';

export function VesselOfSoulsScreen() {
  const pages = useGuidePages();
  const [filters, setFilters] = usePersistentState<GuideTableFilterState>(
    'd2r-esr.vesselOfSouls.filters.v1',
    DEFAULT_GUIDE_TABLE_FILTERS,
    isGuideTableFilterState
  );

  if (pages === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  const page = pages.find((entry) => entry.id === VESSEL_OF_SOULS_PAGE_ID);

  if (!page) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">灵魂之器资料尚未同步。请在设置中刷新数据。</CardContent>
      </Card>
    );
  }

  const sections = getGuideTableSections(page);
  const filteredPage = filterGuidePageTables(page, filters);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">灵魂之器</h1>
        <p className="mt-1 text-sm text-muted-foreground">赫拉迪克方块公式的独立检索页，可按阶级、关键词、等级和收藏过滤。</p>
      </header>

      <GuideTableFilterControls
        sections={sections}
        filters={filters}
        visibleRowCount={filteredPage.visibleRowCount}
        totalRowCount={filteredPage.totalRowCount}
        onFiltersChange={setFilters}
      />
      <main className="rounded-md border bg-card p-4 md:p-6">
        <GuidePageContent page={filteredPage.page} />
      </main>

      <ScrollToTopButton />
    </div>
  );
}
