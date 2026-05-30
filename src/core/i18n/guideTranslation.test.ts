import { translateGuideText } from './guideTranslation';
import { GUIDE_PAGE_CATALOG, getGuidePageEntry } from '../api/guidePageCatalog';
import { translateGameText } from './index';

describe('guide text translation', () => {
  it('keeps existing game text translation behavior for affixes and rune names', () => {
    expect(translateGuideText('Adds 20-40 Fire Damage to Attacks')).toBe('攻击附加 20-40 火焰伤害');
    expect(translateGuideText('El Rune')).toBe('El Rune');
  });

  it('translates common official guide labels and mechanism prose', () => {
    expect(translateGuideText('Input(s)')).toBe('投入物');
    expect(translateGuideText('Possible Outcome(s)')).toBe('可能结果');
    expect(translateGuideText('Same Item')).toBe('同一物品');
    expect(translateGuideText('Worldstone Shard')).toBe(translateGameText('Worldstone Shard'));
    expect(translateGuideText('Weapon Mastery Token')).toBe(translateGameText('Weapon Mastery Token'));
    expect(translateGuideText('Awakened Weapon Mastery Token')).toBe(translateGameText('Awakened Weapon Mastery Token'));
    expect(translateGuideText('Rare Weapon')).toBe('稀有武器');
    expect(translateGuideText('Rare Equippable Gear')).toBe('稀有可装备物品');
    expect(translateGuideText('Unique Charm')).toBe('暗金护身符');
    expect(translateGuideText('Any Class Weapon')).toBe('任意职业武器');
    expect(translateGuideText('Random highest tier suffix')).toBe('随机最高阶后缀');
    expect(translateGuideText('*** Anointed **')).toBe('*** 已涂油 **');
    expect(translateGuideText('Orb of Anointment')).toBe('涂抹之球');
    expect(translateGuideText("Diablo's Demonic Horn")).toBe('迪亚布罗的恶魔之角');
    expect(translateGuideText('Anvil Stone')).toBe('锻造石');
    expect(translateGuideText('Corruptions are unique bonuses obtained through transmuting a Worldstone Shard with any item.')).toBe(
      '腐化是通过将世界石碎片与任意物品合成获得的独特加成。'
    );
    expect(translateGuideText('Weapon mastery is an unique system that changes how class weapons interact with skills.')).toBe(
      '武器精通是一个会改变职业武器与技能互动方式的独特系统。'
    );
    expect(
      translateGuideText('Anointments are unique bonuses obtained through transmuting specific cube regents with certain items.')
    ).toBe('涂油是通过将特定方块材料与指定物品合成获得的独特加成。');
    expect(
      translateGuideText(
        'Warning: endgame map zones are much more difficult than all other content they require extremely well defined builds.'
      )
    ).toBe('警告：终局地图区域远难于其他内容，需要非常明确且成型的构筑。');
    expect(
      translateGuideText(
        'Vessel of Souls is a special mythical unique amulet that can consume 5 organs at a time to get various bonuses based on the organs consumed.'
      )
    ).toBe('灵魂之器是一件特殊的神话暗金项链，可以一次消耗 5 个器官，并根据消耗的器官获得不同加成。');
    expect(translateGuideText('The Kill Ledger is a special book that keeps tracks of the amount of enemies you have killed.')).toBe(
      '击杀账本是一本特殊书籍，会记录你击杀的敌人数量。'
    );
    expect(translateGuideText('Here you can find information about mercenaries and various oskills.')).toBe(
      '这里可以查看佣兵和各种 Oskill 的信息。'
    );
    expect(translateGuideText('All items have a 25% chance to be turned into a rare (brick) upon corrupting.')).toBe(
      '所有物品在腐化时都有 25% 几率变成稀有物品（损坏）。'
    );
    expect(translateGuideText('Unlike corruptions, anointing an item cannot brick it.')).toBe('不同于腐化，给物品涂油不会使其损坏。');
    expect(translateGuideText('Endgame map zones can be accessed by transmuting map items by themselves in act 5 hell.')).toBe(
      '在地狱第五幕单独合成地图物品即可进入终局地图区域。'
    );
    expect(translateGuideText('Each tier 1 recipe consumes 350 souls per use.')).toBe('每次使用 1 阶公式会消耗 350 个灵魂。');
    expect(translateGuideText('The boss bonuses can be completed in any order.')).toBe('首领加成可以按任意顺序完成。');
    expect(translateGuideText('You can only apply one weapon mastery per weapon.')).toBe('每把武器只能应用一种武器精通。');
  });

  it('keeps guide page titles aligned with existing MOD item names', () => {
    expect(getGuidePageEntry('vesselOfSouls').title).toBe(translateGameText('Vessel of Souls'));
  });

  it('translates long official feature introduction paragraphs sentence by sentence', () => {
    expect(
      translateGuideText(
        'Corruptions are unique bonuses obtained through transmuting a Worldstone Shard with any item. On SP build, Worldstone Shards can drop from any terrorized champion or unique. All items have a 25% chance to be turned into a rare (brick) upon corrupting. BE AWARE that corrupting an item can turn it into a rare.'
      )
    ).toBe(
      '腐化是通过将世界石碎片与任意物品合成获得的独特加成。单机版中，世界石碎片可由任意恐怖化冠军怪或暗金怪掉落。所有物品在腐化时都有 25% 几率变成稀有物品（损坏）。请注意，腐化物品可能会把它变成稀有物品。'
    );

    expect(
      translateGuideText(
        "For Unique Charms , anointments can be obtained through transmuting all Eye of the Storm boss body parts ( Diablo's Demonic Horn , Baal's Demonic Eye , Mephisto's Demonic Brain ) with a Unique Charm for a one-time bonus. For Rare Equippable Gear , anointments can be obtained through transmuting an Orb of Anointment with a rare item."
      )
    ).toBe(
      '暗金护身符可以通过将全部风暴之眼首领器官（迪亚布罗的恶魔之角、巴尔的恶魔之眼、梅菲斯托的恶魔大脑）与暗金护身符合成，获得一次性涂油加成。稀有可装备物品可以通过将涂抹之球与稀有物品合成来获得涂油。'
    );

    expect(
      translateGuideText(
        'Endgame map zones can be accessed by transmuting map items by themselves in act 5 hell . There are a total of 18 map items across 5 tiers. Each tier has 4 different map zones, except tier 5 which has only 2 maps with unique and extremely difficult boss encounters.'
      )
    ).toBe(
      '在地狱第五幕单独合成地图物品即可进入终局地图区域。地图物品共有 5 个阶级、18 种。每个阶级有 4 个不同地图区域，但 5 阶只有 2 张地图，并带有独特且极其困难的首领战。'
    );
  });

  it('translates recurring endgame map reward labels', () => {
    expect(translateGuideText('Description/Rewards')).toBe('描述/奖励');
    expect(translateGuideText('Orb of Anointment (5% chance on average)')).toBe('涂抹之球（平均 5% 几率）');
    expect(translateGuideText('Orb of Anointment (16.67% chance on average each)')).toBe('涂抹之球（平均每个 16.67% 几率）');
    expect(translateGuideText('Tier 2 Map (25% chance on average)')).toBe('2 阶地图（平均 25% 几率）');
    expect(translateGuideText('Tier 5 Map (17% chance on average each)')).toBe('5 阶地图（平均每个 17% 几率）');
    expect(translateGuideText('Random Pandemonium Key (100% chance each on average)')).toBe('随机混沌钥匙（平均每个 100% 几率）');
    expect(translateGuideText('Other Generic Items/Materials')).toBe('其他通用物品/材料');
  });

  it('translates base information table names, data headers, and parameter notes', () => {
    expect(translateGuideText('Code')).toBe('代码');
    expect(translateGuideText('Properties')).toBe('属性');
    expect(translateGuideText('Dur')).toBe('耐久');
    expect(translateGuideText('Req Lvl')).toBe('需求等级');
    expect(translateGuideText('Required Level')).toBe('需求等级');
    expect(translateGuideText('Req Str')).toBe('需求力量');
    expect(translateGuideText('Gem Type')).toBe('宝石类型');
    expect(translateGuideText('Str/Dex Bonus')).toBe('力量/敏捷加成');
    expect(translateGuideText('Item Level: 45')).toBe('物品等级: 45');
    expect(translateGuideText('Required Level: 40')).toBe('所需等级：40');
    expect(translateGuideText('Item Level: 35 Required Level: 40')).toBe('物品等级: 35 需求等级: 40');
    expect(translateGuideText('Gamble Item:')).toBe('赌博物品:');
    expect(translateGuideText('(Cannot be Gambled)')).toBe('（无法赌博获得）');
    expect(translateGuideText('Ancient Coupon Unique')).toBe('古代券暗金');
    expect(translateGuideText('Quilted Armor (qui)')).toBe('绗缝铠甲 (qui)');
    expect(translateGuideText('Gamble Item: Quilted Armor (qui)')).toBe('赌博物品: 绗缝铠甲 (qui)');
    expect(translateGuideText('Lvl 5 / Req Lvl 3')).toBe('等级 5 / 需求等级 3');
    expect(translateGuideText('(2 items)')).toBe('（2 件）');
    expect(translateGuideText('tors = Armor')).toBe('tors = 护甲');
    expect(translateGuideText('rod = Staves And Rods')).toBe('rod = 法杖与权杖');
    expect(translateGuideText('weap, circ')).toBe('武器(weap)、头环(circ)');
    expect(translateGuideText('staf, wand, orb')).toBe('法杖(staf)、魔杖(wand)、法球(orb)');
    expect(translateGuideText('amul, circ, glov, spea, scrn')).toBe('项链(amul)、头环(circ)、手套(glov)、长矛(spea)、死灵盾(scrn)');
    expect(translateGuideText('amul, circ, claw, asnx, tkni, cloa')).toBe(
      '项链(amul)、头环(circ)、爪(claw)、刺客武器(asnx)、投掷刀(tkni)、斗篷(cloa)'
    );
    expect(translateGuideText('staf, wand, mana, orb, dclb, npol, ndgr')).toBe(
      '法杖(staf)、魔杖(wand)、法力物品(mana)、法球(orb)、德鲁伊木棒(dclb)、死灵法师长柄武器(npol)、死灵匕首(ndgr)'
    );
    expect(translateGuideText('arrm, boqm')).toBe('弓箭袋(arrm)、弩矢袋(boqm)');
    expect(translateGuideText('glov, miss, thro')).toBe('手套(glov)、远程武器(miss)、投掷武器(thro)');
    expect(translateGuideText('Magic Torso')).toBe('魔法身体护甲');
    expect(translateGuideText('Any Torso/Helm/Shield')).toBe('任意身体护甲/头盔/盾牌');
    expect(translateGuideText('16.0 Avg')).toBe('16.0 平均');
  });

  it('translates guide-specific item, affix, and skill-list parameter text', () => {
    expect(translateGuideText('Gem Word')).toBe('宝石之语');
    expect(translateGuideText('Allowed Items')).toBe('允许物品');
    expect(translateGuideText('Weapons / Gloves')).toBe('武器 / 手套');
    expect(translateGuideText('(3 Socket)')).toBe('（3 孔）');
    expect(translateGuideText('+10% to Lightning Skill Damage')).toBe('+10% 闪电技能伤害');
    expect(translateGuideText('+(15 to 20)% Increased Cast Speed')).toBe('+(15 to 20)% 施法速度提高');
    expect(translateGuideText('+(15 to 20)% to All Resistances')).toBe('+(15 to 20)% 所有抗性');
    expect(translateGuideText('Level 10 Corpse Explosion (40/40 Charges)')).toBe('等级 10 尸体爆炸（40/40 次）');
    expect(translateGuideText('Immolation Arrow, Freezing Arrow, Lightning Arrow')).toBe('焚烧箭、冰冻箭、闪电箭');
    expect(translateGuideText('Any Perfect Gem x3')).toBe('任意完美宝石 x3');
    expect(translateGuideText('+1 to Bow and Crossbow Skills (Amazon Only)')).toBe('+1 弓和弩技能（仅亚马逊）');
    expect(translateGuideText('+1 to Poison and Bone Skills (Necromancer Only)')).toBe('+1 毒素与白骨技能（仅死灵法师）');
    expect(translateGuideText('Repairs 1 durability in 1 seconds')).toBe('每 1 秒恢复 1 点耐久');
    expect(translateGuideText('Socketed (%i) (1 to 3)')).toBe('镶孔 (%i) (1 to 3)');
    expect(translateGuideText('Drow Adamantite Chain')).toBe('暗精灵精金链甲');
    expect(translateGuideText('++1 To Elemental Form')).toBe('+1 元素形态');
    expect(translateGuideText("+10 To Ancients' Presence (Barbarian Only)")).toBe('+10 先祖显现（仅野蛮人）');
    expect(translateGuideText('Hit Blinds Target +1')).toBe('击晕目标 +1');
    expect(translateGuideText('+(15 to 20)% to Deadly Strike')).toBe('+(15 to 20)% 致命一击');
    expect(translateGuideText('+(15 to 20)% to Crushing Blow')).toBe('+(15 to 20)% 压碎性打击');
    expect(translateGuideText('+(15 to 20) Mana after each Kill')).toBe('+(15 to 20) 击杀后获得法力');
    expect(translateGuideText('+10% to Spell Damage')).toBe('+10% 法术伤害');
    expect(translateGuideText('+10% Summon Damage')).toBe('+10% 召唤伤害');
    expect(translateGuideText('+(50 to 75) Tinkering Points')).toBe('+(50 to 75) 修缮点数');
    expect(translateGuideText('+3% Chance to Cast Level 60 Lightning Surge Surge on Striking')).toBe(
      '+3% 几率在击中时施放等级 60 闪电冲击'
    );
    expect(translateGuideText('1% Chance to Cast Level 15 Frozen Orb on Striking')).toBe('1% 几率在击中时施放等级 15 冰封球');
    expect(translateGuideText('25% Chance to Cast Level 20 Immolation when you Kill an Enemy')).toBe(
      '25% 几率在击杀敌人时施放等级 20 焚烧'
    );
    expect(translateGuideText('Adds 1000-1500 Cold Damage to Attacks over 10 Seconds')).toBe('攻击附加 1000-1500 冰冷伤害，持续 10 秒');
    expect(translateGuideText("(15 to 30)% Reanimate as: Rathma's Acolyte")).toBe('(15 to 30)% 复生为: 拉斯玛的侍僧');
    expect(translateGuideText('of the Colossus')).toBe('之巨像');
    expect(translateGuideText("Mechanist's")).toBe('机械师之');
    expect(translateGuideText("Nature's")).toBe('自然之');
    expect(translateGuideText('of Cold Arrows')).toBe('之冰箭');
    expect(translateGuideText('Grand Charms')).toBe('超大型护身符');
    expect(translateGuideText('Arrow/Bolt Quivers')).toBe('箭/弩矢袋');
    expect(translateGuideText('+(10 to 20)% chance for finishing moves to not consume charges')).toBe(
      '+(10 to 20)% 几率使终结技不消耗充能'
    );
  });

  it('translates cube recipe, map, and mechanism guide prose labels', () => {
    expect(translateGuideText("Most, but not all, recipes that reroll the input don't work if the input has a Forging.")).toBe(
      '多数会重置投入物的公式在投入物带有锻造时不会生效，但并非全部如此。'
    );
    expect(translateGuideText('Torso means Body Armor. Armor means all kinds of armor.')).toBe(
      '身体部位表示身体护甲。护甲表示所有类型的护甲。'
    );
    expect(translateGuideText('Special')).toBe('特殊');
    expect(translateGuideText("Wirt's leg or Any Club Class Weapon")).toBe('维特之脚或任意木棒职业武器');
    expect(translateGuideText('1-4 Stamina Potions')).toBe('1-4 耐力药剂');
    expect(translateGuideText('Teleport Restrictions')).toBe('传送限制');
    expect(translateGuideText('Location: Act 1 The Secret Cow Level')).toBe('位置: 第 1 幕 秘密奶牛关');
    expect(translateGuideText('Location: Act 1 Tamoe Highland')).toBe('位置: 第 1 幕 塔莫高地');
    expect(translateGuideText('Forgotten Tower Level 5')).toBe('遗忘之塔第 5 层');
    expect(translateGuideText('Location: Act 5 Naraku Level 1&2')).toBe('位置: 第 5 幕 奈落第 1 和 2 层');
    expect(translateGuideText('Way Point*')).toBe('传送小站*');
    expect(translateGuideText('Level 1 and Level 2')).toBe('第 1 层和第 2 层');
    expect(translateGuideText('General')).toBe('通用');
    expect(translateGuideText('Min iLvl')).toBe('最低物品等级');
    expect(translateGuideText('Stats')).toBe('属性');
    expect(translateGuideText('Item Type')).toBe('物品类型');
    expect(translateGuideText('mcha = Medium Charm')).toBe('mcha = 中型护身符');
    expect(translateGuideText('of Anima')).toBe('之灵魂');
    expect(translateGuideText('Kill Ledger (see Kill Ledger Page )')).toBe('击杀账本（见击杀账本页面）');
    expect(translateGuideText('-(25-100)% Better Chance of Getting Magic Item')).toBe('-(25-100)% 魔法装备掉落率');
    expect(translateGuideText('(25% chance to apply a small bonus)')).toBe('（25% 几率获得小型加成）');
    expect(translateGuideText('Any Perfect Gem/x2/x3')).toBe('任意完美宝石/x2/x3');
    expect(translateGuideText('Any Unique Charm, Unique/Set/Crafted/Rare Equipment')).toBe('任意暗金护身符、暗金/套装/手工/稀有装备');
    expect(translateGuideText('Endgame Map of the Next Tier')).toBe('下一阶终局地图');
    expect(translateGuideText('Random Endgame Map of the Same Tier')).toBe('随机同阶终局地图');
    expect(translateGuideText('5 organs')).toBe('5 个器官');
    expect(translateGuideText('Random Bonus (see Corruptions Page for all possible bonuses)')).toBe('随机加成（见腐化页面的全部可能加成）');
    expect(translateGuideText('(*25% chance to brick item)')).toBe('（*25% 几率损坏物品）');
    expect(translateGuideText('2 Endgame Maps of the Same Tier')).toBe('2 张同阶终局地图');
    expect(translateGuideText('Random Perfect Gem')).toBe('随机完美宝石');
    expect(translateGuideText('Key of Terror/Hate/Destruction')).toBe('恐惧/憎恨/毁灭钥匙');
    expect(translateGuideText('Any Weapon with Durability')).toBe('任意有耐久的武器');
    expect(translateGuideText('Rejuvenation Potion')).toBe('复苏药水');
    expect(translateGuideText('3 Any Mana potions')).toBe('3 任意法力药剂');
    expect(translateGuideText('Any Ring/Amulet')).toBe('任意戒指/项链');
    expect(translateGuideText('or Unique/Rare Quiver')).toBe('或暗金/稀有箭袋');
    expect(translateGuideText('Chipped Gem')).toBe('碎裂的宝石');
    expect(translateGuideText('Flawless Topazes')).toBe('无瑕黄玉');
    expect(translateGuideText('Blemished Amethist')).toBe('瑕疵紫水晶');
    expect(translateGuideText('3 Gems of the Same Color and Grade')).toBe('3 个相同颜色和等级的宝石');
    expect(translateGuideText('Gem of One Higher Grade (up to Perfect)')).toBe('高一级宝石（最高到完美）');
    expect(translateGuideText('2 Flawless Gems of the Same Color')).toBe('2 个相同颜色的无瑕宝石');
    expect(translateGuideText('Can Opener (Chipped Gem Output)')).toBe('开罐器（输出碎裂的宝石）');
    expect(translateGuideText('(-1 Crystal Point of selected color)')).toBe('（所选颜色水晶点数 -1）');
    expect(translateGuideText('Adds 54 Gem points of selected color')).toBe('增加 54 点所选颜色宝石点数');
    expect(translateGuideText('2 Runes/Decals of the Same Grade')).toBe('2 个相同等级的符文/贴花');
    expect(translateGuideText('Rune/Decal of One Higher Grade (up to Wo or Zod)')).toBe('高一级符文/贴花（最高到 Wo 或 Zod）');
    expect(translateGuideText('2 Same Runes (up to O rune)')).toBe('2 相同符文（最高到 O Rune）');
    expect(translateGuideText('8 Ancient Coupons (Normal)')).toBe('8 张古代券（普通）');
    expect(translateGuideText('Converts 5 normal coupon points')).toBe('转换 5 点普通券点数');
    expect(translateGuideText('to 1 exceptional coupon point')).toBe('为 1 点扩展券点数');
    expect(translateGuideText('Full Rejuvenation Potion')).toBe('完全复苏药水');
    expect(translateGuideText('Any Non-ethereal Weapon/Armor')).toBe('任意非无形武器/护甲');
    expect(translateGuideText('Quantity Reset To 500 (Quivers)')).toBe('数量重置为 500（箭袋）');
    expect(translateGuideText('Normal Weapon of the Same Type')).toBe('同类型普通武器');
    expect(translateGuideText('Set/Unique Weapons/Armor (Elite)')).toBe('套装/暗金武器/护甲（精英）');
    expect(translateGuideText('Adds 4 Ancient Decipherer points')).toBe('增加 4 点古代解读器点数');
    expect(translateGuideText('into an Anvil Stone point')).toBe('转为铁砧石点数');
    expect(translateGuideText('(25% chance of success)')).toBe('（25% 成功几率）');
    expect(translateGuideText("Base upgraded uniques can't be rerolled. Please reroll before upgrade.")).toBe(
      '底材已升级的暗金物品不能重置。请在升级前重置。'
    );
    expect(translateGuideText('Forging, D-Stoning and other ehnancements are inherited.')).toBe('锻造、D-Stoning 和其他强化会被继承。');
    expect(translateGuideText('Level 92 unique jewels and quivers cannot be rerolled.')).toBe('92 级暗金珠宝和箭袋不能重置。');
    expect(translateGuideText("D-Stoning doesn't work if the property on the target item has reached the cap.")).toBe(
      '如果目标物品上的属性已经达到上限，D-Stoning 不会生效。'
    );
    expect(translateGuideText("Adds Chipped Gem's Weapon Bonus")).toBe('增加碎裂的宝石的武器加成');
    expect(translateGuideText('(Capped at 500%)')).toBe('（上限 500%）');
    expect(translateGuideText('Lvl 10 Blessed Aim Aura When Equipped')).toBe('装备时赋予等级 10 祝福瞄准光环');
    expect(translateGuideText('Normal/Superior Weapon/Armor (Elite)')).toBe('普通/超强武器/护甲（精英）');
    expect(translateGuideText('Rare Gloves of the Same Mods')).toBe('相同词缀稀有手套');
    expect(
      translateGuideText('On LAN build, Worldstone Shards can drop from any champion or unique that has level 90+, regardless if they')
    ).toBe('局域网版中，世界石碎片可由任意 90 级以上冠军怪或暗金怪掉落，无论它们');
    expect(
      translateGuideText('are terrorized or not (although terrorized zones help with this since they add levels to the affected monsters).')
    ).toBe('是否恐怖化（恐怖化区域会提高受影响怪物的等级，因此会有帮助）。');
    expect(
      translateGuideText('For Unique Charms , anointments can be obtained through transmuting all Eye of the Storm boss body parts')
    ).toBe('暗金护身符可以通过合成全部风暴之眼首领器官获得涂油');
    expect(
      translateGuideText(
        'After you exhausted all souls, you can transform the amulet in 1 out of 8 mythical weapon bases. Doing this will allow you to wear the weapon without restrictions and any flavor text will be removed.'
      )
    ).toBe('耗尽所有灵魂后，你可以把项链转化为 8 种神话武器底材之一。这样可以让你无视限制装备该武器，并移除所有风味文本。');
    expect(translateGuideText('A simple arrow that deals 100% weapon damage and that cannot pierce.')).toBe(
      '一支简单箭矢，造成 100% 武器伤害，且不能穿透。'
    );
  });

  it('translates feature mechanism table labels and formula fragments', () => {
    expect(translateGuideText('Tier 1')).toBe('1 阶');
    expect(translateGuideText('Each tier 2 recipe consumes 42 souls per use.')).toBe('每次使用 2 阶公式会消耗 42 个灵魂。');
    expect(translateGuideText('2x Heart')).toBe('2x 心脏');
    expect(translateGuideText('Weapon Anointment Bonus')).toBe('武器涂油加成');
    expect(translateGuideText('-5 Souls')).toBe('-5 灵魂');
    expect(translateGuideText('(Only works once)')).toBe('（仅生效一次）');
    expect(translateGuideText('Kill Bonuses')).toBe('击杀加成');
    expect(translateGuideText('(At least 500 kills)')).toBe('（至少 500 次击杀）');
    expect(translateGuideText('2x Flawed Enigmatic Cinnabar')).toBe('2x 裂开的神秘朱砂');
    expect(translateGuideText('Mercenaries')).toBe('佣兵');
    expect(translateGuideText('Hireling')).toBe('雇佣兵');
    expect(translateGuideText('Comb - Nightmare')).toBe('战斗 - 噩梦');
    expect(translateGuideText("Howl, Battle Command, Ancients' Presence, Berserk, Concentrate")).toBe(
      '嚎叫、战斗指令、先祖显现、狂暴、集中'
    );
    expect(translateGuideText('Stag Bow Variant')).toBe('雄鹿弓变体');
    expect(translateGuideText('3 Thawing Potion')).toBe('3 解冻药剂');
    expect(translateGuideText('Same Item*')).toBe('同一物品*');
    expect(
      translateGuideText(
        'Weapon mastery can be achieved by transmuting a Weapon Mastery Token that can drop from Corrupted Zakarum and endgame map bosses (25% chance, not scaled by /players).'
      )
    ).toBe('武器精通可以通过合成武器精通代币获得；该代币可由腐化的扎卡鲁姆和终局地图首领掉落（25% 几率，不受玩家数缩放影响）。');
    expect(translateGuideText('Weapon mastery can be removed , but the token is lost on removal.')).toBe(
      '武器精通可以移除，但移除时会消耗代币。'
    );
    expect(
      translateGuideText(
        'The Kill Ledger can also be used to capture the souls of endgame map bosses. Killing map bosses allows you to transmute the ledger for special bonuses.'
      )
    ).toBe('击杀账本也可以用于捕获终局地图首领的灵魂。击杀地图首领后，可以合成账本来获得特殊加成。');
    expect(
      translateGuideText(
        'The vessel spawns with 2000 souls and every recipe consumes a number of souls. There are four tier of stats, each tier has specific properties, as listed below.'
      )
    ).toBe('灵魂之器生成时带有 2000 个灵魂，每个公式都会消耗一定数量的灵魂。属性共有 4 个阶级，每个阶级都有如下特定属性。');
    expect(translateGuideText('The Kill Ledger cannot be transfered between characters.')).toBe('击杀账本不能在角色之间转移。');
    expect(translateGuideText('Needless to say, each bonus is attainable only once.')).toBe('不用说，每项加成都只能获得一次。');
    expect(translateGuideText('Vessel of Souls cannot be corrupted while it has unconsumed souls.')).toBe(
      '灵魂之器仍有未消耗的灵魂时不能被腐化。'
    );
    expect(
      translateGuideText(
        'Mythical unique items are items that have a different base from all other items, which means they cannot be gambled.'
      )
    ).toBe('神话暗金物品使用与其他所有物品不同的底材，因此无法赌博获得。');
    expect(translateGuideText('( Fire Variant)')).toBe('（火焰变体）');
    expect(translateGuideText("Lucion's Whisper - Cellar of Pain")).toBe('卢西恩的低语 - 痛苦地窖');
    expect(translateGuideText('Lucion Whisper just killed')).toBe('卢西恩的低语刚被击杀');
    expect(translateGuideText('Fire/Cold/Lightning/Poison/Magic/Wind Surge')).toBe('火焰/冰冷/闪电/毒素/魔法/风暴涌动');
    expect(translateGuideText("Wrathamon's Omens")).toBe('拉萨蒙的预兆');
    expect(translateGuideText('(with 5 souls remaining)')).toBe('（剩余 5 个灵魂）');
    expect(translateGuideText('Rathma just killed')).toBe('拉斯玛刚被击杀');
    expect(
      translateGuideText(
        "Weakening Curse - Lucion's Whisper has a chance to cast a curse on the ground. If you're caught within the area, you are petrified and your fire resistance is lowered by 150%."
      )
    ).toBe('削弱诅咒 - 卢西恩的低语有几率在地面施放诅咒。若你处于区域内，会被石化并降低 150% 火焰抗性。');
    expect(
      translateGuideText(
        "Spell on Attack - Diablo's Hellhound has a chance to unlesh a deadly spell on attacking its prey. Possible spells include a regular Meteor, a devastating Frozen Orb whose ice bolts seek nearby players, a piercing Bone Spirit and a curse that slows the target and lowers their elemental resistances by 100% and magic resist by 50%."
      )
    ).toBe(
      '攻击触发法术 - 迪亚布罗的地狱犬在攻击猎物时有几率释放致命法术。可能的法术包括普通陨石、毁灭性的冰封球（冰弹会追踪附近玩家）、可穿透的骨灵，以及一个会减速目标、降低 100% 元素抗性和 50% 魔法抗性的诅咒。'
    );
    expect(translateGuideText('Rewards (for each boss)')).toBe('奖励（每个首领）');
    expect(translateGuideText('Glacial Behemoth - Frozen Wastes (Northern Descent)')).toBe('冰川巨兽 - 冰冻荒原（北部下坡）');
  });

  it('translates official guide multiline table headers and captions line by line', () => {
    expect(translateGuideText('Tier 1\nEach tier 1 recipe consumes 350 souls per use.')).toBe('1 阶 每次使用 1 阶公式会消耗 350 个灵魂。');
    expect(translateGuideText('Vessel of Souls\n2x Heart\nBrain\nTail\nQuill')).toBe('灵魂之器 2x 心脏 脑 尾巴 刺');
    expect(translateGuideText('Same Item\n+5% Chance to Cast Level 15 Thrown Axe on Striking')).toBe(
      '同一物品 +5% 几率在击中时施放等级 15 投掷斧'
    );
    expect(translateGuideText('Any Class Weapon\nWeapon Mastery Token')).toBe('任意职业武器 武器精通代币');
    expect(
      translateGuideText(
        'Poison, Immolation, Freezing, Lightning Arrow\nMakes those skills fire their special effect every 5 attacks\ninstead of 3, but increases their total damage by 20%'
      )
    ).toBe('毒箭、焚烧箭、冰冻箭、闪电箭 使这些技能每 5 次攻击触发一次特殊效果 而不是每 3 次触发一次，但总伤害提高 20%');
    expect(translateGuideText('Lut Gohlein\nThe Sewer\nSouth Entrance')).toBe('鲁高因 下水道 南入口');
    expect(
      translateGuideText(
        "Autolycus' Robes\nQuilted Armor (qui)\nLvl 5 / Req Lvl 3\nGamble Item: Quilted Armor (qui)\n+30 Defense\n+5 to Dexterity\nAll Resistances +10"
      )
    ).toBe('阿托利库斯的长袍 绗缝铠甲 (qui) 等级 5 / 需求等级 3 赌博物品: 绗缝铠甲 (qui) +30 防御 +5 敏捷 所有抗性 +10');
  });

  it('translates ascendancy challenge prose and ascendancy names', () => {
    expect(
      translateGuideText('Ascendancies are powerful specializations that shape how you play, granting unique skills and bonuses.')
    ).toBe('升华是强力专精，会塑造你的玩法，并提供独特技能和加成。');
    expect(translateGuideText('Tier 1 Challenge')).toBe('1 阶挑战');
    expect(
      translateGuideText(
        'The second tier is achieved by killing Nihalthak in his domain on hell difficulty and transmuting the ascendancy stone with itself.'
      )
    ).toBe('第 2 阶需要在地狱难度尼拉塞克领域击杀尼拉塞克，并将升华之石与自身合成。');
    expect(translateGuideText('2 Maple Leaves')).toBe('2 枫叶');
    expect(translateGuideText('Battlemage Ascendancy')).toBe('战斗法师升华');
    expect(translateGuideText('Mana Warden Ascendancy')).toBe('法力守卫升华');
  });

  it('translates every official guide navigation label for visible database UI', () => {
    for (const entry of GUIDE_PAGE_CATALOG) {
      expect(translateGuideText(entry.label), entry.label).not.toBe(entry.label);
    }

    expect(translateGuideText('Changelogs')).toBe('更新日志');
    expect(translateGuideText('Uni Armor')).toBe('暗金护甲');
    expect(translateGuideText('Gems/Runes')).toBe('宝石/符文');
    expect(translateGuideText('Mercenary and Oskill Information')).toBe('佣兵与 Oskill 信息');
  });
});
