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
  Input: '投入物',
  'Possible Outcome(s)': '可能结果',
  Outcome: '结果',
  Output: '产物',
  'Output(s)': '产物',
  Name: '名称',
  Code: '代码',
  Dur: '耐久',
  FRW: '移动速度',
  Qlvl: '品质等级',
  General: '通用',
  'Min iLvl': '最低物品等级',
  'Max iLvl': '最高物品等级',
  Rarity: '稀有度',
  Group: '组别',
  Stats: '属性',
  'Item Type': '物品类型',
  Blank: '空白',
  'Excluding:': '排除:',
  'Mag Lvl': '魔法等级',
  'Req Lvl': '需求等级',
  'Req Str': '需求力量',
  'Req Dex': '需求敏捷',
  'Block%': '格挡率%',
  Soc: '孔数',
  Range: '范围',
  WSM: '武器速度',
  'Str/Dex Bonus': '力量/敏捷加成',
  'Gem Type': '宝石类型',
  Automod: '自动词缀',
  Staffmod: '职业技能词缀',
  Keys: '键值',
  Recipe: '公式',
  Recipes: '公式',
  Notes: '备注',
  'Gem Word': '宝石之语',
  Gems: '宝石',
  'Allowed Items': '允许物品',
  'Weapons / Gloves': '武器 / 手套',
  'Helms / Boots / Rings / Amulets / Charms': '头盔 / 靴子 / 戒指 / 项链 / 护身符',
  'Armor / Shields / Belts': '护甲 / 盾牌 / 腰带',
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
  'Staves And Rods': '法杖与权杖',
  'Thrown Weapon': '投掷武器',
  Item: '物品',
  Weapon: '武器',
  Ring: '戒指',
  Amulet: '项链',
  Quiver: '箭袋',
  'Amazon Item': '亚马逊物品',
  'Assassin Item': '刺客物品',
  'Barbarian Item': '野蛮人物品',
  'Druid Item': '德鲁伊物品',
  'Necromancer Item': '死灵法师物品',
  'Sorceress Item': '女巫物品',
  'Perfect Gem': '完美宝石',
  'Flawless Gem': '无瑕宝石',
  'Blemished Gem': '瑕疵宝石',
  'Medium Charm': '中型护身符',
  'Unique/Set/Crafted/Rare Weapon': '暗金/套装/手工/稀有武器',
  'Unique/Set/Crafted/Rare Armor': '暗金/套装/手工/稀有护甲',
  'Unique/Set/Crafted/Rare Shield': '暗金/套装/手工/稀有盾牌',
  'Unique/Set/Crafted/Rare Body Armor': '暗金/套装/手工/稀有身体护甲',
  'Unique/Set/Crafted/Rare Boots': '暗金/套装/手工/稀有靴子',
  'Unique/Set/Crafted/Rare Gloves': '暗金/套装/手工/稀有手套',
  'Unique/Set/Crafted/Rare Belt': '暗金/套装/手工/稀有腰带',
  'Unique/Set/Crafted/Rare Ring': '暗金/套装/手工/稀有戒指',
  'Unique/Set/Crafted/Rare Amulet': '暗金/套装/手工/稀有项链',
  'Unique/Set/Crafted/Rare Helm': '暗金/套装/手工/稀有头盔',
  'Unique/Set/Crafted/Rare Jewelry': '暗金/套装/手工/稀有首饰',
  'Unique/Set/Crafted/Rare Charm': '暗金/套装/手工/稀有护身符',
  'Unique/Rare Quiver': '暗金/稀有箭袋',
  'Unique Ring': '暗金戒指',
  'Unique Amulet': '暗金项链',
  'Set Weapons': '套装武器',
  'Unique Weapons': '暗金武器',
  'Rare Weapon': '稀有武器',
  'Rare Armor': '稀有护甲',
  'Rare Jewelry': '稀有首饰',
  'Rare Equippable Gear': '稀有可装备物品',
  'Rare Equipment': '稀有装备',
  'Unique Charm': '暗金护身符',
  'Small Charm': '小护身符',
  'Special Small Charm': '特殊小护身符',
  'Bow and Crossbow Skills': '弓和弩技能',
  'Javelin and Spear Skills': '标枪和长矛技能',
  'Poison and Bone Skills': '毒素和白骨技能',
  'Partial Set Bonus': '部分套装加成',
  'Full Set Bonus': '完整套装加成',
  'Random highest tier suffix': '随机最高阶后缀',
  'Random Highest Tier Suffix': '随机最高阶后缀',
  'Same item': '同一物品',
  Anima: '灵魂',
  'of Anima': '之灵魂',
  'Drow Adamantite Chain': '暗精灵精金链甲',
  'Assassin 1H Katana': '刺客单手武士刀',
  'decoy dagger': '诱饵匕首',
  'Missile Potion': '飞弹药剂',
  'Grim Scythe': '残酷镰刀',
  'Fuma Shuriken': '风魔手里剑',
  '*** Anointed **': '*** 已涂油 **',
  '*** Anointed ***': '*** 已涂油 ***',
  '***Anointed***': '***已涂油***',
  '***Upgraded***': '***已升级***',
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
  'Generic Items/Materials': '通用物品/材料',
  Special: '特殊',
  'Viper amulet': '蝮蛇项链',
  "Wirt's leg": '维特之脚',
  'Stamina Potion': '耐力药剂',
  'Stamina Potions': '耐力药剂',
  'Mana Potion': '法力药剂',
  'Mana Potions': '法力药剂',
  'Mana potions': '法力药剂',
  'Healing Potion': '治疗药剂',
  'Healing Potions': '治疗药剂',
  'Rejuvenation Potions': '复苏药水',
  Hearts: '心脏',
  Heart: '心脏',
  Souls: '灵魂',
  Soul: '灵魂',
  Organs: '器官',
  Organ: '器官',
  Flags: '旗帜',
  Flag: '旗帜',
  'Thawing Potion': '解冻药剂',
  'Portal to the Secret Cow Level': '通往秘密奶牛关的传送门',
  "Starter's Pack": '新手包',
  'Teleport Restrictions': '传送限制',
  'No Teleport across the walls': '不能隔墙传送',
  'Special Dungeons/Areas': '特殊地下城/区域',
  'Secret Cow Level': '秘密奶牛关',
  'The Secret Cow Level': '秘密奶牛关',
  'Open Field': '开阔地',
  'Kill Bonuses': '击杀加成',
  'Boss Bonuses': '首领加成',
  'Weapon Anointment Bonus': '武器涂油加成',
  Mercenaries: '佣兵',
  Hireling: '雇佣兵',
  Subtype: '子类型',
  Price: '价格',
  'Rogue Scout': '罗格斥候',
  'Eastern Sorcerer': '东方女巫',
  Comb: '战斗',
  Def: '防御',
  Off: '攻击',
  Normal: '普通',
  Nightmare: '噩梦',
  Hell: '地狱',
  "Ancients' Presence": '先祖显现',
  'Stag Bow Variant': '雄鹿弓变体',
  'Reflex Bow Variant': '反射弓变体',
  'Precision Bow Variant': '精准弓变体',
  'Maiden Spear Variant': '少女之矛变体',
  Completion: '完成',
  'Only works once': '仅生效一次',
  'Unique/Set/Crafted/Rare Equipment': '暗金/套装/手工/稀有装备',
  'Endgame Map': '终局地图',
  'Endgame Map of the Next Tier': '下一阶终局地图',
  'Random Endgame Map of the Same Tier': '随机同阶终局地图',
  '2 Endgame Maps of the Same Tier': '2 张同阶终局地图',
  'Random Perfect Gem': '随机完美宝石',
  'Key of Terror/Hate/Destruction': '恐惧/憎恨/毁灭钥匙',
  'Key of Destruction/Terror/Hate': '毁灭/恐惧/憎恨钥匙',
  'Key of Hate/Destruction/Terror': '憎恨/毁灭/恐惧钥匙',
  'Random Bonus (see Corruptions Page for all possible bonuses)': '随机加成（见腐化页面的全部可能加成）',
  'Random Bonus (see Anointment Page for all possible bonuses)': '随机加成（见涂油页面的全部可能加成）',
  '(*25% chance to brick item)': '（*25% 几率损坏物品）',
  'Deadly Strike': '致命一击',
  'Crushing Blow': '压碎性打击',
  'Spell Damage': '法术伤害',
  'Summon Damage': '召唤伤害',
  'Tinkering Points': '修缮点数',
  'Frozen Orb': '冰封球',
  'of the Colossus': '之巨像',
  "Mechanist's": '机械师之',
  "Acrobat's": '杂技师之',
  "Gymnast's": '体操师之',
  "Athlete's": '运动员之',
  Assamic: '刺客的',
  Accursed: '受诅咒的',
  Vodoun: '伏都的',
  "Warder's": '守卫者之',
  'of Craftsmanship': '之手艺',
  'of Warmth': '之温暖',
  'of Traveling': '之旅行',
  'of Atlus': '之阿特拉斯',
  'of Fast Repair': '之快速修复',
  'of the Kraken': '之海妖',
  'of Damage Amplification': '之伤害加深',
  'of Clay Golem Summoning': '之黏土魔像召唤',
  'Any Weapon with Durability': '任意有耐久的武器',
  'Randomize Stone': '随机化之石',
  'Legendary Consumables': '传奇消耗品',
  "Lucion's Fiery Relic": '卢西恩的炽炎遗物',
  'The Same Item': '同一物品',
  'Added Bonus': '新增加成',
  'Added Ethereality': '新增无形属性',
  'Removed Corruption Status': '移除腐化状态',
  'Fire/Cold/Lightning/Poison/Magic/Wind Surge': '火焰/冰冷/闪电/毒素/魔法/风暴涌动',
  'Fire/Cold/Lightning/Magic/Wind Brand': '火焰/冰冷/闪电/魔法/风暴印记',
  'Fire/Cold/Lightning/Magic/Non-Elemental Spike Nova': '火焰/冰冷/闪电/魔法/非元素尖刺新星',
  'Fire/Cold/Lightning Damage Aura': '火焰/冰冷/闪电伤害光环',
  'Fire/Cold/Lightning Pierce Aura': '火焰/冰冷/闪电穿透光环',
  'Super Nova': '超级新星',
  'Trophy of Skills': '技能奖杯',
  'Rest in Peace': '安息',
  'Poison Dagger': '毒匕首',
  'Killer Scythe': '杀手镰刀',
  'All Applied Bonuses': '全部已应用加成',
  'Blemished Amethist': '瑕疵紫宝石',
  'Blemished Saphire': '瑕疵蓝宝石',
  'Flawed Tourmaline': '裂纹电气石',
  'Tamoe Highland': '塔莫高地',
  'Rocky Waste': '碎石荒地',
  'Lost City': '遗失城市',
  'Great Marsh': '庞大湿地',
  'Kurast Bazzar': '库拉斯特商场',
  'Kurast Causeway': '库拉斯特堤道',
  'Frigid Highland': '冰冻高地',
  'Arreat Plateau': '亚瑞特高原',
  'Frozen Tundra': '冰冻苔原',
  "Ancients' Way": '远古之路',
  'Chaos Sanctuary': '混沌避难所',
  "Lucion's Whisper": '卢西恩的低语',
  'Lucion Whisper': '卢西恩的低语',
  'Cellar of Pain': '痛苦地窖',
  "Diablo's Hellhound": '迪亚布罗的地狱犬',
  'Chasm of Horror': '恐怖裂隙',
  'Ancient Fallen Angel': '远古堕天使',
  'Fallen Ancient Angel': '远古堕天使',
  Necropolis: '大墓地',
  'Terror in the Shadows': '暗影恐惧',
  'Infested Lair': '虫群巢穴',
  'Double Bosses': '双首领',
  'Chaos Rift': '混沌裂隙',
  'Avatar of the Night': '暗夜化身',
  'Labyrinth of Suffering': '苦痛迷宫',
  'Herald of Doom': '末日先驱',
  'Endless Abyss': '无尽深渊',
  'Glacial Behemoth': '冰川巨兽',
  'The Taskmaster': '工头',
  "Baal's Disfigured Harbinger of Destruction": '巴尔畸变的毁灭先驱',
  'Shrine of Destruction': '毁灭圣坛',
  'Arbiter of Souls': '灵魂仲裁者',
  'Reliquary of Souls': '灵魂圣匣',
  'Mephisto the Invincible': '无敌的墨菲斯托',
  'Diablo the Invincible': '无敌的迪亚布罗',
  'Baal the Invincible': '无敌的巴尔',
  'Eye of the Storm': '风暴之眼',
  'Eternal Ancient': '永恒远古',
  organs: '个器官',
  "Most, but not all, recipes that reroll the input don't work if the input has a Forging.":
    '多数会重置投入物的公式在投入物带有锻造时不会生效，但并非全部如此。',
  "If you find a recipe doesn't work, please check if the input has a Forging or not.": '如果某个公式无法生效，请检查投入物是否带有锻造。',
  'You can buy Stockers (Gem Can and other special storage items) at Gheed.': '你可以在基德处购买储存器（宝石罐和其他特殊储物道具）。',
  'Most Stockers can store up to 2 items of a kind at once.': '多数储存器一次最多可以存放同类物品 2 个。',
  'Enable transmute key in D2Launcher for a much faster transmuting experience': '在 D2Launcher 中启用合成快捷键可以显著加快合成操作。',
  'Torso means Body Armor. Armor means all kinds of armor.': 'Torso 表示身体护甲。Armor 表示所有类型的护甲。',
  'Weapon mastery can be achieved by transmuting a Weapon Mastery Token that can drop from Corrupted Zakarum and endgame map bosses (25% chance, not scaled by /players).':
    '武器精通可以通过合成武器精通代币获得；该代币可由腐化的扎卡鲁姆和终局地图首领掉落（25% 几率，不受 /players 缩放影响）。',
  'Weapon mastery can be removed, but the token is lost on removal.': '武器精通可以移除，但移除时会消耗代币。',
  'The Kill Ledger can also be used to capture the souls of endgame map bosses. Killing map bosses allows you to transmute the ledger for special bonuses.':
    '击杀账本也可以用于捕获终局地图首领的灵魂。击杀地图首领后，可以合成账本来获得特殊加成。',
  'The vessel spawns with 2000 souls and every recipe consumes a number of souls. There are four tier of stats, each tier has specific properties, as listed below.':
    '灵魂之器生成时带有 2000 个灵魂，每个公式都会消耗一定数量的灵魂。属性共有 4 个阶级，每个阶级都有如下特定属性。',
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
  'The Kill Ledger cannot be transfered between characters.': '击杀账本不能在角色之间转移。',
  'Needless to say, each bonus is attainable only once.': '不用说，每项加成都只能获得一次。',
  'Vessel of Souls cannot be corrupted while it has unconsumed souls.': '灵魂之器仍有未消耗的灵魂时不能被腐化。',
  'You need to complete each tier in order to be able to advance to the next tier (e.g. you cannot use tier 3 recipes unless you have completed the tier 1 and 2 first).':
    '你需要按顺序完成每个阶级，才能推进到下一阶级（例如，未先完成 1 阶和 2 阶前，不能使用 3 阶公式）。',
  'Every tier has a capacity of 5 recipes, except tier 4 (the last one), which is a bit more special.':
    '每个阶级可容纳 5 个公式，只有 4 阶（最后一阶）稍微特殊一些。',
  'You will be notified when each tier is exhausted with a special orange text on the item.':
    '每个阶级耗尽时，物品上会出现特殊橙色文字提示。',
  'Once you exhaust all tiers, you can transform the Vessel of Souls into 1 out of many possible mythical weapon bases.':
    '耗尽全部阶级后，你可以将灵魂之器转化为多种神话武器底材中的一种。',
  'Vessel of Souls is also the only equippable unique item in the game that can be anointed.':
    '灵魂之器也是游戏中唯一可以涂油的可装备暗金物品。',
  'WARNING: Vessel of Souls cannot be worn as an amulet, attempting to wear it as an amulet will set your life to 1.':
    '警告：灵魂之器不能作为项链佩戴，尝试将它当作项链佩戴会把你的生命设为 1。',
  'Note: You can apply any specific recipe a maximum of two times.': '注意：每个指定公式最多可以应用两次。',
  'Tier 4 is special compared to the other tiers. Recipes here have varying amount of soul cost.':
    '与其他阶级相比，4 阶较为特殊。这里的公式消耗灵魂数量各不相同。',
  'In addition to keeping track, the ledger can be imbued with various bonuses once you reach specific kill tresholds.':
    '除了记录击杀外，当你达到特定击杀门槛时，账本还可以注入各种加成。',
  "The bonuses aren't as important or game changing as the ascendancy ones, but they are generally easier to obtain and are mostly symbolic, meant to track your progress.":
    '这些加成不像升华加成那样重要或改变玩法，但通常更容易获得，主要用于象征性地记录你的进度。',
  "The kill bonuses need to be completed in order. Trying to transmute for all skills without all the previous bonuses won't work, for example.":
    '击杀加成需要按顺序完成。例如，如果没有取得之前的所有加成，尝试合成“所有技能”加成不会生效。',
  "The Kill Ledger is also essential for the skills' random effects to work, so you need to keep it in inventory at all times.":
    '击杀账本也是技能随机效果生效的必要条件，因此你需要始终把它放在物品栏中。',
  'You have 60 seconds to transmute your Kill Ledger after you kill the boss with the appropriate ingredients to get the bonus.':
    '击杀首领后，你有 60 秒时间用对应材料合成击杀账本以获得加成。',
};

const guideItemTypeCodeTranslations: Readonly<Record<string, string>> = {
  amul: '项链',
  armo: '护甲',
  belt: '腰带',
  boot: '靴子',
  circ: '头环',
  glov: '手套',
  helm: '头盔',
  h2h: '爪',
  head: '巫毒头颅',
  jave: '标枪',
  knif: '匕首',
  mana: '法力物品',
  mele: '近战武器',
  miss: '远程武器',
  ndgr: '死灵匕首',
  orb: '法球',
  amaz: '亚马逊物品',
  asnx: '刺客武器',
  bjav: '野蛮人标枪',
  bow: '弓',
  club: '木棒',
  dclb: '德鲁伊木棒',
  necr: '死灵物品',
  pala: '圣骑士物品',
  pelt: '德鲁伊毛皮',
  phlm: '野蛮人头盔',
  pole: '长柄武器',
  robe: '法袍',
  rod: '法杖与权杖',
  spea: '长矛',
  ring: '戒指',
  scep: '权杖',
  scrn: '死灵盾',
  shld: '盾牌',
  sorc: '女巫物品',
  staf: '法杖',
  taxe: '投掷斧',
  tkni: '投掷刀',
  tors: '身体护甲',
  wand: '魔杖',
  weap: '武器',
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
    .replace(/\+-/gu, '-')
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

function normalizeGuideNumericValue(value: string): string {
  return value.replace(/^\+\+/u, '+');
}

function normalizeGuideSkillName(skillName: string): string {
  return skillName.replace(/\b(\w+\s+Surge)\s+Surge\b/giu, '$1');
}

function translateGuideItemTypeCode(code: string): string | null {
  const normalizedCode = code.toLowerCase();
  const label = guideItemTypeCodeTranslations[normalizedCode];
  if (!label) return null;
  return `${label}(${normalizedCode})`;
}

function translateGuideItemTypeCodeList(normalized: string): string | null {
  const parts = normalized.split(/\s*,\s*/u);
  if (parts.length < 2) return null;
  const translatedParts = parts.map((part) => translateGuideItemTypeCode(part));
  if (translatedParts.some((part) => part === null)) return null;
  return translatedParts.join('、');
}

function isFullyTranslatedGuideText(text: string): boolean {
  const allowedEnglish = text
    .replace(/\b[A-Z][a-zA-Z' -]* Rune\b/gu, '')
    .replace(/\([a-z0-9]{2,4}\)/giu, '')
    .replace(/\b(?:D2R|ESR|LoD|Oskill|Oskills|SP|LAN|HP|MP|WSM|FRW|MF|AoE|DoT|PvP|DPS)\b/gu, '');
  return !/[A-Za-z]{3,}/u.test(allowedEnglish);
}

function translateGuideListText(normalized: string): string | null {
  if (!normalized.includes(',')) return null;
  if (/[.!?]/u.test(normalized)) return null;

  const itemTypeCodeList = translateGuideItemTypeCodeList(normalized);
  if (itemTypeCodeList) return itemTypeCodeList;

  const parts = normalized.split(/\s*,\s*/u);
  if (parts.length < 2) return null;
  if (!parts.every((part) => /^[A-Za-z][A-Za-z' /-]*$/u.test(part))) return null;
  if (!parts.every((part) => part.length <= 48 && part.split(/\s+/u).length <= 4)) return null;

  const translatedParts = parts.map((part) => translateGuideCompositeText(part));
  if (translatedParts.every((part, index) => part === parts[index])) return null;
  return translatedParts.join('、');
}

function translateGuideSlashText(normalized: string): string | null {
  const slashCountsMatch = /^(.+?)\/(x\d+(?:\/x\d+)*)$/iu.exec(normalized);
  if (slashCountsMatch) {
    const translatedBase = translateGuideCompositeText(slashCountsMatch[1]);
    if (translatedBase !== slashCountsMatch[1]) return `${translatedBase}/${slashCountsMatch[2]}`;
  }

  if (normalized.includes('/') && !/[.!?]/u.test(normalized)) {
    const parts = normalized.split(/\//u);
    if (parts.length > 1 && parts.every((part) => part.trim().length > 0 && part.trim().length <= 40)) {
      const translatedParts = parts.map((part) => translateGuideCompositeText(part.trim()));
      if (translatedParts.some((part, index) => part !== parts[index].trim())) return translatedParts.join('/');
    }
  }

  if (!normalized.includes(' / ')) return null;

  const parts = normalized.split(/\s+\/\s+/u);
  if (parts.length < 2) return null;
  if (!parts.every((part) => /^[A-Za-z][A-Za-z' -]*$/u.test(part))) return null;

  const translatedParts = parts.map((part) => translateGuideDirectText(part));
  if (translatedParts.every((part, index) => part === parts[index])) return null;
  return translatedParts.join(' / ');
}

function translateGuideSpecialFormat(normalized: string): string | null {
  const footnoteMatch = /^(.+?)(\*+)$/u.exec(normalized);
  if (footnoteMatch) {
    const translatedBase = translateGuideCompositeText(footnoteMatch[1]);
    if (translatedBase !== footnoteMatch[1]) return `${translatedBase}${footnoteMatch[2]}`;
  }

  const gambleMatch = /^Gamble Item:\s*(.+)$/u.exec(normalized);
  if (gambleMatch) return `赌博物品: ${translateGuideCompositeText(gambleMatch[1])}`;

  const defeatedBossMatch = /^(.+?)\s+just killed$/iu.exec(normalized);
  if (defeatedBossMatch) {
    const translatedBoss = translateGuideCompositeText(defeatedBossMatch[1]);
    if (translatedBoss !== defeatedBossMatch[1]) return `${translatedBoss}刚被击杀`;
  }

  const titleLocationMatch = /^(.+?)\s+-\s+(.+)$/u.exec(normalized);
  if (titleLocationMatch) {
    const translatedTitle = translateGuideCompositeText(titleLocationMatch[1]);
    const translatedLocation = translateGuideCompositeText(titleLocationMatch[2]);
    if (translatedTitle !== titleLocationMatch[1] || translatedLocation !== titleLocationMatch[2]) {
      return `${translatedTitle} - ${translatedLocation}`;
    }
  }

  const seePageMatch = /^(.+?)\s+\(see\s+(.+?)\s+Page\)$/iu.exec(normalized);
  if (seePageMatch) return `${translateGuideCompositeText(seePageMatch[1])}（见${translateGuideCompositeText(seePageMatch[2])}页面）`;

  const codeNameMatch = /^(.+?)\s+\(([a-z0-9]{2,4})\)$/iu.exec(normalized);
  if (codeNameMatch) {
    const translatedName = translateGuideCompositeText(codeNameMatch[1]);
    if (translatedName !== codeNameMatch[1]) return `${translatedName} (${codeNameMatch[2]})`;
  }

  const keyMatch = /^([a-z0-9]+)\s*=\s*(.+)$/iu.exec(normalized);
  if (keyMatch) return `${keyMatch[1]} = ${translateGuideCompositeText(keyMatch[2])}`;

  const lvlReqMatch = /^Lvl\s+(\d+)\s*\/\s*Req Lvl\s+(\d+)$/iu.exec(normalized);
  if (lvlReqMatch) return `等级 ${lvlReqMatch[1]} / 需求等级 ${lvlReqMatch[2]}`;

  const levelRangeMatch = /^Level\s+(\d+)\s+and\s+Level\s+(\d+)$/iu.exec(normalized);
  if (levelRangeMatch) return `第 ${levelRangeMatch[1]} 层和第 ${levelRangeMatch[2]} 层`;

  const levelDashMatch = /^Level\s+(\d+)-(\d+)$/iu.exec(normalized);
  if (levelDashMatch) return `第 ${levelDashMatch[1]}-${levelDashMatch[2]} 层`;

  const tierMatch = /^Tier\s+(\d+)$/iu.exec(normalized);
  if (tierMatch) return `${tierMatch[1]} 阶`;

  const tierRecipeMatch = /^Each tier\s+(\d+)\s+recipe consumes\s+(\d+)\s+souls per use\.$/iu.exec(normalized);
  if (tierRecipeMatch) return `每次使用 ${tierRecipeMatch[1]} 阶公式会消耗 ${tierRecipeMatch[2]} 个灵魂。`;

  const itemsMatch = /^\((\d+)\s+items?\)$/iu.exec(normalized);
  if (itemsMatch) return `（${itemsMatch[1]} 件）`;

  const socketMatch = /^\((\d+)\s+Sockets?\)$/iu.exec(normalized);
  if (socketMatch) return `（${socketMatch[1]} 孔）`;

  const onlyParenthesizedMatch = /^\((Only works once)\)$/iu.exec(normalized);
  if (onlyParenthesizedMatch) return `（${translateGuideCompositeText(onlyParenthesizedMatch[1])}）`;

  const killCountMatch = /^\(At least\s+(\d+)\s+kills\)$/iu.exec(normalized);
  if (killCountMatch) return `（至少 ${killCountMatch[1]} 次击杀）`;

  const chanceSmallBonusMatch = /^\((\d+(?:\.\d+)?)%\s+chance to apply a small bonus\)$/iu.exec(normalized);
  if (chanceSmallBonusMatch) return `（${chanceSmallBonusMatch[1]}% 几率获得小型加成）`;

  const avgMatch = /^([+-]?\d+(?:\.\d+)?)\s+Avg$/iu.exec(normalized);
  if (avgMatch) return `${avgMatch[1]} 平均`;

  const repairMatch = /^Repairs\s+(\d+)\s+durability in\s+(\d+)\s+seconds$/iu.exec(normalized);
  if (repairMatch) return `每 ${repairMatch[2]} 秒恢复 ${repairMatch[1]} 点耐久`;

  const socketedFormulaMatch = /^Socketed\s+\(%i\)\s+\((.+)\)$/iu.exec(normalized);
  if (socketedFormulaMatch) return `镶孔 (%i) (${socketedFormulaMatch[1]})`;

  const levelChargesMatch = /^Level\s+(\d+)\s+(.+?)\s+\((\d+\/\d+)\s+Charges\)$/iu.exec(normalized);
  if (levelChargesMatch)
    return `等级 ${levelChargesMatch[1]} ${translateGuideCompositeText(levelChargesMatch[2])}（${levelChargesMatch[3]} 次）`;

  const locationMatch = /^Location:\s+Act\s+(\d+)\s+(.+)$/iu.exec(normalized);
  if (locationMatch) return `位置: 第 ${locationMatch[1]} 幕 ${translateGuideCompositeText(locationMatch[2])}`;

  const chanceCastMatch =
    /^([+-]?\d+%)\s+Chance to Cast Level\s+(\d+)\s+(.+?)\s+(on Striking|when Struck|when Taking Damage|when you Kill an Enemy|on Attack|on Melee Attack|When you Die)$/iu.exec(
      normalized
    );
  if (chanceCastMatch) {
    const triggerTranslations: Readonly<Record<string, string>> = {
      'on striking': '在击中时',
      'when struck': '在被击中时',
      'when taking damage': '在受到伤害时',
      'when you kill an enemy': '在击杀敌人时',
      'on attack': '在攻击时',
      'on melee attack': '在近战攻击时',
      'when you die': '在死亡时',
    };
    const trigger = triggerTranslations[chanceCastMatch[4].toLowerCase()] ?? chanceCastMatch[4];
    return `${chanceCastMatch[1]} 几率${trigger}施放等级 ${chanceCastMatch[2]} ${translateGuideCompositeText(
      normalizeGuideSkillName(chanceCastMatch[3])
    )}`;
  }

  const skillDamageMatch =
    /^([+-]?(?:\(\d+\s+to\s+\d+\)|\d+(?:\.\d+)?)%?)\s+to\s+(Physical|Lightning|Fire|Cold|Poison|Magic)\s+Skill Damage$/iu.exec(normalized);
  if (skillDamageMatch) return `${skillDamageMatch[1]} ${translateGuideCompositeText(skillDamageMatch[2])}技能伤害`;

  const castSpeedMatch = /^([+-]?(?:\(\d+\s+to\s+\d+\)|\d+(?:\.\d+)?)%?)\s+Increased Cast Speed$/iu.exec(normalized);
  if (castSpeedMatch) return `${castSpeedMatch[1]} 施法速度提高`;

  const allResistMatch = /^([+-]?(?:\(\d+\s+to\s+\d+\)|\d+(?:\.\d+)?)%?)\s+to\s+All Resistances$/iu.exec(normalized);
  if (allResistMatch) return `${allResistMatch[1]} 所有抗性`;

  const classSkillMatch = /^([+-]?(?:\(\d+\s+to\s+\d+\)|\d+(?:\.\d+)?))\s+to\s+(.+ Skills)\s+\((.+?)\s+Only\)$/iu.exec(normalized);
  if (classSkillMatch) {
    return `${classSkillMatch[1]} ${translateGuideCompositeText(classSkillMatch[2])}（仅${translateGuideCompositeText(classSkillMatch[3])}）`;
  }

  const genericToSkillMatch = /^(\+{1,2}\d+|[+-]?(?:\(\d+\s+to\s+\d+\)|\d+(?:\.\d+)?)(?:%)?)\s+To\s+(.+?)(?:\s+\((.+?)\s+Only\))?$/iu.exec(
    normalized
  );
  if (genericToSkillMatch) {
    const translatedSkill = translateGuideCompositeText(normalizeGuideSkillName(genericToSkillMatch[2]));
    const classSuffix = genericToSkillMatch[3] ? `（仅${translateGuideCompositeText(genericToSkillMatch[3])}）` : '';
    return `${normalizeGuideNumericValue(genericToSkillMatch[1])} ${translatedSkill}${classSuffix}`;
  }

  const trailingSignedBonusMatch = /^(.+?)\s+([+-]\d+)$/u.exec(normalized);
  if (trailingSignedBonusMatch) {
    const translatedBase = translateGuideCompositeText(trailingSignedBonusMatch[1]);
    if (translatedBase !== trailingSignedBonusMatch[1]) return `${translatedBase} ${trailingSignedBonusMatch[2]}`;
  }

  const betterMagicFindMatch = /^([+-]?\(?\d+(?:-\d+|\s+to\s+\d+)?\)?%)\s+Better Chance of Getting Magic Items?$/iu.exec(normalized);
  if (betterMagicFindMatch) return `${betterMagicFindMatch[1]} 魔法装备掉落率`;

  const strikeMatch = /^([+-]?\(?\d+(?:\s+to\s+\d+)?\)?%)\s+to\s+(Deadly Strike|Crushing Blow)$/iu.exec(normalized);
  if (strikeMatch) return `${strikeMatch[1]} ${translateGuideCompositeText(strikeMatch[2])}`;

  const manaAfterKillMatch = /^([+-]?\(?\d+(?:\s+to\s+\d+)?\)?)\s+Mana after each Kill$/iu.exec(normalized);
  if (manaAfterKillMatch) return `${manaAfterKillMatch[1]} 击杀后获得法力`;

  const genericPercentStatMatch = /^([+-]?\d+(?:\.\d+)?%)\s+(?:to\s+)?(Spell Damage|Summon Damage)$/iu.exec(normalized);
  if (genericPercentStatMatch) return `${genericPercentStatMatch[1]} ${translateGuideCompositeText(genericPercentStatMatch[2])}`;

  const tinkeringPointsMatch = /^([+-]?\(?\d+(?:\s+to\s+\d+)?\)?)\s+Tinkering Points$/iu.exec(normalized);
  if (tinkeringPointsMatch) return `${tinkeringPointsMatch[1]} ${translateGuideCompositeText('Tinkering Points')}`;

  const countItemMatch = /^(\d+|\d+-\d+|[+-]?\d+)\s+(.+)$/u.exec(normalized);
  if (countItemMatch) {
    const translatedItem = translateGuideCompositeText(countItemMatch[2]);
    if (translatedItem !== countItemMatch[2]) return `${countItemMatch[1]} ${translatedItem}`;
  }

  const timesItemMatch = /^(\d+)x\s+(.+)$/iu.exec(normalized);
  if (timesItemMatch) return `${timesItemMatch[1]}x ${translateGuideCompositeText(timesItemMatch[2])}`;

  const soulsMatch = /^([+-]?\d+)\s+Souls?$/iu.exec(normalized);
  if (soulsMatch) return `${soulsMatch[1]} 灵魂`;

  const subtypeDifficultyMatch = /^(Comb|Def|Off)\s+-\s+(Normal|Nightmare|Hell)$/iu.exec(normalized);
  if (subtypeDifficultyMatch) {
    return `${translateGuideCompositeText(subtypeDifficultyMatch[1])} - ${translateGuideCompositeText(subtypeDifficultyMatch[2])}`;
  }

  const leadingOrMatch = /^or\s+(.+)$/iu.exec(normalized);
  if (leadingOrMatch) return `或${translateGuideCompositeText(leadingOrMatch[1])}`;

  const orMatch = !/[.!?]/u.test(normalized) ? /^(.+?)\s+or\s+(.+)$/iu.exec(normalized) : null;
  if (orMatch) return `${translateGuideCompositeText(orMatch[1])}或${translateGuideCompositeText(orMatch[2])}`;

  const classWeaponMatch = /^(.+?)\s+Class Weapon$/iu.exec(normalized);
  if (classWeaponMatch) return `${translateGuideCompositeText(classWeaponMatch[1])}职业武器`;

  const anyMatch = /^Any\s+(.+?)(?:\s+x(\d+))?$/iu.exec(normalized);
  if (anyMatch) {
    const translatedItem = translateGuideCompositeText(anyMatch[1]);
    return `任意${translatedItem}${anyMatch[2] ? ` x${anyMatch[2]}` : ''}`;
  }

  const listText = translateGuideListText(normalized);
  if (listText) return listText;

  const slashText = translateGuideSlashText(normalized);
  if (slashText) return slashText;

  return null;
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

  const gameTranslated = translateGameText(normalized);
  if (gameTranslated !== normalized && isFullyTranslatedGuideText(gameTranslated)) return gameTranslated;

  const specialFormat = translateGuideSpecialFormat(normalized);
  if (specialFormat) return specialFormat;

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

  return applyGuidePhraseTranslations(normalized);
}

export function translateGuideText(text: string): string {
  const normalized = normalizeGuideTranslationKey(text);
  if (!normalized) return normalized;

  return translateGuideCompositeText(normalized);
}
