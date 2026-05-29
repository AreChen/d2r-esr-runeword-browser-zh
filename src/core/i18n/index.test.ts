import { describe, expect, it } from 'vitest';
import { buildLocalizedSearchText, translateGameText } from './index';

describe('game text i18n facade', () => {
  it('keeps full rune item names in English', () => {
    expect(translateGameText('El Rune')).toBe('El Rune');
    expect(translateGameText('Yu Rune')).toBe('Yu Rune');
  });

  it('does not add localized rune names to the search index', () => {
    expect(buildLocalizedSearchText(['El Rune'])).toBe('el rune');
  });

  it('translates elemental attack damage with duration variants', () => {
    expect(translateGameText('Adds 30-40 Cold Damage to Attacks over 2 Seconds、')).toBe('攻击附加 30-40 冰冷伤害，持续 2 秒');
    expect(translateGameText('Adds 250 Poison Damage to Attacks over 10.24')).toBe('攻击附加 250 毒素伤害，持续 10.24 秒');
  });

  it('translates skill names captured by proc templates', () => {
    expect(translateGameText('15% Chance to Cast Level 20 Cloak of Shadows when Struck')).toBe('15% 几率在被击中时施放等级 20 暗影斗篷');
    expect(translateGameText('5% CTC Lvl 60 Fist of the Heavens on Striking')).toBe('5% 几率在击中时施放等级 60 天之拳');
  });

  it('translates standalone ascendancy names', () => {
    expect(translateGameText('Battlemage')).toBe('战斗法师');
  });

  it('translates unique item scaled affixes', () => {
    expect(translateGameText('+1 to Maximum Damage to Attacks (Based on Character Level)')).toBe('+1 攻击最大伤害（基于角色等级）');
    expect(translateGameText('Socketed (1 to 3)')).toBe('镶孔 (1 to 3)');
    expect(translateGameText('+(5 to 10) To Battle Orders')).toBe('+(5 to 10) 战斗命令');
    expect(translateGameText('+(2 to 4) to Offensive Auras (Paladin Only)')).toBe('+(2 to 4) 攻击灵气（仅圣骑士）');
  });

  it('translates ascendancy bonus affixes', () => {
    expect(translateGameText('+1 to Class Skill Levels')).toBe('+1 职业技能等级');
    expect(translateGameText('20% Physical Resist')).toBe('20% 物理抗性');
    expect(translateGameText('+30 to Elemental Fury (All Classes)')).toBe('+30 元素狂怒（所有职业）');
    expect(translateGameText('Spell Damage: +50%**')).toBe('法术伤害: +50%**');
    expect(translateGameText('10% Chance to Cast Level 60 Annihilation when Struck **')).toBe('10% 几率在被击中时施放等级 60 毁灭**');
    expect(translateGameText('25% Chance to Cast Level 1 Ravage on Melee Attack**')).toBe('25% 几率在近战攻击时施放等级 1 蹂躏**');
  });

  it('translates starred mythical unique proc names', () => {
    expect(translateGameText('5% CTC Lvl 1 Mythical Chaos Lightning* on Striking')).toBe('5% 几率在击中时施放等级 1 神话混沌闪电*');
    expect(translateGameText('10% CTC Lvl 1 Blizzard Cannon* on Striking')).toBe('10% 几率在击中时施放等级 1 暴风雪炮*');
  });

  it('translates remaining common ascendancy and mythical unique notes', () => {
    expect(translateGameText('Gain 1% Total Defense Bonus for every 3% Deadly Strike and Crushing Blow*')).toBe(
      '每 3% 致命一击和压碎性打击获得 1% 总防御加成*'
    );
    expect(translateGameText('Energy has no effect on Spell or Summon Damage anymore')).toBe('精力不再影响法术或召唤伤害');
    expect(translateGameText('Adds 3-4 Fire, 2-5 Cold, 1-7 Lightning Damage to Attacks')).toBe('攻击附加 3-4 火焰、2-5 冰冷、1-7 闪电伤害');
    expect(
      translateGameText(
        'Each stack of Blood Empowerment grants 10 Maximum Damage, 2% Attack Speed and 2% Life Steal at the cost of 10 Life per second per stack. Lasts 3 seconds'
      )
    ).toBe('每层血之强化提供 10 最大伤害、2% 攻击速度和 2% 生命偷取，每层每秒消耗 10 生命，持续 3 秒');
    expect(translateGameText('Cannot Be Frozen (50% chance to spawn)')).toBe('无法冰冻（50% 几率出现）');
  });

  it('preserves formula placeholder order when translating templates', () => {
    expect(translateGameText('1% Fire Spell Damage and 3-6 Fire Damage to Attacks for every 1% Fire Resistance you have')).toBe(
      '获得 1% 火焰法术伤害，并使攻击附加 3-6 火焰伤害，每 1% 火焰抗性'
    );
    expect(translateGameText('+35 to Dexterity')).toBe('+35 敏捷');
    expect(translateGameText('+12% to Enemy Fire Resistance')).toBe('+12% 敌人火焰抗性');
    expect(
      translateGameText(
        '*Each type of speed (block, cast, move, attack, recovery) is counted separately. E.g. +1% to All Speeds counts as +5% to ascendancy bonuses.'
      )
    ).toBe('*每种速度（格挡、施法、移动、攻击、打击恢复）会分别计算。例如 +1% 所有速度会按 +5% 计入升华加成。');
    expect(translateGameText('*Blood Magic means you use life to cast spells now.')).toBe('*血魔法表示你现在使用生命来施放法术。');
    expect(
      translateGameText(
        '*Every cycle lasts 5 attacks/spells. On 6th attack/spell, you gain second cycle bonuses. On 11th attack/spell, you gain third cycle bonuses. On 16th attack/spell, you gain first cycle bonuses. This repeats indefinitely.'
      )
    ).toBe(
      '*每个循环持续 5 次攻击/法术。第 6 次攻击/法术获得第二循环加成，第 11 次获得第三循环加成，第 16 次获得第一循环加成。此过程无限重复。'
    );
    expect(translateGameText('of the Aether')).toBe('之虚空');
    expect(translateGameText('of the Bat')).toBe('之蝙蝠');
  });
});
