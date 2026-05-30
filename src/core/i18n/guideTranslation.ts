import { translateGameText } from './index';
import { normalizeTranslationKey } from './textTranslation';

const guideExactTranslations: Readonly<Record<string, string>> = {
  'Input(s)': '投入物',
  'Possible Outcome(s)': '可能结果',
  Output: '产物',
  'Output(s)': '产物',
  Recipe: '公式',
  Recipes: '公式',
  Notes: '备注',
  'General Recipes': '通用公式',
  Specializations: '专精',
  'General Recipe': '通用公式',
  Specialization: '专精',
  'Same Item': '同一物品',
  Corrupted: '已腐化',
  'Worldstone Shard': '世界之石碎片',
  'Weapon Mastery Token': '武器精通令牌',
  'Awakened Weapon Mastery Token': '觉醒武器精通令牌',
  'Any Awakened Weapon Mastery Token': '任意觉醒武器精通令牌',
  'Any Class Weapon with Weapon Mastery': '任意带有武器精通的职业武器',
  'Weapon Mastery Removed*': '移除武器精通*',
  '*The token is lost': '*令牌会被消耗',
  '*Unawakened': '*未觉醒',
  'Class specific Dragon Stone form': '对应职业的龙石形态',
  'Any Class Weapon': '任意职业武器',
  'Unique/Set/Crafted/Rare Weapon': '暗金/套装/手工/稀有武器',
  'Unique/Set/Crafted/Rare Armor': '暗金/套装/手工/稀有护甲',
  'Unique/Set/Crafted/Rare Jewelry': '暗金/套装/手工/稀有首饰',
  'Unique/Set/Crafted/Rare Charm': '暗金/套装/手工/稀有护身符',
  'Rare Weapon': '稀有武器',
  'Rare Armor': '稀有护甲',
  'Rare Jewelry': '稀有首饰',
  'Rare Equippable Gear': '稀有可装备物品',
  'Unique Charm': '暗金护身符',
  'Random highest tier suffix': '随机最高阶后缀',
  '*** Anointed **': '*** 已涂油 **',
  '*** Anointed ***': '*** 已涂油 ***',
  'Corruption Outcomes': '腐化结果',
  'Anointment Outcomes': '涂油结果',
  'Endgame Maps': '终局地图',
  'Vessel of Souls': '灵魂容器',
  Ascendancies: '升华',
  'Kill Ledger': '击杀账本',
  'Mercenary and Oskill Information': '佣兵与 Oskill 信息',
  'Weapon Mastery': '武器精通',
  Oskills: 'Oskills',
  'Corruptions are unique bonuses obtained through transmuting a Worldstone Shard with any item.':
    '腐化是通过将世界之石碎片与任意物品合成获得的独特加成。',
  'Anointments are unique bonuses obtained through transmuting specific cube regents with certain items.':
    '涂油是通过将特定方块材料与指定物品合成获得的独特加成。',
  'Warning: endgame map zones are much more difficult than all other content they require extremely well defined builds.':
    '警告：终局地图区域远难于其他内容，需要非常明确且成型的构筑。',
  'Vessel of Souls is a special mythical unique amulet that can consume 5 organs at a time to get various bonuses based on the organs consumed.':
    '灵魂容器是一件特殊的神话暗金项链，可以一次消耗 5 个器官，并根据消耗的器官获得不同加成。',
  'The Kill Ledger is a special book that keeps tracks of the amount of enemies you have killed.':
    '击杀账本是一本特殊书籍，会记录你击杀的敌人数量。',
  'Here you can find information about mercenaries and various oskills.': '这里可以查看佣兵和各种 Oskill 的信息。',
  'Weapon mastery is an unique system that changes how class weapons interact with skills.':
    '武器精通是一个会改变职业武器与技能互动方式的独特系统。',
};

const guidePhraseTranslations: readonly (readonly [RegExp, string])[] = [
  [/\bWorldstone Shards\b/g, '世界之石碎片'],
  [/\bWorldstone Shard\b/g, '世界之石碎片'],
  [/\bWeapon Mastery Token\b/g, '武器精通令牌'],
  [/\bAwakened Weapon Mastery Token\b/g, '觉醒武器精通令牌'],
  [/\bCorrupted Zakarum\b/g, '腐化的扎卡鲁姆'],
  [/\bWeapon mastery\b/gi, '武器精通'],
  [/\bclass weapons\b/gi, '职业武器'],
  [/\bendgame map bosses\b/gi, '终局地图首领'],
  [/\bendgame maps\b/gi, '终局地图'],
  [/\bmap bosses\b/gi, '地图首领'],
  [/\bunique bonuses\b/gi, '独特加成'],
  [/\btransmuting\b/gi, '合成'],
  [/\bany item\b/gi, '任意物品'],
  [/\bchance\b/gi, '几率'],
  [/\bnot scaled by \/players\b/gi, '不受 /players 缩放影响'],
  [/\bcan drop from\b/gi, '可由'],
  [/\bcan be removed\b/gi, '可以移除'],
  [/\bthe token is lost\b/gi, '令牌会被消耗'],
  [/\bCannot exceed maximum sockets\b/gi, '不能超过最大镶孔数'],
];

export function translateGuideText(text: string): string {
  const normalized = normalizeTranslationKey(text);
  if (!normalized) return normalized;

  const exact = guideExactTranslations[normalized];
  if (exact) return exact;

  const gameTranslated = translateGameText(normalized);
  if (gameTranslated !== normalized) return gameTranslated;

  let translated = normalized;
  for (const [pattern, replacement] of guidePhraseTranslations) {
    translated = translated.replace(pattern, replacement);
  }
  return translated;
}
