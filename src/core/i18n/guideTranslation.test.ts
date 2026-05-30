import { translateGuideText } from './guideTranslation';

describe('guide text translation', () => {
  it('keeps existing game text translation behavior for affixes and rune names', () => {
    expect(translateGuideText('Adds 20-40 Fire Damage to Attacks')).toBe('攻击附加 20-40 火焰伤害');
    expect(translateGuideText('El Rune')).toBe('El Rune');
  });

  it('translates common official guide labels and mechanism prose', () => {
    expect(translateGuideText('Input(s)')).toBe('投入物');
    expect(translateGuideText('Possible Outcome(s)')).toBe('可能结果');
    expect(translateGuideText('Same Item')).toBe('同一物品');
    expect(translateGuideText('Worldstone Shard')).toBe('世界之石碎片');
    expect(translateGuideText('Weapon Mastery Token')).toBe('武器精通令牌');
    expect(translateGuideText('Awakened Weapon Mastery Token')).toBe('觉醒武器精通令牌');
    expect(translateGuideText('Corruptions are unique bonuses obtained through transmuting a Worldstone Shard with any item.')).toBe(
      '腐化是通过将世界之石碎片与任意物品合成获得的独特加成。'
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
    ).toBe('灵魂容器是一件特殊的神话暗金项链，可以一次消耗 5 个器官，并根据消耗的器官获得不同加成。');
    expect(translateGuideText('The Kill Ledger is a special book that keeps tracks of the amount of enemies you have killed.')).toBe(
      '击杀账本是一本特殊书籍，会记录你击杀的敌人数量。'
    );
    expect(translateGuideText('Here you can find information about mercenaries and various oskills.')).toBe(
      '这里可以查看佣兵和各种 Oskill 的信息。'
    );
  });
});
