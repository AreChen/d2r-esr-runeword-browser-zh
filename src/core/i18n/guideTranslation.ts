import { translateGameText } from './index';
import { normalizeTranslationKey } from './textTranslation';

const guideExactTranslations: Readonly<Record<string, string>> = {
  Changelogs: '更新日志',
  Armor: '护甲',
  Weapons: '武器',
  Prefixes: '前缀',
  Suffixes: '后缀',
  'Uni Armor': '暗金护甲',
  'Uni Weapons': '暗金武器',
  'Uni Other': '暗金其他',
  'Uni Mythicals': '神话暗金',
  Sets: '套装',
  'Gems/Runes': '宝石/符文',
  Gemwords: '宝石之语',
  Runewords: '符文之语',
  'Cube Recipes': '方块公式',
  Maps: '地图',
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
  'Worldstone Shard': '世界石碎片',
  'Weapon Mastery Token': '武器精通代币',
  'Awakened Weapon Mastery Token': '觉醒武器精通代币',
  'Any Awakened Weapon Mastery Token': '任意觉醒武器精通代币',
  'Any Class Weapon with Weapon Mastery': '任意带有武器精通的职业武器',
  'Weapon Mastery Removed*': '移除武器精通*',
  '*The token is lost': '*代币会被消耗',
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
  'Vessel of Souls': '灵魂之器',
  Ascendancies: '升华',
  'Kill Ledger': '击杀账本',
  'Mercenary and Oskill Information': '佣兵与 Oskill 信息',
  'Weapon Mastery': '武器精通',
  Oskills: 'Oskills',
  'Description/Rewards': '描述/奖励',
  Rewards: '奖励',
  Passives: '被动',
  'Other Generic Items/Materials': '其他通用物品/材料',
  'Corruptions are unique bonuses obtained through transmuting a Worldstone Shard with any item.':
    '腐化是通过将世界石碎片与任意物品合成获得的独特加成。',
  'On SP build, Worldstone Shards can drop from any terrorized champion or unique.':
    '单机版中，世界石碎片可由任意恐怖化冠军怪或暗金怪掉落。',
  'On LAN build, Worldstone Shards can drop from any champion or unique that has level 90+, regardless if they are terrorized or not (although terrorized zones help with this since they add levels to the affected monsters).':
    '局域网版中，世界石碎片可由任意 90 级以上冠军怪或暗金怪掉落，无论它们是否恐怖化（恐怖化区域会提高怪物等级，因此有帮助）。',
  'All items have a 25% chance to be turned into a rare (brick) upon corrupting.': '所有物品在腐化时都有 25% 几率变成稀有物品（损坏）。',
  'The chance of getting a successful corruption (bonus) is 75% (66% for unique charms).':
    '成功腐化并获得加成的几率为 75%（暗金护身符为 66%）。',
  'Certain items cannot be corrupted to avoid abuse or too powerful items (e.g. Damage Augmenter).':
    '为避免滥用或产生过强物品，部分物品不能腐化（例如伤害增强器）。',
  'After transmuting an item with a Worldstone Shard, you need to transmute it again to effectively corrupt it.':
    '物品与世界石碎片合成后，需要再次合成才会真正完成腐化。',
  'BE AWARE that corrupting an item can turn it into a rare.': '请注意，腐化物品可能会把它变成稀有物品。',
  'Anointments are unique bonuses obtained through transmuting specific cube regents with certain items.':
    '涂油是通过将特定方块材料与指定物品合成获得的独特加成。',
  "For Unique Charms, anointments can be obtained through transmuting all Eye of the Storm boss body parts (Diablo's Demonic Horn, Baal's Demonic Eye, Mephisto's Demonic Brain) with a Unique Charm for a one-time bonus.":
    '暗金护身符可以通过将全部风暴之眼首领器官（迪亚布罗的恶魔之角、巴尔的恶魔之眼、梅菲斯托的恶魔大脑）与暗金护身符合成，获得一次性涂油加成。',
  'For Rare Equippable Gear, anointments can be obtained through transmuting an Orb of Anointment with a rare item.':
    '稀有可装备物品可以通过将涂抹之球与稀有物品合成来获得涂油。',
  'Unlike corruptions, anointing an item cannot brick it.': '不同于腐化，给物品涂油不会使其损坏。',
  'Character Augmenter can also be anointed, unlike the case for corruption.': '角色增强器也可以涂油，这一点不同于腐化。',
  'After transmuting an item with the specific cube regents, you need to transmute it again to effectively anoint it.':
    '物品与指定方块材料合成后，需要再次合成才会真正完成涂油。',
  'Warning: endgame map zones are much more difficult than all other content they require extremely well defined builds.':
    '警告：终局地图区域远难于其他内容，需要非常明确且成型的构筑。',
  'Endgame map zones can be accessed by transmuting map items by themselves in act 5 hell.':
    '在地狱第五幕单独合成地图物品即可进入终局地图区域。',
  'There are a total of 18 map items across 5 tiers.': '地图物品共有 5 个阶级、18 种。',
  'Each tier has 4 different map zones, except tier 5 which has only 2 maps with unique and extremely difficult boss encounters.':
    '每个阶级有 4 个不同地图区域，但 5 阶只有 2 张地图，并带有独特且极其困难的首领战。',
  'Map items can drop from nihlathak domain superuniques.': '地图物品可由尼拉塞克领域的超级暗金怪掉落。',
  'Each superunique boss has a 5% chance to drop a tier 1 map.': '每个超级暗金首领有 5% 几率掉落 1 阶地图。',
  'Map items can also drop from champions and unique monsters in level 96 terrorized zones.':
    '地图物品也可由 96 级恐怖化区域中的冠军怪和暗金怪掉落。',
  'Map items can also be acquired as a rare drop in endgame map zones themselves, which will be your main source if you run map zones regularly':
    '地图物品也会作为终局地图区域内的稀有掉落出现；如果你经常刷地图，这会是主要来源。',
  "Regular monsters in maps can drop a map one tier higher than the map tier they're killed in.":
    '地图中的普通怪物可以掉落比当前地图高 1 阶的地图。',
  'You can also upgrade maps at a 3:1 ratio.': '你也可以按 3:1 比例升级地图。',
  'It is recommended that your build has at least 5k hp, max resistances, some physical resist and other defensive layers in order to survive.':
    '建议你的构筑至少有 5000 生命、满抗性、一定物理抗性以及其他防御层，才能稳定生存。',
  'Rewards that are expressed in average chance mean that those rewards can be increased by up to 100% at players 8.':
    '以平均几率表示的奖励，代表这些奖励在 8 人难度下最多可提高到 100%。',
  'For example, An ancient has 50% chance to roll a key drop twice, so on average you get one key, but increasing player number to 8 will make him have almost 100% chance to drop 2 keys.':
    '例如，某个远古怪有 50% 几率进行两次钥匙掉落判定，因此平均能获得一把钥匙；将玩家数提高到 8 后，它几乎会有 100% 几率掉落两把钥匙。',
  'Endgame maps can become terrorized and one map of each tier will be terrorized at one time (except tier 5, which are terrorized both at the same time, independent of others).':
    '终局地图也会被恐怖化；每个阶级同一时间会有一张地图被恐怖化（5 阶除外，两张 5 阶地图会同时恐怖化且独立于其他地图）。',
  'Endgame maps can be terrorized on normal and nightmare difficulties too, but it is not intended.':
    '终局地图在普通和噩梦难度也可能被恐怖化，但这并非设计意图。',
  'This cannot be fixed due to engine limitations.': '由于引擎限制，这一点无法修复。',
  'Terrorized bosses always drop a Worldstone Shard (except tier 5 bosses due to an engine limitation).':
    '恐怖化首领必定掉落世界石碎片（由于引擎限制，5 阶首领除外）。',
  'Tier 1-4 bosses have an Immunity Shield that falls off from time to time.': '1-4 阶首领拥有会不时消失的免疫护盾。',
  'You can make it fall more often with resistance reduction effects.': '通过降低抗性的效果可以让护盾更频繁地消失。',
  'Vessel of Souls is a special mythical unique amulet that can consume 5 organs at a time to get various bonuses based on the organs consumed.':
    '灵魂之器是一件特殊的神话暗金项链，可以一次消耗 5 个器官，并根据消耗的器官获得不同加成。',
  'Each tier 1 recipe consumes 350 souls per use.': '每次使用 1 阶公式会消耗 350 个灵魂。',
  'The Kill Ledger is a special book that keeps tracks of the amount of enemies you have killed.':
    '击杀账本是一本特殊书籍，会记录你击杀的敌人数量。',
  'The boss bonuses can be completed in any order.': '首领加成可以按任意顺序完成。',
  'Here you can find information about mercenaries and various oskills.': '这里可以查看佣兵和各种 Oskill 的信息。',
  'Weapon mastery is an unique system that changes how class weapons interact with skills.':
    '武器精通是一个会改变职业武器与技能互动方式的独特系统。',
  'You can only apply one weapon mastery per weapon.': '每把武器只能应用一种武器精通。',
};

const guidePhraseTranslations: readonly (readonly [RegExp, string])[] = [
  [/\bWorldstone Shards\b/g, '世界石碎片'],
  [/\bWorldstone Shard\b/g, '世界石碎片'],
  [/\bWeapon Mastery Token\b/g, '武器精通代币'],
  [/\bAwakened Weapon Mastery Token\b/g, '觉醒武器精通代币'],
  [/\bCorrupted Zakarum\b/g, '腐化的扎卡鲁姆'],
  [/\bWeapon mastery\b/gi, '武器精通'],
  [/\bclass weapons\b/gi, '职业武器'],
  [/\bendgame map bosses\b/gi, '终局地图首领'],
  [/\bendgame maps\b/gi, '终局地图'],
  [/\bmap bosses\b/gi, '地图首领'],
  [/\bunique bonuses\b/gi, '独特加成'],
  [/\btransmuting\b/gi, '合成'],
  [/\bany item\b/gi, '任意物品'],
  [/\((\d+(?:\.\d+)?)% chance on average\)/g, '（平均 $1% 几率）'],
  [/\((\d+(?:\.\d+)?)% chance each on average\)/g, '（平均每个 $1% 几率）'],
  [/\((\d+(?:\.\d+)?)% chance on average each\)/g, '（平均每个 $1% 几率）'],
  [/\bchance\b/gi, '几率'],
  [/\bnot scaled by \/players\b/gi, '不受 /players 缩放影响'],
  [/\bcan drop from\b/gi, '可由'],
  [/\bcan be removed\b/gi, '可以移除'],
  [/\bthe token is lost\b/gi, '代币会被消耗'],
  [/\bCannot exceed maximum sockets\b/gi, '不能超过最大镶孔数'],
  [/\bOrb of Anointment\b/g, '涂抹之球'],
  [/\bRandom Pandemonium Key\b/g, '随机混沌钥匙'],
  [/\bTier (\d+) Map\b/g, '$1 阶地图'],
];

function normalizeGuideTranslationKey(text: string): string {
  return normalizeTranslationKey(text)
    .replace(/\s+([,.;:!?])/gu, '$1')
    .replace(/\(\s+/gu, '(')
    .replace(/\s+\)/gu, ')')
    .trim();
}

function applyGuidePhraseTranslations(text: string): string {
  let translated = text;
  for (const [pattern, replacement] of guidePhraseTranslations) {
    translated = translated.replace(pattern, replacement);
  }
  return translated.replace(/\s+（/gu, '（').replace(/\s+([，。！？；：])/gu, '$1');
}

function translateGuideExactText(normalized: string): string {
  const exact = guideExactTranslations[normalized];
  if (exact) return exact;

  return normalized;
}

function translateGuideDirectText(normalized: string): string {
  const exact = translateGuideExactText(normalized);
  if (exact !== normalized) return exact;

  const gameTranslated = translateGameText(normalized);
  if (gameTranslated !== normalized) return gameTranslated;

  return normalized;
}

function splitGuideSentences(text: string): string[] {
  const dotPlaceholder = '[[GUIDE_DOT]]';
  const protectedText = text.replace(/\b(?:e\.g|i\.e)\./giu, (match) => match.replace(/\./g, dotPlaceholder));

  return protectedText
    .split(/(?<=[.!?])\s+(?=[A-Z0-9*])/u)
    .map((part) => part.replaceAll(dotPlaceholder, '.').trim())
    .filter((part) => part.length > 0);
}

function translateGuideCompositeText(normalized: string): string {
  const exact = translateGuideExactText(normalized);
  if (exact !== normalized) return exact;

  const sentences = splitGuideSentences(normalized);
  if (sentences.length > 1) {
    const translatedSentences = sentences.map((sentence) => {
      const sentenceDirect = translateGuideDirectText(sentence);
      if (sentenceDirect !== sentence) return sentenceDirect;
      return applyGuidePhraseTranslations(sentence);
    });
    const translatedParagraph = translatedSentences.join(' ').replace(/([。！？])\s+(?=\p{Script=Han})/gu, '$1');
    if (translatedParagraph !== normalized) return translatedParagraph;
    return applyGuidePhraseTranslations(normalized);
  }

  const direct = translateGuideDirectText(normalized);
  if (direct !== normalized) return direct;

  return applyGuidePhraseTranslations(normalized);
}

export function translateGuideText(text: string): string {
  const normalized = normalizeGuideTranslationKey(text);
  if (!normalized) return normalized;

  return translateGuideCompositeText(normalized);
}
