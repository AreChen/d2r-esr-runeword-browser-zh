import { CORE_GUIDE_PAGE_IDS, GUIDE_PAGE_CATALOG, getGuidePageSourceUrl, type GuidePageCatalogEntry } from './guidePageCatalog';

export interface FetchedGuidePageHtml {
  readonly entry: GuidePageCatalogEntry;
  readonly html: string;
}

export async function fetchAdditionalGuidePageHtmls(skippedIds: readonly string[] = CORE_GUIDE_PAGE_IDS): Promise<FetchedGuidePageHtml[]> {
  const skipped = new Set<string>(skippedIds);
  const entries = GUIDE_PAGE_CATALOG.filter((entry) => !skipped.has(entry.id));

  return Promise.all(
    entries.map(async (entry) => {
      const response = await fetch(getGuidePageSourceUrl(entry.sourcePath));
      if (!response.ok) {
        throw new Error(`获取 ${entry.sourcePath} 失败: ${String(response.status)} ${response.statusText}`);
      }

      return {
        entry,
        html: await response.text(),
      };
    })
  );
}
