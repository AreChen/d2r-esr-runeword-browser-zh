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
    expect(translateGuideText('Tier 2 Map (25% chance on average)')).toBe('2 阶地图（平均 25% 几率）');
    expect(translateGuideText('Random Pandemonium Key (100% chance each on average)')).toBe('随机混沌钥匙（平均每个 100% 几率）');
    expect(translateGuideText('Other Generic Items/Materials')).toBe('其他通用物品/材料');
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
