export type GuideMaterialLineKind = 'rune' | 'gem' | 'corruption' | 'organ' | 'cube' | 'consumable' | 'currency';

export type GuideRowMarkerKind = GuideMaterialLineKind | 'affix';

export type GuideCellLineClassification =
  | { readonly kind: 'plain' }
  | { readonly kind: 'affix' }
  | { readonly kind: 'material'; readonly materialKind: GuideMaterialLineKind };

export const GUIDE_ROW_MARKER_LABELS: Record<GuideRowMarkerKind, string> = {
  rune: '符文',
  gem: '宝石',
  corruption: '世界石/腐化',
  organ: '器官',
  cube: '方块材料',
  consumable: '消耗品',
  currency: '优惠券/代币',
  affix: '属性词缀',
};

export const GUIDE_ROW_MARKER_KINDS: readonly GuideRowMarkerKind[] = [
  'rune',
  'gem',
  'corruption',
  'organ',
  'cube',
  'consumable',
  'currency',
  'affix',
] as const;

const MATERIAL_KIND_PATTERNS: readonly { readonly kind: GuideMaterialLineKind; readonly patterns: readonly RegExp[] }[] = [
  {
    kind: 'corruption',
    patterns: [/\bWorldstone Shards?\b/iu, /(?:世界石碎片|世界石碎片袋)/u],
  },
  {
    kind: 'organ',
    patterns: [
      /\b(?:Diablo's Demonic Horn|Baal's Demonic Eye|Mephisto's Demonic Brain|Viper Amulet)\b/iu,
      /\b(?:Heart|Brain|Eye|Horn|Soul)\b/iu,
      /(?:迪亚布罗的恶魔之角|巴尔的恶魔之眼|墨菲斯托的恶魔之脑|恶魔之角|恶魔之眼|恶魔大脑|蛇护符|心脏|大脑|眼球|灵魂)/u,
    ],
  },
  {
    kind: 'rune',
    patterns: [/\b[A-Z][a-z]+ Rune\b/u, /(?:符文|新符|古符|汉字符文|空白符文)/u],
  },
  {
    kind: 'gem',
    patterns: [
      /\b(?:Chipped|Flawed|Blemished|Flawless|Perfect)?\s*(?:Gem|Ruby|Sapphire|Emerald|Topaz|Diamond|Amethyst|Skull|Obsidian)s?\b/iu,
      /(?:宝石|珠宝|红宝石|蓝宝石|绿宝石|黄玉|钻石|紫水晶|头骨|黑曜石)/u,
      /(?:碎裂|裂开|瑕疵|无瑕|完美|缺陷|破裂)(?:的)?[\u4e00-\u9fff]{1,12}(?:石|石英|橄榄石|电气石|黄玉|钻石|水晶|头骨|黑曜石|琥珀|绿松石|锆石|翡翠|宝石)/u,
    ],
  },
  {
    kind: 'cube',
    patterns: [
      /\b(?:Dragon Stones?|Maple Leaves?|Anvil Stones?|Anvils?|Aura Stones?|Socket Donuts?|D-Stones?|Randomiz(?:e|ing) Stones?|Ore Shards?|Tyranium Ores?|Unique Stones?)\b/iu,
      /(?:龙石|枫叶|铁砧(?:之石|石)?|锻造石|光环石|(?:镶孔)?甜甜圈|随机化?石|随机化之石|矿石碎片|钛金矿石|独特的?石头|暗金石头)/u,
    ],
  },
  {
    kind: 'consumable',
    patterns: [/\b(?:Elixir|Steak|Potion|Scroll|Key)\b/iu, /(?:秘药|灵药|牛排|药水|卷轴|钥匙|传送卷轴|鉴定卷轴)/u],
  },
  {
    kind: 'currency',
    patterns: [
      /\b(?:Ancient Decipherers?|Ancient Coupons?|Token)\b/iu,
      /(?:古代解读器|古代解密者|古代优惠券|解读器|解密者|优惠券|奖券|代币)/u,
    ],
  },
] as const;

const AFFIX_LINE_PATTERNS = [
  /^[+-](?:\(|\d)/u,
  /\b(?:Enhanced Damage|All Skills|Skill Levels?|Resist|Resistance|Defense|Damage|Chance to Cast|Attack Rating)\b/iu,
  /\b(?:Life|Mana|Faster|Speed|Leech|Sockets?|Corrupted|Anointed|Forging|Crushing Blow|Deadly Strike)\b/iu,
  /(?:增强伤害|所有技能|技能等级|抗性|防御|伤害|几率|攻击准确率|生命|法力|速度|吸取|镶孔|腐化|涂油|锻造)/u,
] as const;

function getGuideMaterialLineKind(line: string): GuideMaterialLineKind | null {
  for (const entry of MATERIAL_KIND_PATTERNS) {
    if (entry.patterns.some((pattern) => pattern.test(line))) return entry.kind;
  }

  return null;
}

export function getGuideCellLineClassification(line: string): GuideCellLineClassification {
  const materialKind = getGuideMaterialLineKind(line);
  if (materialKind !== null) return { kind: 'material', materialKind };
  if (AFFIX_LINE_PATTERNS.some((pattern) => pattern.test(line))) return { kind: 'affix' };
  return { kind: 'plain' };
}

export function isGuideRowMarkerKind(value: unknown): value is GuideRowMarkerKind {
  return typeof value === 'string' && GUIDE_ROW_MARKER_KINDS.includes(value as GuideRowMarkerKind);
}
