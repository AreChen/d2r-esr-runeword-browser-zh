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
  Items: '物品',
  Weapon: '武器',
  'Throwing Weapon': '投掷武器',
  'Throwing Weapons': '投掷武器',
  Ring: '戒指',
  Rings: '戒指',
  Amulet: '项链',
  Amulets: '项链',
  Charm: '护身符',
  Charms: '护身符',
  Quiver: '箭袋',
  Quivers: '箭袋',
  'Amazon Item': '亚马逊物品',
  'Amazon Only': '仅亚马逊',
  'Assassin Item': '刺客物品',
  'Assassin Only': '仅刺客',
  'Barbarian Item': '野蛮人物品',
  'Barbarian Only': '仅野蛮人',
  'Druid Item': '德鲁伊物品',
  'Druid Only': '仅德鲁伊',
  'Necromancer Item': '死灵法师物品',
  'Necromancer Only': '仅死灵法师',
  'Paladin Only': '仅圣骑士',
  'Sorceress Item': '女巫物品',
  'Sorceress Only': '仅女巫',
  'Perfect Gem': '完美宝石',
  Perfect: '完美',
  Gem: '宝石',
  'Flawless Gem': '无瑕宝石',
  Flawless: '无瑕',
  'Blemished Gem': '瑕疵宝石',
  Blemished: '瑕疵',
  'Chipped Gem': '碎裂宝石',
  Chipped: '碎裂',
  'Flawed Gem': '裂纹宝石',
  Flawed: '裂纹',
  'Normal Gem': '普通宝石',
  'Flawless Gems': '无瑕宝石',
  'Blemished Gems': '瑕疵宝石',
  Emeralds: '绿宝石',
  Rubies: '红宝石',
  Amethysts: '紫宝石',
  Topazes: '黄宝石',
  Skulls: '骷髅',
  Diamonds: '钻石',
  Sapphires: '蓝宝石',
  Obsidians: '黑曜石',
  'Flawless Rubies': '无瑕红宝石',
  'Flawless Sapphires': '无瑕蓝宝石',
  'Flawless Topazes': '无瑕黄宝石',
  'Flawless Emeralds': '无瑕绿宝石',
  'Flawless Diamonds': '无瑕钻石',
  'Flawless Obsidians': '无瑕黑曜石',
  'Flawless Skulls': '无瑕骷髅',
  'Flawless Amethysts': '无瑕紫宝石',
  'Perfect Gem (6 Pack)': '完美宝石（6 包）',
  'Chipped Crystal': '碎裂水晶',
  'Flawed Crystal': '裂纹水晶',
  'Normal Crystal': '普通水晶',
  'Crystal Point': '水晶点数',
  'Crystal points': '水晶点数',
  'Gem points': '宝石点数',
  Crystal: '水晶',
  Crystals: '水晶',
  Runes: '符文',
  Rune: '符文',
  Decal: '贴花',
  Decals: '贴花',
  'Rune/Decal': '符文/贴花',
  'Runes/Decals': '符文/贴花',
  'Rune/Decal Stocker': '符文/贴花储存器',
  'Kanji Runes': '汉字符文',
  'Ancient Coupon': '古代券',
  'Ancient Coupons': '古代券',
  'Same Ancient Coupons': '相同古代券',
  'Ancient Decipherer': '古代解读器',
  'Ancient Decipherers': '古代解读器',
  'normal coupon points': '普通券点数',
  'exceptional coupon points': '扩展券点数',
  'elite coupon points': '精英券点数',
  'normal coupon point': '普通券点数',
  'exceptional coupon point': '扩展券点数',
  'elite coupon point': '精英券点数',
  'Wildcard Point': '万能点数',
  'Wild Cards': '万能卡',
  'Wild Card': '万能卡',
  'Can Opener': '开罐器',
  'Burning Surphur': '燃烧硫磺',
  'Tainted Tourmarine': '污秽电气石',
  'Ancient Relics': '远古遗物',
  'Cubing Materials': '方块材料',
  Multistocker: '多用储存器',
  'Dragon Stones': '龙石',
  'Dragon Stone': '龙石',
  'Maple Leaf': '枫叶',
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
  Amazon: '亚马逊',
  Assassin: '刺客',
  Barbarian: '野蛮人',
  Druid: '德鲁伊',
  Necromancer: '死灵法师',
  Paladin: '圣骑士',
  Sorceress: '女巫',
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
  'Viper Amulet': '蝮蛇项链',
  "Wirt's leg": '维特之脚',
  'Stamina Potion': '耐力药剂',
  'Stamina Potions': '耐力药剂',
  'Mana Potion': '法力药剂',
  'Mana Potions': '法力药剂',
  'Mana potions': '法力药剂',
  'Minor Mana Potion': '轻微法力药剂',
  'Minor Mana Potions': '轻微法力药剂',
  'Healing Potion': '治疗药剂',
  'Healing Potions': '治疗药剂',
  'Minor Healing Potion': '轻微治疗药剂',
  'Minor Healing Poitons': '轻微治疗药剂',
  'Light Healing Potion': '轻型治疗药剂',
  'Rejuvenation Potions': '复苏药水',
  'Full Rejuvenation Potion': '完全复苏药水',
  'Antidote Potion': '解毒药剂',
  Hearts: '心脏',
  Heart: '心脏',
  Brains: '脑',
  Brain: '脑',
  Eyes: '眼',
  Eye: '眼',
  Scalps: '头皮',
  Scalp: '头皮',
  Horns: '角',
  Horn: '角',
  Fangs: '尖牙',
  Fang: '尖牙',
  Jawbones: '颚骨',
  Jawbone: '颚骨',
  Spleens: '脾脏',
  Spleen: '脾脏',
  Quills: '刺',
  Quill: '刺',
  Tails: '尾巴',
  Tail: '尾巴',
  Souls: '灵魂',
  Soul: '灵魂',
  Organs: '器官',
  Organ: '器官',
  Steaks: '肉排',
  Steak: '肉排',
  Cookbooks: '烹饪书',
  Cookbook: '烹饪书',
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
  'Forgotten Tower': '遗忘之塔',
  Catacomb: '地下墓穴',
  'Hall of the Dead': '亡者大厅',
  'Durance of Hate': '憎恨囚牢',
  "Blood Raven's Workshop": '血鸦工坊',
  "Dark Magician's Chamber": '黑暗魔术师密室',
  "Andariel's Dressing Room": '安达利尔更衣室',
  'Lost Farm': '失落农场',
  'Marsh of Pain': '痛苦沼泽',
  'Bookstore Sarina': '书店莎莉娜',
  "Harpie's Nest": '鹰身女妖巢穴',
  'Moonshine Distillery': '私酿酒厂',
  'Fake Note Factory': '假钞工厂',
  'Poppy Farm': '罂粟农场',
  Naraku: '奈落',
  'GFraizer Dome': '吉弗雷泽巨蛋',
  'Bill Roper Memorial Ballpark': '比尔·罗珀纪念球场',
  'Dead End': '死路',
  "Nihlathak's Domain": '尼拉塞克的领域',
  'Act 2': '第 2 幕',
  'Act 3': '第 3 幕',
  'Act 5': '第 5 幕',
  Anya: '安雅',
  'Far Oasis': '遥远绿洲',
  'Lut Gohlein': '鲁高因',
  'The Sewer': '下水道',
  'South Entrance': '南入口',
  'Maggot Lair': '蛆虫巢穴',
  'Temple Passage': '神殿通道',
  'Unholy Alter': '邪秽祭坛',
  'Way Point': '传送小站',
  'Claw Viper Temple': '利爪蝮蛇神殿',
  'Valley of Snakes': '群蛇峡谷',
  'Spider Forest': '蜘蛛森林',
  'Flayer Jungle': '剥皮丛林',
  'Ruined Fane': '残破神殿',
  'Gidbinn Village': '吉得宾村',
  'Upper Kurast': '库拉斯特上层',
  'Swampy Pit': '沼泽地洞',
  'Flayer Dungeon': '剥皮地窖',
  'Bloody Foothills': '血腥丘陵',
  'Frozen River': '冰河',
  Pindleskin: '暴躁外皮',
  'Arreat Summit': '亚瑞特山巅',
  'Ancient Barbarians': '远古野蛮人',
  'Worldstone Keep': '世界之石要塞',
  'Bill Roper': '比尔·罗珀',
  'Memorial Ball Park': '纪念球场',
  'Throne of Destruction': '毁灭王座',
  'Worldstone Chamber': '世界之石大殿',
  Nihlathak: '尼拉塞克',
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
  Exceptional: '扩展',
  Elite: '精英',
  Magic: '魔法',
  Rare: '稀有',
  Set: '套装',
  Unique: '暗金',
  Crafted: '手工',
  Ethereal: '无形',
  'Non-ethereal': '非无形',
  'Low Quality': '低质量',
  Cracked: '破损',
  Crude: '粗糙',
  Damaged: '损坏',
  Others: '其他',
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
  'Perfect Gems': '完美宝石',
  'Key of Terror/Hate/Destruction': '恐惧/憎恨/毁灭钥匙',
  'Key of Destruction/Terror/Hate': '毁灭/恐惧/憎恨钥匙',
  'Key of Hate/Destruction/Terror': '憎恨/毁灭/恐惧钥匙',
  'Random Bonus (see Corruptions Page for all possible bonuses)': '随机加成（见腐化页面的全部可能加成）',
  'Random Bonus (see Anointment Page for all possible bonuses)': '随机加成（见涂油页面的全部可能加成）',
  '(*25% chance to brick item)': '（*25% 几率损坏物品）',
  'Deadly Strike': '致命一击',
  'Crushing Blow': '压碎性打击',
  'Enhanced Defense': '增强防御',
  'Increased Attack Speed': '攻击速度提高',
  'Mana After Each Kill': '击杀后获得法力',
  Mana: '法力',
  Energy: '精力',
  'All Attributes': '所有属性',
  'All Resistances': '所有抗性',
  'Fire Resist': '火焰抗性',
  'Cold Resist': '冰冷抗性',
  'Lightning Resist': '闪电抗性',
  'Poison Resist': '毒素抗性',
  'Posion Resist': '毒素抗性',
  'Magic Resist': '魔法抗性',
  'Damage Reduced By': '伤害降低',
  'Physical Damage Leeched as Life': '物理伤害偷取生命',
  'Physical Damage Leeched as Mana': '物理伤害偷取法力',
  'Spell Damage': '法术伤害',
  'Summon Damage': '召唤伤害',
  'Bow & Crossbow': '弓和弩',
  'Bow and Crossbow': '弓和弩',
  'Spear & Javelin': '长矛和标枪',
  'Spear and Javelin': '长矛和标枪',
  'Martial Arts': '武学艺术',
  Traps: '陷阱',
  'Combat Skills': '战斗技能',
  Shapeshifting: '变形',
  'Elemental Skills': '元素技能',
  'Summoning Skills': '召唤技能',
  'Offensive Auras': '攻击性光环',
  'Fire Skills': '火焰技能',
  'Cold Skills': '冰冷技能',
  'Lightning Skills': '闪电技能',
  'Amazon Skill Levels': '亚马逊技能等级',
  'Assassin Skills': '刺客技能',
  'Druid Skills': '德鲁伊技能',
  'Necromancer Skills': '死灵法师技能',
  'Paladin Skills': '圣骑士技能',
  'Sorceress Skills': '女巫技能',
  'Tinkering Points': '修缮点数',
  Tinkering: '修缮',
  'Supercharged Tinkering': '超充能修缮',
  'D-Stoning': 'D-Stoning',
  'D-Stoning Weapon': 'D-Stoning 武器',
  'D-Stoning Runeworded Items': 'D-Stoning 符文之语物品',
  'D-Stoning Torso/Helm/Shield': 'D-Stoning 身体护甲/头盔/盾牌',
  'D-Stoning Gloves/Belt/Boots': 'D-Stoning 手套/腰带/靴子',
  'D-Stoning Ring/Amulet': 'D-Stoning 戒指/项链',
  'Gem Melding': '宝石融合',
  'Gem Melding Caps': '宝石融合上限',
  'Base Upgrades/Changes': '底材升级/变更',
  'Base Upgrade': '底材升级',
  'Socket Recipes': '镶孔公式',
  Former: '旧版',
  'Secret Recipes': '秘密公式',
  'Fail-Safe Features': '防故障机制',
  'Dragon Stone Cycling': '龙石循环',
  'Level Requirement': '等级需求',
  Requirement: '需求',
  'Level Req Penalty': '等级需求惩罚',
  'Max Damage': '最大伤害',
  'Enemy Elemental Poison Resistance': '敌人元素毒素抗性',
  'Poison Spell Damage': '毒素法术伤害',
  'Fire Spell Damage': '火焰法术伤害',
  'Physical Spell Damage': '物理法术伤害',
  'Lightning Spell Damage': '闪电法术伤害',
  'Cold Spell Damage': '冰冷法术伤害',
  'Physical Skill Damage': '物理技能伤害',
  'Fire/Cold/Lightning/Poison/Summoning/Magic/Physical Skill Damage': '火焰/冰冷/闪电/毒素/召唤/魔法/物理技能伤害',
  'Faster Block Rate': '格挡速度提高',
  'Increased Maximum Mana': '法力上限提高',
  'Cold Absorb': '冰冷吸收',
  'Fire Absorb': '火焰吸收',
  'Lightning Absorb': '闪电吸收',
  'Replenish Life': '生命恢复',
  'Bonus to Attack Rating': '攻击准确率加成',
  'Poison Length Reduced By': '毒素持续时间缩短',
  'Heal after Each Kill': '击杀后生命恢复',
  'Slow Target': '减慢目标',
  'Extra Gold': '额外金币',
  'Magic Damage Reduced by': '魔法伤害降低',
  'Piercing Attack': '穿透攻击',
  'Increase Max Life': '生命上限提高',
  'Increase Max Mana': '法力上限提高',
  'Experience Gained': '获得经验',
  'Slain Monsters Rest In Peace': '击杀怪物安息',
  Knockback: '击退',
  'Merc Only Conversion': '佣兵专用转换',
  'Merc Only Converison': '佣兵专用转换',
  'Merc Only': '佣兵专用',
  'Converted Item': '已转换物品',
  'Underlined Material(s)': '带下划线的材料',
  'Other Items': '其他物品',
  'Antidote Potions': '解毒药剂',
  'Damage Reduced by': '伤害降低',
  'Faster Run/Walk': '跑步/行走速度提高',
  'Cold Damage': '冰冷伤害',
  'Sec Duration': '秒持续时间',
  'Unique/Set Items': '暗金/套装物品',
  'Convertible Set Items': '可转换套装物品',
  'Special Upgrade Recipes': '特殊升级公式',
  'Mercenary Sets': '佣兵套装',
  'Cap Family': '帽子家族',
  'Skull Cap Family': '骷髅帽家族',
  'Helm Family': '头盔家族',
  'Full Helm Family': '高级头盔家族',
  'Great Helm Family': '巨盔家族',
  'Mask Family': '面具家族',
  'Crown Family': '皇冠家族',
  'Bone Helm Family': '骨盔家族',
  'Hachigane Family': '钵金家族',
  'Craft Weapon': '手工武器',
  'Craft Torso': '手工身体护甲',
  'Craft Helm': '手工头盔',
  'Craft Shield': '手工盾牌',
  'Craft Gloves': '手工手套',
  'Craft Belt': '手工腰带',
  'Craft Boots': '手工靴子',
  'Full Repaired item': '完全修复的物品',
  'Forging Mod': '锻造词缀',
  'Ancient Scroll': '古代卷轴',
  'Aura Stone': '光环石',
  'Blessed Aim': '祝福瞄准',
  Concentration: '专注',
  Defiance: '反抗',
  Vigor: '活力',
  Thorns: '荆棘',
  Conviction: '审判',
  Meditation: '冥想',
  'Blessed Aim Aura': '祝福瞄准光环',
  'Concentration Aura': '专注光环',
  'Defiance Aura': '反抗光环',
  'Vigor Aura': '活力光环',
  'Thorns Aura': '荆棘光环',
  'Conviction Aura': '审判光环',
  'Meditation Aura': '冥想光环',
  Superior: '超强',
  White: '白色',
  'Normal/Superior': '普通/超强',
  '2H Melee Weapons': '双手近战武器',
  'Other Weapons': '其他武器',
  Helms: '头盔',
  Shields: '盾牌',
  Belts: '腰带',
  'Any Other Weapon': '任意其他武器',
  Socketable: '镶嵌物',
  'Socketable(s)': '镶嵌物',
  'Empty Socket(s)': '空镶孔',
  'All Socketable(s)': '所有镶嵌物',
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
  "Nature's": '自然之',
  "Terra's": '大地之',
  "Gaea's": '盖亚之',
  "Shogukusha's": '修行者之',
  Ember: '余烬',
  Scorching: '灼热',
  Envenomed: '淬毒',
  Corosive: '腐蚀',
  Miocene: '中新世',
  Oligocene: '渐新世',
  Eocene: '始新世',
  Paleocene: '古新世',
  Shouting: '呐喊',
  Trump: '号角',
  Eburin: '象牙白',
  Vermillion: '朱红',
  Ambergris: '龙涎香',
  Aureolin: '金黄',
  'Grand Charms': '超大型护身符',
  'Large Charms': '大型护身符',
  'Small Charms': '小型护身符',
  Jewels: '珠宝',
  'Arrow/Bolt Quivers': '箭/弩矢袋',
  'Bolt Quivers': '弩矢袋',
  'of Substinence': '之存续',
  'of Cold Arrows': '之冰箭',
  'of Exploding Arrows': '之爆炸箭',
  'of Magic Arrows': '之魔法箭',
  'of Immolation Arrows': '之焚烧箭',
  'of Freezing Arrows': '之冰冻箭',
  'of Lightning Arrows': '之闪电箭',
  'Any Weapon with Durability': '任意有耐久的武器',
  'Randomize Stone': '随机化之石',
  'Legendary Consumables': '传奇消耗品',
  'Uber/Endgame Map Recipes': '超级/终局地图公式',
  'Fully Repaired': '完全修复',
  'Fully Recharged': '完全充能',
  'Any Crafted Item': '任意手工物品',
  'Unique Quiver': '暗金箭袋',
  'Normal Items': '普通物品',
  'Magic/Rare Items': '魔法/稀有物品',
  'Magic Jewel Point': '魔法珠宝点数',
  'Magic Jewel Points': '魔法珠宝点数',
  'Jewel Points': '珠宝点数',
  'Rare Quiver Points': '稀有箭袋点数',
  'Rerolling Orb': '重置之球',
  'Custom Reroll': '自定义重置',
  'Skill Tab Reroll': '技能页重置',
  Forging: '锻造',
  'Remove Forging': '移除锻造',
  'Forged Item': '已锻造物品',
  'Removes Forging': '移除锻造',
  'Skill Forging': '技能锻造',
  'Stat Forging': '属性锻造',
  'Rune Forging': '符文锻造',
  'Aura Forging': '光环锻造',
  'All Skill Forging': '所有技能锻造',
  'Target Item': '目标物品',
  'Target Item includes:': '目标物品包括:',
  'Underlined Material(s)*': '带下划线的材料*',
  'Anvil Stones': '铁砧石',
  'Any Rarity Equipment': '任意稀有度装备',
  'No Runewords': '非符文之语',
  'Passive & Magic': '被动和魔法',
  'Poison & Bone': '毒素与白骨',
  'Input Output': '投入物 产物',
  'Standard Reroll': '标准重置',
  Reroll: '重置',
  Conversion: '转换',
  'Base Conversion': '底材转换',
  'Set Conversion': '套装转换',
  'Set Base Conversion': '套装底材转换',
  'Unique Reroll': '暗金重置',
  'Set Reroll': '套装重置',
  'Mercenary Set Upgrade': '佣兵套装升级',
  "Starter's Weapon": '新手武器',
  'CtC Skill Armor': '触发施法护甲',
  Craft: '手工',
  'Hit Power': '强力打击',
  Blood: '鲜血',
  Caster: '施法',
  Safety: '安全',
  Class: '职业',
  Helm: '头盔',
  Boots: '靴子',
  Gloves: '手套',
  Belt: '腰带',
  Shield: '盾牌',
  Body: '身体护甲',
  'Random Affixes': '随机词缀',
  'Gem Socket': '宝石孔',
  'Same Type': '同类型',
  'Ancient Decipherer point': '古代解读器点数',
  'Ancient Decipherer points': '古代解读器点数',
  'Decipherer point': '解读器点数',
  'Decipherer points': '解读器点数',
  'Anvil Stone point': '铁砧石点数',
  'Anvil Stone points': '铁砧石点数',
  'Maple Leaf point': '枫叶点数',
  'Maple Leaf points': '枫叶点数',
  "Devil's Food point": '恶魔食粮点数',
  "Devil's Food points": '恶魔食粮点数',
  'Heart point': '心脏点数',
  'Heart points': '心脏点数',
  'Soul point': '灵魂点数',
  'Soul points': '灵魂点数',
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
  'Crystal Sword': '水晶剑',
  'Crystal Boots': '水晶靴',
  'Crystal Sword/Crystal Boots family excluded': '不包括水晶剑/水晶靴家族',
  'Autolycus Belt': '奥托吕科斯腰带',
  'Autolycus Belts': '奥托吕科斯腰带',
  'Arctic Belt': '北极腰带',
  "Kashya's Survival Kit": '卡夏的生存套装',
  "Kashya's Survival Kit N": '卡夏的生存套装 N',
  'Crook of the Valley': '山谷牧杖',
  'Petrified Staff': '石化法杖',
  'Arctic Horn': '北极之角',
  'Hunter Bow': '猎人的弓',
  'Battering Arm': '撞击臂',
  'Repeating Crosbow': '连射弩',
  'Repeating Crossbow': '连射弩',
  'Assassin Crosbow': '刺客弩',
  'Assassin Crossbow': '刺客弩',
  'The Staff of the Magius': '法师之杖',
  'Rune Staff': '符文法杖',
  'Normar Set Item': '普通套装物品',
  'Normal Set Item': '普通套装物品',
  'Legacy Craft': '旧版手工',
  'LoD Craft': 'LoD 手工',
  'Crafted item': '手工物品',
  'Crafted Item': '手工物品',
  'Crafted items': '手工物品',
  'Class Crafted items': '职业手工物品',
  'Gem Can': '宝石罐',
  'Tab Forging': '技能页锻造',
  'Magic Amulet pts': '魔法项链点数',
  'Magic Ring pts': '魔法戒指点数',
  'Magic Amulet point': '魔法项链点数',
  'Magic Ring point': '魔法戒指点数',
  'Gem Points': '宝石点数',
  'Same Runes': '相同符文',
  "Veteran's Odd Charm": '老兵的奇异护符',
  "Noob's Odd Charm": '新手的奇异护符',
  'Square Charm': '方形护身符',
  'Odd Charm': '奇异护符',
  'Grand/Odd Charm': '超大型/奇异护符',
  'Tyranium Ores': '钛金矿石',
  'Tyranium Ore': '钛金矿石',
  'Crushed Gems': '粉碎宝石',
  'Crushed Gem': '粉碎宝石',
  "Spider's Silks": '蛛丝',
  "Spider's Silk": '蛛丝',
  'Forging Hammers': '锻造锤',
  'Forging Hammer': '锻造锤',
  'Holy Symbols': '神圣符号',
  'Holy Symbol': '神圣符号',
  Blackmoors: '黑沼',
  Blackmoor: '黑沼',
  Elixirs: '秘药',
  Elixir: '秘药',
  "Devil's Foods": '恶魔食粮',
  "Devil's Food": '恶魔食粮',
  'Ore Shards': '矿石碎片',
  'Ore Shard': '矿石碎片',
  Ore: '矿石',
  'drop source': '掉落来源',
  'Socket Donut': '镶孔甜甜圈',
  'Legendary Components': '传奇组件',
  'for each boss': '每个首领',
  'uber variant': '超级变体',
  'Northern Descent': '北部下坡',
  'Southern Descent': '南部下坡',
  'excluding runewords': '不包括符文之语',
  'white/socketed items work': '白色/有孔物品可用',
  'the # of Gems': '宝石数量',
  'Max Socket is 3': '最大镶孔数为 3',
  'Gem type is Helm': '宝石类型为头盔',
  'Gem type is Weapon': '宝石类型为武器',
  'Runewords must be unsocketed first': '符文之语必须先移除镶嵌物',
  'Socketables must be unsocketed first': '镶嵌物必须先移除',
  'Ethereality and Superiority are lost': '无形和超强属性会丢失',
  'Please also see Secret Recipe 16 and 17': '也请参见秘密公式 16 和 17',
  'Can be mixed': '可以混合',
  'With no level requirement penalty': '没有等级需求惩罚',
  'May be Superior': '可能为超强',
  'lvl req 130': '需求等级 130',
  'no lvl req': '无等级需求',
  'Unique Amazon Amulet': '暗金亚马逊项链',
  'Unique Assassin Amulet': '暗金刺客项链',
  'Unique Barbarian Amulet': '暗金野蛮人项链',
  'Unique Druid Amulet': '暗金德鲁伊项链',
  'Unique Necromancer Amulet': '暗金死灵法师项链',
  'Unique Paladin Amulet': '暗金圣骑士项链',
  'Unique Sorceress Amulet': '暗金女巫项链',
  'The Cursed Doughnut': '被诅咒的甜甜圈',
  'Socketed quivers': '镶孔箭袋',
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
  Rathma: '拉斯玛',
  Lucion: '卢西恩',
  "Wrathamon's Omens": '拉萨蒙的预兆',
  "Wrathamon's Skull": '拉萨蒙的头骨',
  "Wrathamon's Scythe of Doom": '拉萨蒙的毁灭镰刀',
  "Wrathamon's Cloak of Night": '拉萨蒙的夜幕斗篷',
  "Hurja's Harmonic Rage": '胡尔加的和谐狂怒',
  organs: '个器官',
  "Most, but not all, recipes that reroll the input don't work if the input has a Forging.":
    '多数会重置投入物的公式在投入物带有锻造时不会生效，但并非全部如此。',
  "If you find a recipe doesn't work, please check if the input has a Forging or not.": '如果某个公式无法生效，请检查投入物是否带有锻造。',
  'You can buy Stockers (Gem Can and other special storage items) at Gheed.': '你可以在基德处购买储存器（宝石罐和其他特殊储物道具）。',
  'Most Stockers can store up to 2 items of a kind at once.': '多数储存器一次最多可以存放同类物品 2 个。',
  'Enable transmute key in D2Launcher for a much faster transmuting experience': '在 D2Launcher 中启用合成快捷键可以显著加快合成操作。',
  "*The feather works on ethereal items as well due to an engine bug, so be careful not to waste it. It doesn't work on missile weapons.":
    '*由于引擎缺陷，羽毛也会对无形物品生效，所以请小心不要浪费。它对投射武器无效。',
  'Torso means Body Armor. Armor means all kinds of armor.': 'Torso 表示身体护甲。Armor 表示所有类型的护甲。',
  "Base upgraded uniques can't be rerolled. Please reroll before upgrade.": '底材已升级的暗金物品不能重置。请在升级前重置。',
  'Items that had sockets added before reroll will lose their sockets upon rerolling.':
    '重置前额外添加过镶孔的物品，在重置时会失去这些镶孔。',
  'Level 92 unique jewels and quivers cannot be rerolled.': '92 级暗金珠宝和箭袋不能重置。',
  'You can convert unwanted one to the other.': '你可以把不需要的那个转换成另一个。',
  "Kashya's Survival Kit and Kashya's Survival Kit N are different sets, for example.":
    '例如，卡夏的生存套装和卡夏的生存套装 N 是不同套装。',
  'If you partially upgrade some of a full set, you lose the full set bonus.': '如果只升级完整套装中的一部分，会失去完整套装加成。',
  'Forging, D-Stoning and other ehnancements are inherited.': '锻造、D-Stoning 和其他强化会被继承。',
  'You need to convert the base item back to the original before rerolling.': '重置前需要先把底材转换回原本形态。',
  'All throwing weapons are given Replenishes Quantity.': '所有投掷武器都会获得回复数量。',
  'All normal throwing weapons are given Piercing Attack 10%.': '所有普通投掷武器都会获得 10% 穿透攻击。',
  'All exceptional throwing weapons are given Piercing Attack 15%.': '所有扩展投掷武器都会获得 15% 穿透攻击。',
  'Converts the base item': '转换底材',
  '(No socket is allowed)': '（不能有镶孔）',
  "(Aerin Shield -> Ring, can't be converted back)": '（艾琳盾牌 -> 戒指，无法转换回来）',
  'LoD crafting recipes have been drastically improved (and made more expensive as well). No limitation for the base item. Blood Glove recipe accepts all gloves, for example.':
    'LoD 手工公式已被大幅强化（成本也更高）。底材没有限制，例如鲜血手套公式接受所有手套。',
  'A junk Crafted item can be turned into 2 Flawless Gems by cubing with a Gem Can.':
    '不需要的手工物品可以和宝石罐一起合成，转为 2 个无瑕宝石。',
  'Class Crafted items can be used by any classes, unless the base item is class specific.':
    '职业手工物品可由任意职业使用，除非底材本身是职业专属。',
  'For example, if you play a Barbarian, but you need much IAS and Crushing Blow,':
    '例如，如果你玩野蛮人，但需要大量攻击速度和压碎性打击，',
  'you may like Necro Crafted weapons better than Barbarian Crafted Weapons.': '你可能会更喜欢死灵手工武器，而不是野蛮人手工武器。',
  'Stat Forging, Rune Forging and Tab Forging are allowed for Crafted items.': '手工物品允许属性锻造、符文锻造和技能页锻造。',
  'When you reroll multiple Amulets or Rings, the last one put in the Cube determines the type.':
    '同时重置多个项链或戒指时，最后放入方块的物品会决定类型。',
  "For example, if you put a Ring, an Amazon Ring and a Sorc Ring in this order, you'll get a new Sorc Ring.":
    '例如，如果按戒指、亚马逊戒指、女巫戒指的顺序放入，会得到新的女巫戒指。',
  'If the output ilvl is lower than the level of the spawned Unique, it turns into a rare.':
    '如果产物物品等级低于生成暗金所需等级，会变成稀有物品。',
  'To roll a non-class Unique Ring,': '要洗出非职业暗金戒指，',
  'your clvl must be higer than 15.': '你的角色等级必须高于 15。',
  'To roll a class specific Unique Ring,': '要洗出职业专属暗金戒指，',
  'your clvl must be higher than 57.': '你的角色等级必须高于 57。',
  'To roll a non-class Unique Amulet,': '要洗出非职业暗金项链，',
  'To roll a class specific Unique Amulet,': '要洗出职业专属暗金项链，',
  '(Optionally add dragon Stone form for class jewelry)': '（职业首饰可选择加入龙石形态）',
  '(You can use a Gem Can instead.': '（也可以改用宝石罐。',
  'The selected Gem Points are used)': '会消耗所选宝石点数）',
  'Rerolling Orb no longer accepts Crafted Rings and Amulets as a Magic Jewel Point,': '重置之球不再接受手工戒指和项链作为魔法珠宝点数，',
  'because a Magic Jewel Point is worth 1.5 Flawless Gems,': '因为 1 点魔法珠宝点数价值相当于 1.5 个无瑕宝石，',
  'and you can convert any Crafted item into 2 Flawless Gems using Gem Can.': '而任意手工物品都可以用宝石罐转换为 2 个无瑕宝石。',
  'Forging enhances an item for no penalty, but an item may have only one Forging mod at a time.':
    '锻造可以无惩罚强化物品，但每件物品同一时间只能有一个锻造词缀。',
  'You can remove any unwanted Forging (except Wo Forging) to apply another Forging.':
    '可以移除不需要的锻造（Wo 锻造除外），再应用其他锻造。',
  'Wo Forging can\'t be removed because there is no way to remove "Indestructible" property.':
    'Wo 锻造不能移除，因为没有办法移除“无法破坏”属性。',
  '* NOTE: Removing Aura Forging does NOT return the Aura Stone, it is destroyed upon unforging.':
    '* 注意：移除光环锻造不会返还光环石，解除锻造时它会被摧毁。',
  'NOTE: Removing Aura Forging does NOT return the Aura Stone, it is destroyed upon unforging.':
    '注意：移除光环锻造不会返还光环石，解除锻造时它会被摧毁。',
  'You can also use kanji runes.': '也可以使用汉字符文。',
  "You can't apply Aura Forging to Spellcaster's Aid or Mythical Highlord's Wrath because an item can't activate multiple auras.":
    '不能对施法者援助或神话大君之怒应用光环锻造，因为一件物品不能激活多个光环。',
  'This recipe is added to encourage players to use other items than Mercenary Sets. It stacks with Forgings.':
    '加入此公式是为了鼓励玩家使用佣兵套装以外的物品。它可以与锻造叠加。',
  'with no (merc only) property': '没有（佣兵专用）属性',
  'Adds (merc only) property': '增加（佣兵专用）属性',
  'Removes Merc Only Converison': '移除佣兵专用转换',
  'D-Stoning can also be applied to unforgeable items like Runeworded items.': 'D-Stoning 也可以应用到符文之语物品等不能锻造的物品上。',
  "D-Stoning can't be removed, so please apply it carefully. (Is the input correct? Is the cap ok?)":
    'D-Stoning 不能移除，请谨慎应用。（投入物正确吗？上限没问题吗？）',
  'D-Stoning applied to a white item after making a Runeword is lost when you remove the Runes.':
    '制成符文之语后再对该白色物品应用的 D-Stoning，会在移除符文时丢失。',
  'D-Stoning applied to a white item before making a Runeword remains when you remove the Runes.':
    '制成符文之语前已应用到白色物品上的 D-Stoning，会在移除符文后保留。',
  '(Please also see the caution of Secret Recipe 50.)': '（也请参见秘密公式 50 的注意事项。）',
  "D-Stoning doesn't work if the property on the target item has reached the cap.":
    '如果目标物品上的属性已经达到上限，D-Stoning 不会生效。',
  "(Please unsocket the socketables if the recipe doesn't calculate the cap correctly.": '（如果公式未正确计算上限，请先移除镶嵌物。',
  'Enhanced Damage on a weapon can go beyond the cap. Please watch it by yourself!)': '武器上的增强伤害可能超过上限。请自行留意！）',
  "D-Stoning doesn't work if the target is elite and has +58 level req penalty or more.":
    '如果目标是精英物品且等级需求惩罚达到 +58 或更高，D-Stoning 不会生效。',
  "D-Stoning doesn't work if the target is exceptional and has +79 level req penalty or more.":
    '如果目标是扩展物品且等级需求惩罚达到 +79 或更高，D-Stoning 不会生效。',
  "D-Stoning doesn't work if the target is normal or jewelry and has +99 level req penalty or more.":
    '如果目标是普通物品或首饰且等级需求惩罚达到 +99 或更高，D-Stoning 不会生效。',
  'Dragon Stones can be transmuted to obtain its different forms that can be used for crafting.':
    '龙石可以合成为不同形态，用于制作手工物品。',
  'See also Supercharged Tinkering.': '另见超充能修缮。',
  "You can't reroll Unique/Set Items after base upgrade.": '底材升级后不能重置暗金/套装物品。',
  "You can't convert Convertible Set Items after base upgrade.": '底材升级后不能转换可转换套装物品。',
  'Because Base Upgrade hardly increases the defense of Ethereal Armor due to the bug of LoD,':
    '由于 LoD 缺陷，底材升级几乎不会提高无形护甲的防御，',
  'Base Upgrade recipe no longer accepts Ethereal Armor to avoid spoiling the target item.':
    '为了避免毁坏目标物品，底材升级公式不再接受无形护甲。',
  'Use Special Upgrade Recipes for Mercenary Sets, which are cheaper and better.': '佣兵套装请使用特殊升级公式，成本更低且效果更好。',
  "The number of sockets can't exceed the max sockets of the base item.": '镶孔数量不能超过底材最大镶孔数。',
  "The items dropped in Normal and NM Act 1 can't have the max sockets in some cases.":
    '普通难度和噩梦第 1 幕掉落的物品在某些情况下无法拥有最大镶孔数。',
  "You can't change the number of existing sockets.": '不能更改已有镶孔数量。',
  '(*Unique Dagger. You can get ones by': '（*暗金匕首。可以通过',
  'gambling with a low level character)': '用低等级角色赌博获得）',
  '(*Ethereality and Superiority are lost.': '（*无形和超强属性会丢失。',
  'Please also see Secret Recipe 16 and 17)': '也请参见秘密公式 16 和 17）',
  '(*Max Socket is 3. Gem type is Helm.': '（*最大镶孔数为 3。宝石类型为头盔。',
  'Runewords must be unsocketed first)': '符文之语必须先移除镶嵌物）',
  'Resets the socket number and skill bonus': '重置镶孔数量和技能加成',
  '(Socketables must be unsocketed first)': '（必须先移除镶嵌物）',
  '(*Gem type is Weapon. Socketed quivers': '（*宝石类型为武器。镶孔箭袋',
  "don't show the quantity due to a bug of D2)": '由于 D2 缺陷不会显示数量）',
  '(This recipe automatically identifies the target.': '（此公式会自动鉴定目标物品。',
  "This isn't an intended behavior but can't be fixed)": '这不是预期行为，但无法修复）',
  'In original Eastern Sun There used to be 50 secret scrolls that needed to be found to use the following recipes. All the recipes now require an Ancient Decipherer instead of an Ancient Scroll as one of the input.':
    '原版东方之日中曾有 50 张秘密卷轴，需要找到后才能使用以下公式。现在所有这些公式都需要古代解读器作为投入物之一，而不是古代卷轴。',
  '50% Chance for a Flawed Crystal specific to the drop source (LAN)': '50% 几率获得与掉落来源对应的裂纹水晶（LAN）',
  '50% Chance for another Ore of the same type (SP)': '50% 几率获得另一个同类型矿石（SP）',
  '50% Chance for Ore Shards': '50% 几率获得矿石碎片',
  '*Ore Shards are only worth 5000 gold.': '*矿石碎片只值 5000 金币。',
  '(You can use a Rerolling Orb instead)': '（可以改用重置之球）',
  '(You can use a Rerolling Orb instead.': '（可以改用重置之球。',
  "25 Devil's Food points are used)": '会消耗 25 点恶魔食粮点数）',
  "Veteran's Odd Charm that can have up to 3 sockets": '最多可拥有 3 个镶孔的老兵的奇异护符',
  "You can carry only one of Noob's or Veteran's Odd Charm": '新手的奇异护符和老兵的奇异护符只能携带其中一个',
  'This recipe is meant to restore old charms to new ones without wasting more mats':
    '此公式用于把旧护身符恢复为新版护身符，避免浪费更多材料',
  CAUTION: '注意',
  'If you applied D-Stoning before making a Runeword, you need to remove the runes': '如果在制作符文之语前应用了 D-Stoning，需要先移除符文',
  "before removing the penalty added by such D-Stoning, or you'll lose the materials for nothing.":
    '再移除该 D-Stoning 增加的惩罚，否则会白白损失材料。',
  "If you applied D-Stoning after making a Runeword, you don't need to remove the runes.":
    '如果在制作符文之语后应用了 D-Stoning，则不需要移除符文。',
  'D-Stoning applied after making a Runeword is lost when you remove the runes.': '制作符文之语后应用的 D-Stoning 会在移除符文时丢失。',
  'The penalty added by that D-Stoning is also removed at that time.': '该 D-Stoning 增加的惩罚也会同时移除。',
  '*Spell Damage per D-Stoning': '*每次 D-Stoning 的法术伤害',
  'Summon Damage applies to all damage done by minions, including special attacks, skills, basic attack, spells etc.':
    '召唤伤害适用于召唤物造成的所有伤害，包括特殊攻击、技能、普通攻击和法术等。',
  'Gem melding can be applied up to 20 times on weapons and up to 10 times on other equipment.':
    '武器最多可应用 20 次宝石融合，其他装备最多可应用 10 次。',
  'Because cube recipe caps work based on specific stats due to engine limitations, gem melding':
    '由于引擎限制，方块公式上限会基于特定属性计算，因此宝石融合',
  'is capped based on a specific stat for every type of item, as shown in the table below.': '会按每类物品的特定属性设置上限，如下表所示。',
  'If the item already spawned with some value of the stat that is used to check the gem meld cap, then the value is also counted towards the cap.':
    '如果物品生成时已经带有用于检查宝石融合上限的属性数值，该数值也会计入上限。',
  'E.g., if a weapon spawns with 12% Physical Damage Leeched as Life, then you can only gem meld 8 skulls.':
    '例如，若武器生成时带有 12% 物理伤害偷取生命，则你只能融合 8 个骷髅。',
  "Adds Chipped Gem's Helm Bonus": '增加碎裂宝石的头盔加成',
  "Adds Chipped Gem's Weapon Bonus": '增加碎裂宝石的武器加成',
  "Adds Chipped Gem's Armor Bonus": '增加碎裂宝石的护甲加成',
  'All items are generated with 25-35 invisible Tinkering points as an inherit property.':
    '所有物品生成时都会自带 25-35 点不可见修缮点数，作为固有属性。',
  'Each Tinkering recipe consumes some Tinkering point(s).': '每个修缮公式都会消耗一定修缮点数。',
  'If an item cannot be tinkered anymore, it means the points have been depleted.': '如果物品无法继续修缮，表示点数已经耗尽。',
  'Weapon mastery can be achieved by transmuting a Weapon Mastery Token that can drop from Corrupted Zakarum and endgame map bosses (25% chance, not scaled by /players).':
    '武器精通可以通过合成武器精通代币获得；该代币可由腐化的扎卡鲁姆和终局地图首领掉落（25% 几率，不受玩家数缩放影响）。',
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
  'On LAN build, Worldstone Shards can drop from any champion or unique that has level 90+, regardless if they':
    '局域网版中，世界石碎片可由任意 90 级以上冠军怪或暗金怪掉落，无论它们',
  'are terrorized or not (although terrorized zones help with this since they add levels to the affected monsters).':
    '是否恐怖化（恐怖化区域会提高受影响怪物的等级，因此会有帮助）。',
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
  'For Unique Charms, anointments can be obtained through transmuting all Eye of the Storm boss body parts':
    '暗金护身符可以通过合成全部风暴之眼首领器官获得涂油',
  "(Diablo's Demonic Horn, Baal's Demonic Eye, Mephisto's Demonic Brain) with a Unique Charm for a one-time bonus.":
    '（迪亚布罗的恶魔之角、巴尔的恶魔之眼、墨菲斯托的恶魔大脑）与暗金护身符合成可获得一次性加成。',
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
  "From the abyssal depths of the Burning Hells, Lucion's Whisper emerges - a spectral harbinger of his master's will. A shadow wreathed in eldritch fire, he is neither fully demon nor shade, but a cursed echo of Lucion's own essence.":
    '卢西恩的低语自燃烧地狱的深渊中浮现，是其主人意志的幽魂先兆。它是缠绕诡异火焰的暗影，既非完整恶魔，也非纯粹幽魂，而是卢西恩本质中受诅咒的回响。',
  "Eternal Fires - Lucion's Whisper is capable of conjuring fires that last for 30 seconds and deal insane amount of fire damage.":
    '永恒之火 - 卢西恩的低语可以召唤持续 30 秒的火焰，造成极高火焰伤害。',
  "Weakening Curse - Lucion's Whisper has a chance to cast a curse on the ground. If you're caught within the area, you are petrified and your fire resistance is lowered by 150%.":
    '削弱诅咒 - 卢西恩的低语有几率在地面施放诅咒。若你处于区域内，会被石化并降低 150% 火焰抗性。',
  "Teleport - Lucion's Whisper has a chance to teleport away when hurt, making him unpredictable.":
    '传送 - 卢西恩的低语受伤时有几率传送离开，使其行动难以预测。',
  "From the blackened pits of the Burning Hells arises Diablo's personal hellhound. More than mere flesh and fang, it is a living nightmare, a manifestation of the Prime Evil's boundless wrath.":
    '迪亚布罗的私人地狱犬自燃烧地狱焦黑深坑中现身。它不只是血肉与利齿，而是活生生的梦魇，是至恶之王无尽愤怒的化身。',
  "Frenzy - Diablo's Hellhound enters a frenzied state and gains increased attack and movement speed with each attack.":
    '狂乱 - 迪亚布罗的地狱犬进入狂乱状态，每次攻击都会提高攻击速度和移动速度。',
  "Spell on Attack - Diablo's Hellhound has a chance to unlesh a deadly spell on attacking its prey. Possible spells include a regular Meteor, a devastating Frozen Orb whose ice bolts seek nearby players, a piercing Bone Spirit and a curse that slows the target and lowers their elemental resistances by 100% and magic resist by 50%.":
    '攻击触发法术 - 迪亚布罗的地狱犬在攻击猎物时有几率释放致命法术。可能的法术包括普通陨石、毁灭性的冰封球（冰弹会追踪附近玩家）、可穿透的骨灵，以及一个会减速目标、降低 100% 元素抗性和 50% 魔法抗性的诅咒。',
  'Once a radiant warrior of the High Heavens, this Ancient Fallen Angel now wanders the void, a forsaken relic of the celestial war. Time has stripped away its luster, its once-glistening armor tarnished with the soot of shattered realms. Where golden wings once carried it upon divine light, now tattered remnants hang in ruin, charred by the fires of damnation.':
    '这名远古堕天使曾是高阶天堂中光辉的战士，如今却游荡在虚空中，成为天界战争遗留下的被弃遗物。岁月剥去了它的光彩，曾经闪耀的铠甲被破碎诸界的烟灰玷污。昔日金色羽翼承载它乘神圣之光而行，如今只剩被诅咒火焰烧焦的残破羽片。',
  "Obliterate Nova - The Ancient Fallen Angel will occasionally cast a devastating nova that deals both physical and magic damage. The nova is slowly expanding and reverberates once upon hitting any surface, so it's highly encouraged to hide in another room while it happens.":
    '湮灭新星 - 远古堕天使会偶尔施放毁灭性新星，造成物理和魔法伤害。新星会缓慢扩张，碰到任何表面后还会回响一次，因此强烈建议在它出现时躲到其他房间。',
  'Ball Lightning Storm - The boss will occasionally cast a storm of lightning balls on attack or upon being hurt that explode into several charged bolts.':
    '球状闪电风暴 - 首领在攻击或受伤时会偶尔施放球状闪电风暴，闪电球会爆裂成多道充能弹。',
  'Enrage - The boss has a 10% chance on average to enrage upon behing hurt, gaining maximum attack speed for a short period.':
    '激怒 - 首领受伤时平均有 10% 几率进入激怒状态，在短时间内获得最大攻击速度。',
  'Deep beneath the earth, where the air grows thick with decay and unseen things scuttle beyond the veil of darkness, the an ancient horror that has woven its domain from fear itself lurks.':
    '在大地深处，空气因腐朽而沉重，黑暗帷幕之后有不可见之物窸窣爬行；一头以恐惧编织领地的远古恐魔潜伏其中。',
  'Leap Attack - The giant spider will occasionally jump on top of clueless victims, dealing damage in an area of effect.':
    '跳跃攻击 - 巨蛛会偶尔跳到毫无防备的受害者身上，造成范围伤害。',
  'Throw Spiderlings - The boss has a chance to throw a bunch of spiderlings that have a deadly poisonous attack along with the ability to leap attack on their own.':
    '投掷小蜘蛛 - 首领有几率投出一群小蜘蛛。它们拥有致命毒素攻击，也能自行跳跃攻击。',
  "Web Spit - The boss will lob a deadly poisonous ball of webs on an interval of 4 seconds. The poisonous ball lowers the affected target's movement speed and poison resistance by 150% and their attack and cast speed by 50%.":
    '蛛网喷吐 - 首领每 4 秒会抛出一团致命毒性蛛网球。毒球会使受影响目标的移动速度和毒素抗性降低 150%，攻击速度和施法速度降低 50%。',
  'The chaotic rift is highly unstable, which weakened the fabric of spacetime and allowed two tier 1 map bosses to find themselves together.':
    '混沌裂隙极不稳定，削弱了时空结构，使两个 1 阶地图首领同时出现在这里。',
  'The bosses are identical to their tier 1 map counterparts and use the same skills. The difficulty is raised by the fact that you need to fight two of them at once in a small space.':
    '这些首领与其 1 阶地图版本相同，并使用相同技能。难点在于你需要在狭小空间中同时对抗两个首领。',
  'Rewards (for each boss)': '奖励（每个首领）',
  'Glacial Behemoth - Frozen Wastes (Northern Descent)': '冰川巨兽 - 冰冻荒原（北部下坡）',
  'The Taskmaster - Frozen Wastes (Southern Descent)': '工头 - 冰冻荒原（南部下坡）',
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
  'These are the special areas like the Secret Cow Level, where grants the best experience and drop. You are basically reccomended to go these areas after you beat that difficulty, but it may be fun and rewarding for experienced players to visit these areas with low level characters.':
    '这些是类似秘密奶牛关的特殊区域，能提供最佳经验和掉落。基本建议你在通关对应难度后再前往这些区域，但有经验的玩家用低等级角色挑战也可能很有趣且收益不错。',
  'Please note that you can get Viper Amulet without visiting Lost Farm (formely Lost City), and you can visit Bookstore Sarina (formely Ruined Temple) for the book after you beat Baal.':
    '请注意，不去失落农场（原失落之城）也能取得蝮蛇项链；击败巴尔后，你也可以前往书店莎莉娜（原残破神殿）取得书本。',
  'CAUTION: Naraku and below are extremely': '注意：奈落及其下层是极其困难的区域，',
  'difficult areas for super rich experts. Only uber': '只适合装备极好的专家玩家。只有顶级',
  "players can stay alive there. You don't need to": '玩家才能在那里存活。你不需要',
  'kill Nihlathak to clear a difficulty, and I belive': '击杀尼拉塞克也能通关该难度，而且我相信',
  "99% people don't use personalize. ;)": '99% 的玩家不会使用个性化任务。;)',
  "99% people don't use personalize.;)": '99% 的玩家不会使用个性化任务。;)',
  "You can't come back": '你无法返回',
  'from The Sewer Level 1': '下水道第 1 层',
  '*Taking this WP makes': '*使用这个传送小站会使',
  'the Red Potal disappear.': '红门消失。',
  'The downstairs are': '下行楼梯是',
  'hidden, but there always': '隐藏的，但总会',
  'exists a landmark. ;)': '存在一个地标。;)',
  'exists a landmark.;)': '存在一个地标。;)',
  '(Hint: Sp***ling C***t)': '（提示：闪***水***）',
  'The following levels have been removed: Act 2 Sewer Level 1, Palace Level 1, Catacombs level 4 (replaced 3 with 4), Worldstone keep level 3 (replaced 2 with 3), Jail level 3 (replaced 2 with 3).':
    '以下楼层已移除：第 2 幕下水道第 1 层、皇宫第 1 层、地下墓穴第 4 层（用 4 替换 3）、世界之石要塞第 3 层（用 3 替换 2）、监牢第 3 层（用 3 替换 2）。',
  'After you exhausted all souls, you can transform the amulet in 1 out of 8 mythical weapon bases. Doing this will allow you to wear the weapon without restrictions and any flavor text will be removed.':
    '耗尽所有灵魂后，你可以把项链转化为 8 种神话武器底材之一。这样可以让你无视限制装备该武器，并移除所有风味文本。',
  'Once transformed, the Vessel of Souls gains triple the amount of tinkering points an item would usually get.':
    '转化后，灵魂之器获得的修缮点数为普通物品通常获得量的三倍。',
  'Eastern Sun Resurrected': '东方之日重制版',
  "If you think there's something that can be added here, please contact me on discord and I'll add it.":
    '如果你觉得这里还可以补充内容，请联系我，我会加入。',
  "Note: There's an ongoing bug (limitation) with D2RLAN that makes it impossible to tell what skills each mercenary has. As a bandaid, some mercenaries will be slighly more expensive and you will be able to infer from their buy cost what skills they use, as following in the table below.":
    '注意：局域网版目前有一个持续存在的限制，导致无法显示每个佣兵拥有哪些技能。作为临时方案，部分佣兵价格会略高，你可以根据下表中的雇佣费用推断他们使用的技能。',
  '[Mercenaries] &nbsp; [Oskills] &nbsp;': '[佣兵] [特殊技能]',
  'A simple arrow that deals 100% weapon damage and that cannot pierce.': '一支简单箭矢，造成 100% 武器伤害，且不能穿透。',
  'A simple arrow that deals 100% weapon damage and that cannot pierce. The elemental enhanced variants convert 100% of physical damage to the corresponding damage type.':
    '一支简单箭矢，造成 100% 武器伤害，且不能穿透。元素强化变体会将 100% 物理伤害转化为对应伤害类型。',
  'Axe Throw, Fire/Cold/Lightning/Magic Enhanced Axe': '掷斧、火焰/冰霜/闪电/魔法强化斧',
  'A simple axe that deals 100% weapon damage and that cannot pierce. The elemental enhanced variants convert 100% of physical damage to the corresponding damage type.':
    '一把简单飞斧，造成 100% 武器伤害，且不能穿透。元素强化变体会将 100% 物理伤害转化为对应伤害类型。',
  'A small area of effect instant spell damage skill. Each skill gets synergy bonuses from all spells of their attuned element (e.g. Fire Surge gets synergy bonuses from all direct damage fire spells, like Flameburst or Volcano). Unlike other procs, those inherit the bonus damage from crossbows.':
    '一个小范围即时法术伤害技能。每个技能都会从其调谐元素的所有法术获得协同加成（例如火焰涌动会从烈焰爆发或火山这类直接火焰伤害法术获得协同加成）。与其他触发不同，这些技能会继承弩的额外伤害。',
  'A skill that attaches a brand to the target enemy and deals 100% weapon damage converted to the respective element after a delay of 0.4 seconds.':
    '一个将印记附着到目标敌人的技能，0.4 秒延迟后造成 100% 武器伤害，并转化为对应元素。',
  'A skill that releases a 100% weapon damage converted to the respective element 64 spikes nova.':
    '一个释放 64 枚尖刺新星的技能，造成 100% 武器伤害，并转化为对应元素。',
  'A skill that simply heals the user when it procs / is casted. Level = % heal (e.g. level 10 = 10% heal of max life).':
    '一个在触发或施放时单纯治疗使用者的技能。等级 = 治疗百分比（例如 10 级 = 治疗最大生命值的 10%）。',
  'A 150% weapon damage converted to lightning damage screen wide area of effect nova that also deals flat lightning damage which scales with all of your lightning skills that deal direct damage and knockbacks all enemies.':
    '一个全屏范围新星，造成 150% 武器伤害并转化为闪电伤害，同时造成固定闪电伤害；该固定伤害会随所有直接闪电伤害技能缩放，并击退所有敌人。',
  'A passive skill granting 1% physical resist and 5% life (additive with feral mastery bonus) per level.':
    '一个被动技能，每级提供 1% 物理抗性和 5% 生命值（与野性精通加成为加算）。',
  'A buff that grants 2% attack speed, 2% movement speed, 2% cast speed, 10% mana regen per level. Also regenerates life equal to ~10 life per second per level.':
    '一个增益，每级提供 2% 攻击速度、2% 移动速度、2% 施法速度和 10% 法力回复；同时每级每秒回复约 10 点生命。',
  'Procs that discharge a simulated 3 charges charge up skill when they proc. They take the same synergies as the regular skills. Unlike the Physical finisher discharge procs, those take the level of the proc itself rather than the learned skill.':
    '这些触发效果会在触发时释放一个模拟 3 层充能的蓄力技能。它们使用与常规技能相同的协同加成。与物理终结技释放触发不同，它们使用触发本身的等级，而不是已学习技能的等级。',
  'Aura that grants 5% specific Spell Damage to affected party members per level.': '光环每级为受影响的队伍成员提供 5% 指定法术伤害。',
  'Aura that lowers the resistances to the specific element of nearby enemies by 1% per level.':
    '光环每级使附近敌人的指定元素抗性降低 1%。',
  'This comes as a proc on items and when it procs, you get a fully charged, current level (skill level learned, not proc level) Dragon Fury/Execute discharged on the enemy.':
    '这是物品上的触发效果；触发时会对敌人释放满充能、当前等级（已学习技能等级，而非触发等级）的龙怒/处决。',
  'A buff that grants 800% Enhanced Damage and 50-100 Physical Damage to Attacks. Lasts 20 seconds.':
    '一个增益，提供 800% 增强伤害，并使攻击附加 50-100 物理伤害，持续 20 秒。',
  'A buff that grants 150% Movement Speed, 50% Attack Speed, 100% Faster Cast Rate, 100% Faster Block Rate and 100% Faster Hit Recovery. Lasts 20 seconds.':
    '一个增益，提供 150% 移动速度、50% 攻击速度、100% 快速施法速度、100% 快速格挡速度和 100% 快速打击恢复，持续 20 秒。',
  'A buff that grants 300% Spell Damage. Lasts 20 seconds.': '一个增益，提供 300% 法术伤害，持续 20 秒。',
  'A buff that grants 150% Increased Maximum Life and Mana. Lasts 20 seconds.': '一个增益，提供 150% 最大生命和法力提高，持续 20 秒。',
  'A buff that grants 100% Elemental and Poison Resistances and 50% Physical and Magic Resistances. Lasts 20 seconds.':
    '一个增益，提供 100% 元素和毒素抗性，以及 50% 物理和魔法抗性，持续 20 秒。',
  'A buff that grants 150 to All Attributes. Lasts 20 seconds.': '一个增益，提供 150 所有属性，持续 20 秒。',
  'A buff that grants 10 to All Skills. Lasts 20 seconds.': '一个增益，提供 10 所有技能，持续 20 秒。',
  'A buff that grants 50% Bonus to All Attributes, 15 Life on Striking and Curse Immunity (does NOT clear present curses) for 4 seconds.':
    '一个增益，提供 50% 所有属性加成、击中时获得 15 生命，并免疫诅咒 4 秒（不会清除已存在的诅咒）。',
  'A multiple shot type attack that fires 1 lightning bolt + 1 per 5 levels in a cone. Each bolt has 100% inherent pierce chance and converts all physical damage to lightning.':
    '一种多重射击类攻击，以锥形发射 1 支闪电箭，并且每 5 级额外发射 1 支。每支箭自带 100% 穿透几率，并将所有物理伤害转化为闪电伤害。',
  '(0% MF is the best for finding white items. Negative': '（0% 魔法装备掉落率最适合寻找白色物品。负数',
  'MF also increases the chance of low-quality items)': '魔法装备掉落率也会提高低质量物品出现几率）',
  'Increases Max Mana by -(2/4/8/16)%': '使最大法力降低 -(2/4/8/16)%',
  '(Not Upgraded Already)': '（尚未升级）',
  '(Excluding level 96+ suffixes and auras)': '（不包括 96 级以上后缀和光环）',
  '*Each key has the respective output': '*每把钥匙都有对应产物',
  '**Vessel of Souls is a special mythical unique that can consume organs to gain various bonuses.':
    '**灵魂之器是一件特殊神话暗金物品，可以消耗器官获得各种加成。',
  'Legendary consumables are extremely rare consumables that can be used only once and the outcome cannot be reverted. They grant special bonuses.':
    '传奇消耗品是极其稀有的消耗品，只能使用一次且结果无法撤销。它们会提供特殊加成。',
  '**Spell Mastery is a passive that increases total spell damage by 4% per level and stacks with all other masteries.':
    '**法术精通是一个被动技能，每级提高 4% 总法术伤害，并与所有其他精通叠加。',
  "***Astrogha's Petrified Heart can be used on any item to remove the corruption status in order to be able to corrupt that item again. If used on a Triune Harbinger of Apocalypse staff, it will allow it to receive an additional corruption (it will not reset the entire count to 0). Doing so, the item will also count 1 less corruption for every heart used when providing the bonus damage to Triumvirate Orb (as if the corruption never happened).":
    '***阿斯特罗加的石化之心可以用于任意物品，以移除腐化状态，从而让该物品可以再次腐化。若用于三位一体末日先驱法杖，则允许它获得一次额外腐化（不会将总次数重置为 0）。这样做还会在给三巨头法球提供伤害加成时，每使用一颗心就少计 1 次腐化（相当于该次腐化从未发生）。',
  '(And so for other Healing/Mana Potions)': '（其他治疗/法力药剂同理）',
  '(A Light Potion counts as 3 Minor Potions)': '（一瓶轻型药剂按 3 瓶轻微药剂计算）',
  'Any Arrow/Bolt/Javelin/Thowing Weapon': '任意箭矢/弩矢/标枪/投掷武器',
  "Perfect Gem of Chipped Gem's Color": '与碎裂宝石同色的完美宝石',
  'lvl 92+ Unique Jewelry and Quivers': '92 级以上暗金首饰和箭袋',
  'up to O rune': '最高到 O rune',
  'P-Gem determines the color': '完美宝石决定颜色',
  '(25% chance to apply a small bonus)': '（25% 几率获得小型加成）',
  '2 Same Organs (except Hearts and Souls)': '2 个相同器官（心脏和灵魂除外）',
  'Adds 5-10 Cold Damage 0.2 Sec Duration': '增加 5-10 点冰冷伤害，持续 0.2 秒',
  'The Same Item with Empty Socket(s)': '带空镶孔的同一物品',
  '(Former) Secret Recipes': '（旧版）秘密公式',
  '5 Chipped Obsidians': '5 个碎裂黑曜石',
  '5 Chipped Diamonds': '5 个碎裂钻石',
  '(**Added as a Forging Mod)': '（**作为锻造词缀添加）',
  '(*Can be mixed)': '（*可以混合）',
  '(*With no level requirement penalty)': '（*没有等级需求惩罚）',
  '2 Tinkering points': '2 点修缮点数',
  '3 Tinkering points': '3 点修缮点数',
  '10 Tinkering points': '10 点修缮点数',
  'Tinkering points': '修缮点数',
  'Tinkering point': '修缮点数',
  '(If the base item has 2 set pieces': '（如果底材有 2 件套装部件',
  'ex. Arctic Belt -> Autolycus Belt. See below.)': '例如：北极腰带 -> 奥托吕科斯腰带。见下文。）',
  '(or Rerolling Orb with 3 Magic Amulet pts)': '（或使用带 3 点魔法项链点数的重置之球）',
  '(or Rerolling Orb with 3 Magic Ring pts)': '（或使用带 3 点魔法戒指点数的重置之球）',
  '(or Rerolling Orb with 7 Magic Amulet pts)': '（或使用带 7 点魔法项链点数的重置之球）',
  '(or Rerolling Orb with 7 Magic Ring pts)': '（或使用带 7 点魔法戒指点数的重置之球）',
  'Gem Socket (1-6, the # of Gems)': '宝石孔（1-6，宝石数量）',
  '(= 2 Flawless Gems)': '（= 2 个无瑕宝石）',
  'Converts the apropriate amount of points of the selected': '转换所选项目对应数量的点数',
  'Rune/Decal bracket to the next bracket': '符文/贴花档位到下一档',
  'Rune/Decal bracket to the previous lower bracket': '符文/贴花档位到上一档',
  '(Any ESR rune bracket: 128:1 points ratio)': '（任意 ESR 符文档位：128:1 点数比例）',
  '(Any Lod Decal Bracket: 2048:1 points ratio)': '（任意 LoD 贴花档位：2048:1 点数比例）',
  '(Any ESR rune bracket: 1:64 points ratio)': '（任意 ESR 符文档位：1:64 点数比例）',
  '(Any Lod Decal Bracket: 1:1024 points ratio)': '（任意 LoD 贴花档位：1:1024 点数比例）',
  '(Crystals are stored back in Crystal Can)': '（水晶会存回水晶罐）',
  'LoD Unique Item*': 'LoD 暗金物品*',
  'LoD uniques are reworked in ESR and are significantly more powerful than their vanilla counterparts.':
    'LoD 暗金物品在 ESR 中经过重做，明显比原版对应物更强。',
  'LoD uniques are generally more powerful than ESR uniques as well due to being harder to get.':
    '由于更难取得，LoD 暗金物品通常也比 ESR 暗金物品更强。',
  '(with normal coupon selected)': '（选择普通券时）',
  '(with exceptional coupon selected)': '（选择扩展券时）',
  '(with any coupon selected)': '（选择任意券时）',
  "Converts selected coupon's points": '转换所选券的点数',
  'into a Wildcard Point.': '转为万能点数。',
  'Organs include Hearts, Souls, Brains, Eyes, Scalps, Horns, Fangs, Jawbones, Spleens, Quills and Tails.':
    '器官包括心脏、灵魂、脑、眼、头皮、角、尖牙、颚骨、脾脏、刺和尾巴。',
  'Steaks, Cookbooks and Flags are not Organs.': '肉排、烹饪书和旗帜不是器官。',
  'Same Organs (except Hearts and Souls)': '相同器官（心脏和灵魂除外）',
  'Same Organs': '相同器官',
  'Hearts and Souls': '心脏和灵魂',
  'Organ/Flag (except Hearts and Souls)': '器官/旗帜（心脏和灵魂除外）',
  '(-1 skull point)': '（骷髅点数 -1）',
  '(8 points for an Ethereal one)': '（无形物品为 8 点）',
  '(4 points for an Ethereal one)': '（无形物品为 4 点）',
  '(2 point for an Ethereal one)': '（无形物品为 2 点）',
  '(Charms need to be unforged first)': '（护身符需要先移除锻造）',
  '(Will attempt to pull rejuvenation points from the stocker if no rejuvenation is provided)':
    '（若未提供复苏药水，会尝试从储存器中提取复苏点数）',
  '(with wildcard or any organ selected)': '（选择万能点或任意器官时）',
  "Converts selected item's point(s)": '转换所选物品的点数',
  'into Decipherer point(s)': '转为解读器点数',
  '(with any organ or flag selected)': '（选择任意器官或旗帜时）',
  "into selected material's point": '转为所选材料的点数',
  "(Devil's Food selected)": '（选择恶魔食粮时）',
  '(Sell to venders to cause Diablo Clone to spawn)': '（卖给商人会导致迪亚布罗克隆出现）',
  '(This recipe is an ES version of LoD': '（这个公式是 LoD 的 ES 版本',
  "3 C-Gem reroll. A poor man's special)": '3 碎裂宝石重置，穷人的特制公式）',
  '*This recipe is cheaper than the traditional 2 Blemished Gems recipe, but the item level goes down by a bit with every use and those items cannot roll more than 1 socket.':
    '*这个公式比传统的 2 瑕疵宝石公式更便宜，但每次使用都会使物品等级略微下降，且这些物品最多只能洗出 1 孔。',
  'This is to encourage players to pick up rare items from the ground as they find them and reroll them a few times.':
    '这是为了鼓励玩家捡起地上的稀有物品，并在找到后重置几次。',
  'Corrupted Zakarum are deadly unique enemies that you will encounter ramdomly in the campaign across nightmare and hell that have a chance to drop a weapon mastery token (up to 75%, not scaled by /players) and an increased chance to drop uniques and weapons.':
    '腐化的扎卡鲁姆是致命的暗金敌人，会在噩梦和地狱难度流程中随机遭遇；它们有几率掉落武器精通代币（最高 75%，不受玩家数缩放影响），并且掉落暗金物品和武器的几率更高。',
  'Once transmuted, the token is awakened and you can properly apply it to the weapon by transmuting it with the weapon and a few ingredients.':
    '合成后，代币会被觉醒；之后你可以将它与武器和少量材料一起合成，从而正确应用到武器上。',
  'Weapon mastery specializations are not meant to add power creep or necessarily make the character stronger, but change how skills work mechanically or offer new itemization paths for characters.':
    '武器精通专精并不是为了制造强度膨胀，也不一定会让角色变强，而是改变技能机制，或为角色提供新的装备构筑路线。',
  'You can only apply one weapon mastery per weapon. Weapon masteries do not stack (for dual wielding cases) unless explicitly stated otherwise.':
    '每把武器只能应用一种武器精通。除非明确说明，否则双持时武器精通不会叠加。',
  'Weapon mastery can be applied to any class weapon, regardless of its tier (works on exceptional, elite and mythical bases as well).':
    '武器精通可以应用到任意职业武器上，不受阶级限制（扩展、精英和神话底材同样可用）。',
  '*This only awakens the token, it does not change the weapon': '*这只会觉醒代币，不会改变武器',
  'Poison, Immolation, Freezing, Lightning Arrow': '毒箭、焚烧箭、冰冻箭、闪电箭',
  'Makes those skills fire their special effect every 5 attacks': '使这些技能每 5 次攻击触发一次特殊效果',
  'instead of 3, but increases their total damage by 20%': '而不是每 3 次触发一次，但总伤害提高 20%',
  'Causes the projectiles to chain twice,': '使投射物连锁两次，',
  'Causes the projectiles to chain twice': '使投射物连锁两次',
  'but reduce the total number of targets by 40%': '但总目标数量减少 40%',
  "Causes the projectiles to reduce enemies'": '使投射物降低敌人的',
  'magic resistance by 10% + 1% per 2 levels on every': '魔法抗性，每次攻击降低 10% + 每 2 级 1%',
  'attack with the special synergy, but no longer chains': '通过特殊协同触发，但不再连锁',
  'Fires a 16 arrow nova instead, triples its special': '改为发射 16 支箭的新星，并使其特殊',
  'synergy debuff, and gains an unmodifiable 10 seconds cooldown': '协同减益变为三倍，同时获得无法修改的 10 秒冷却',
  'No longer gains attack rating per': '不再每级获得攻击准确率',
  'level or from synergy, but the damage bonus is doubled': '也不再从协同获得攻击准确率，但伤害加成翻倍',
  'Those skills fire an extra arrow at a nearby enemy every 3 attacks, but': '这些技能每 3 次攻击会向附近敌人额外发射一支箭，但',
  'lose all damage and attack rating from levels and synergies': '失去来自等级和协同的所有伤害与攻击准确率',
  'Causes Spearstorm to double the number of spear shards': '使矛风暴的长矛碎片数量翻倍',
  'every 3 attacks, but no longer grants bonus physical damage': '每 3 次攻击触发一次，但不再提供额外物理伤害',
  'Causes Fend to generate only the small spear nova, which now': '使击退只生成小型长矛新星，该新星现在',
  'reduces physical resistance at 150% effectiveness, but no longer slows*': '以 150% 效率降低物理抗性，但不再减速*',
  'Replaces converging novas with waves of homing spears': '将汇聚新星替换为追踪长矛波',
  'Critical strikes are replaced by extra waves': '致命一击被额外波次取代',
  '*the physical resistance effectiveness increase only works on LAN': '*物理抗性效果提升仅在局域网版生效',
  'Maiden Pike Variant': '少女长矛变体',
  'Gains 2 times less spear shards per level,': '每级获得的长矛碎片减少为原来的一半，',
  'Gains 2 times less spear shards per level': '每级获得的长矛碎片减少为原来的一半',
  'but the global physical damage is doubled': '但全局物理伤害翻倍',
  'Causes Fend to generate only the bigger spear': '使击退只生成较大的长矛',
  'nova and double the slow effectiveness*': '新星，并使减速效果翻倍*',
  'Doubles total damage every 5 attacks with the special': '每 5 次攻击通过特殊',
  'synergy instead of a 15% chance to quadruple damage': '协同使总伤害翻倍，而不是 15% 几率造成四倍伤害',
  '*the slow effectiveness increase only works on LAN': '*减速效果提升仅在局域网版生效',
  'Maiden Javelin Variant': '少女标枪变体',
  'Pyre, Plague, Frost Javelin, Lightning Fury': '火葬、瘟疫、冰霜标枪、闪电之怒',
  'Those skills release their on hit effect one more time': '这些技能会额外释放一次命中效果',
  'after a 1.4 second delay, but total damage is reduced by 40%': '延迟 1.4 秒后触发，但总伤害降低 40%',
  'Ninja To Variant': '忍者刀变体',
  'Halves the number of targets and strikes a nearby': '目标数量减半，并攻击附近',
  'enemy roughly equal to 60% of the amount reduced': '敌人，数量约等于减少量的 60%',
  'Tribal Hatchet Variant': '部族手斧变体',
  'No longer bounces. Instead releases a 4 axe converging': '不再弹跳。改为释放 4 把斧头汇聚',
  'nova that hits only the main target again': '新星，只会再次命中主目标',
  'Now launches the axes in a spiraling nova instead, which': '现在改为以螺旋新星发射斧头，该新星',
  'can only hit terrain and then ricochet towards up to 4 nearby enemies': '只能命中地形，然后向最多 4 个附近敌人弹射',
  'Increases magical bolts number by 50%,': '魔法弹数量提高 50%，',
  'Increases magical bolts number by 50%': '魔法弹数量提高 50%',
  'but reduces target seek number from 2 to 1': '但追踪目标数从 2 降为 1',
  'Magical bolts split towards nearby enemies instantly,': '魔法弹会立即向附近敌人分裂，',
  'Magical bolts split towards nearby enemies instantly': '魔法弹会立即向附近敌人分裂',
  'but no longer generate converging novas. Increases': '但不再生成汇聚新星。提高',
  'projectile speed and number of bolts by 50%': '投射物速度和弹体数量 50%',
  'Oak Branch Variant': '橡木枝变体',
  'Wolves, Ravens, Grizzly': '狼、乌鸦、灰熊',
  'Halves the Wolves and Ravens you can summon and gain': '可召唤的狼和乌鸦数量减半，并获得',
  '1 additional Grizzly bear for every 5 regular summons': '每失去 5 个普通召唤物，额外获得 1 只灰熊',
  'lost. Double the amount of hits of all pet skills': '所有宠物技能的命中次数翻倍',
  'Soul Hunter Variant': '灵魂猎手变体',
  'This skill no longer grants elemental damage,': '该技能不再提供元素伤害，',
  'This skill no longer grants elemental damage': '该技能不再提供元素伤害',
  'but the physical damage is doubled': '但物理伤害翻倍',
  'Ritualistic Dagger Variant': '仪式匕首变体',
  'All curses are twice as strong, but their duration': '所有诅咒强度翻倍，但持续时间',
  'is reduced to 2 seconds and radius to 4 yards': '降低为 2 秒，半径降低为 4 码',
  'Wretched Scythe Variant': '悲惨镰刀变体',
  "Your Necromancer's direct damage magic spells": '你的死灵法师直接伤害魔法法术',
  'have a 1% chance to repeat per 1% missing': '每损失 1% 生命，就有 1% 几率重复',
  'life. Your magic resist is always 0': '你的魔法抗性始终为 0',
  'Blessed Edge Variant': '祝福之刃变体',
  'Increases the total empower chance by 50%,': '总强化几率提高 50%，',
  'Increases the total empower chance by 50%': '总强化几率提高 50%',
  'but shortens the duration to 2 seconds': '但持续时间缩短为 2 秒',
  'Mana Blade Variant': '法力之刃变体',
  'Reduces the number of hits to 1, but every third hit': '命中次数降为 1，但每第三次命中',
  'now unleashes elemental effects that deal spell damage,': '现在会释放造成法术伤害的元素效果，',
  'now unleashes elemental effects that deal spell damage': '现在会释放造成法术伤害的元素效果',
  'scaling with all direct damage spells of their respective element': '并随对应元素的所有直接伤害法术缩放',
  'Sorceress Orb': '女巫法球',
  'Sorceress Spells': '女巫法术',
  'Triples the cooldown of your level 24 Sorceress spells': '你的 24 级女巫法术冷却时间变为三倍',
  'and adds a 2 second cooldown to Hydra,': '并给九头海蛇增加 2 秒冷却，',
  'and adds a 2 second cooldown to Hydra': '并给九头海蛇增加 2 秒冷却',
  'but increases your total spell damage by 20%': '但你的总法术伤害提高 20%',
  'Sorceress Exclusives': '女巫专属',
  'Increases the bonuses granted by your exclusives by 50% and their downsides by 75%': '你的专属技能提供的加成提高 50%，负面效果提高 75%',
  'Assassin Claw (LAN ONLY)': '刺客爪（仅局域网版）',
  'Elemental Charge-up Skills': '元素蓄力技能',
  'Makes all elemental charge up skills discharge only the corresponding charge,': '使所有元素蓄力技能只释放对应的充能，',
  'Makes all elemental charge up skills discharge only the corresponding charge': '使所有元素蓄力技能只释放对应的充能',
  'but increase total damage by 50/70/100% for each charge level, respectively': '但每层充能等级分别使总伤害提高 50/70/100%',
  'This effect does not affect procs and does not stack': '此效果不影响触发效果，且不会叠加',
  'Assassin Claw': '刺客爪',
  'Lowers the base damage of all elemental charge up skills by 25%, but each': '所有元素蓄力技能的基础伤害降低 25%，但每个',
  'different charge present increases the total damage by 10%': '已存在的不同充能会使总伤害提高 10%',
  'This effect stacks': '此效果可以叠加',
};

const guideEndgameExactTranslations: Readonly<Record<string, string>> = {
  'When the sun fades and the veil of night descends, it awakens. A shadow among shadows, the Avatar of the Night moves with the silence of a hunting panther, its obsidian form blending seamlessly into the abyss.':
    '当太阳褪去、夜幕降临时，它便苏醒。暗夜化身如暗影中的暗影，行动如猎豹般无声，黑曜石般的身形无缝融入深渊。',
  'Pounce - The avatar will try to ambush you occasionally, jumping on top of you and weakening you with a madness inducing effect that decreases your physical resistance by 100% and your cold resistance by 150%. However, the effect puts you into a rabid state, increasing your attack, cast and movement speed by 100%.':
    '扑袭 - 化身会偶尔试图伏击你，跳到你身上并施加诱发疯狂的削弱效果，使物理抗性降低 100%、冰冷抗性降低 150%。不过该效果也会让你进入狂暴状态，使攻击、施法和移动速度提高 100%。',
  'Flurry of Javelins - The boss main attack is a flurry of javelins that deal hybrid physical/cold damage that can bounce to nearby players, even after hitting a wall.':
    '标枪乱舞 - 首领的主要攻击是一阵标枪，造成物理/冰冷混合伤害；即使命中墙壁后，也会弹向附近玩家。',
  "Converging Cold Nova - Once he's close to you, the boss will cast a nova of ice bolts that stick to the walls, which will seek nearby players after a short period of time, so make sure to run. He also has a chance to cast this ability when hurt.":
    '汇聚冰冷新星 - 一旦靠近你，首领会施放冰弹新星，冰弹会附着在墙上，并在短时间后追踪附近玩家，所以务必跑开。首领受伤时也有几率施放此技能。',
  'Passives - The boss has a passive chance of deadly strike and crushing blow on attack.':
    '被动 - 首领攻击时被动拥有致命一击和压碎性打击几率。',
  'Long ago, before corruption blackened his soul, he walked among the Horadrim - a scholar of forbidden knowledge, a seeker of truth in the shadows of creation. But wisdom is a double-edged blade, and the one now known as the Herald of Doom saw too much. He gazed into the abyss of elemental power, not as a cautious ward, but as a willing disciple. And in return, the abyss gazed back.':
    '很久以前，在腐化染黑他的灵魂之前，他曾行走于赫拉迪姆之间，是研究禁忌知识的学者，也是追寻创世阴影中真相的人。但智慧是一把双刃剑，如今被称为末日先驱的他看见了太多。他凝视元素力量的深渊，不是作为谨慎的守卫，而是作为自愿的门徒。于是，深渊也回望了他。',
  'Rain of Doom - The corrupted horadrim will occasionally cast a rain of meteors upon its enemies, each meteor dealing devastating physical and fire damage.':
    '末日之雨 - 腐化的赫拉迪姆会偶尔向敌人降下陨石雨，每颗陨石都会造成毁灭性的物理和火焰伤害。',
  "Thunder Storm - The boss will sometimes conjure a ring of lightning balls that will eventually materialize into deadly bolts of lightning that seek nearby enemies, so it's imperative you run as soon as you see them.":
    '雷暴 - 首领有时会召唤一圈闪电球，随后化为致命闪电追踪附近敌人；看到它们时必须立刻跑开。',
  'Flurry of Ice - The boss can also conjure novas of ice bolts that do not deal direct damage, but rather stick to surfaces and that seek nearby players after a short delay.':
    '寒冰乱舞 - 首领也能召唤冰弹新星；冰弹不会直接造成伤害，而是附着在表面，并在短暂延迟后追踪附近玩家。',
  'Meteor Spirtal - When one is foolish enough to approach the sorcerer in close range, he will cast a spiral of devastating meteors.':
    '陨石螺旋 - 当有人愚蠢地靠近这名法师时，他会施放一圈毁灭性的螺旋陨石。',
  'Passives - The horadrim sorcerer pierces the elemental resistances by 100%, so make sure to overcap them before fighting him.':
    '被动 - 赫拉迪姆法师会穿透 100% 元素抗性，开战前务必把抗性堆到上限以上。',
  'Legends speak of a time when the Horadrim sought to imprison a great elemental force, fearing that its raw, unbridled power could challenge even the Prime Evils. But ice does not die. It does not fade. It waits. And when the seals upon its prison shattered, the Glacial Behemoth rose once more, its breath a storm of razor-sharp frost, its every step cracking the earth beneath an avalanche of death.':
    '传说中，赫拉迪姆曾试图囚禁一股强大的元素之力，因为他们担心那原始而不受约束的力量甚至足以挑战三大魔神。但冰不会死去，不会消散，只会等待。当封印它的牢笼破碎时，冰川巨兽再度崛起；它的吐息是锋利如刃的霜暴，每一步都让大地在死亡雪崩下裂开。',
  'Permafrost - The behemoth will attempt to summon a deadly avalanche of ice in melee range that leaves behind icy fires which deal insane amounts of both cold and physical damage, lasting 30 seconds.':
    '永冻 - 巨兽会尝试在近战范围内召唤致命冰雪崩，并留下持续 30 秒的冰焰，造成极高冰冷和物理伤害。',
  'Perma Freeze - Upon taking damage, he has a chance to cast a petrifying curse that lowers your cold resistance by 150%, movement speed by 500% and cast and attack speed by 200%.':
    '永久冻结 - 受到伤害时，它有几率施放石化诅咒，使你的冰冷抗性降低 150%、移动速度降低 500%、施法和攻击速度降低 200%。',
  'Charge - When taking damage, the boss has a chance to charge at the target with insane speed, closing the gap between him and yourself.':
    '冲锋 - 受到伤害时，首领有几率以极快速度冲向目标，迅速拉近距离。',
  'Disrupt - The boss emits a mysterious aura that prevents your teleport skills from working.':
    '干扰 - 首领散发神秘光环，使你的传送技能无法生效。',
  'Clad in chains that bind not just flesh but souls, he does not fight alone. With a guttural command, he summons the wicked, tearing open the veil between worlds to unleash legions of fiends, each one bound to his iron will. But he does not simply send them to battle, he drives them, his very presence igniting a madness within his minions, pushing them beyond pain, beyond fear, beyond death itself.':
    '他身披锁链，那锁链束缚的不只是血肉，还有灵魂。他并非独自作战；一声低沉命令便召来邪物，撕开世界之间的帷幕，释放受其钢铁意志束缚的恶魔军团。他不只是派它们上阵，而是驱策它们；他的存在会点燃仆从心中的疯狂，让它们超越痛苦、恐惧，乃至死亡本身。',
  'Summon Bloodthirsty Slaves - The taskmaster will periodically summon bloodthirsty demons from the depths of hell to aid him in battle. The minions are immune to all damage and their immunities need to be broken by regular means.':
    '召唤嗜血奴仆 - 工头会周期性从地狱深处召唤嗜血恶魔协助作战。这些仆从免疫所有伤害，需要用常规手段打破免疫。',
  'Bloodrage - The boss will attempt to enrage his minions, either granting them a buff that heals them insanely fast and providing them damage, attack and movement speed for 6 seconds or turning them into suicidal slaves.':
    '血怒 - 首领会尝试激怒仆从，要么赋予它们持续 6 秒的增益，使其极速恢复并提高伤害、攻击速度和移动速度；要么将它们变成自爆奴仆。',
  'Suicidal Slaves - The suicidal slaves will chase down players and attempt to explode in their face. If killed directly by a player, they will explode in an extremely devastating fiery rain dealing both physical and fire damage as well as release a homing fiery skull of death that deals lethal fire damage.':
    '自爆奴仆 - 自爆奴仆会追逐玩家并试图贴脸爆炸。若被玩家直接击杀，它们会爆成毁灭性的火雨，造成物理和火焰伤害，并释放会追踪的死亡火焰骷髅，造成致命火焰伤害。',
  "Once, it was a loyal and devoted servant of the Lord of Destruction, a chosen harbinger meant to spread ruin in Baal's name. For one fleeting moment, it dared to question, to hesitate before Baal's decree. And for that, it was unmade and remade, not destroyed, but left to suffer, reshaped by its master's boundless wrath. Baal did not grant death, he granted a lesson, an eternal scar, a grotesque reminder of what happens to those who defy the Lord of Destruction.":
    '它曾是毁灭之王忠诚而虔诚的仆从，是以巴尔之名传播毁灭的选定先驱。只因短暂一瞬的质疑，只因在巴尔命令前迟疑，它便被拆解又重塑；并非被毁灭，而是被留下受苦，被主人无尽怒火重塑。巴尔没有赐予死亡，而是赐予教训，一道永恒伤疤，一个畸形提醒，警示所有胆敢违抗毁灭之王者的下场。',
  "Homing Cold Novas of Destruction - Baal's former servant will most often cast a deadly orb of ice that spread ice bolts. At first, the ice bolts stand suspended in air for a short period, before seeking to pierce nearby players with extremely high speed.":
    '追踪毁灭冰冷新星 - 巴尔昔日仆从最常施放致命冰球，散射冰弹。冰弹起初会短暂悬停空中，随后以极高速度追踪并穿刺附近玩家。',
  'Baal Lightning Storm - The harbinger of destruction dabbled into arcane power of the high angels, learning to rarely cast a devastating storm of lightning balls. The balls stand suspended in the air for a short period before exploding into charged bolts, dealing high lightning damage.':
    '巴尔闪电风暴 - 毁灭先驱涉足高阶天使的奥术力量，学会偶尔施放毁灭性的闪电球风暴。闪电球会短暂悬停空中，然后爆裂为充能弹，造成高额闪电伤害。',
  'Summon Instruments of Destruction - He will spawn a horde of beasts of destruction every 30 seconds. They have a chance to charge at players when injured and heal nearby allies upon death, making them difficult to dispatch quickly and also making it imperative you avoid killing them near the boss.':
    '召唤毁灭工具 - 它每 30 秒会生成一群毁灭兽。它们受伤时有几率冲向玩家，死亡时会治疗附近盟友，因此很难快速清理，也必须避免在首领附近击杀它们。',
  'Meteor Spiral - Upon getting close to the harbinger of destruction, he will attempt to defend himself with a spiral of meteors that deal devastating physical and fire damage.':
    '陨石螺旋 - 接近毁灭先驱时，它会尝试用螺旋陨石自卫，造成毁灭性的物理和火焰伤害。',
  'Passives - The boss pierces 100% of your elemental resistances, so make sure to overcap them.':
    '被动 - 首领会穿透你 100% 元素抗性，所以务必把抗性堆到上限以上。',
  'In the endless war between Heaven and Hell, where angels and demons clash for dominion, there exists a force that serves neither side. Once, it may have been an angel, a being of celestial grace charged with guiding the dead to their destined afterlife. But that purpose was twisted, corrupted by the whispers of the Abyss, until it became something else entirely - a cold, impartial executioner, severed from both the light and the darkness.':
    '在天堂与地狱无尽争战中，天使与恶魔为支配权彼此冲突，而有一股力量不侍奉任何一方。它曾或许是天使，是承载天界恩典、负责引导亡者前往命定来世的存在。但这一使命被深渊低语扭曲腐化，最终化为截然不同之物：一个冷酷而公正的处刑者，与光明和黑暗都已断绝。',
  "Bone Spirit - The arbiter's main attack is a bone spirit that deals very high amounts of magic damage, capable of hitting a target multiple times.":
    '骨灵 - 仲裁者的主要攻击是骨灵，造成极高魔法伤害，并可多次命中同一目标。',
  "Bone Spear Flurry - The boss will cast a flurry of bone spears on a 4 seconds cooldown that seek out nearby enemies. They deal high amounts of magic damage and pierce their targets, so it's best to try to avoid them.":
    '骨矛乱舞 - 首领每 4 秒会施放一阵骨矛追踪附近敌人。骨矛造成高额魔法伤害并穿透目标，因此最好尽量躲避。',
  'Soulstorm - Rarely, the boss will raise the souls of the dead to seek out nearby players and destroy them with insanely high amounts of magic damage.':
    '灵魂风暴 - 首领会罕见地唤起死者灵魂追踪附近玩家，并以极高魔法伤害将其摧毁。',
  'Weakening Curse - When taking damage, the boss has a chance to conjure a curse of the soul. If affected, the victim will have their movement speed reduced by 150% and their magic resist by 50%.':
    '削弱诅咒 - 受到伤害时，首领有几率召唤灵魂诅咒。受影响者移动速度降低 150%，魔法抗性降低 50%。',
  "Timeless heroes shattered his soulstone upon the Hellforge, watching as the fragments were swallowed by the abyss. They thought they had destroyed him. But hatred is not so easily destroyed. Deep within the smoldering veins of Hell, where the echoes of suffering never fade, the remnants of Mephisto's essence festered. Though his prison was broken, his malice endured, clinging to the very fabric of Hell itself. Every whisper of betrayal, every act of cruelty, every drop of innocent blood spilled upon the earth fed his lingering presence, reforging his spirit in the shadows. From the smoldering abyss, he rose anew. No longer bound to a soulstone, no longer constrained by the laws of the past - Mephisto had returned and is more powerful than ever before.":
    '永恒英雄曾在地狱熔炉上击碎他的灵魂石，看着碎片被深渊吞没。他们以为已经毁灭了他。但憎恨并不会轻易消亡。在地狱炽燃脉络深处，在痛苦回声永不消散之处，墨菲斯托残余的本质继续溃烂。囚笼虽破，他的恶意仍存，附着于地狱本身的结构之上。每一次背叛低语、每一次残忍行径、每一滴洒在大地上的无辜之血，都滋养着他的残存存在，在阴影中重铸他的灵魂。自燃烧深渊中，他再度崛起。不再受灵魂石束缚，不再受过去法则限制，墨菲斯托回来了，并且比以往更强。',
  'Invincibility - As his name states, Mephisto is completely invincible to any damage and his immunities cannot be broken by regular means.':
    '无敌 - 正如其名，墨菲斯托完全免疫任何伤害，且其免疫无法用常规手段打破。',
  "Poison Bomb - Mephisto's attrition spell is lobbing a bomb of poison that explodes upon hitting the ground, applying an incredibly strong poison to everyone in the area.":
    '毒素炸弹 - 墨菲斯托的消耗法术会抛出毒素炸弹，落地爆炸并对区域内所有人施加极强毒素。',
  'Flurry of Charged Bolts - Roughly every 12 seconds, Mephisto will cast a flurry of charged bolts that seek nearby enemies, dealing very high lightning damage.':
    '充能弹乱舞 - 大约每 12 秒，墨菲斯托会施放一阵追踪附近敌人的充能弹，造成极高闪电伤害。',
  "Flurry of Ice Orbs - When approaching Mephisto, he will attempt to cast on a 12 seconds cooldown a flurry of ice orbs that deal insane amounts of cold and physical damage. The ice orbs don't stop after one hit, but rather attempt to seek and hit their target multiple times, so it is imperative to run away from this spell.":
    '冰球乱舞 - 接近墨菲斯托时，他会尝试每 12 秒施放一阵冰球，造成极高冰冷和物理伤害。冰球命中一次后不会停止，而会继续追踪并多次命中目标，因此必须远离此法术。',
  'Cold Wave Prison - Mephisto will rarely cast 4 waves of cold, converging on top of the unsuspecting players and dealing extremely high cold damage to anyone in their path.':
    '寒波牢笼 - 墨菲斯托会罕见地施放 4 道寒波，向毫无防备的玩家汇聚，对路径上的任何人造成极高冰冷伤害。',
  'Passives - Mephisto pierces 100% of your elemental resistances.': '被动 - 墨菲斯托会穿透你 100% 元素抗性。',
  "Heaven's Light (SP only) - Not all hope is lost when fighting Mephisto. Very rarely after damaging Mephisto, the lights of heaven will scatter the battlefield. Picking up a orb of light empowers you, making you and any summons affected able to damage Mephisto for a short period of time.":
    '天之光（仅 SP）- 与墨菲斯托战斗时并非全无希望。伤害墨菲斯托后，极少数情况下天界之光会散落战场。拾取光球会强化你，使你和受影响的召唤物能在短时间内伤害墨菲斯托。',
  "Heaven's Light (LAN only) - Not all hope is lost when fighting Mephisto. Very rarely after damaging Mephisto, the lights of heaven will scatter the battlefield. Picking up a orb of light weakens Mephisto for a short period of time.":
    '天之光（仅 LAN）- 与墨菲斯托战斗时并非全无希望。伤害墨菲斯托后，极少数情况下天界之光会散落战场。拾取光球会在短时间内削弱墨菲斯托。',
  "Mephisto's Demonic Horn": '墨菲斯托的恶魔之角',
  "From the depths of the Abyss, where the very foundations of Hell burn hottest, the Infernal Crucible - an ancient relic, older than the Prime Evils themselves - began to stir. Legends claim it was where the first demons were shaped, where the essence of darkness itself was forged into form. And now, drawn by the echoes of his own shattered being, Diablo's remnants flowed into its flames, reforging the Lord of Terror into something greater, something unbreakable. He emerged not as the Diablo of old, but as something more. No longer bound to soulstones, no longer vulnerable to the rituals of men, he is Diablo the Invincible, terror incarnate, darkness given flesh, a force of pure, undying malevolence.":
    '在深渊最深处，在地狱根基燃烧最烈之地，炼狱熔炉开始震动。这件古老遗物甚至比三大魔神更古老。传说最初的恶魔正是在那里被塑造，黑暗本质也在那里被锻造成形。如今，在自身破碎存在的回声吸引下，迪亚布罗的残余流入其火焰，将恐惧之王重铸为更强大、更不可摧毁之物。他现身时已不再是旧日的迪亚布罗，而是更高层次的存在。不再受灵魂石束缚，不再易受人类仪式伤害；他是无敌的迪亚布罗，是恐惧化身、黑暗成肉，是纯粹且不朽的恶意。',
  'Invincibility - As his name states, Diablo is completely invincible to any damage and his immunities cannot be broken by regular means.':
    '无敌 - 正如其名，迪亚布罗完全免疫任何伤害，且其免疫无法用常规手段打破。',
  "Meteor Shower - Diablo's regular ability is summoning meteors in a line that deal insane amounts of physical and fire damage.":
    '陨石雨 - 迪亚布罗的常规技能会召唤一列陨石，造成极高物理和火焰伤害。',
  "Fire Nova - Roughly every 12 seconds, with an audio cue, Diablo releases his most devastating fire nova to date. The fire nova expands slowly, leaving lingering fire behind that deal extremely high amounts of fire damage, so it's imperative you run away when you hear the audio cue.":
    '火焰新星 - 大约每 12 秒，伴随音效提示，迪亚布罗会释放迄今最毁灭性的火焰新星。火焰新星会缓慢扩张并留下持续火焰，造成极高火焰伤害，因此听到音效提示时必须立刻远离。',
  'Flurry of Destruction - Very rarely, Diablo will start casting a flurry of homing fire balls that call down meteors from the sky for every bounce they do, dealing insanely high amounts of physical and fire damage.':
    '毁灭乱舞 - 迪亚布罗会极少数情况下开始施放一阵追踪火球；火球每次弹跳都会从天上召下陨石，造成极高物理和火焰伤害。',
  'Stream of Lightning - His old spell is now powerful than ever before. He casts his stream of lightning every 6 seconds, dealing prohibitively high amounts of physical and lightning damage.':
    '闪电洪流 - 他的旧法术如今比以往更强。每 6 秒施放一次闪电洪流，造成极高物理和闪电伤害。',
  'Passives - Diablo pierces 100% of your elemental resistances.': '被动 - 迪亚布罗会穿透你 100% 元素抗性。',
  "Doomsday Angels (SP only) - Not all hope is lost when fighting Diablo. Very rarely after damaging Diablo (with a cooldown of 10 seconds), angels from the high heavens will appear on the battlefield. After they inevitably get obliterated by Diablo's arsenal, they will empower all nearby players and their minions for a short period of time, allowing you to damage Diablo himself.":
    '末日天使（仅 SP）- 与迪亚布罗战斗时并非全无希望。伤害迪亚布罗后（10 秒冷却），极少数情况下高阶天堂的天使会出现在战场上。当它们不可避免地被迪亚布罗的力量毁灭后，会在短时间内强化附近所有玩家及其仆从，使你能够伤害迪亚布罗本体。',
  "Doomsday Angels (LAN only) - Not all hope is lost when fighting Diablo. Very rarely after damaging Diablo (with a cooldown of 10 seconds), angels from the high heavens will appear on the battlefield. After they inevitably get obliterated by Diablo's arsenal, they will weaken Diablo, allowing you to damage him.":
    '末日天使（仅 LAN）- 与迪亚布罗战斗时并非全无希望。伤害迪亚布罗后（10 秒冷却），极少数情况下高阶天堂的天使会出现在战场上。当它们不可避免地被迪亚布罗的力量毁灭后，会削弱迪亚布罗，使你能够伤害他。',
  "The world believed him undone. His body crumbled, his essence scattered as the Worldstone shattered, its ancient power unraveled in a cascade of celestial ruin. Baal had not perished, he had been absorbed into the very heart of creation. For years, his essence laid dormant, dispersed across the fragments of the Worldstone. But with every war, every act of destruction upon Sanctuary, his power slowly reformed, feeding off the chaos, the ruin, the unraveling of the world he once sought to corrupt. The cracks in reality deepened, the echoes of his will whispering through the fabric of existence itself. And then, the final fracture came. Baal rose again, no longer bound by a Prime Evil's flesh, no longer merely a demon lord. He was something greater now - something no longer of Hell, nor of Sanctuary, but of the broken foundation of the world itself. He did not simply command Destruction - he is now Destruction incarnate, more powerful than ever before.":
    '世人以为他已经终结。世界之石破碎时，他的躯体崩解，本质散落，古老力量在天界般的毁灭洪流中瓦解。巴尔并未消亡，而是被吸入创世核心。多年间，他的本质潜伏沉睡，散布于世界之石碎片之中。但庇护之地上的每一场战争、每一次毁灭，都让他的力量缓慢重组，以混乱、废墟和世界崩解为食。现实裂隙日益加深，他意志的回声在存在结构中低语。最终裂痕到来，巴尔再度崛起，不再受三大魔神之肉身束缚，也不再只是恶魔领主。他如今是更伟大的存在，既非地狱之物，也非庇护之地之物，而是世界破碎根基本身的产物。他不只是号令毁灭，他如今就是毁灭化身，比以往更强。',
  'Invincibility - As his name states, Baal is completely invincible to any damage and his immunities cannot be broken by regular means.':
    '无敌 - 正如其名，巴尔完全免疫任何伤害，且其免疫无法用常规手段打破。',
  "Chain Lightning - Baal's primary ability is a chain lightning that deals very high lightning damage, able to bounce from thin air and seek nearby enemies multiple times.":
    '连锁闪电 - 巴尔的主要技能是连锁闪电，造成极高闪电伤害，可从空处弹跳并多次追踪附近敌人。',
  'Cold Wave - Baal has a low chance to summon his most destructive cold wave yet, dealing high amounts of cold and physical damage. The wave periodically generates reverberations that seek nearby players.':
    '寒波 - 巴尔有较低几率召唤迄今最毁灭性的寒波，造成高额冰冷和物理伤害。寒波会周期性产生回响，追踪附近玩家。',
  'Meteor Prison - Roughly every 8 seconds, Baal will cast a devastating circle of meteors converging upon the unsuspecting target, dealing devastating physical and fire damage to anyone affected.':
    '陨石牢笼 - 大约每 8 秒，巴尔会施放一圈毁灭性的陨石，向毫无防备的目标汇聚，对受影响者造成毁灭性物理和火焰伤害。',
  'Passives - Baal pierces 100% of your elemental resistances.': '被动 - 巴尔会穿透你 100% 元素抗性。',
  'Weakening Tower (SP only) - Not all hope is lost when fighting Baal. Roughly ever 13 seconds, Baal will summon demonic towers with a devastating meteor attack to aid him into battle. Upon death, towers empower nearby players and their minions, making them able to damage Baal himself.':
    '削弱塔（仅 SP）- 与巴尔战斗时并非全无希望。大约每 13 秒，巴尔会召唤带有毁灭性陨石攻击的恶魔塔协助战斗。塔死亡时会强化附近玩家和仆从，使其能够伤害巴尔本体。',
  'Weakening Tower (LAN only) - Not all hope is lost when fighting Baal. Roughly ever 13 seconds, Baal will summon demonic towers with a devastating meteor attack to aid him into battle. Upon death, towers weaken Baal, making you and your allies able to damage him.':
    '削弱塔（仅 LAN）- 与巴尔战斗时并非全无希望。大约每 13 秒，巴尔会召唤带有毁灭性陨石攻击的恶魔塔协助战斗。塔死亡时会削弱巴尔，使你和盟友能够伤害他。',
  "Baal's Demonic Horn": '巴尔的恶魔之角',
  'Guardians of Time - The Icecrown Citadel (The Edge of Eternity)': '时间守卫 - 冰冠堡垒（永恒边缘）',
  'Long ago, three warriors stood as the final guardians of Mount Arreat, sworn to keep the Worldstone from the hands of the unworthy. Korlic, Talic, and Madawc, champions of an age long past, stood against all who dared trespass. They were not driven by hatred nor by conquest - they were bound by duty, a sacred oath that transcended even death. But duty is a cruel master. When the Worldstone shattered, the power they once protected was lost, and with it, their purpose. Their bodies crumbled, their spirits dissolved into the void… or so the world believed. What the Nephalem did not realize was that the Ancients were never truly mortal. For centuries that passed in an instant, they drifted outside reality, watching as Sanctuary fell further into corruption. They saw humanity - the very children of the Worldstone - abandon their purpose, wielding their forbidden Nephalem power as if they were gods. They saw the wars, the betrayal, the reckless destruction of the balance once held sacred. And in the void, a new purpose took root. The Ancients did not return as protectors. They returned as executioners.':
    '很久以前，三名战士作为亚瑞特山最后的守卫者而立，誓言不让不配者染指世界之石。科力克、塔力克与马道克，这些逝去年代的勇士，抵挡所有胆敢闯入者。他们并非受仇恨或征服驱使，而是被职责束缚，那是超越死亡的神圣誓言。但职责是残酷的主人。世界之石破碎时，他们曾守护的力量消失了，随之消失的还有他们的使命。世人以为他们的躯体崩毁，灵魂溶入虚空。奈非天没有意识到，远古人从来不是真正的凡人。对现实之外的他们而言，百年不过一瞬；他们看着庇护之地愈发腐化，看着人类这些世界之石的子嗣抛弃使命，像神明一样挥舞禁忌的奈非天力量。他们看见战争、背叛，以及对曾经神圣平衡的鲁莽毁坏。于是，在虚空中，新的使命扎根。远古人归来时不再是守护者，而是处刑者。',
  'Invincibility - The returned ancients are being of immense power, controlling time itself. Their attacks deal equal parts of physical and magic damage. You cannot damage them by regular means.':
    '无敌 - 归来的远古人拥有巨大力量，掌控时间本身。他们的攻击造成等量物理和魔法伤害。你无法用常规手段伤害他们。',
  Korlic: '科力克',
  'Cataclysm - Korlic will occasionally cast a devastating attack, raining down an avalanche of rocks from the sky, dealing immense physical damage to anyone affected.':
    '灾变 - 科力克会偶尔施放毁灭性攻击，从天空降下岩石雪崩，对受影响者造成巨大物理伤害。',
  'Converging Axes - He sometimes conjures axes from thin air that converge upon their target. Anyone caught in the middle is sure to meet a quick death.':
    '汇聚飞斧 - 他有时会凭空召唤飞斧，向目标汇聚。任何被夹在中间的人都会迅速死亡。',
  'Passives - Upon taking damage, Korlic has a chance to charge at the enemy.': '被动 - 受到伤害时，科力克有几率冲向敌人。',
  "Heaven's Light (SP only) - Upon damaging Korlic, there's a small chance of heaven intervening, summoning balls of pure light. Upon touching them, you and nearby affected allies are empowered.":
    '天之光（仅 SP）- 伤害科力克时，有小几率触发天堂干预，召唤纯净光球。触碰后，你和附近受影响的盟友会被强化。',
  "Heaven's Light (LAN only) - Upon damaging Korlic, there's a small chance of heaven intervening, summoning balls of pure light. Upon touching them, the eternal ancients are partially weakened.":
    '天之光（仅 LAN）- 伤害科力克时，有小几率触发天堂干预，召唤纯净光球。触碰后，永恒远古人会被部分削弱。',
  Talic: '塔力克',
  'Axe Prison - Talic will sometimes conjure several nova of axes, seeking the unsuspecting target, dealing massive physical and magic damage.':
    '飞斧牢笼 - 塔力克有时会召唤数圈飞斧新星，追踪毫无防备的目标，造成大量物理和魔法伤害。',
  'Eternal Pendulum (SP only) - Upon attacking in melee, Talic has a chance to summon Eternal Pendulums. The Pendulums summon the sands of time, which seek nearby enemies, dealing devastating physical damage and stunning the target for a short time. Upon killing the Pendulum, you and nearby allies are empowered.':
    '永恒钟摆（仅 SP）- 近战攻击时，塔力克有几率召唤永恒钟摆。钟摆会召来时间之砂，追踪附近敌人，造成毁灭性物理伤害并短暂击晕目标。击杀钟摆后，你和附近盟友会被强化。',
  'Eternal Pendulum (LAN only) - Upon attacking in melee, Talic has a chance to summon Eternal Pendulums. The Pendulums summon the sands of time, which seek nearby enemies, dealing devastating physical damage and stunning the target for a short time. Upon killing the Pendulum, the eternal ancients are partially weakened.':
    '永恒钟摆（仅 LAN）- 近战攻击时，塔力克有几率召唤永恒钟摆。钟摆会召来时间之砂，追踪附近敌人，造成毁灭性物理伤害并短暂击晕目标。击杀钟摆后，永恒远古人会被部分削弱。',
  Madawc: '马道克',
  "Magic Axe - Madawc's primary attack is a magic axe that homes into nearby targets, dealing devastating magic and physical damage.":
    '魔法斧 - 马道克的主要攻击是会追踪附近目标的魔法斧，造成毁灭性魔法和物理伤害。',
  'Magic Axe Flurry - Occasionally, Madawc will enrage, starting throwing magic axes in a rapid fashion.':
    '魔法斧乱舞 - 马道克会偶尔激怒，开始快速投掷魔法斧。',
  'Magic Axe Nova - Very rarely, Madawc will tap into the power of time itself, summoning a devastating nova of magic axes that remain suspended in walls, seeking nearby players after a short time.':
    '魔法斧新星 - 马道克极少数情况下会汲取时间本身的力量，召唤毁灭性魔法斧新星；魔法斧会悬停在墙中，并在短时间后追踪附近玩家。',
  "Timeless - The returned ancients are enraged by the state of sanctuary, making them absolutely immortal to all damage. Once you have both the empowering effects of the Eternal Pendulum and Heaven's Light, you will be able to damage them.":
    '永恒 - 归来的远古人因庇护之地的现状而愤怒，因此对所有伤害完全不朽。只有同时拥有永恒钟摆与天之光的强化效果后，你才能伤害他们。',
  'Eternal Hourglass of Timeless Sand (Unique Large Charm)': '永恒沙漏（暗金大型护身符）',
  '(you need to kill them all to forge it)': '（需要将他们全部击杀才能锻造）',
  "The boundaries between worlds are not as unbreakable as the scholars of Sanctuary once believed. The Worldstone stood as the anchor of reality, a divine barrier that separated Sanctuary from the influence of both the High Heavens and the Burning Hells. But when Tyrael shattered it, that barrier was forever weakened. And something else took notice. Far beyond the realms of the Eternal Conflict, in a world consumed by war and death, the Lich King ruled in cold silence. His dominion was absolute, his legions endless, yet the hunger for conquest knows no borders. For death is not confined to a single world, and the power of the Worldstone's destruction echoed through the void between realities, calling to something beyond Sanctuary's understanding. The Lich King does not seek to burn the world like the Prime Evils, nor to corrupt it with lies. He seeks to claim it. The Burning Hells revel in chaos; he brings order through death. The Heavens fight for justice; he believes justice is an illusion. To him, all things end in undeath, and even the angels and demons who have warred since time immemorial will bow before the frozen silence of eternity. Will you not put an end to his reign, he will enslave all of sanctuary. This is the end of all things.":
    '世界之间的边界，并不像庇护之地学者曾经相信的那样不可打破。世界之石曾是现实的锚点，是将庇护之地与高阶天堂和燃烧地狱影响隔开的神圣屏障。但当泰瑞尔击碎它时，那屏障便永远削弱了。还有别的存在注意到了这一点。在永恒之战远方，在一个被战争与死亡吞噬的世界里，巫妖王于冰冷沉默中统治。他的支配绝对，军团无尽，而征服的饥渴没有边界。死亡并不局限于单一世界，世界之石毁灭的力量回响于现实之间的虚空，呼唤着某种超出庇护之地理解的存在。巫妖王不像三大魔神那样要焚毁世界，也不以谎言腐化世界。他要占有它。燃烧地狱沉溺混乱，而他以死亡带来秩序。天堂为正义而战，而他认为正义只是幻象。对他而言，万物终将归于亡灵；自太古以来征战不休的天使与恶魔，也会在永恒的冰封沉默前屈膝。若不终结他的统治，他将奴役整个庇护之地。这就是万物的终结。',
  "Converging Cold - Lich King's regular ability is a converging nova of 6 cold spikes that deal very high cold and physical damage to anyone hit.":
    '汇聚冰冷 - 巫妖王的常规技能是由 6 枚冰刺组成的汇聚新星，对命中的目标造成极高冰冷和物理伤害。',
  "Cold Nova - Lich King's secondary ability is a fast moving cold wave that deals extremely high physical and cold damage to anyone hit.":
    '冰冷新星 - 巫妖王的次要技能是一道快速移动的寒波，对命中的目标造成极高物理和冰冷伤害。',
  'Pounce - Roughly every 10 seconds, the Lich King will assault an unsuspecting target, releasing a nova of pure energy, knockbacking nearby enemies, followed shortly by Eternal Winter .':
    '扑袭 - 大约每 10 秒，巫妖王会突袭毫无防备的目标，释放纯能量新星击退附近敌人，随后紧接永恒的冬天。',
  "Eternal Winter - Rarely, in addition to Pounce's followup, the Lich King will release a deadly nova of blue fire that siphons the souls of anyone affected, dealing extremely high amounts of physical and cold damage, reducing cold resistance by 150%, physical resist by 75% and slowing affected players to a crawl. This spell is announced with an audio cue.":
    '永恒的冬天 - 除扑袭后的追击外，巫妖王还会罕见地释放致命蓝火新星，吸取受影响者的灵魂，造成极高物理和冰冷伤害，降低 150% 冰冷抗性、75% 物理抗性，并将受影响玩家减速到几乎无法行动。此法术会有音效提示。',
  'Summon Undead - Roughly every 20 seconds, the Lich King will summon 4 ghouls and 1 abomination to aid him in battle.':
    '召唤亡灵 - 大约每 20 秒，巫妖王会召唤 4 个食尸鬼和 1 个憎恶协助作战。',
  'Shadow Trap - Upon taking damage, the Lich King has a chance to summon a shadow trap beneath the attacking player. After a short period, the shadow trap arms itself and releases a wave of Eternal Winter fires once it is stepped on.':
    '暗影陷阱 - 受到伤害时，巫妖王有几率在攻击者脚下召唤暗影陷阱。短暂时间后陷阱会完成启动，一旦被踩中就释放一波永恒冬火。',
  Ghouls: '食尸鬼',
  'Ghouls possess the spirit of the undead, regenerating very rapidly. They also have a chance to charge at their target when hurt.':
    '食尸鬼拥有亡灵之魂，会快速恢复。受伤时也有几率冲向目标。',
  Abominations: '憎恶',
  "The abomination is immune to all damage and its immunity cannot be broken by regular means. Upon taking damage, the abomination has a chance to enrage, increasing either its damage or movement speed. Very rarely upon taking damage, the abomination will cause the heavens to aid the player in battle, sending the Heaven's Light . Upon picking up the light, the player can damage the abomination and kill it.":
    '憎恶免疫所有伤害，且免疫无法用常规手段打破。受到伤害时，憎恶有几率激怒，提高伤害或移动速度。极少数情况下，受到伤害会引发天堂援助玩家作战，降下天之光。拾取光芒后，玩家即可伤害并击杀憎恶。',
  Valkyries: '女武神',
  'Upon taking damage (with a 15 seconds cooldown), the Lich King has a small chance to summon Valkyries to aid him in battle. The Valkyries deal high amounts of physical and cold damage.':
    '受到伤害时（15 秒冷却），巫妖王有小几率召唤女武神协助作战。女武神造成高额物理和冰冷伤害。',
  "Upon killing them, they will empower nearby players with the Light's Hope (SP only)": '击杀她们后，会用光明希望强化附近玩家（仅 SP）',
  "Upon killing them, they will weaken nearby enemies with Light's Hope (LAN only)": '击杀她们后，会用光明希望削弱附近敌人（仅 LAN）',
  "Timeless - Being a being from outside of Sanctuary's space and time, The Lich King is absolutely immortal to this world's damage. In order to be able to damage him, you need to possess both the effects of Light's Hope and Heaven's Light .":
    '永恒 - 巫妖王来自庇护之地时空之外，因此对这个世界的伤害完全不朽。若要伤害他，你需要同时拥有光明希望和天之光的效果。',
  'Uber Variant - Playing this fight on /players 8 will activate the uber variant and all enemies will be empowered as following.':
    '超级变体 - 以 8 人难度进行此战会激活超级变体，所有敌人会获得以下强化。',
  'The Lich King - The Lich King will summon 3 times more ghouls and abominations.': '巫妖王 - 巫妖王会召唤 3 倍数量的食尸鬼和憎恶。',
  'Ghouls - Ghouls now enrage with every hit, gaining 25% physical and cold damage. This effect stacks.':
    '食尸鬼 - 食尸鬼现在每次命中都会激怒，获得 25% 物理和冰冷伤害。此效果可叠加。',
  'Valkyries - The Lich King summons 6 valkyries instead of 2 and they deal two times more damage.':
    '女武神 - 巫妖王会召唤 6 名女武神而不是 2 名，且她们造成双倍伤害。',
  'Special Mythical Unique': '特殊神话暗金',
  'If you manage to kill The Lich King on players 8, you will be able to transmute your Ascendancy Stone with a Null Rune for a bonus +1 to All Skills .':
    '如果你能在 8 人难度击杀巫妖王，就可以将升华之石与 Null Rune 合成，获得 +1 所有技能加成。',
  'This recipe can only be done once.': '此公式只能完成一次。',
  'Rathma - The Sanctum of the Dead (The Crepuscular Basilica)': '拉斯玛 - 亡者圣所（昏暮圣殿）',
  "Beneath the dying light of Sanctuary, the heroes descended into the Sanctum of the Dead, a labyrinth of bone and whispering ash buried deep within the underworld. The air shimmered with trapped souls, their pale glow painting the black marble in spectral hues. They came seeking Rathma, the First Necromancer. Once guardian of balance, now its betrayer. The balance he once served had withered into obsession; he sought to unmake death, to master both ends of eternity. At his side stood Kor'nac, the Hollow Apostle, his most loyal revenant draped in the vestments of a forgotten faith. Flesh falling from his bone, and each word etched into his flesh pulsed with forbidden grace. His voice was a dirge that made even the spirits falter. Steel, flame, and faith met shadow and decay in that place where life had no meaning. The heroes knew they faced not just death, but its architect.":
    '在庇护之地将熄的光芒下，英雄们深入亡者圣所，那是一座由白骨与低语灰烬构成、深埋地底世界的迷宫。空气因被困灵魂而闪烁，苍白光辉在黑色大理石上染出幽魂般的色彩。他们前来寻找拉斯玛，第一位死灵法师。曾经的平衡守护者，如今成了背叛者。他曾服务的平衡枯萎为执念；他试图拆解死亡，掌控永恒两端。身旁站着科纳克，空洞使徒，他最忠诚的亡魂仆从，披着被遗忘信仰的法衣。血肉从骨上剥落，刻入血肉的每个字都涌动禁忌恩典。他的声音如挽歌，连灵魂也为之动摇。钢铁、火焰与信仰在这生命毫无意义之地，与阴影和腐朽交锋。英雄们知道，他们面对的不只是死亡，而是死亡的设计者。',
  'Veil of the Dead - Rathma emits an aura that prevents heroes from using teleport skills.':
    '亡者帷幕 - 拉斯玛散发光环，阻止英雄使用传送技能。',
  "Bone Spear Flurry / Poison Wraths - Rathma's will alternate between a flurry of 3 bone spears and a flurry of 3 poison wraths, both dealing devastating magic and poison damage respectively.":
    '骨矛乱舞 / 毒怒 - 拉斯玛会在 3 发骨矛乱舞和 3 发毒怒乱舞之间交替施放，分别造成毁灭性的魔法和毒素伤害。',
  'Bone Spirit - Rathma will rarely cast a bone spirit that speeds up over time. On hit, it deals extremely high amounts of magic damage.':
    '骨灵 - 拉斯玛会罕见地施放随时间加速的骨灵。命中时造成极高魔法伤害。',
  'Bone Prison - Roughly every 20 seconds, when in relatively close proximity to Rathma, he will raise a labyrinth of bones around you with limited ways out. If you do not escape this labyrinth in time, he will detonate the area, killing you instantly . After he detonates the area, he raises the Living Dead from the desecrated ground.':
    '骨牢 - 大约每 20 秒，当你距离拉斯玛较近时，他会在你周围升起一座白骨迷宫，出口有限。若未能及时逃离，他会引爆该区域并瞬间杀死你。引爆后，他会从亵渎之地唤起活死人。',
  'Summon Withering Efigies (SP only) - Every 20 seconds, Rathma raises 4 withering effigies that cast a stacking debuff on the player, lowering their magic resistance and movement speed . If you kill them before they crumble on their own, you and nearby allies are empowered for 10 seconds.':
    '召唤凋零雕像（仅 SP）- 每 20 秒，拉斯玛会升起 4 个凋零雕像，对玩家施加可叠加减益，降低魔法抗性和移动速度。若在其自行崩解前击杀它们，你和附近盟友会被强化 10 秒。',
  'Summon Withering Efigies (LAN only) - Every 20 seconds, Rathma raises 4 withering effigies that cast a stacking debuff on the player, lowering their magic resistance and movement speed . If you kill them before they crumble on their own, nearby enemies are weakened for 10 seconds.':
    '召唤凋零雕像（仅 LAN）- 每 20 秒，拉斯玛会升起 4 个凋零雕像，对玩家施加可叠加减益，降低魔法抗性和移动速度。若在其自行崩解前击杀它们，附近敌人会被削弱 10 秒。',
  "Kor'nac, The Hollow Apostle": '科纳克，空洞使徒',
  "Kor'nac is Rathma's most loyal servant, aiding him in battle at all times.": '科纳克是拉斯玛最忠诚的仆从，会始终协助他作战。',
  "Devastating Slam - Occasionally, Kor'nac slams the ground, sending devastating shockwaves that deal extremely high physical damage.":
    '毁灭重击 - 科纳克会偶尔猛击地面，释放毁灭性冲击波，造成极高物理伤害。',
  "Rising Hatred - As time passes, Kor'nac becomes more powerful, gaining increased movement speed and improving his slam.":
    '高涨憎恨 - 随时间推移，科纳克会变得更强，获得更高移动速度并强化重击。',
  'Living Dead': '活死人',
  'The Living Dead are not difficult to dispatch, but they have a small chance to charge at the enemy when hurt.':
    '活死人并不难处理，但受伤时有小几率冲向敌人。',
  'Burning Soul (SP only) - When killed, the living dead leave behind their agonizing soul. Picking it up empowers you for 10 seconds.':
    '燃烧灵魂（仅 SP）- 被击杀时，活死人会留下痛苦灵魂。拾取后会强化你 10 秒。',
  'Burning Soul (LAN only) - When killed, the living dead leave behind their agonizing soul. Picking it up weakens nearby enemies for 10 seconds.':
    '燃烧灵魂（仅 LAN）- 被击杀时，活死人会留下痛苦灵魂。拾取后会削弱附近敌人 10 秒。',
  "Timeless - Rathma is the master of the undead and has attained boundless power, making him invincible. Only when you have the empowerment from the effigies and the living dead's souls you may be able to damage him. Rathma extends his invincibility aura to his most trusted servant, Kor'nac.":
    '永恒 - 拉斯玛是亡灵大师，已获得无边力量，因此处于无敌状态。只有拥有雕像和活死人灵魂提供的强化后，你才可能伤害他。拉斯玛会将无敌光环延伸至他最信任的仆从科纳克。',
  'Rathma - On reaching 25% current health, Rathma will enrage, sending area wide shockwaves, gaining increased casting speed and raining down meteors that deal devastating physical and fire damage.':
    '拉斯玛 - 当前生命降至 25% 时，拉斯玛会激怒，释放全区域冲击波，获得更高施法速度，并降下造成毁灭性物理和火焰伤害的陨石雨。',
  'The Living Dead - The Living Dead will also gain 500% bonus damage when charging and their charging effect will last three times longer.':
    '活死人 - 活死人冲锋时还会获得 500% 额外伤害，冲锋效果持续时间变为三倍。',
  "Kor'nac, The Hollow Apostle - Kor'nac will enrage at a twice faster rate.": '科纳克，空洞使徒 - 科纳克的激怒速度变为两倍。',
  "If you manage to kill both Rathma and Kor'nac, The Hollow Apostle within one minute of each other, you will be able to transmute Rathma's Eternal Skull with itself to gain the following bonuses:":
    '如果你能在一分钟内相继击杀拉斯玛和科纳克，空洞使徒，就可以将拉斯玛的永恒颅骨与自身合成，获得以下加成：',
  'Lucion - The Altar of Doomed Salvation (The Reliquary of False Light)': '卢西恩 - 注定救赎祭坛（虚假之光圣匣）',
  "Lucion, the son of Mephisto and brother of Lilith, was once banished to the abyss after his failed bid to enslave Sanctuary under demonic order. But pure evil never dies, it festers. Through the corrupted faith of a forgotten cult, Lucion's essence was rekindled in secret, his soul bound to the embers of a dying world. Now reborn in a form of living flame, he seeks vengeance upon the living, believing the mortal realm should burn as the crucible for a new creation forged in his image. Every soul consumed strengthens his infernal light, feeding a fire that threatens to consume all existence. Only by severing his tether to the mortal plane and extinguishing the infernal core that fuels him can Lucion be stopped. Should he ascend beyond his current form, even the Prime Evils themselves would tremble before his wrath.":
    '卢西恩是墨菲斯托之子、莉莉丝之兄，曾因试图以恶魔秩序奴役庇护之地失败而被放逐深渊。但纯粹邪恶永不死去，只会溃烂。通过某个被遗忘教团的腐化信仰，卢西恩的本质在暗中被重新点燃，他的灵魂被束缚在将死世界的余烬中。如今他以活焰之形重生，向生者寻求复仇，认为凡人国度应作为熔炉燃烧，以他的形象锻造新的造物。每个被吞噬的灵魂都会强化他的炼狱之光，喂养威胁吞噬一切存在的火焰。唯有切断他与凡世位面的系绳，并熄灭驱动他的炼狱核心，才能阻止卢西恩。若他超越当前形态升华，就连三大魔神也会在他的怒火前颤抖。',
  'Firestorm - One of the regular attacks Lucion performs is a devastating firestorm that burns everything in its path.':
    '火焰风暴 - 卢西恩的常规攻击之一是毁灭性火焰风暴，会焚烧路径上的一切。',
  'Meteor Line - Lucion will alternate his Firestorm attack with an attack that summons a line of meteors which deal immense fire and physical damage.':
    '陨石线 - 卢西恩会在火焰风暴与召唤一列陨石的攻击之间交替，陨石造成巨大火焰和物理伤害。',
  'Fiery Pounce - Lucion pounces on an unsuspecting target roughly every 8 seconds, releasing a devastating converging fire nova. The fire bolts converge after a short period, dealing three times more damage than the initial nova, so it must be dodged at all costs.':
    '炽焰扑袭 - 卢西恩大约每 8 秒扑向毫无防备的目标，释放毁灭性的汇聚火焰新星。火焰弹会在短时间后汇聚，造成初始新星三倍伤害，因此必须不惜一切代价躲开。',
  'Fire Stampede - Every time Lucion pounces, he summons a tempest of fire bolts to fill the room. The bolts deal devastating fire damage.':
    '火焰奔涌 - 卢西恩每次扑袭都会召唤火焰弹风暴填满房间。火焰弹造成毁灭性火焰伤害。',
  'Summon Religious Fanatics - Rarely, Lucion will summon 10 religious fanatics to serve him in battle. The fanatics apply a stacking debuff that increase the physical and elemental damage taken.':
    '召唤宗教狂热者 - 卢西恩会罕见地召唤 10 名宗教狂热者为他作战。狂热者会施加可叠加减益，提高受到的物理和元素伤害。',
  'Cleansing Flames (SP only) - Roughly every 8 seconds, Lucion will conjure cleansing flames around him, dealing moderately high damage to anyone touching them. Stepping into them empowers you.':
    '净化火焰（仅 SP）- 大约每 8 秒，卢西恩会在周围召唤净化火焰，对触碰者造成中高伤害。踏入火焰会强化你。',
  'Cleansing Flames (LAN only) - Roughly every 8 seconds, Lucion will conjure cleansing flames around him, dealing moderately high damage to anyone touching them. Stepping into them weakens nearby enemies.':
    '净化火焰（仅 LAN）- 大约每 8 秒，卢西恩会在周围召唤净化火焰，对触碰者造成中高伤害。踏入火焰会削弱附近敌人。',
  'Summon High Priests - Roughly every 15 seconds after being hit, Lucion summons 4 high priests to aid him in battle':
    '召唤大祭司 - 被击中后，大约每 15 秒卢西恩会召唤 4 名大祭司协助作战',
  'High Priests': '大祭司',
  'The High Priests are highly specialized spellcasters that serve Lucion.': '大祭司是侍奉卢西恩的高度专精施法者。',
  'Fiery Ball - Their regular attack is a ball of fire that scorches the ground upon impact and which deals high amounts of fire damage.':
    '炽焰球 - 他们的常规攻击是火球，命中时灼烧地面并造成高额火焰伤害。',
  'Demonic Empowerment - Occasionally, they empower the nearby allies, increasing their damage and attack/cast speed by 3%. This effect stacks.':
    '恶魔强化 - 他们会偶尔强化附近盟友，使伤害和攻击/施法速度提高 3%。此效果可叠加。',
  'Light Empowerment (SP only) - On death, the high priests empower nearby players.': '光明强化（仅 SP）- 死亡时，大祭司会强化附近玩家。',
  'Light Empowerment (LAN only) - On death, the high priests weaken nearby enemies.': '光明强化（仅 LAN）- 死亡时，大祭司会削弱附近敌人。',
  'Religious Fanatics': '宗教狂热者',
  'Religious Fanatics are highly aggressive servants of Lucion.': '宗教狂热者是卢西恩极具攻击性的仆从。',
  'Glacial Spike/Lightning - When not running toward you to rip you to shreds, they cast a highly damaging cold/lightning spell that pierces everything.':
    '冰霜尖刺/闪电 - 当他们没有冲向你将你撕碎时，会施放高伤害冰冷/闪电法术，穿透一切。',
  'Timeless - Lucion is a hellish beast of immense power which makes him invincible to regular attacks. In order to be able to damage him, you need to have both the effects from Light Empowerment and Cleansing Flames .':
    '永恒 - 卢西恩是拥有巨大力量的地狱兽，使他对常规攻击无敌。若要伤害他，你需要同时拥有光明强化和净化火焰效果。',
  'Lucion - Lucion emits a demonic aura that increases the damage of him and his allies by 5% and their attack and cast speed by 2% every 20 seconds. This effect stacks indefinitely.':
    '卢西恩 - 卢西恩散发恶魔光环，每 20 秒使自身和盟友的伤害提高 5%，攻击和施法速度提高 2%。此效果无限叠加。',
  "High Priests - The high priests' buff is now twice as powerful, increasing damage and attack/cast speed by 6% instead of 3%.":
    '大祭司 - 大祭司的增益现在强度翻倍，使伤害和攻击/施法速度提高 6%，而不是 3%。',
  'Religious Fanatics - Lucion summons 20 religious fanatics instead of 10.': '宗教狂热者 - 卢西恩会召唤 20 名宗教狂热者，而不是 10 名。',
  '(see Legendary Components section for the list of bonuses)': '（加成列表见传奇组件章节）',
  "If you manage to kill Lucion on players 8, he will drop his essence ( Lucion's Essence ). The essence is a more powerful version of a Socket Donut.":
    '如果你能在 8 人难度击杀卢西恩，他会掉落他的精华（卢西恩的精华）。该精华是更强力版本的镶孔甜甜圈。',
};

const guideItemTypeCodeTranslations: Readonly<Record<string, string>> = {
  amul: '项链',
  arrm: '弓箭袋',
  armo: '护甲',
  belt: '腰带',
  boqm: '弩矢袋',
  boot: '靴子',
  circ: '头环',
  claw: '爪',
  cloa: '斗篷',
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
  npol: '死灵法师长柄武器',
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
  thro: '投掷武器',
  wand: '魔杖',
  weap: '武器',
  xbow: '弩',
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

let normalizedGuideExactTranslations: Readonly<Record<string, string>> | null = null;

function getNormalizedGuideExactTranslations(): Readonly<Record<string, string>> {
  if (normalizedGuideExactTranslations) return normalizedGuideExactTranslations;

  const normalizedEntries: Record<string, string> = {};
  for (const [source, target] of Object.entries({ ...guideExactTranslations, ...guideEndgameExactTranslations })) {
    normalizedEntries[normalizeGuideTranslationKey(source)] = target;
  }
  normalizedGuideExactTranslations = normalizedEntries;
  return normalizedGuideExactTranslations;
}

function translateGuideExactText(normalized: string): string {
  const exact = guideExactTranslations[normalized];
  if (exact) return exact;

  const endgameExact = guideEndgameExactTranslations[normalized];
  if (endgameExact) return endgameExact;

  const normalizedExact = getNormalizedGuideExactTranslations()[normalized];
  if (normalizedExact) return normalizedExact;

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

function translateGuideAndListText(normalized: string): string | null {
  if (!/\s+and\s+/iu.test(normalized)) return null;
  if (/[.!?]/u.test(normalized)) return null;

  const parts = normalized.split(/\s+and\s+/iu);
  if (parts.length < 2) return null;
  if (!parts.every((part) => part.length <= 48 && /^[A-Za-z0-9][A-Za-z0-9' /()+.-]*$/u.test(part))) return null;

  const translatedParts = parts.map((part) => translateGuideCompositeText(part.trim()));
  if (translatedParts.every((part, index) => part === parts[index]?.trim())) return null;
  return translatedParts.join('和');
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

  const areaLevelMatch = /^(.+?)\s+Level\s+(\d+(?:&\d+)?)$/iu.exec(normalized);
  if (areaLevelMatch) {
    const translatedArea = translateGuideCompositeText(areaLevelMatch[1]);
    if (translatedArea !== areaLevelMatch[1]) return `${translatedArea}第 ${areaLevelMatch[2].replace('&', ' 和 ')} 层`;
  }

  const levelDashMatch = /^Level\s+(\d+)-(\d+)$/iu.exec(normalized);
  if (levelDashMatch) return `第 ${levelDashMatch[1]}-${levelDashMatch[2]} 层`;

  const actMatch = /^Act\s+(\d+)$/iu.exec(normalized);
  if (actMatch) return `第 ${actMatch[1]} 幕`;

  const tierMatch = /^Tier\s+(\d+)$/iu.exec(normalized);
  if (tierMatch) return `${tierMatch[1]} 阶`;

  const tierRecipeMatch = /^Each tier\s+(\d+)\s+recipe consumes\s+(\d+)\s+souls per use\.$/iu.exec(normalized);
  if (tierRecipeMatch) return `每次使用 ${tierRecipeMatch[1]} 阶公式会消耗 ${tierRecipeMatch[2]} 个灵魂。`;

  const itemsMatch = /^\((\d+)\s+items?\)$/iu.exec(normalized);
  if (itemsMatch) return `（${itemsMatch[1]} 件）`;

  const socketMatch = /^\((\d+)\s+Sockets?\)$/iu.exec(normalized);
  if (socketMatch) return `（${socketMatch[1]} 孔）`;

  const requiredLevelMatch = /^\(Required Level\s+(.+)\)$/iu.exec(normalized);
  if (requiredLevelMatch) return `（需求等级 ${requiredLevelMatch[1]}）`;

  const ilvlFormulaMatch = /^\(ilvl\s*=\s*(.+)\)$/iu.exec(normalized);
  if (ilvlFormulaMatch) {
    const formula = ilvlFormulaMatch[1]
      .replace(/\bchar(?:acter)?\s+lvl\b/giu, '角色等级')
      .replace(/\bchar(?:acter)?\s+level\b/giu, '角色等级')
      .replace(/\bprevious ilvl\b/giu, '原物品等级')
      .replace(/\bitem level\b/giu, '物品等级')
      .replace(/\bany socket remains\b/giu, '保留已有镶孔')
      .replace(/\bilvl\b/giu, '物品等级')
      .replace(/\bx\b/gu, 'x');
    return `（物品等级 = ${formula}）`;
  }

  const rawIlvlFormulaMatch = /^\(ilvl\s*=\s*(.+)\)\*$/iu.exec(normalized);
  if (rawIlvlFormulaMatch) return `${translateGuideCompositeText(`(ilvl = ${rawIlvlFormulaMatch[1]})`)}*`;

  const cappedMatch = /^\(Capped at\s+(.+?)\)$/iu.exec(normalized);
  if (cappedMatch) return `（上限 ${cappedMatch[1]}）`;

  const forTargetMatch = /^\(for\s+(.+?)\)$/iu.exec(normalized);
  if (forTargetMatch) return `（用于${translateGuideCompositeText(forTargetMatch[1])}）`;

  const exceptParentheticalMatch = /^\(except\s+(.+?)\)$/iu.exec(normalized);
  if (exceptParentheticalMatch) return `（除${translateGuideCompositeText(exceptParentheticalMatch[1])}外）`;

  const exampleParentheticalMatch = /^\(ex\.\s+(.+?)\)$/iu.exec(normalized);
  if (exampleParentheticalMatch) return `（例如 ${translateGuideCompositeText(exampleParentheticalMatch[1])}）`;

  const upToRuneMatch = /^\(up to\s+(.+?)\)$/iu.exec(normalized);
  if (upToRuneMatch) return `（最高到 ${upToRuneMatch[1]}）`;

  const conversionPathMatch = /^\((.+?)\)$/u.exec(normalized);
  if (conversionPathMatch && /(?:<->|->)/u.test(conversionPathMatch[1])) {
    const translatedPath = conversionPathMatch[1]
      .split(/(\s*(?:<->|->)\s*)/u)
      .map((part) => (/^\s*(?:<->|->)\s*$/u.test(part) ? ` ${part.trim()} ` : translateGuideCompositeText(part.trim())))
      .join('')
      .replace(/\s+/gu, ' ')
      .trim();
    if (translatedPath !== conversionPathMatch[1]) return `（${translatedPath}）`;
  }

  const fullyParenthesizedMatch = /^\((.+?)\)$/u.exec(normalized);
  if (fullyParenthesizedMatch) {
    const detail = fullyParenthesizedMatch[1];
    const shouldDefer =
      /\bchance\b/iu.test(detail) ||
      /\bof selected color\b/iu.test(detail) ||
      /^Only works once$/iu.test(detail) ||
      /^At least\s+\d+\s+kills$/iu.test(detail);
    if (!shouldDefer) {
      const translatedDetail = translateGuideCompositeText(detail);
      if (translatedDetail !== detail) return `（${translatedDetail}）`;
    }
  }

  const quantityResetMatch = /^Quantity Reset To\s+(\d+)(?:\s+\((.+)\))?$/iu.exec(normalized);
  if (quantityResetMatch) {
    const target = quantityResetMatch[2] ? `（${translateGuideCompositeText(quantityResetMatch[2])}）` : '';
    return `数量重置为 ${quantityResetMatch[1]}${target}`;
  }

  const upgradedToMatch = /^Upgraded To\s+(.+)$/iu.exec(normalized);
  if (upgradedToMatch) return `升级为${translateGuideCompositeText(upgradedToMatch[1])}`;

  const convertedToFamilyMatch = /^Converted To\s+(.+?)\s+Family$/iu.exec(normalized);
  if (convertedToFamilyMatch) return `转换为${translateGuideCompositeText(convertedToFamilyMatch[1])}家族`;

  const nonWhiteFamilyMatch = /^Non-White\s+(.+?)\s+Family$/iu.exec(normalized);
  if (nonWhiteFamilyMatch) return `非白色${translateGuideCompositeText(nonWhiteFamilyMatch[1])}家族`;

  const craftTitleMatch =
    /^(Hit Power|Blood|Caster|Safety|Class|Amazon|Assassin|Barbarian|Druid|Necromancer|Paladin|Sorceress)\s+(Craft|Helm|Boots|Gloves|Belt|Shield|Body|Amulet|Ring|Weapon)$/iu.exec(
      normalized
    );
  if (craftTitleMatch) return `${translateGuideCompositeText(craftTitleMatch[1])}${translateGuideCompositeText(craftTitleMatch[2])}`;

  const mercenarySetMatch = /^(Normal|Nightmare|Hell)\s+Mercenary Set\s+(Weapon|Armor)$/iu.exec(normalized);
  if (mercenarySetMatch)
    return `${translateGuideCompositeText(mercenarySetMatch[1])}佣兵套装${translateGuideCompositeText(mercenarySetMatch[2])}`;

  const magicWeaponOtherClassMatch =
    /^Magic Weapon other than (Amazon|Assassin|Barbarian|Druid|Necromancer|Paladin|Sorceress) Weapon$/iu.exec(normalized);
  if (magicWeaponOtherClassMatch) return `非${translateGuideCompositeText(magicWeaponOtherClassMatch[1])}专属魔法武器`;

  const nonEtherealAnyMatch = /^Any\s+Non-ethereal\s+(.+)$/iu.exec(normalized);
  if (nonEtherealAnyMatch) return `任意非无形${translateGuideCompositeText(nonEtherealAnyMatch[1])}`;

  const nonEtherealAnySpaceMatch = /^Any\s+Non\s+Ethereal\s+(.+)$/iu.exec(normalized);
  if (nonEtherealAnySpaceMatch) return `任意非无形${translateGuideCompositeText(nonEtherealAnySpaceMatch[1])}`;

  const levelRequirementMatch = /^(Level Requirement|Requirement)\s+([+-]?\d+%?)$/iu.exec(normalized);
  if (levelRequirementMatch) return `${translateGuideCompositeText(levelRequirementMatch[1])} ${levelRequirementMatch[2]}`;

  const statTrailingValueMatch =
    /^(Magic Resist|Piercing Attack|Increase Max Life|Increase Max Mana|Level Requirement|Requirement|Faster Block Rate|Increased Maximum Mana|Cold Absorb|Fire Absorb|Lightning Absorb|Replenish Life|Bonus to Attack Rating|Poison Length Reduced By|Heal after Each Kill|Damage Reduced by|Slow Target|Extra Gold|Magic Damage Reduced by|Max Damage)\s+([+-]?\d+(?:-\d+)?%?)$/iu.exec(
      normalized
    );
  if (statTrailingValueMatch) return `${translateGuideCompositeText(statTrailingValueMatch[1])} ${statTrailingValueMatch[2]}`;

  const qualityItemMatch =
    /^(Normal|Exceptional|Elite|Magic|Rare|Set|Unique|Crafted|Ethereal|Low Quality|Cracked|Crude|Damaged|White|Superior)\s+(.+)$/iu.exec(
      normalized
    );
  if (qualityItemMatch && !/\bof the Same (?:Type|Mods)$/iu.test(normalized)) {
    return `${translateGuideCompositeText(qualityItemMatch[1])}${translateGuideCompositeText(qualityItemMatch[2])}`;
  }

  const sameColorAndGradeMatch = /^(\d+)\s+(.+?)s?\s+of the Same Color and Grade$/iu.exec(normalized);
  if (sameColorAndGradeMatch)
    return `${sameColorAndGradeMatch[1]} 个相同颜色和等级的${translateGuideCompositeText(sameColorAndGradeMatch[2])}`;

  const sameColorMatch = /^(\d+)\s+(.+?)s?\s+of the Same Color$/iu.exec(normalized);
  if (sameColorMatch) return `${sameColorMatch[1]} 个相同颜色的${translateGuideCompositeText(sameColorMatch[2])}`;

  const sameGradeMatch = /^(\d+)\s+(.+?)\s+of the Same Grade$/iu.exec(normalized);
  if (sameGradeMatch) return `${sameGradeMatch[1]} 个相同等级的${translateGuideCompositeText(sameGradeMatch[2])}`;

  const oneHigherGradeMatch = /^(.+?)\s+of One Higher Grade\s+\(up to\s+(.+?)\)$/iu.exec(normalized);
  if (oneHigherGradeMatch) {
    const upperLimit = oneHigherGradeMatch[2]
      .split(/\s+or\s+/iu)
      .map((part) => (/^(?:Wo|Zod)$/u.test(part) ? part : translateGuideCompositeText(part)))
      .join(' 或 ');
    return `高一级${translateGuideCompositeText(oneHigherGradeMatch[1])}（最高到${/^\p{Script=Han}/u.test(upperLimit) ? '' : ' '}${upperLimit}）`;
  }

  const canOpenerMatch = /^Can Opener\s+\((.+?)\s+Output\)$/iu.exec(normalized);
  if (canOpenerMatch) return `开罐器（输出${translateGuideCompositeText(canOpenerMatch[1])}）`;

  const sameTypeItemMatch = /^((?:\d+\s+)?)(.+?)\s+of the Same Type$/iu.exec(normalized);
  if (sameTypeItemMatch) return `${sameTypeItemMatch[1]}同类型${translateGuideCompositeText(sameTypeItemMatch[2])}`;

  const sameBaseItemMatch = /^((?:\d+\s+)?)(.+?)\s+of the Same Base Item$/iu.exec(normalized);
  if (sameBaseItemMatch) return `${sameBaseItemMatch[1]}${translateGuideCompositeText(sameBaseItemMatch[2])}同底材`;

  const sameNameItemMatch = /^(.+?)\s+of the Same Name$/iu.exec(normalized);
  if (sameNameItemMatch) return `${translateGuideCompositeText(sameNameItemMatch[1])}同名`;

  const sameModsItemMatch = /^(.+?)\s+of the Same Mods$/iu.exec(normalized);
  if (sameModsItemMatch) return `相同词缀${translateGuideCompositeText(sameModsItemMatch[1])}`;

  const selectedColorPointMatch = /^\(([-+]?\d+)\s+(.+?)\s+of selected color\)$/iu.exec(normalized);
  if (selectedColorPointMatch)
    return `（所选颜色${translateGuideCompositeText(selectedColorPointMatch[2])} ${selectedColorPointMatch[1]}）`;

  const addsSelectedColorPointsMatch = /^Adds\s+(\d+)\s+(.+?)\s+of selected color$/iu.exec(normalized);
  if (addsSelectedColorPointsMatch)
    return `增加 ${addsSelectedColorPointsMatch[1]} 点所选颜色${translateGuideCompositeText(addsSelectedColorPointsMatch[2])}`;

  const extractsSelectedColorMatch = /^Extracts\s+(.+?)\s+of selected color$/iu.exec(normalized);
  if (extractsSelectedColorMatch) return `取出所选颜色${translateGuideCompositeText(extractsSelectedColorMatch[1])}`;

  const selectedColorItemMatch = /^(.+?)\s+of selected color$/iu.exec(normalized);
  if (selectedColorItemMatch) return `所选颜色${translateGuideCompositeText(selectedColorItemMatch[1])}`;

  const ancientCouponMatch = /^(\d+)\s+(Same\s+)?Ancient Coupons?\s+\((Normal|Exceptional|Elite)\)$/iu.exec(normalized);
  if (ancientCouponMatch) {
    const same = ancientCouponMatch[2] ? '相同' : '';
    return `${ancientCouponMatch[1]} 张${same}古代券（${translateGuideCompositeText(ancientCouponMatch[3])}）`;
  }

  const averageChanceParentheticalMatch = /^(.+?)\s+\((\d+(?:\.\d+)?)%\s+chance\s+(each\s+)?on average( each)?\)$/iu.exec(normalized);
  if (averageChanceParentheticalMatch) {
    const each = averageChanceParentheticalMatch[3] || averageChanceParentheticalMatch[4] ? '每个 ' : '';
    return `${translateGuideCompositeText(averageChanceParentheticalMatch[1])}（${each ? `平均${each}` : '平均 '}${
      averageChanceParentheticalMatch[2]
    }% 几率）`;
  }

  const parentheticalSocketedFormulaMatch = /^Socketed\s+\(%i\)\s+\((.+)\)$/iu.exec(normalized);
  if (parentheticalSocketedFormulaMatch) return `镶孔 (%i) (${parentheticalSocketedFormulaMatch[1]})`;

  const parentheticalLevelChargesMatch = /^Level\s+(\d+)\s+(.+?)\s+\((\d+\/\d+)\s+Charges\)$/iu.exec(normalized);
  if (parentheticalLevelChargesMatch)
    return `等级 ${parentheticalLevelChargesMatch[1]} ${translateGuideCompositeText(parentheticalLevelChargesMatch[2])}（${
      parentheticalLevelChargesMatch[3]
    } 次）`;

  const genericParentheticalMatch = /^(.+?)\s+\(([^)]+)\)$/u.exec(normalized);
  if (genericParentheticalMatch) {
    const translatedBase = translateGuideCompositeText(genericParentheticalMatch[1]);
    const translatedDetail = translateGuideCompositeText(genericParentheticalMatch[2]);
    if (translatedBase !== genericParentheticalMatch[1] || translatedDetail !== genericParentheticalMatch[2]) {
      return `${translatedBase}（${translatedDetail}）`;
    }
  }

  const compactParentheticalMatch = /^(.+?)\(([^)]+)\)$/u.exec(normalized);
  if (compactParentheticalMatch) {
    const translatedBase = translateGuideCompositeText(compactParentheticalMatch[1]);
    const translatedDetail = translateGuideCompositeText(compactParentheticalMatch[2]);
    if (translatedBase !== compactParentheticalMatch[1] || translatedDetail !== compactParentheticalMatch[2]) {
      return `${translatedBase}（${translatedDetail}）`;
    }
  }

  const convertsPointsMatch = /^Converts\s+(\d+)\s+(.+)$/iu.exec(normalized);
  if (convertsPointsMatch) return `转换 ${convertsPointsMatch[1]} 点${translateGuideCompositeText(convertsPointsMatch[2])}`;

  const addsPointsMatch = /^Adds\s+(\d+(?:-\d+)?)\s+(.+)$/iu.exec(normalized);
  if (addsPointsMatch) return `增加 ${addsPointsMatch[1]} 点${translateGuideCompositeText(addsPointsMatch[2])}`;

  const addsTimedDamageMatch = /^Adds\s+(\d+(?:-\d+)?)\s+(.+ Damage)\s+(\d+(?:\.\d+)?)\s+Sec Duration$/iu.exec(normalized);
  if (addsTimedDamageMatch)
    return `增加 ${addsTimedDamageMatch[1]} 点${translateGuideCompositeText(addsTimedDamageMatch[2])}，持续 ${addsTimedDamageMatch[3]} 秒`;

  const reducesPointsMatch = /^Reduces\s+(\d+(?:-\d+)?)\s+(.+)$/iu.exec(normalized);
  if (reducesPointsMatch) return `减少 ${reducesPointsMatch[1]} 点${translateGuideCompositeText(reducesPointsMatch[2])}`;

  const toPointsMatch = /^to\s+(\d+)\s+(.+)$/iu.exec(normalized);
  if (toPointsMatch) return `为 ${toPointsMatch[1]} 点${translateGuideCompositeText(toPointsMatch[2])}`;

  const intoPointsMatch = /^into\s+(?:an?|the)?\s*(.+)$/iu.exec(normalized);
  if (intoPointsMatch) return `转为${translateGuideCompositeText(intoPointsMatch[1])}`;

  const onlyParenthesizedMatch = /^\((Only works once)\)$/iu.exec(normalized);
  if (onlyParenthesizedMatch) return `（${translateGuideCompositeText(onlyParenthesizedMatch[1])}）`;

  const killCountMatch = /^\(At least\s+(\d+)\s+kills\)$/iu.exec(normalized);
  if (killCountMatch) return `（至少 ${killCountMatch[1]} 次击杀）`;

  const successChanceMatch = /^\((\d+(?:\.\d+)?)%\s+chance of success\)$/iu.exec(normalized);
  if (successChanceMatch) return `（${successChanceMatch[1]}% 成功几率）`;

  const chanceSmallBonusMatch = /^\((\d+(?:\.\d+)?)%\s+chance to apply a small bonus\)$/iu.exec(normalized);
  if (chanceSmallBonusMatch) return `（${chanceSmallBonusMatch[1]}% 几率获得小型加成）`;

  const finishingMoveChargeMatch =
    /^([+-]?(?:\(\d+\s+to\s+\d+\)|\d+(?:\.\d+)?)%?)\s+chance for finishing moves to not consume charges$/iu.exec(normalized);
  if (finishingMoveChargeMatch) return `${normalizeGuideNumericValue(finishingMoveChargeMatch[1])} 几率使终结技不消耗充能`;

  const soulsRemainingMatch = /^\(with\s+(\d+)\s+souls remaining\)$/iu.exec(normalized);
  if (soulsRemainingMatch) return `（剩余 ${soulsRemainingMatch[1]} 个灵魂）`;

  const avgMatch = /^([+-]?\d+(?:\.\d+)?)\s+Avg$/iu.exec(normalized);
  if (avgMatch) return `${avgMatch[1]} 平均`;

  const repairMatch = /^Repairs\s+(\d+)\s+durability in\s+(\d+)\s+seconds$/iu.exec(normalized);
  if (repairMatch) return `每 ${repairMatch[2]} 秒恢复 ${repairMatch[1]} 点耐久`;

  const repairShortMatch = /^Repairs\s+(\d+)\s+Durability In\s+(\d+)\s+Sec$/iu.exec(normalized);
  if (repairShortMatch) return `每 ${repairShortMatch[2]} 秒恢复 ${repairShortMatch[1]} 点耐久`;

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

  const ctcMatch = /^([+-]?\d+%)\s+CtC\s+Level\s+(\d+)\s+(.+?)(\s+When Struck)?$/iu.exec(normalized);
  if (ctcMatch) {
    const trigger = ctcMatch[4] ? '在被击中时' : '';
    return `${ctcMatch[1]} 几率${trigger}施放等级 ${ctcMatch[2]} ${translateGuideCompositeText(ctcMatch[3])}`;
  }

  const levelAuraWhenEquippedMatch = /^Lvl\s+(\d+)\s+(.+?\s+Aura)\s+When Equipped$/iu.exec(normalized);
  if (levelAuraWhenEquippedMatch) {
    return `装备时赋予等级 ${levelAuraWhenEquippedMatch[1]} ${translateGuideCompositeText(levelAuraWhenEquippedMatch[2])}`;
  }

  const skillDamageMatch =
    /^([+-]?(?:\(\d+\s+to\s+\d+\)|\d+(?:\.\d+)?)%?)\s+to\s+(Physical|Lightning|Fire|Cold|Poison|Magic)\s+Skill Damage$/iu.exec(normalized);
  if (skillDamageMatch) return `${skillDamageMatch[1]} ${translateGuideCompositeText(skillDamageMatch[2])}技能伤害`;

  const castSpeedMatch = /^([+-]?(?:\(\d+\s+to\s+\d+\)|\d+(?:\.\d+)?)%?)\s+Increased Cast Speed$/iu.exec(normalized);
  if (castSpeedMatch) return `${castSpeedMatch[1]} 施法速度提高`;

  const allResistMatch = /^([+-]?(?:\(\d+\s+to\s+\d+\)|\d+(?:\.\d+)?)%?)\s+to\s+All Resistances$/iu.exec(normalized);
  if (allResistMatch) return `${allResistMatch[1]} 所有抗性`;

  const leadingPercentStatMatch = /^([+-]?\(?\d+(?:-\d+|\s+to\s+\d+)?\)?%)\s+(.+)$/iu.exec(normalized);
  if (leadingPercentStatMatch) {
    const shouldDeferPercentStat = /^(?:to\s+(?:Deadly Strike|Crushing Blow)|Better Chance of Getting Magic Items?)$/iu.test(
      leadingPercentStatMatch[2]
    );
    if (!shouldDeferPercentStat) {
      const translatedStat = translateGuideCompositeText(leadingPercentStatMatch[2]);
      if (translatedStat !== leadingPercentStatMatch[2]) return `${leadingPercentStatMatch[1]} ${translatedStat}`;
    }
  }

  const trailingRangeStatMatch = /^(.+?)\s+([+-]?\d+(?:-\d+)?%)$/iu.exec(normalized);
  if (trailingRangeStatMatch) {
    const translatedStat = translateGuideCompositeText(trailingRangeStatMatch[1]);
    if (translatedStat !== trailingRangeStatMatch[1]) return `${translatedStat} ${trailingRangeStatMatch[2]}`;
  }

  const trailingPlusRangeStatMatch = /^(.+?)\s+\+(\d+(?:-\d+)?)$/iu.exec(normalized);
  if (trailingPlusRangeStatMatch) {
    const translatedStat = translateGuideCompositeText(trailingPlusRangeStatMatch[1]);
    if (translatedStat !== trailingPlusRangeStatMatch[1]) return `${translatedStat} +${trailingPlusRangeStatMatch[2]}`;
  }

  const classSkillMatch = /^([+-]?(?:\(\d+\s+to\s+\d+\)|\d+(?:-\d+)?(?:\.\d+)?))\s+to\s+(.+ Skills)\s+\((.+?)\s+Only\)$/iu.exec(normalized);
  if (classSkillMatch) {
    return `${classSkillMatch[1]} ${translateGuideCompositeText(classSkillMatch[2])}（仅${translateGuideCompositeText(classSkillMatch[3])}）`;
  }

  const genericToSkillMatch =
    /^(\+{1,2}\d+(?:-\d+)?|[+-]?\(\d+\s+to\s+\d+\)(?:%)?|[+-]?\(\d+-\d+\)(?:%)?|\+?\d+(?:-\d+)?(?:\.\d+)?%?)\s+To\s+(.+?)(?:\s+\((.+?)\s+Only\))?$/iu.exec(
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

  const toEnemyResistanceMatch = /^([+-]?\(?\d+(?:\s+to\s+\d+|-\d+)?\)?%)\s+to\s+(Enemy .+ Resistance)$/iu.exec(normalized);
  if (toEnemyResistanceMatch) return `${toEnemyResistanceMatch[1]} ${translateGuideCompositeText(toEnemyResistanceMatch[2])}`;

  const toSpellDamageMatch = /^([+-]?\d+(?:-\d+)?%)\s+To\s+(Poison|Fire|Physical|Lightning|Cold)\s+Spell Damage(\*?)$/iu.exec(normalized);
  if (toSpellDamageMatch)
    return `${toSpellDamageMatch[1]} ${translateGuideCompositeText(`${toSpellDamageMatch[2]} Spell Damage`)}${toSpellDamageMatch[3]}`;

  const strikeMatch = /^([+-]?\(?\d+(?:\s+to\s+\d+)?\)?%)\s+to\s+(Deadly Strike|Crushing Blow)$/iu.exec(normalized);
  if (strikeMatch) return `${strikeMatch[1]} ${translateGuideCompositeText(strikeMatch[2])}`;

  const manaAfterKillMatch = /^([+-]?\(?\d+(?:\s+to\s+\d+)?\)?)\s+Mana after each Kill$/iu.exec(normalized);
  if (manaAfterKillMatch) return `${manaAfterKillMatch[1]} 击杀后获得法力`;

  const genericPercentStatMatch = /^([+-]?\d+(?:\.\d+)?%)\s+(?:to\s+)?(Spell Damage|Summon Damage)$/iu.exec(normalized);
  if (genericPercentStatMatch) return `${genericPercentStatMatch[1]} ${translateGuideCompositeText(genericPercentStatMatch[2])}`;

  const tinkeringPointsMatch = /^([+-]?\(?\d+(?:\s+to\s+\d+)?\)?)\s+Tinkering Points$/iu.exec(normalized);
  if (tinkeringPointsMatch) return `${tinkeringPointsMatch[1]} ${translateGuideCompositeText('Tinkering Points')}`;

  const signedRangeStatMatch = /^([+-]?\d+(?:-\d+)?)\s+(.+)$/u.exec(normalized);
  if (signedRangeStatMatch) {
    const translatedStat = translateGuideCompositeText(signedRangeStatMatch[2]);
    if (translatedStat !== signedRangeStatMatch[2]) return `${signedRangeStatMatch[1]} ${translatedStat}`;
  }

  const countItemMatch = /^(\d+|\d+-\d+|[+-]?\d+)\s+(.+)$/u.exec(normalized);
  if (countItemMatch) {
    const translatedItem = translateGuideCompositeText(countItemMatch[2]);
    if (translatedItem !== countItemMatch[2]) return `${countItemMatch[1]} ${translatedItem}`;
  }

  const timesItemMatch = /^(\d+)x\s+(.+)$/iu.exec(normalized);
  if (timesItemMatch) return `${timesItemMatch[1]}x ${translateGuideCompositeText(timesItemMatch[2])}`;

  const secretRecipeMatch = /^Secret Recipe\s+(\d+)$/iu.exec(normalized);
  if (secretRecipeMatch) return `秘密公式 ${secretRecipeMatch[1]}`;

  const addsGemBonusMatch = /^Adds\s+Chipped Gem's\s+(.+?)\s+Bonus$/iu.exec(normalized);
  if (addsGemBonusMatch) return `增加碎裂宝石的${translateGuideCompositeText(addsGemBonusMatch[1])}加成`;

  const addsSocketMatch = /^Adds\s+Gem Socket\s+\((\d+)\)(\*?)$/iu.exec(normalized);
  if (addsSocketMatch) return `增加宝石孔（${addsSocketMatch[1]}）${addsSocketMatch[2]}`;

  const removesMatch = /^Removes\s+(.+)$/iu.exec(normalized);
  if (removesMatch) return `移除${translateGuideCompositeText(removesMatch[1])}`;

  const forcesMatch = /^Forces\s+(.+)$/iu.exec(normalized);
  if (forcesMatch) return `强制生成${translateGuideCompositeText(forcesMatch[1])}`;

  const socketCountMatch = /^(\d+)\s+Socket\s+(.+)$/iu.exec(normalized);
  if (socketCountMatch) return `${socketCountMatch[1]} 孔${translateGuideCompositeText(socketCountMatch[2])}`;

  const levelReqPenaltyMatch = /^Level Req Penalty by\s+(\d+)$/iu.exec(normalized);
  if (levelReqPenaltyMatch) return `等级需求惩罚 ${levelReqPenaltyMatch[1]} 点`;

  const withNoMatch = /^with no\s+\((.+?)\)\s+property$/iu.exec(normalized);
  if (withNoMatch) return `没有（${translateGuideCompositeText(withNoMatch[1])}）属性`;

  const withPenaltyMatch = !/[.!?]/u.test(normalized) ? /^(.+?)\s+with\s+(.+)$/iu.exec(normalized) : null;
  if (withPenaltyMatch) {
    const translatedBase = translateGuideCompositeText(withPenaltyMatch[1]);
    const translatedDetail = translateGuideCompositeText(withPenaltyMatch[2]);
    if (translatedBase !== withPenaltyMatch[1] || translatedDetail !== withPenaltyMatch[2])
      return `${translatedBase}带有${translatedDetail}`;
  }

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

  const andListText = translateGuideAndListText(normalized);
  if (andListText) return andListText;

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
