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
    sourcePath: 'CubeFormula.html',
    sourceBaseUrl: D2R_DPDNS_BASE_URL,
    fixturePath: 'd2r-dpdns/CubeFormula.html',
    parserProfile: 'dpdns',
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
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rMaterials',
    label: 'DPDNS Materials',
    title: '材料资料（DPDNS）',
    sourcePath: 'Materials.html',
    fixturePath: 'd2r-dpdns/Materials.html',
    order: 201,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rAnointment',
    label: 'DPDNS Anointment',
    title: '装备祝福（DPDNS）',
    sourcePath: 'Anointment.html',
    fixturePath: 'd2r-dpdns/Anointment.html',
    order: 202,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rCorruption',
    label: 'DPDNS Corruption',
    title: '装备腐化（DPDNS）',
    sourcePath: 'Corruption.html',
    fixturePath: 'd2r-dpdns/Corruption.html',
    order: 203,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rEndMap',
    label: 'DPDNS End Map',
    title: '终局地图与 BOSS（DPDNS）',
    sourcePath: 'EndMap.html',
    fixturePath: 'd2r-dpdns/EndMap.html',
    order: 204,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rVesselOfSouls',
    label: 'DPDNS Vessel of Souls',
    title: '灵魂容器（DPDNS）',
    sourcePath: 'Vessel_Of_Souls.html',
    fixturePath: 'd2r-dpdns/Vessel_Of_Souls.html',
    order: 205,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rKillLedger',
    label: 'DPDNS Kill Ledger',
    title: '击杀记录（DPDNS）',
    sourcePath: 'kill_ledger.html',
    fixturePath: 'd2r-dpdns/kill_ledger.html',
    order: 206,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rAscendancies',
    label: 'DPDNS Ascendancies',
    title: '职业升华（DPDNS）',
    sourcePath: 'Ascendancies.html',
    fixturePath: 'd2r-dpdns/Ascendancies.html',
    order: 207,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rMythicals',
    label: 'DPDNS Mythicals',
    title: '神话装备（DPDNS）',
    sourcePath: 'Mythicals.html',
    fixturePath: 'd2r-dpdns/Mythicals.html',
    order: 208,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rWeapons',
    label: 'DPDNS Weapon Bases',
    title: '武器底材（DPDNS）',
    sourcePath: 'Weapons.html',
    fixturePath: 'd2r-dpdns/Weapons.html',
    order: 209,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rArmors',
    label: 'DPDNS Armor Bases',
    title: '防具底材（DPDNS）',
    sourcePath: 'Armor.html',
    fixturePath: 'd2r-dpdns/Armor.html',
    order: 210,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rMaps',
    label: 'DPDNS Maps',
    title: '普通地图（DPDNS）',
    sourcePath: 'Map.html',
    fixturePath: 'd2r-dpdns/Map.html',
    order: 211,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rSkillInformation',
    label: 'DPDNS Skill Information',
    title: '装备技能与佣兵技能（DPDNS）',
    sourcePath: 'skill_information.html',
    fixturePath: 'd2r-dpdns/skill_information.html',
    order: 212,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rWeaponMastery',
    label: 'DPDNS Weapon Mastery',
    title: '武器精通（DPDNS）',
    sourcePath: 'weapon_mastery.html',
    fixturePath: 'd2r-dpdns/weapon_mastery.html',
    order: 213,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rQuickGuide',
    label: 'DPDNS Quick Guide',
    title: '简要攻略（DPDNS）',
    sourcePath: 'GameGuide_Quick.html',
    fixturePath: 'd2r-dpdns/GameGuide_Quick.html',
    order: 214,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rAmazonGuide',
    label: 'DPDNS Amazon Guide',
    title: '亚马逊攻略（DPDNS）',
    sourcePath: 'GameGuide_Amazon.html',
    fixturePath: 'd2r-dpdns/GameGuide_Amazon.html',
    order: 220,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rAssassinGuide',
    label: 'DPDNS Assassin Guide',
    title: '刺客攻略（DPDNS）',
    sourcePath: 'GameGuide_Assassin.html',
    fixturePath: 'd2r-dpdns/GameGuide_Assassin.html',
    order: 221,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rBarbarianGuide',
    label: 'DPDNS Barbarian Guide',
    title: '野蛮人攻略（DPDNS）',
    sourcePath: 'GameGuide_Barbarian.html',
    fixturePath: 'd2r-dpdns/GameGuide_Barbarian.html',
    order: 222,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rDruidGuide',
    label: 'DPDNS Druid Guide',
    title: '德鲁伊攻略（DPDNS）',
    sourcePath: 'GameGuide_Druid.html',
    fixturePath: 'd2r-dpdns/GameGuide_Druid.html',
    order: 223,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rNecromancerGuide',
    label: 'DPDNS Necromancer Guide',
    title: '死灵法师攻略（DPDNS）',
    sourcePath: 'GameGuide_Necromancer.html',
    fixturePath: 'd2r-dpdns/GameGuide_Necromancer.html',
    order: 224,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rPaladinGuide',
    label: 'DPDNS Paladin Guide',
    title: '圣骑士攻略（DPDNS）',
    sourcePath: 'GameGuide_Paladin.html',
    fixturePath: 'd2r-dpdns/GameGuide_Paladin.html',
    order: 225,
  },
  {
    ...D2R_DPDNS_GUIDE_DEFAULTS,
    id: 'd2rSorceressGuide',
    label: 'DPDNS Sorceress Guide',
    title: '法师攻略（DPDNS）',
    sourcePath: 'GameGuide_Sorceress.html',
    fixturePath: 'd2r-dpdns/GameGuide_Sorceress.html',
    order: 226,
  },
] as const satisfies readonly GuidePageCatalogEntry[];

export const CORE_GUIDE_PAGE_IDS = [
  'gems',
  'gemwords',
  'runewords',
  'uniqueWeapons',
  'uniqueArmors',
  'uniqueOthers',
  'uniqueMythicals',
  'ascendancies',
] as const;

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
