import { CORE_GUIDE_PAGE_IDS, GUIDE_PAGE_CATALOG, getGuidePageEntrySourceUrl, type GuidePageCatalogEntry } from './guidePageCatalog';

export interface FetchedGuidePageHtml {
  readonly entry: GuidePageCatalogEntry;
  readonly html: string;
}

async function fetchGuidePageHtml(entry: GuidePageCatalogEntry): Promise<FetchedGuidePageHtml | null> {
  try {
    const response = await fetch(getGuidePageEntrySourceUrl(entry));
    if (!response.ok) {
      throw new Error(`获取 ${entry.sourcePath} 失败: ${String(response.status)} ${response.statusText}`);
    }

    return {
      entry,
      html: await response.text(),
    };
  } catch (error) {
    if (entry.optional) {
      console.warn('[HTML] Optional guide page skipped:', entry.sourcePath, error);
      return null;
    }

    throw error;
  }
}

export async function fetchAdditionalGuidePageHtmls(skippedIds: readonly string[] = CORE_GUIDE_PAGE_IDS): Promise<FetchedGuidePageHtml[]> {
  const skipped = new Set<string>(skippedIds);
  const entries = GUIDE_PAGE_CATALOG.filter((entry) => !skipped.has(entry.id));
  const results = await Promise.all(entries.map(fetchGuidePageHtml));

  return results.filter((result): result is FetchedGuidePageHtml => result !== null);
}
