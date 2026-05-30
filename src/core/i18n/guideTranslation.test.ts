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
  });
});
