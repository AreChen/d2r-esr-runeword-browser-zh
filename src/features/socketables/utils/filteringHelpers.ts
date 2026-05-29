import type { SocketableBonuses } from '@/core/db/models';
import type { UnifiedSocketable } from '../types';
import { buildLocalizedSearchText } from '@/core/i18n';

/**
 * Convert bonus affixes to searchable text.
 */
export function bonusesToSearchText(bonuses: SocketableBonuses): string {
  const allAffixes = [...bonuses.weaponsGloves, ...bonuses.helmsBoots, ...bonuses.armorShieldsBelts];
  return buildLocalizedSearchText(allAffixes.map((a) => a.rawText));
}

/**
 * Check if item matches search terms (AND logic).
 * All terms must be present in the searchable text (name + bonuses).
 */
export function matchesSearch(item: UnifiedSocketable, searchTerms: readonly string[]): boolean {
  if (searchTerms.length === 0) return true;

  const searchableText = `${buildLocalizedSearchText([item.name])} ${bonusesToSearchText(item.bonuses)}`;
  return searchTerms.every((term) => searchableText.includes(term));
}
