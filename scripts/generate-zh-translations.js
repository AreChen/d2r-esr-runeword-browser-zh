#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const DEFAULT_STRINGS_DIR = 'H:\\D2RLAN\\D2R\\Mods\\EasternSunLAN\\EasternSunLAN.mpq\\data\\local\\lng\\strings';
const STRINGS_DIR = process.env.D2R_ESR_STRINGS_DIR ?? DEFAULT_STRINGS_DIR;
const OUTPUT_FILE = join(REPO_ROOT, 'src', 'core', 'i18n', 'generated', 'zhCN.ts');

const SOURCE_FILES = [
  'item-runes.json',
  'item-gems.json',
  'item-names.json',
  'item-nameaffixes.json',
  'item-modifiers.json',
  'skills.json',
  'ui.json',
];

const EXACT_MAX_LENGTH = 120;
const TEMPLATE_MAX_LENGTH = 180;
const PLACEHOLDER_REGEX = /%\+?[dius]/;
const TEMPLATE_PLACEHOLDER_REGEX = /%\+?[dius]/g;

const manualExactTranslations = {
  'All Weapons': '所有武器',
  '2H Swing Weapon': '双手挥击武器',
  'Any Armor': '任意护甲',
  'Any Shield': '任意盾牌',
  Armor: '护甲',
  'Assassin 2H Katana': '刺客双手武士刀',
  Axe: '斧',
  Belt: '腰带',
  Blunt: '钝器',
  'Body Armor': '身体护甲',
  Boots: '靴子',
  Bow: '弓',
  Charm: '护身符',
  'Class-Specific': '职业专属',
  Club: '木棒',
  Crossbow: '弩',
  Dagger: '匕首',
  Gloves: '手套',
  Hammer: '锤',
  'Hand to Hand': '格斗武器',
  Helm: '头盔',
  Knife: '小刀',
  Mace: '钉锤',
  'Melee Weapon': '近战武器',
  Missile: '远程',
  'Missile Weapon': '远程武器',
  Orb: '法球',
  'Paladin Item': '圣骑士物品',
  'Paladin Sword': '圣骑士剑',
  Pelt: '兽皮',
  Polearm: '长柄武器',
  Scepter: '权杖',
  Shield: '盾牌',
  Shuriken: '手里剑',
  'Sorceress Mana Blade': '女巫法力刃',
  Spear: '长矛',
  Staff: '法杖',
  Sword: '剑',
  Wand: '魔杖',
  Weapon: '武器',
  'Weapons/Gloves': '武器/手套',
  'Helms/Boots/Staves/Orbs/Wands': '头盔/靴子/法杖/法球/魔杖',
  'Armor/Shields/Belts': '护甲/盾牌/腰带',
  Battlemage: '战斗法师',
  Blademaster: '剑术大师',
  Arcanist: '奥术师',
  Bloodmage: '血法师',
  Awakened: '觉醒者',
  Ironbolt: '铁弩手',
  Starborn: '星裔',
  Lifebreaker: '破命者',
  Worldshaper: '塑界者',
  'Soul Warden': '灵魂守卫',
  'Stance Dancer': '姿态舞者',
  Nomad: '游牧者',
  Sharpshooter: '神射手',
  'Mana Warden': '法力守卫',
  Berserker: '狂战士',
  Amazon: '亚马逊',
  Assassin: '刺客',
  Barbarian: '野蛮人',
  Druid: '德鲁伊',
  Necromancer: '死灵法师',
  Paladin: '圣骑士',
  Sorceress: '女巫',
  Unassigned: '未指定',
  'Offensive Auras': '攻击灵气',
  'Defensive Auras': '防御灵气',
  'Combat Skills': '战斗技能',
  'Class Skill Levels': '职业技能等级',
  'All Maximum Resistances': '所有最大抗性',
  'All Classes': '所有职业',
  'Physical Resist': '物理抗性',
  'Magic Skills': '魔法技能',
  'Poison Skills': '毒素技能',
  'Shape Shifting Skills': '变形技能',
  Strength: '力量',
  Dexterity: '敏捷',
  Vitality: '体力',
  Energy: '精力',
  Life: '生命',
  Mana: '法力',
  'Spell Damage': '法术伤害',
  'Summon Damage': '召唤伤害',
  'Total Defense Bonus': '总防御加成',
  'Attack Speed': '攻击速度',
  'Life Steal': '生命偷取',
  Attributes: '属性',
  Speed: '速度',
  'Elemental Resist': '元素抗性',
  'Elemental Absorb': '元素吸收',
  'Minimum Damage': '最小伤害',
  'Maximum Damage': '最大伤害',
  'Faster Crossbow Reload Time': '更快弩重新装填速度',
  'Cannot be Frozen': '无法冰冻',
  'Blood Magic': '血魔法',
  'Power of the Timeless Sands': '永恒沙漏之力',
  'Scosglen Resonance': '斯科斯格伦共鸣',
  'Revenant Of Corruption': '腐化亡魂',
  'Random Spell Mastery (Poison/Wind/Magic)': '随机法术掌握（毒素/风/魔法）',
  "Tal Rasha's Final Whisper": '塔拉夏的最终低语',
  "El'Druin, Excalibur of the Light": '艾尔德鲁因，光明圣剑',
  'The Ties that Bind': '束缚之结',
  'Energy has no effect on Spell or Summon Damage anymore': '精力不再影响法术或召唤伤害',
  '50% Increased Maximum Life': '最大生命提高 50%',
  'Gain 5 Mana for every 1% Speed': '每 1% 速度获得 5 法力',
  'Gain 1 Mana on Striking for every 25% Speed': '每 25% 速度获得 1 点击中恢复法力',
  'Gain 1% Spell Damage for every 250 Life and 1% Summon Damage for every 400 Life':
    '每 250 生命获得 1% 法术伤害，每 400 生命获得 1% 召唤伤害',
  'Gain 1 All Skills for every 1000 Attributes': '每 1000 点属性获得 +1 所有技能',
  'Gain 1 Elemental and Magic Absorb for every 100 Attributes': '每 100 点属性获得 1 点元素与魔法吸收',
  'Gain 1 Defense for every 2 Attributes': '每 2 点属性获得 1 防御',
  'Gain 2 Maximum Fire, Cold and Lightning Damage to Attacks for every 1% Elemental Resist':
    '每 1% 元素抗性使攻击获得 2 点最大火焰、冰冷和闪电伤害',
  'Gain 1% Physical and Magic Resist for every 30% Elemental Resist': '每 30% 元素抗性获得 1% 物理与魔法抗性',
  'Gain 1% Poison Resist for every 5% Elemental Resist': '每 5% 元素抗性获得 1% 毒素抗性',
  'Gain 1% Poison and Magic Spell Damage for every 40 Energy': '每 40 点精力获得 1% 毒素与魔法法术伤害',
  'Second cycle (Green): 1% Bonus to Attack Rating for every 3 Dexterity': '第二循环（绿色）：每 3 点敏捷获得 1% 攻击准确率加成',
  'Adds 3-4 Fire, 2-5 Cold, 1-7 Lightning Damage to Attacks': '攻击附加 3-4 火焰、2-5 冰冷、1-7 闪电伤害',
  'per 4 Dexterity': '每 4 点敏捷',
  'Adds 2000-3000 cold damage over 40 seconds': '增加 2000-3000 冰冷伤害，持续 40 秒',
  '+50% chance for finishing moves to not consume charges (SP only)': '+50% 几率使终结技不消耗充能（仅单人）',
  'Gain 1% Lightning Spell Damage per 100 Strength when': '每 100 点力量获得 1% 闪电法术伤害，当',
  'Taking Damage for 5 Seconds': '受到伤害时，持续 5 秒',
  'If you have at least 1000 Vitality, your Raised Skeletons': '如果你至少有 1000 点体力，你的复生骷髅',
  'and your Summoned Skeleton King can use Empowered Poison Weapon': '和召唤的骷髅王可以使用强化毒素武器',
  'Empowered Poison Weapon is a more powerful version of the regular Poison Weapon.': '强化毒素武器是普通毒素武器的强化版本。',
  'Undead Frenzy has 0 Cooldown and Reap Souls provides': '亡灵狂乱没有冷却时间，并且收割灵魂提供',
  '15% additional Physical Damage and 5% Summon Damage per Level': '每级额外 15% 物理伤害和 5% 召唤伤害',
  'With at least 1000% Fire, Cold and Lightning Resistances combined': '当火焰、冰冷和闪电抗性合计至少 1000% 时',
  'this weapon can summon up to five times more Hydras': '此武器最多可以召唤五倍数量的九头海蛇',
  'Pyre, Frost, Plague Javelin and Lightning Fury fire one additional main javelin when below 33% Life':
    '生命低于 33% 时，火葬、霜冻、瘟疫标枪和闪电之怒额外发射一支主标枪',
  'Each stack of Blood Empowerment grants 10 Maximum Damage, 2% Attack Speed and 2% Life Steal at the cost of 10 Life per second per stack. Lasts 3 seconds':
    '每层血之强化提供 10 最大伤害、2% 攻击速度和 2% 生命偷取，每层每秒消耗 10 生命，持续 3 秒',
  'Cannot Be Frozen (50% chance to spawn)': '无法冰冻（50% 几率出现）',
  "The effect doesn't stack if you dual wield this weapon.": '双持此武器时，此效果不会叠加。',
  "The special effect doesn't stack if you dual wield this weapon.": '双持此武器时，此特殊效果不会叠加。',
  'Mythical Chaos Lightning is a special Chain Lightning that deals 150% Weapon Damage as Lightning Damage and splits into 2 other bolts on striking. Each bolt chains up to 3 times.':
    '神话混沌闪电是一种特殊的连锁闪电，造成相当于 150% 武器伤害的闪电伤害，击中时分裂为另外 2 道电弧。每道电弧最多连锁 3 次。',
  'The lightning damage granted by strength is affected by lightning Spell Damage, but not properly displayed on the advanced character stat screen.':
    '力量提供的闪电伤害受闪电法术伤害影响，但不会在高级角色属性面板上正确显示。',
  'The elemental damage granted by dexterity is affected by fire/cold/lightning Spell Damage, but not properly displayed on the advanced character stat screen.':
    '敏捷提供的元素伤害受火焰、冰冷和闪电法术伤害影响，但不会在高级角色属性面板上正确显示。',
  'The elemental damage granted by the physical damage is affected by fire/cold/lightning Spell Damage, but not properly displayed on the advanced character stat screen.':
    '物理伤害提供的元素伤害受火焰、冰冷和闪电法术伤害影响，但不会在高级角色属性面板上正确显示。',
  "*Monkey King's Wrath is a special attack that rains a shower of rocks in a straight line, each rock dealing 150% weapon damage in a small area of effect.":
    '*美猴王之怒是一种特殊攻击，会沿直线降下岩石雨，每块岩石在小范围内造成 150% 武器伤害。',
  'Blizzard Cannon is a special attack that launches a fast missile which deals 150% weapon damage as Cold Damage and can hit for multiple times. Enemies hit have their cold resistance reduced by 50% and the effect works at 100% efficiency against cold immune enemies.':
    '暴风雪炮是一种特殊攻击，会发射高速飞弹，造成相当于 150% 武器伤害的冰冷伤害，并可多次命中。被命中的敌人冰冷抗性降低 50%，该效果对冰冷免疫敌人以 100% 效率生效。',
  'Blades of Ice Discharge is a proc that simulates a 3 charge discharge of Blades of Ice.':
    '寒冰刃释放是一个触发效果，模拟 3 层充能的寒冰刃释放。',
  'All other summons include non necromancer summons as well.': '其他召唤物也包括非死灵法师召唤物。',
  'Summon damage matters only at the time of summoning, so you need to resummon your skeleton kings while reap souls is active for the summon damage bonus to take effect.':
    '召唤伤害只在召唤时结算，因此需要在收割灵魂生效期间重新召唤骷髅王，召唤伤害加成才会生效。',
  "Triumvirate Orb is a slow moving orb that fires tri elemental beams towards nearby enemies. Corruptions from other items also count toward the Triumvirate Orb's damage.":
    '三重执政法球是一颗缓慢移动的法球，会向附近敌人发射三元素光束。其他物品上的腐化也会计入三重执政法球的伤害。',
  'This item was designed by TiltedPrimate over the ESR Discord as a winner of the Mythical Unique Contest.':
    '此物品由 ESR Discord 上的 TiltedPrimate 设计，是神话暗金设计竞赛的获胜作品。',
  'Star rupture cannot deal damage directly. You need to aim it slightly away from the enemy.':
    '星裂无法直接造成伤害。你需要稍微瞄准敌人旁边的位置。',
  'This bow is inspired by the Orion gun from the Borderlands 2 fight for your life lands mod, which in turn was inspired by the Borderlands 1 gun with the same name.':
    '这把弓的灵感来自无主之地 2 “为生存而战之地”模组中的奥利安枪，而它又源自无主之地 1 中的同名武器。',
  'Bloody Spear is a 125% Weapon Damage projectile that pierces by default.': '血矛是默认穿透的投射物，造成 125% 武器伤害。',
  "You have a small chance to summon Light's Fiery Beacons on the battlefield on hitting an enemy that grant 15% Total Physical Damage and 15% Maximum Life when you pick them up":
    '击中敌人时有小几率在战场上召唤光之烈焰信标，拾取后获得 15% 总物理伤害和 15% 最大生命。',
  'Every 5 attacks, you gain Resonance with a specific element, empowering the element and making Flameburst, Twister, or Frozen Blast fire three times more projectiles, respectively':
    '每 5 次攻击，你会与一种特定元素产生共鸣，强化该元素，并分别使烈焰爆发、龙卷风或冰冻冲击发射三倍投射物。',
  'Elemental spells now synergize across all elements': '元素法术现在会在所有元素之间互相加成',
  'Holy Bolt and Blessed Hammer triggered by this blade deal 20% Weapon Damage as Magic Damage and no flat magic damage. Fist of the Heavens deals 125% Weapon Damage as Magic Damage and its secondary bolts deal 20% Weapon Damage as Magic Damage':
    '此剑触发的神圣之箭和祝福之锤会造成相当于 20% 武器伤害的魔法伤害，不再造成固定魔法伤害。天堂之拳造成相当于 125% 武器伤害的魔法伤害，其副闪电造成相当于 20% 武器伤害的魔法伤害。',
  'Each Stack of Underworld Empowerment grants 5% Poison, Magic and Physical Skill Damage for 2 seconds':
    '每层冥界强化提供 5% 毒素、魔法和物理技能伤害，持续 2 秒',
  'Execute Discharge discharges a fully charged, current level Execute': '处决释放会释放一次满充能、当前等级的处决',
  'The additional physical damage inflicted by spectral main is a fixed, unmodifiable amount of bonus physical damage.':
    '幽魂主手造成的额外物理伤害是固定且不可修改的额外物理伤害。',
  'Mythical Decrepify is regular decrepify and amplify damage 2 in 1. It slows as much as regular decrepify and reduces physical resist as much as regular amplify damage (same level progression applies). It also reduces cold resist equivalent to the physical resist amount.':
    '神话衰老结合了普通衰老和伤害加深。它的减速幅度等同普通衰老，降低物理抗性的幅度等同普通伤害加深（等级成长相同）。它还会降低等同物理抗性数值的冰冷抗性。',
  'This shuriken is inspired by the unique elite shuriken of the same name from the diablo 2 immersion mod.':
    '这件手里剑的灵感来自暗黑破坏神 2 沉浸模组中同名的精英暗金手里剑。',
  'Each trophy effect lasts 20 seconds.': '每个战利品效果持续 20 秒。',
  'Both Spirit and Dire Wolves can use Pounce. Pounce is both a strong area of effect and single target attack that teleports the wolf on top of its target to strike it':
    '灵狼和狂狼都可以使用猛扑。猛扑既是强力范围攻击也是单体攻击，会将狼传送到目标身上进行打击。',
  'Direct damage spells mean spells that can be casted directly (e.g. Rain of Fire). The damage bonus is a total multiplier to all bonuses (effectively a double damage increase)':
    '直接伤害法术指可以直接施放的法术（例如火雨）。该伤害加成是作用于所有加成的总乘区（实际相当于伤害翻倍）。',
  'Corrupted items can include both equipped items and charms (unique or not)': '腐化物品可以包括已装备物品和护身符（无论是否暗金）。',
  "but the level is based off Teleport's level and each nova deals 3 times less damage":
    '但等级基于传送的等级，且每个新星造成的伤害降低为三分之一',
  "The triple damage effect applies to all damage dealt, from all sources. That includes attacks, spells, holy auras etc. The effect stacks multiplicativiely with critical strike and deadly strike, but additively with the crossbow bonus damage (as well as other similar effects, like sorceress' exclusive skills).":
    '三倍伤害效果适用于所有来源造成的全部伤害，包括攻击、法术、神圣灵气等。该效果与双倍打击和致命一击乘法叠加，但与弩的额外伤害（以及女巫专属技能等类似效果）加法叠加。',
  'The ring can come in one out of 7 variants. Each variant has some baseline stats (elemental damage, resist, spell damage) and some special stats (e.g. Maximum Life, Cooldown Reduction etc.). Wearing two different rings causes their modifiers to double in magnitude.':
    '此戒指会出现 7 种变体之一。每种变体都有一些基础属性（元素伤害、抗性、法术伤害）和特殊属性（例如最大生命、冷却缩减等）。佩戴两个不同戒指会使它们的词缀数值翻倍。',
  'Vessel of Souls is a special mythical unique that can consume organs to gain various bonuses.':
    '灵魂容器是一件特殊神话暗金，可以消耗器官获得各种加成。',
  'Check the Vessel of Souls page for a complete list of bonuses.': '完整加成列表请查看灵魂容器页面。',
  'Can be obtained on killing all eternal ancients in The Edge of Eternity and transmuting the dropped hourglass pieces':
    '击杀永恒边缘中的所有永恒先祖并合成掉落的沙漏碎片即可获得',
  'Can be obtained on killing The Lich King': '击杀巫妖王即可获得',
  'The amulet has 6 total variants, one for every element': '此项链共有 6 种变体，每种元素各一种',
  "Despite the effect showing up visually, it won't work unless you have 15 anointed items":
    '尽管视觉上会显示效果，但除非你拥有 15 件涂油物品，否则不会生效',
  'Eternal Winter is a powerful area of effect spell that deals very high cold damage over time, lowering the cold resistance of affected enemies by 50% at 100% efficiency against immune monsters and their movement speed and attack/cast speed by 150%/50%, respectively.':
    '永恒寒冬是强力范围法术，会造成极高的冰冷持续伤害，使受影响敌人的冰冷抗性降低 50%（对免疫怪物以 100% 效率生效），并分别使其移动速度和攻击/施法速度降低 150%/50%。',
  'Eternal Winter benefits from the Aegis of Corruption spell damage increase.': '永恒寒冬受腐化庇护提供的法术伤害提高影响。',
  'Can be obtained on killing Rathma.': '击杀拉斯玛即可获得。',
  "Can be upgraded by killing Rathma and Kor'nac, The Hollow Apostle within one minute of each other on /players 8 and transmuting the charm with itself. The charm gains +(10 to 20) to Raise Kor'nac, The Hollow Apostle.":
    '在 8 人难度下于一分钟内击杀拉斯玛和空洞使徒 Kor’nac，并将护身符合成本体即可升级。该护身符获得 +(10 to 20) 复生 Kor’nac，空洞使徒。',
  '*Each type of speed (block, cast, move, attack, recovery) is counted separately. E.g. +1% to All Speeds counts as +5% to ascendancy bonuses.':
    '*每种速度（格挡、施法、移动、攻击、打击恢复）会分别计算。例如 +1% 所有速度会按 +5% 计入升华加成。',
  '*Breakpoints are reached for total number of attributes (e.g. you gain +1 to All Skills if you have 250 of each attribute).':
    '*断点按总属性值计算（例如每项属性各有 250 点时，你会获得 +1 所有技能）。',
  '**Annihilation is a devastating 6 elemental nova (F/C/L/P/Phys/Magic), entire screen area of effect skill that deals 75% weapon damage converted to each respective element per nova as well as significant spell damage of each damage type which gets scaled by total attributes, knockbacks enemies and lowers all of their resistances by 25% for 2 seconds.':
    '**毁灭是毁灭性的六元素新星（火/冰/电/毒/物理/魔法），覆盖整个屏幕。每个新星造成 75% 武器伤害并转化为对应元素，同时造成大量对应伤害类型的法术伤害，该法术伤害随总属性成长，并击退敌人，使其所有抗性降低 25%，持续 2 秒。',
  '**Annihilation can proc only when you are below 30% current life.': '**毁灭只会在当前生命低于 30% 时触发。',
  '*Total Defense Bonus is multiplicative with your entire armor value.': '*总防御加成会与你的整体护甲值相乘。',
  '*Ravage is a small-to-medium area of effect skill that deals 150% weapon damage as physical to all enemies affected and lowers their physical resist by 30%.':
    '*蹂躏是小到中范围的区域技能，对所有受影响敌人造成 150% 武器伤害的物理伤害，并使其物理抗性降低 30%。',
  '*Blood Magic means you use life to cast spells now.': '*血魔法表示你现在使用生命来施放法术。',
  '*Reduces your current and your minimum crossbow reload time by 20% (bypasses the 1 second minimum reload time cap).':
    '*使你当前和最低弩重新装填时间降低 20%（绕过 1 秒最低装填时间上限）。',
  '*Life Pact is a toggleable skill that drains 25% of your maximum health every second and that grants 10% maximum health per level. Life Pact cannot kill you.':
    '*生命契约是一个可开关技能，每秒消耗你 25% 最大生命，并且每级提供 10% 最大生命。生命契约不会杀死你。',
  '*Scurry is a 1 second duration buff that grants 33% dodge, 2000 maximum stamina, 100% movement speed and regenerates 10% of maximum life over its duration.':
    '*疾走是持续 1 秒的增益，提供 33% 闪避、2000 最大耐力、100% 移动速度，并在持续期间恢复 10% 最大生命。',
  '*Every cycle lasts 5 attacks/spells. On 6th attack/spell, you gain second cycle bonuses. On 11th attack/spell, you gain third cycle bonuses. On 16th attack/spell, you gain first cycle bonuses. This repeats indefinitely.':
    '*每个循环持续 5 次攻击/法术。第 6 次攻击/法术获得第二循环加成，第 11 次获得第三循环加成，第 16 次获得第一循环加成。此过程无限重复。',
  "**Every cycle has a special overlay to let the player know which cycle he's currently in. The overlay color corresponds to the current stat bonus (red for strength, green for dexterity, blue for energy).":
    '**每个循环都有特殊覆盖效果，用来提示玩家当前处于哪个循环。覆盖效果颜色对应当前属性加成（红色为力量，绿色为敏捷，蓝色为精力）。',
  '*Each resist type counts separately towards bonus breakpoints. For example, you get 1% physical resist if you have 10% fire/cold/lightning resistance each.':
    '*每种抗性类型会分别计入加成断点。例如火焰/冰冷/闪电抗性各有 10% 时，你会获得 1% 物理抗性。',
  '**Spell Damage is fire/cold/lightning/poison/magic/physical Spell Damage and it increases flat damage to attacks.':
    '**法术伤害指火焰/冰冷/闪电/毒素/魔法/物理法术伤害，并且会提高攻击附加的固定伤害。',
  '***Fury of Creation is a medium area of effect triple elemental nova skill, each nova dealing 50% weapon damage converted to the respective element and reducing elemental resistances of enemies by 30%.':
    '***创造之怒是中范围的三元素新星技能，每个新星造成 50% 武器伤害并转化为对应元素，同时使敌人的元素抗性降低 30%。',
  '( Fire Variant)': '（火焰变体）',
  '( Cold Variant)': '（冰冷变体）',
  '( Lightning Variant)': '（闪电变体）',
  '(Disabled in LAN)': '（LAN 中禁用）',
  'Summoning Skills': '召唤技能',
  'Poison and Bone Skills': '毒素与白骨技能',
  'Javelin and Spear Skills': '标枪与长矛技能',
  'Mythical Unique Weapons': '神话暗金武器',
  'Mythical Unique Armor': '神话暗金护甲',
  'Mythical Unique Jewelry': '神话暗金首饰',
  'Dedicated Drops Mythical Uniques': '专属掉落神话暗金',
};

const manualSuffixTranslations = {
  'of the Aether': '之虚空',
  'of the Ancients': '之先祖',
  'of the Angel': '之天使',
  'of the Anti Mage': '之反法师',
  'of the Apprentice': '之学徒',
  'of the Arctic': '之极寒',
  'of the Bat': '之蝙蝠',
  'of the Bear': '之熊',
  'of the Beastmaster': '之兽王',
  'of the Catalyst': '之催化剂',
  'of the Centaur': '之半人马',
  'of the Cheetah': '之猎豹',
  'of the Cobra': '之眼镜蛇',
  'of the Collector': '之收藏家',
  'of the Combatant': '之战斗者',
  'of the Conflux': '之汇流',
  'of the Efreeti': '之火灵',
  'of the Elements': '之元素',
  'of the Elephant': '之巨象',
  'of the Elves': '之精灵',
  'of the Enigma': '之谜团',
  'of the Fox': '之狐狸',
  'of the Frost Wyrm': '之霜龙',
  'of the Gargantuan': '之巨人',
  'of the Genius': '之天才',
  'of the Giant': '之巨人',
  'of the Glacier': '之冰川',
  'of the Heavens': '之天堂',
  'of the Hero': '之英雄',
  'of the Ice Age': '之冰河时代',
  'of the Iceberg': '之冰山',
  'of the Icicle': '之冰柱',
  'of the Jackal': '之豺狼',
  'of the Lamprey': '之水蛭',
  'of the Leech': '之吸血',
  'of the Locust': '之蝗虫',
  'of the Lurker': '之潜伏者',
  'of the Magus': '之魔导师',
  'of the Mammoth': '之猛犸',
  'of the Manticore': '之蝎尾狮',
  'of the Master': '之大师',
  'of the Mind': '之心灵',
  'of the Mystic': '之秘法',
  'of the Ox': '之公牛',
  'of the Phoenix': '之凤凰',
  'of the Psyche': '之灵能',
  'of the Pyromancer': '之烈焰法师',
  'of the Rainbow': '之彩虹',
  'of the Rogue': '之游侠',
  'of the Saint': '之圣者',
  'of the Scorpion': '之蝎子',
  'of the Sentinel': '之哨兵',
  'of the Sky': '之天空',
  'of the Snowman': '之雪人',
  'of the Squid': '之乌贼',
  'of the Stars': '之星辰',
  'of the Stone Golem': '之石魔像',
  'of the Stormcaller': '之唤雷者',
  'of the Sun': '之太阳',
  'of the Tank': '之坦克',
  'of the Tarantula': '之狼蛛',
  'of the Tiger': '之虎',
  'of the Titan': '之泰坦',
  'of the Trickster': '之欺诈者',
  'of the Valiant': '之勇武',
  'of the Vampire': '之吸血鬼',
  'of the Warlock': '之术士',
  'of the Warrior': '之战士',
  'of the Werebear': '之熊人',
  'of the Wererat': '之鼠人',
  'of the Weretiger': '之虎人',
  'of the Werewolf': '之狼人',
  'of the Whale': '之鲸',
  'of the Wicked': '之邪恶',
  'of the Wizard': '之巫师',
  'of the Wolf': '之狼',
  'of the Wraith': '之幽魂',
  'of the Yeti': '之雪怪',
  'of the Zodiac': '之黄道',
};

const manualTemplateTranslations = [
  ['Adds %d-%d Cold Damage to Attacks over %d Seconds', '攻击附加 %d-%d 冰冷伤害，持续 %d 秒'],
  ['Adds %d Cold Damage to Attacks over %d Seconds', '攻击附加 %d 冰冷伤害，持续 %d 秒'],
  ['Adds %d-%d Fire Damage to Attacks over %d Seconds', '攻击附加 %d-%d 火焰伤害，持续 %d 秒'],
  ['Adds %d Fire Damage to Attacks over %d Seconds', '攻击附加 %d 火焰伤害，持续 %d 秒'],
  ['Adds %d-%d Lightning Damage to Attacks over %d Seconds', '攻击附加 %d-%d 闪电伤害，持续 %d 秒'],
  ['Adds %d Lightning Damage to Attacks over %d Seconds', '攻击附加 %d 闪电伤害，持续 %d 秒'],
  ['Adds %d-%d Magic Damage to Attacks over %d Seconds', '攻击附加 %d-%d 魔法伤害，持续 %d 秒'],
  ['Adds %d Magic Damage to Attacks over %d Seconds', '攻击附加 %d 魔法伤害，持续 %d 秒'],
  ['Adds %d-%d Poison Damage to Attacks over %d Seconds', '攻击附加 %d-%d 毒素伤害，持续 %d 秒'],
  ['Adds %d Poison Damage to Attacks over %d Seconds', '攻击附加 %d 毒素伤害，持续 %d 秒'],
  ['Adds %d Poison Damage to Attacks over %d', '攻击附加 %d 毒素伤害，持续 %d 秒'],
  ['Adds %d-%d Poison Damage to Attacks over %d', '攻击附加 %d-%d 毒素伤害，持续 %d 秒'],
  ['Adds %d-%d Fire Damage', '增加 %d-%d 火焰伤害'],
  ['Adds %d-%d Cold Damage', '增加 %d-%d 冰冷伤害'],
  ['Adds %d-%d Lightning Damage', '增加 %d-%d 闪电伤害'],
  ['Adds %d-%d Magic Damage', '增加 %d-%d 魔法伤害'],
  ['Adds %d-%d Poison Damage', '增加 %d-%d 毒素伤害'],
  ['Adds %d-%d Fire Damage to Attacks', '攻击附加 %d-%d 火焰伤害'],
  ['Adds %d-%d Cold Damage to Attacks', '攻击附加 %d-%d 冰冷伤害'],
  ['Adds %d-%d Lightning Damage to Attacks', '攻击附加 %d-%d 闪电伤害'],
  ['Adds %d-%d Magic Damage to Attacks', '攻击附加 %d-%d 魔法伤害'],
  ['Adds %d-%d Poison Damage to Attacks', '攻击附加 %d-%d 毒素伤害'],
  ['Adds %d-%d Physical Damage to Attacks', '攻击附加 %d-%d 物理伤害'],
  ['Adds %d-%d cold damage over %d seconds', '增加 %d-%d 冰冷伤害，持续 %d 秒'],
  ['%+d to Maximum Damage to Attacks (Based on Character Level)', '%+d 攻击最大伤害（基于角色等级）'],
  ['%+d to Minimum Damage to Attacks (Based on Character Level)', '%+d 攻击最小伤害（基于角色等级）'],
  ['%+d to Maximum Fire Damage to Attacks (Based on Character Level)', '%+d 攻击最大火焰伤害（基于角色等级）'],
  ['%+d to Maximum Lightning Damage to Attacks (Based on Character Level)', '%+d 攻击最大闪电伤害（基于角色等级）'],
  ['%+d to Maximum Cold Damage to Attacks (Based on Character Level)', '%+d 攻击最大冰冷伤害（基于角色等级）'],
  ['%+d to Maximum Poison Damage to Attacks (Based on Character Level)', '%+d 攻击最大毒素伤害（基于角色等级）'],
  ['%+d to Attack Rating (Based on Character Level)', '%+d 攻击准确率（基于角色等级）'],
  ['%+d to Strength (Based on Character Level)', '%+d 力量（基于角色等级）'],
  ['%+d to Dexterity (Based on Character Level)', '%+d 敏捷（基于角色等级）'],
  ['%+d to Vitality (Based on Character Level)', '%+d 体力（基于角色等级）'],
  ['%+d to Energy (Based on Character Level)', '%+d 精力（基于角色等级）'],
  ['%+d to Life (Based on Character Level)', '%+d 生命（基于角色等级）'],
  ['%+d to Mana (Based on Character Level)', '%+d 法力（基于角色等级）'],
  ['%+d Defense (Based on Character Level)', '%+d 防御（基于角色等级）'],
  ['%+d%% Enhanced Maximum Damage (Based on Character Level)', '%+d%% 增强最大伤害（基于角色等级）'],
  ['%+d%% Damage to Undead (Based on Character Level)', '%+d%% 对不死生物伤害（基于角色等级）'],
  ['%+d%% Damage to Demons (Based on Character Level)', '%+d%% 对恶魔伤害（基于角色等级）'],
  ['%+d to Attack Rating against Undead (Based on Character Level)', '%+d 对不死生物攻击准确率（基于角色等级）'],
  ['%+d to Attack Rating against Demons (Based on Character Level)', '%+d 对恶魔攻击准确率（基于角色等级）'],
  ['%+d%% Chance of Crushing Blow (Based on Character Level)', '%+d%% 压碎性打击几率（基于角色等级）'],
  ['%+d%% Deadly Strike (Based on Character Level)', '%+d%% 致命打击几率（基于角色等级）'],
  ['%+d%% Extra Gold from Monsters (Based on Character Level)', '%+d%% 怪物金币掉落（基于角色等级）'],
  ['%+d%% Better Chance of Getting Magic Items (Based on Character Level)', '%+d%% 更佳机会取得魔法装备（基于角色等级）'],
  ['%d%% Physical Resist', '%d%% 物理抗性'],
  ['%+d%% Physical Resist', '%+d%% 物理抗性'],
  ['%+d%% All Maximum Resistances', '%+d%% 所有最大抗性'],
  ['%+d%% to All Maximum Resistances', '%+d%% 所有最大抗性'],
  ['%+d%% Elemental Absorb', '%+d%% 元素吸收'],
  ['%+d%% Faster Crossbow Reload Time', '%+d%% 更快弩重新装填速度'],
  ['Spell Damage: %+d%%', '法术伤害: %+d%%'],
  ['%+d%% Fire Spell Damage', '%+d%% 火焰法术伤害'],
  ['%+d%% Cold Spell Damage', '%+d%% 冰冷法术伤害'],
  ['%+d%% Lightning Spell Damage', '%+d%% 闪电法术伤害'],
  ['%+d%% Poison Spell Damage', '%+d%% 毒素法术伤害'],
  ['%+d%% Magic Spell Damage', '%+d%% 魔法法术伤害'],
  ['%+d%% Physical Spell Damage', '%+d%% 物理法术伤害'],
  [
    '%d%% Fire Spell Damage and %d-%d Fire Damage to Attacks for every %d%% Fire Resistance you have',
    '获得 %d%% 火焰法术伤害，并使攻击附加 %d-%d 火焰伤害，每 %d%% 火焰抗性',
  ],
  ['%+d%% to Enemy Fire Resistance', '%+d%% 敌人火焰抗性'],
  ['%+d%% to Enemy Cold Resistance', '%+d%% 敌人冰冷抗性'],
  ['%+d%% to Enemy Lightning Resistance', '%+d%% 敌人闪电抗性'],
  ['%+d%% to Enemy Poison Resistance', '%+d%% 敌人毒素抗性'],
  ['%+d%% to Enemy Magic Resistance', '%+d%% 敌人魔法抗性'],
  ['%+d%% to Enemy Physical Resistance', '%+d%% 敌人物理抗性'],
  ['-%d%% to Enemy Fire Resistance', '-%d%% 敌人火焰抗性'],
  ['-%d%% to Enemy Cold Resistance', '-%d%% 敌人冰冷抗性'],
  ['-%d%% to Enemy Lightning Resistance', '-%d%% 敌人闪电抗性'],
  ['-%d%% to Enemy Poison Resistance', '-%d%% 敌人毒素抗性'],
  ['-%d%% to Enemy Magic Resistance', '-%d%% 敌人魔法抗性'],
  ['-%d%% to Enemy Physical Resistance', '-%d%% 敌人物理抗性'],
  ['Attacker Takes Damage of %d (Based on Character Level)', '攻击者受到 %d 点伤害（基于角色等级）'],
  ['Freezes target %+d', '冻结目标 %+d'],
  ['%+d Life on Striking', '击中时恢复 %+d 生命'],
  ['%+d Mana on Striking', '击中时恢复 %+d 法力'],
  ['%+d to Class Skill Levels', '%+d 职业技能等级'],
  ['%+d to Minimum Damage', '%+d 最小伤害'],
  ['%+d to Maximum Damage', '%+d 最大伤害'],
  ['%+d Bonus to Attack Rating', '%+d 攻击准确率加成'],
  ['Level %d %s Aura When Equipped', '装备时赋予等级 %d %s 灵气'],
  ['%d%% Chance to Cast Level %d %s on Attack', '%d%% 几率在攻击时施放等级 %d %s'],
  ['%d%% Chance to Cast Level %d %s* on Attack', '%d%% 几率在攻击时施放等级 %d %s*'],
  ['%d%% Chance to Cast Level %d %s on Melee Attack', '%d%% 几率在近战攻击时施放等级 %d %s'],
  ['%d%% Chance to Cast Level %d %s* on Melee Attack', '%d%% 几率在近战攻击时施放等级 %d %s*'],
  ['%d%% Chance to Cast Level %d %s on Melee Attack (LAN only)', '%d%% 几率在近战攻击时施放等级 %d %s（仅 LAN）'],
  ['%d%% Chance to Cast Level %d %s on Striking', '%d%% 几率在击中时施放等级 %d %s'],
  ['%d%% Chance to Cast Level %d %s* on Striking', '%d%% 几率在击中时施放等级 %d %s*'],
  ['%d%% Chance to Cast Level %d %s on Striking (LAN only)', '%d%% 几率在击中时施放等级 %d %s（仅 LAN）'],
  ['%d%% Chance to Cast Level %d %s when Struck', '%d%% 几率在被击中时施放等级 %d %s'],
  ['%d%% Chance to Cast Level %d %s* when Struck', '%d%% 几率在被击中时施放等级 %d %s*'],
  ['%d%% Chance to Cast Level %d %s when Struck (LAN only)', '%d%% 几率在被击中时施放等级 %d %s（仅 LAN）'],
  ['%d%% Chance to Cast Level %d %s when you Kill an Enemy', '%d%% 几率在击杀敌人时施放等级 %d %s'],
  ['%d%% Chance to Cast Level %d %s* when you Kill an Enemy', '%d%% 几率在击杀敌人时施放等级 %d %s*'],
  ['%d%% Chance to Cast Level %d %s when you Kill an Enemy (LAN only)', '%d%% 几率在击杀敌人时施放等级 %d %s（仅 LAN）'],
  ['%d%% Reanimate as: %s', '%d%% 复生为：%s'],
  ['Reanimate as: %s', '复生为：%s'],
  ['%+d To %s (All Classes)', '%+d %s（所有职业）'],
  ['%+d to %s (All Classes)', '%+d %s（所有职业）'],
  ['%+d To %s (%s Only)', '%+d %s（仅%s）'],
  ['%+d to %s (%s Only)', '%+d %s（仅%s）'],
  ['%+d To %s', '%+d %s'],
  ['%+d to %s', '%+d %s'],
];

function stripDiabloColorCodes(text) {
  return text.replace(/ÿc./g, '');
}

function normalizeText(text) {
  return stripDiabloColorCodes(text)
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[、，,]+$/u, '');
}

function normalizeLines(text) {
  return stripDiabloColorCodes(text)
    .replace(/\u00a0/g, ' ')
    .split(/\r?\n/u)
    .map((line) =>
      line
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/[、，,]+$/u, '')
    )
    .filter(Boolean);
}

function hasPlaceholder(text) {
  return PLACEHOLDER_REGEX.test(text);
}

function extractPlaceholderSequence(text) {
  return Array.from(text.matchAll(TEMPLATE_PLACEHOLDER_REGEX), (match) => {
    const token = match[0];
    return token.endsWith('s') ? '%s' : '%n';
  });
}

function countNumericPlaceholders(text) {
  return extractPlaceholderSequence(text).filter((placeholder) => placeholder === '%n').length;
}

function hasCompatiblePlaceholderSequence(source, target) {
  const sourceSequence = extractPlaceholderSequence(source);
  const targetSequence = extractPlaceholderSequence(target);
  return (
    sourceSequence.length === targetSequence.length && sourceSequence.every((placeholder, index) => placeholder === targetSequence[index])
  );
}

function setManualTemplateTranslation(templateTranslations, source, target) {
  if (!hasCompatiblePlaceholderSequence(source, target)) {
    throw new Error(`Manual translation template placeholder mismatch: ${source} => ${target}`);
  }

  templateTranslations.set(source, target);
}

function isShortSingleLine(text, maxLength) {
  return text.length > 0 && text.length <= maxLength && !text.includes('\n') && !text.includes('\r');
}

function chooseChineseText(entry) {
  const source = normalizeText(entry.enUS ?? '');
  const zhCN = normalizeText(entry.zhCN ?? '');
  const zhTW = normalizeText(entry.zhTW ?? '').replace(/魯恩/g, '符文');

  if (source.endsWith(' Rune') && (zhCN === source || zhCN.includes('Rune')) && zhTW && zhTW !== source) {
    return zhTW;
  }

  if (zhCN && zhCN !== source) {
    return zhCN;
  }

  if (zhTW && zhTW !== source) {
    return zhTW;
  }

  return '';
}

function shouldReplace(existing, incoming) {
  if (!existing) return true;
  const existingHasChinese = /[\u3400-\u9fff]/.test(existing);
  const incomingHasChinese = /[\u3400-\u9fff]/.test(incoming);
  if (!existingHasChinese && incomingHasChinese) return true;
  return incoming.length < existing.length && incomingHasChinese === existingHasChinese;
}

async function readJsonFile(fileName) {
  const filePath = join(STRINGS_DIR, fileName);
  const content = await readFile(filePath, 'utf8');
  return JSON.parse(content.replace(/^\uFEFF/, ''));
}

async function main() {
  const exactTranslations = { ...manualExactTranslations, ...manualSuffixTranslations };
  const templateTranslations = new Map();

  for (const [source, target] of manualTemplateTranslations) {
    setManualTemplateTranslation(templateTranslations, source, target);
  }

  for (const fileName of SOURCE_FILES) {
    const entries = await readJsonFile(fileName);
    for (const entry of entries) {
      addTranslationCandidate(exactTranslations, templateTranslations, normalizeText(entry.enUS ?? ''), chooseChineseText(entry));

      const targetRaw = chooseChineseTextRaw(entry);
      if (!targetRaw) continue;

      const sourceLines = normalizeLines(entry.enUS ?? '');
      const targetLines = normalizeLines(targetRaw);
      if (sourceLines.length !== targetLines.length) continue;

      for (let i = 0; i < sourceLines.length; i++) {
        addTranslationCandidate(exactTranslations, templateTranslations, sourceLines[i], targetLines[i]);
      }
    }
  }

  Object.assign(exactTranslations, manualExactTranslations, manualSuffixTranslations);
  for (const [source, target] of manualTemplateTranslations) {
    setManualTemplateTranslation(templateTranslations, source, target);
  }

  const sortedExactTranslations = Object.fromEntries(Object.entries(exactTranslations).sort(([a], [b]) => a.localeCompare(b)));
  const sortedTemplateTranslations = Array.from(templateTranslations.entries()).sort(
    ([a], [b]) => b.length - a.length || a.localeCompare(b)
  );

  const output = `// Generated by scripts/generate-zh-translations.js. Do not edit manually.\n\nexport const exactTranslations = ${JSON.stringify(sortedExactTranslations, null, 2)} as const;\n\nexport const templateTranslations = ${JSON.stringify(sortedTemplateTranslations, null, 2)} as const;\n`;

  await mkdir(dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, output, 'utf8');

  console.log(`Generated ${OUTPUT_FILE}`);
  console.log(`Exact translations: ${Object.keys(sortedExactTranslations).length.toString()}`);
  console.log(`Template translations: ${sortedTemplateTranslations.length.toString()}`);
}

function chooseChineseTextRaw(entry) {
  const source = normalizeText(entry.enUS ?? '');
  const zhCN = stripDiabloColorCodes(entry.zhCN ?? '').trim();
  const zhTW = stripDiabloColorCodes(entry.zhTW ?? '')
    .replace(/魯恩/g, '符文')
    .trim();

  if (source.endsWith(' Rune') && (normalizeText(zhCN) === source || zhCN.includes('Rune')) && zhTW && normalizeText(zhTW) !== source) {
    return zhTW;
  }

  if (zhCN && normalizeText(zhCN) !== source) {
    return zhCN;
  }

  if (zhTW && normalizeText(zhTW) !== source) {
    return zhTW;
  }

  return '';
}

function addTranslationCandidate(exactTranslations, templateTranslations, source, target) {
  if (!source || !target || source === target) return;

  const sourceHasPlaceholder = hasPlaceholder(source);
  const targetHasPlaceholder = hasPlaceholder(target);

  if (
    sourceHasPlaceholder &&
    targetHasPlaceholder &&
    isShortSingleLine(source, TEMPLATE_MAX_LENGTH) &&
    hasCompatiblePlaceholderSequence(source, target) &&
    countNumericPlaceholders(source) <= 1 &&
    !isOverBroadTemplate(source)
  ) {
    const existing = templateTranslations.get(source);
    if (shouldReplace(existing, target)) {
      templateTranslations.set(source, target);
    }
    return;
  }

  if (!sourceHasPlaceholder && !targetHasPlaceholder && isShortSingleLine(source, EXACT_MAX_LENGTH)) {
    const existing = exactTranslations[source];
    if (shouldReplace(existing, target)) {
      exactTranslations[source] = target;
    }
  }
}

function isOverBroadTemplate(source) {
  return /^%\+?[diu]\s+(?:to|To)\s+%s\s+%s$/u.test(source);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
