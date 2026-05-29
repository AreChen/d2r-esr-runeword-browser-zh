import type { HtmFilterGroup } from '../types';

interface HtmCategoryDefinition {
  readonly id: string;
  readonly label: string;
  readonly categories: readonly string[];
}

/**
 * Defines how raw HTM categories (parsed from the docs) are grouped into
 * filter groups in the UI. Categories not listed here fall into a "New" group
 * so that newly added categories in the docs are never silently hidden.
 */
const HTM_CATEGORY_GROUPS: readonly HtmCategoryDefinition[] = [
  // ── Weapons page ──────────────────────────────────────────────────────────
  {
    id: 'missile-weapons',
    label: '远程武器',
    categories: ['Bow', 'Bow Quiver2', 'Crossbow', 'Crossbow Quiver2', 'Javelin', 'Shuriken', 'Throwing Axe', 'Throwing Knife'],
  },
  {
    id: 'class-weapons',
    label: '职业专属',
    categories: [
      'Amazon Bow',
      'Amazon Javelin',
      'Amazon Spear',
      'Assassin 2H Katana',
      'Barbarian Javs',
      'Druid Club',
      'Necromancer Dagger',
      'Necromancer Polearm',
      'Orb',
      'Paladin Sword',
      'Sorceress Mana Blade',
    ],
  },
  {
    id: 'weapons',
    label: '武器',
    categories: [
      'Axe',
      'Club',
      'Hammer',
      'Hand to Hand 1',
      'Hand to Hand 2',
      'Knife',
      'Knuckle',
      'Mace',
      'Polearm',
      'Scepter',
      'Spear',
      'Staff',
      'Sword',
      'Wand',
    ],
  },

  // ── Armors page ───────────────────────────────────────────────────────────
  {
    id: 'armors',
    label: '护甲',
    categories: ['Belt', 'Body Armor', 'Boots', 'Circlet', 'Cloak', 'Gloves', 'Helm', 'Robe', 'Shield'],
  },
  {
    id: 'class-armors',
    label: '职业专属',
    categories: ['Auric Shields', 'Pelt', 'Primal Helm', 'Spirit Crown', 'Voodoo Heads'],
  },

  // ── Other page ────────────────────────────────────────────────────────────
  {
    id: 'rings',
    label: '戒指',
    categories: ['Ring', 'Ama Ring', 'Ass Ring', 'Bar Ring', 'Coupon Rings', 'Dru Ring', 'Nec Ring', 'Pal Ring', 'Sor Ring'],
  },
  {
    id: 'amulets',
    label: '项链',
    categories: [
      'Amulet',
      'Ama Amulet',
      'Ass Amulet',
      'Bar Amulet',
      'Coupon Amulets',
      'Dru Amulet',
      'Nec Amulet',
      'Pal Amulet',
      'Sor Amulet',
    ],
  },
  {
    id: 'charms',
    label: '护身符',
    categories: ['Grand Charm', 'Large Charm', 'Odd Charm', 'Small Charm'],
  },
  {
    id: 'jewels',
    label: '珠宝',
    categories: ['Jewel'],
  },
];

const KNOWN_CATEGORIES = new Set(HTM_CATEGORY_GROUPS.flatMap((g) => g.categories));

/**
 * Groups the available DB categories into filter groups.
 * Any category not in the known list is placed in a "New" group so that
 * new categories added to the docs are never silently hidden.
 */
export function groupHtmCategories(availableCategories: readonly string[]): HtmFilterGroup[] {
  const availableSet = new Set(availableCategories);
  const groups: HtmFilterGroup[] = [];

  for (const def of HTM_CATEGORY_GROUPS) {
    const matching = def.categories.filter((c) => availableSet.has(c));
    if (matching.length > 0) {
      groups.push({ id: def.id, label: def.label, categories: matching });
    }
  }

  const uncategorized = availableCategories.filter((c) => !KNOWN_CATEGORIES.has(c));
  if (uncategorized.length > 0) {
    groups.push({ id: 'new', label: '新增', categories: uncategorized });
  }

  return groups;
}
