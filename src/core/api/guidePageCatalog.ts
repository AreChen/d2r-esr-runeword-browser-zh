import { D2R_DPDNS_BASE_URL, ESR_BASE_URL } from './remoteConfig';
import type { GuidePageGroup } from '@/core/db';

export interface GuidePageCatalogEntry {
  readonly id: string;
  readonly group: GuidePageGroup;
  readonly label: string;
  readonly title: string;
  readonly sourcePath: string;
  readonly sourceBaseUrl?: string;
  readonly fixturePath?: string;
  readonly optional?: boolean;
  readonly parserProfile?: 'official' | 'dpdns';
  readonly order: number;
}

const D2R_DPDNS_GUIDE_DEFAULTS = {
  group: 'community',
  sourceBaseUrl: D2R_DPDNS_BASE_URL,
  optional: true,
  parserProfile: 'dpdns',
} as const;

export const GUIDE_PAGE_CATALOG = [
  { id: 'changelogs', group: 'base', label: 'Changelogs', title: '更新日志', sourcePath: 'changelogs.html', order: 0 },
  {
    id: 'armors',
    group: 'base',
    label: 'Armor',
    title: '护甲基础资料',
    sourcePath: 'Armor.html',
    sourceBaseUrl: D2R_DPDNS_BASE_URL,
    fixturePath: 'd2r-dpdns/Armor.html',
    parserProfile: 'dpdns',
    order: 1,
  },
  {
    id: 'weapons',
    group: 'base',
    label: 'Weapons',
    title: '武器基础资料',
    sourcePath: 'Weapons.html',
    sourceBaseUrl: D2R_DPDNS_BASE_URL,
    fixturePath: 'd2r-dpdns/Weapons.html',
    parserProfile: 'dpdns',
    order: 2,
  },
  { id: 'prefixes', group: 'base', label: 'Prefixes', title: '前缀词缀', sourcePath: 'prefixes.htm', order: 3 },
  { id: 'suffixes', group: 'base', label: 'Suffixes', title: '后缀词缀', sourcePath: 'suffixes.htm', order: 4 },
  { id: 'uniqueArmors', group: 'base', label: 'Uni Armor', title: '暗金护甲资料', sourcePath: 'unique_armors.htm', order: 5 },
  { id: 'uniqueWeapons', group: 'base', label: 'Uni Weapons', title: '暗金武器资料', sourcePath: 'unique_weapons.htm', order: 6 },
  { id: 'uniqueOthers', group: 'base', label: 'Uni Other', title: '暗金其他资料', sourcePath: 'unique_others.htm', order: 7 },
  {
    id: 'uniqueMythicals',
    group: 'base',
    label: 'Uni Mythicals',
    title: '神话暗金资料',
    sourcePath: 'Mythicals.html',
    sourceBaseUrl: D2R_DPDNS_BASE_URL,
    fixturePath: 'd2r-dpdns/Mythicals.html',
    parserProfile: 'dpdns',
    order: 8,
  },
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
  {
    id: 'maps',
    group: 'base',
    label: 'Maps',
    title: '地图资料',
    sourcePath: 'Map.html',
    sourceBaseUrl: D2R_DPDNS_BASE_URL,
    fixturePath: 'd2r-dpdns/Map.html',
    parserProfile: 'dpdns',
    order: 14,
  },
  {
    id: 'corruptions',
    group: 'features',
    label: 'Corruption Outcomes',
    title: '腐化结果',
    sourcePath: 'Corruption.html',
    sourceBaseUrl: D2R_DPDNS_BASE_URL,
    fixturePath: 'd2r-dpdns/Corruption.html',
    parserProfile: 'dpdns',
    order: 100,
  },
  {
    id: 'anointments',
    group: 'features',
    label: 'Anointment Outcomes',
    title: '涂油结果',
    sourcePath: 'Anointment.html',
    sourceBaseUrl: D2R_DPDNS_BASE_URL,
    fixturePath: 'd2r-dpdns/Anointment.html',
    parserProfile: 'dpdns',
    order: 101,
  },
  {
    id: 'endgameMaps',
    group: 'features',
    label: 'Endgame Maps',
    title: '终局地图机制',
    sourcePath: 'EndMap.html',
    sourceBaseUrl: D2R_DPDNS_BASE_URL,
    fixturePath: 'd2r-dpdns/EndMap.html',
    parserProfile: 'dpdns',
    order: 102,
  },
  {
    id: 'vesselOfSouls',
    group: 'features',
    label: 'Vessel of Souls',
    title: '灵魂之器',
    sourcePath: 'Vessel_Of_Souls.html',
    sourceBaseUrl: D2R_DPDNS_BASE_URL,
    fixturePath: 'd2r-dpdns/Vessel_Of_Souls.html',
    parserProfile: 'dpdns',
    order: 103,
  },
  {
    id: 'ascendancies',
    group: 'features',
    label: 'Ascendancies',
    title: '升华机制',
    sourcePath: 'Ascendancies.html',
    sourceBaseUrl: D2R_DPDNS_BASE_URL,
    fixturePath: 'd2r-dpdns/Ascendancies.html',
    parserProfile: 'dpdns',
    order: 104,
  },
  {
    id: 'killLedger',
    group: 'features',
    label: 'Kill Ledger',
    title: '击杀账本',
    sourcePath: 'kill_ledger.html',
    sourceBaseUrl: D2R_DPDNS_BASE_URL,
    fixturePath: 'd2r-dpdns/kill_ledger.html',
    parserProfile: 'dpdns',
    order: 105,
  },
  {
    id: 'skillInformation',
    group: 'features',
    label: 'Mercenary and Oskill Information',
    title: '佣兵与 Oskill 信息',
    sourcePath: 'skill_information.html',
    sourceBaseUrl: D2R_DPDNS_BASE_URL,
    fixturePath: 'd2r-dpdns/skill_information.html',
    parserProfile: 'dpdns',
    order: 106,
  },
  {
    id: 'weaponMastery',
    group: 'features',
    label: 'Weapon Mastery',
    title: '武器精通机制',
    sourcePath: 'weapon_mastery.html',
    sourceBaseUrl: D2R_DPDNS_BASE_URL,
    fixturePath: 'd2r-dpdns/weapon_mastery.html',
    parserProfile: 'dpdns',
    order: 107,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rMaterials',
    group: 'base',
    label: 'Materials',
    title: '材料资料',
    sourcePath: 'Materials.html',
    fixturePath: 'd2r-dpdns/Materials.html',
    order: 15,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rQuickGuide',
    label: 'Quick Guide',
    title: '简要攻略',
    sourcePath: 'GameGuide_Quick.html',
    fixturePath: 'd2r-dpdns/GameGuide_Quick.html',
    order: 214,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rAmazonGuide',
    label: 'Amazon Guide',
    title: '亚马逊攻略',
    sourcePath: 'GameGuide_Amazon.html',
    fixturePath: 'd2r-dpdns/GameGuide_Amazon.html',
    order: 220,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rAssassinGuide',
    label: 'Assassin Guide',
    title: '刺客攻略',
    sourcePath: 'GameGuide_Assassin.html',
    fixturePath: 'd2r-dpdns/GameGuide_Assassin.html',
    order: 221,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rBarbarianGuide',
    label: 'Barbarian Guide',
    title: '野蛮人攻略',
    sourcePath: 'GameGuide_Barbarian.html',
    fixturePath: 'd2r-dpdns/GameGuide_Barbarian.html',
    order: 222,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rDruidGuide',
    label: 'Druid Guide',
    title: '德鲁伊攻略',
    sourcePath: 'GameGuide_Druid.html',
    fixturePath: 'd2r-dpdns/GameGuide_Druid.html',
    order: 223,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rNecromancerGuide',
    label: 'Necromancer Guide',
    title: '死灵法师攻略',
    sourcePath: 'GameGuide_Necromancer.html',
    fixturePath: 'd2r-dpdns/GameGuide_Necromancer.html',
    order: 224,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rPaladinGuide',
    label: 'Paladin Guide',
    title: '圣骑士攻略',
    sourcePath: 'GameGuide_Paladin.html',
    fixturePath: 'd2r-dpdns/GameGuide_Paladin.html',
    order: 225,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rSorceressGuide',
    label: 'Sorceress Guide',
    title: '法师攻略',
    sourcePath: 'GameGuide_Sorceress.html',
    fixturePath: 'd2r-dpdns/GameGuide_Sorceress.html',
    order: 226,
  },
] as const satisfies readonly GuidePageCatalogEntry[];

export const CORE_GUIDE_PAGE_IDS = ['gems', 'gemwords', 'runewords', 'uniqueWeapons', 'uniqueArmors', 'uniqueOthers'] as const;

export function getGuidePageSourceUrl(sourcePath: string, sourceBaseUrl: string = ESR_BASE_URL): string {
  return new URL(sourcePath, `${sourceBaseUrl.replace(/\/+$/u, '')}/`).href;
}

export function getGuidePageEntrySourceUrl(entry: GuidePageCatalogEntry): string {
  return getGuidePageSourceUrl(entry.sourcePath, entry.sourceBaseUrl);
}

export function getGuidePageEntry(id: string): GuidePageCatalogEntry {
  const entry = GUIDE_PAGE_CATALOG.find((item) => item.id === id);
  if (!entry) {
    throw new Error(`Unknown guide page id: ${id}`);
  }
  return entry;
}
