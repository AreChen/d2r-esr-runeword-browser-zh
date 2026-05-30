import { ESR_BASE_URL } from './remoteConfig';
import type { GuidePageGroup } from '@/core/db';

export interface GuidePageCatalogEntry {
  readonly id: string;
  readonly group: GuidePageGroup;
  readonly label: string;
  readonly title: string;
  readonly sourcePath: string;
  readonly order: number;
}

export const GUIDE_PAGE_CATALOG = [
  { id: 'changelogs', group: 'base', label: 'Changelogs', title: '更新日志', sourcePath: 'changelogs.html', order: 0 },
  { id: 'armors', group: 'base', label: 'Armor', title: '护甲基础资料', sourcePath: 'armors.htm', order: 1 },
  { id: 'weapons', group: 'base', label: 'Weapons', title: '武器基础资料', sourcePath: 'weapons.htm', order: 2 },
  { id: 'prefixes', group: 'base', label: 'Prefixes', title: '前缀词缀', sourcePath: 'prefixes.htm', order: 3 },
  { id: 'suffixes', group: 'base', label: 'Suffixes', title: '后缀词缀', sourcePath: 'suffixes.htm', order: 4 },
  { id: 'uniqueArmors', group: 'base', label: 'Uni Armor', title: '暗金护甲资料', sourcePath: 'unique_armors.htm', order: 5 },
  { id: 'uniqueWeapons', group: 'base', label: 'Uni Weapons', title: '暗金武器资料', sourcePath: 'unique_weapons.htm', order: 6 },
  { id: 'uniqueOthers', group: 'base', label: 'Uni Other', title: '暗金其他资料', sourcePath: 'unique_others.htm', order: 7 },
  { id: 'uniqueMythicals', group: 'base', label: 'Uni Mythicals', title: '神话暗金资料', sourcePath: 'unique_mythicals.htm', order: 8 },
  { id: 'sets', group: 'base', label: 'Sets', title: '套装资料', sourcePath: 'sets.htm', order: 9 },
  { id: 'gems', group: 'base', label: 'Gems/Runes', title: '宝石与符文资料', sourcePath: 'gems.htm', order: 10 },
  { id: 'gemwords', group: 'base', label: 'Gemwords', title: '宝石之语', sourcePath: 'gemwords.htm', order: 11 },
  { id: 'runewords', group: 'base', label: 'Runewords', title: '符文之语资料', sourcePath: 'runewords.htm', order: 12 },
  {
    id: 'cubeRecipes',
    group: 'base',
    label: 'Cube Recipes',
    title: '赫拉迪克方块公式',
    sourcePath: 'Eastern Sun Resurrected Cube Recipes.html',
    order: 13,
  },
  { id: 'maps', group: 'base', label: 'Maps', title: '地图资料', sourcePath: 'Eastern Sun Resurrected Maps.html', order: 14 },
  {
    id: 'corruptions',
    group: 'features',
    label: 'Corruption Outcomes',
    title: '腐化结果',
    sourcePath: 'corruptions.htm',
    order: 100,
  },
  {
    id: 'anointments',
    group: 'features',
    label: 'Anointment Outcomes',
    title: '涂油结果',
    sourcePath: 'anointments.htm',
    order: 101,
  },
  { id: 'endgameMaps', group: 'features', label: 'Endgame Maps', title: '终局地图机制', sourcePath: 'endgame_maps.htm', order: 102 },
  {
    id: 'vesselOfSouls',
    group: 'features',
    label: 'Vessel of Souls',
    title: '灵魂之器',
    sourcePath: 'vessel_of_souls.htm',
    order: 103,
  },
  { id: 'ascendancies', group: 'features', label: 'Ascendancies', title: '升华机制', sourcePath: 'ascendancies.htm', order: 104 },
  { id: 'killLedger', group: 'features', label: 'Kill Ledger', title: '击杀账本', sourcePath: 'kill_ledger.htm', order: 105 },
  {
    id: 'skillInformation',
    group: 'features',
    label: 'Mercenary and Oskill Information',
    title: '佣兵与 Oskill 信息',
    sourcePath: 'skill_information.htm',
    order: 106,
  },
  { id: 'weaponMastery', group: 'features', label: 'Weapon Mastery', title: '武器精通机制', sourcePath: 'weapon_mastery.html', order: 107 },
] as const satisfies readonly GuidePageCatalogEntry[];

export const CORE_GUIDE_PAGE_IDS = [
  'gems',
  'runewords',
  'uniqueWeapons',
  'uniqueArmors',
  'uniqueOthers',
  'uniqueMythicals',
  'ascendancies',
] as const;

export function getGuidePageSourceUrl(sourcePath: string): string {
  return `${ESR_BASE_URL}/${encodeURI(sourcePath)}`;
}

export function getGuidePageEntry(id: string): GuidePageCatalogEntry {
  const entry = GUIDE_PAGE_CATALOG.find((item) => item.id === id);
  if (!entry) {
    throw new Error(`Unknown guide page id: ${id}`);
  }
  return entry;
}
