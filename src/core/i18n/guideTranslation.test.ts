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
    expect(translateGuideText('Dur')).toBe('耐久');
    expect(translateGuideText('Req Lvl')).toBe('需求等级');
    expect(translateGuideText('Req Str')).toBe('需求力量');
    expect(translateGuideText('Gem Type')).toBe('宝石类型');
    expect(translateGuideText('Str/Dex Bonus')).toBe('力量/敏捷加成');
    expect(translateGuideText('Quilted Armor (qui)')).toBe('绗缝铠甲 (qui)');
    expect(translateGuideText('Gamble Item: Quilted Armor (qui)')).toBe('赌博物品: 绗缝铠甲 (qui)');
    expect(translateGuideText('Lvl 5 / Req Lvl 3')).toBe('等级 5 / 需求等级 3');
    expect(translateGuideText('(2 items)')).toBe('（2 件）');
    expect(translateGuideText('tors = Armor')).toBe('tors = 护甲');
    expect(translateGuideText('rod = Staves And Rods')).toBe('rod = 法杖与权杖');
    expect(translateGuideText('weap, circ')).toBe('武器(weap)、头环(circ)');
    expect(translateGuideText('staf, wand, orb')).toBe('法杖(staf)、魔杖(wand)、法球(orb)');
    expect(translateGuideText('amul, circ, glov, spea, scrn')).toBe('项链(amul)、头环(circ)、手套(glov)、长矛(spea)、死灵盾(scrn)');
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
    expect(translateGuideText('of the Colossus')).toBe('之巨像');
    expect(translateGuideText("Mechanist's")).toBe('机械师之');
  });

  it('translates cube recipe, map, and mechanism guide prose labels', () => {
    expect(translateGuideText("Most, but not all, recipes that reroll the input don't work if the input has a Forging.")).toBe(
      '多数会重置投入物的公式在投入物带有锻造时不会生效，但并非全部如此。'
    );
    expect(translateGuideText('Torso means Body Armor. Armor means all kinds of armor.')).toBe(
      'Torso 表示身体护甲。Armor 表示所有类型的护甲。'
    );
    expect(translateGuideText('Special')).toBe('特殊');
    expect(translateGuideText("Wirt's leg or Any Club Class Weapon")).toBe('维特之脚或任意木棒职业武器');
    expect(translateGuideText('1-4 Stamina Potions')).toBe('1-4 耐力药剂');
    expect(translateGuideText('Teleport Restrictions')).toBe('传送限制');
    expect(translateGuideText('Location: Act 1 The Secret Cow Level')).toBe('位置: 第 1 幕 秘密奶牛关');
    expect(translateGuideText('Location: Act 1 Tamoe Highland')).toBe('位置: 第 1 幕 塔莫高地');
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
    expect(translateGuideText('2x Flawed Enigmatic Cinnabar')).toBe('2x 缺陷的神秘朱砂');
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
    ).toBe('武器精通可以通过合成武器精通代币获得；该代币可由腐化的扎卡鲁姆和终局地图首领掉落（25% 几率，不受 /players 缩放影响）。');
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
    expect(translateGuideText("Lucion's Whisper - Cellar of Pain")).toBe('卢西恩的低语 - 痛苦地窖');
    expect(translateGuideText('Lucion Whisper just killed')).toBe('卢西恩的低语刚被击杀');
    expect(translateGuideText('Fire/Cold/Lightning/Poison/Magic/Wind Surge')).toBe('火焰/冰冷/闪电/毒素/魔法/风暴涌动');
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
