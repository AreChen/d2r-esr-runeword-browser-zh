import type { Ascendancy } from '@/core/db';
import { buildLocalizedSearchText } from '@/core/i18n';

export function matchesSearch(item: Ascendancy, searchTerms: readonly string[]): boolean {
  if (searchTerms.length === 0) return true;

  const tierText = item.tiers.flatMap((t) => t.bonuses);
  const searchableText = buildLocalizedSearchText([item.name, ...tierText, ...item.footnotes]);

  return searchTerms.every((term) => searchableText.includes(term));
}
