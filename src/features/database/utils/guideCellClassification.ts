export type GuideMaterialLineKind =
  | 'rune'
  | 'gem'
  | 'corruption'
  | 'organ'
  | 'dstone'
  | 'forging'
  | 'aura'
  | 'socket'
  | 'map'
  | 'cube'
  | 'consumable'
  | 'currency';

export type GuideAffixLineKind = 'skillAffix' | 'resistAffix' | 'damageAffix' | 'speedAffix' | 'triggerAffix';

export type GuideRowMarkerKind = GuideMaterialLineKind | 'affix' | GuideAffixLineKind;

export type GuideCellLineClassification =
  | { readonly kind: 'plain' }
  | { readonly kind: 'affix'; readonly affixKind: GuideAffixLineKind | 'affix' }
  | { readonly kind: 'material'; readonly materialKind: GuideMaterialLineKind };

export const GUIDE_ROW_MARKER_LABELS: Record<GuideRowMarkerKind, string> = {
  rune: '符文',
  gem: '宝石',
  corruption: '世界石/腐化',
  organ: '器官',
  dstone: 'D-Stoning/龙石',
  forging: '锻造材料',
  aura: '光环石',
  socket: '镶孔材料',
  map: '地图/钥匙',
  cube: '方块材料',
  consumable: '消耗品',
  currency: '优惠券/代币',
  affix: '属性词缀',
  skillAffix: '技能加成',
  resistAffix: '抗性',
  damageAffix: '伤害/穿刺',
  speedAffix: '速度',
  triggerAffix: '触发施法',
};

export const GUIDE_ROW_MARKER_KINDS: readonly GuideRowMarkerKind[] = [
  'rune',
  'gem',
  'corruption',
  'organ',
  'dstone',
  'forging',
  'aura',
  'socket',
  'map',
  'cube',
  'consumable',
  'currency',
  'affix',
  'skillAffix',
  'resistAffix',
  'damageAffix',
  'speedAffix',
  'triggerAffix',
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
    kind: 'dstone',
    patterns: [/\b(?:Dragon Stones?|D-Stones?|Dragonstone)\b/iu, /(?:龙石|D打造|D-Stoning)/iu],
  },
  {
    kind: 'forging',
    patterns: [
      /\b(?:Forging Hammers?|Anvil Stones?|Anvils?|Holy Symbols?|Blackmoores?|Crushed Gems?|Spider'?s Silk|Tyranium Ores?)\b/iu,
      /(?:锻造(?:之)?锤|铁砧(?:之石|石)?|神圣符号|圣徽|黑沼|粉碎宝石|蛛丝|钛金矿石)/u,
    ],
  },
  {
    kind: 'aura',
    patterns: [
      /\b(?:Aura Stones?|Green Aura Stone|Red Aura Stone|Violet Aura Stone|Yellow Aura Stone|Black Aura Stone|White Aura Stone|Blue Aura Stone)\b/iu,
      /(?:光环石)/u,
    ],
  },
  {
    kind: 'socket',
    patterns: [/\bSocket Donuts?\b/iu, /(?:镶孔甜甜圈|甜甜圈)/u],
  },
  {
    kind: 'map',
    patterns: [
      /\b(?:Endgame Maps?|Map Keys?|Chaos Keys?|Pandemonium Key Set|Key of (?:Terror|Hate|Destruction)|Terror Key|Hate Key|Destruction Key)\b/iu,
      /(?:终局地图|地图钥匙|混沌钥匙|混沌钥匙套装|恐惧之钥|憎恨之钥|仇恨之钥|毁灭之钥)/u,
    ],
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
      /\b(?:Maple Leaves?|Randomiz(?:e|ing) Stones?|Ore Shards?|Unique Stones?)\b/iu,
      /(?:枫叶|锻造石|随机化?石|随机化之石|矿石碎片|独特的?石头|暗金石头)/u,
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
  /\b(?:Life|Mana|Faster|Speed|Leech|Sockets?|Corrupted|Anointed|Crushing Blow|Deadly Strike)\b/iu,
  /(?:增强伤害|所有技能|技能等级|抗性|防御|伤害|几率|攻击准确率|生命|法力|速度|吸取|镶孔|腐化|涂油|锻造)/u,
] as const;

const SPECIFIC_AFFIX_KIND_PATTERNS: readonly { readonly kind: GuideAffixLineKind; readonly patterns: readonly RegExp[] }[] = [
  {
    kind: 'triggerAffix',
    patterns: [/\b(?:Chance to Cast|Cast Level)\b/iu, /(?:几率.*施放|施放等级)/u],
  },
  {
    kind: 'skillAffix',
    patterns: [/\b(?:All Skills?|Skill Levels?|[A-Z][A-Za-z/ ]+ Skills?)\b/iu, /(?:所有技能|技能等级|[一-龥A-Za-z/]+技能(?:（|$|\s))/u],
  },
  {
    kind: 'resistAffix',
    patterns: [/\b(?:Resist|Resistance|Resistances)\b/iu, /(?:抗性|最大抗|降低敌人[^\n]*抗)/u],
  },
  {
    kind: 'damageAffix',
    patterns: [
      /\b(?:Enhanced Damage|Damage|Piercing Attack|Crushing Blow|Deadly Strike|Open Wounds)\b/iu,
      /(?:增强伤害|伤害|穿刺|压碎|致命|撕开伤口)/u,
    ],
  },
  {
    kind: 'speedAffix',
    patterns: [
      /\b(?:Faster|Speed|Run\/Walk|Increased Attack Speed|Attack Speed|Cast Rate|Block Rate|Hit Recovery)\b/iu,
      /(?:速度|跑步|行走|攻击速度|施法速度|格挡速度|恢复速度)/u,
    ],
  },
] as const;

function getGuideMaterialLineKind(line: string): GuideMaterialLineKind | null {
  for (const entry of MATERIAL_KIND_PATTERNS) {
    if (entry.patterns.some((pattern) => pattern.test(line))) return entry.kind;
  }

  return null;
}

function getGuideAffixLineKind(line: string): GuideAffixLineKind | 'affix' | null {
  if (!AFFIX_LINE_PATTERNS.some((pattern) => pattern.test(line))) return null;

  for (const entry of SPECIFIC_AFFIX_KIND_PATTERNS) {
    if (entry.patterns.some((pattern) => pattern.test(line))) return entry.kind;
  }

  return 'affix';
}

export function getGuideCellLineClassification(line: string): GuideCellLineClassification {
  const materialKind = getGuideMaterialLineKind(line);
  if (materialKind !== null) return { kind: 'material', materialKind };
  const affixKind = getGuideAffixLineKind(line);
  if (affixKind !== null) return { kind: 'affix', affixKind };
  return { kind: 'plain' };
}

export function isGuideRowMarkerKind(value: unknown): value is GuideRowMarkerKind {
  return typeof value === 'string' && GUIDE_ROW_MARKER_KINDS.includes(value as GuideRowMarkerKind);
}
