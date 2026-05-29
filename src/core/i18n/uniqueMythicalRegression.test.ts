import { describe, expect, it } from 'vitest';
import { translateGameText } from './index';

describe('regression translations for unique and mythical unique pages', () => {
  it('translates HTM unique category filter labels that are not normal item names', () => {
    expect(translateGameText('Bow Quiver2')).toBe('弓箭袋');
    expect(translateGameText('Amazon Bow')).toBe('亚马逊弓');
    expect(translateGameText('Druid Club')).toBe('德鲁伊木棒');
    expect(translateGameText('Necromancer Polearm')).toBe('死灵法师长柄武器');
    expect(translateGameText('Hand to Hand 1')).toBe('格斗武器 1');
    expect(translateGameText('Auric Shields')).toBe('圣骑士盾牌');
    expect(translateGameText('Coupon Rings')).toBe('优惠券戒指');
    expect(translateGameText('Sor Amulet')).toBe('女巫项链');
  });

  it('translates character-level resistance affixes with the stat name first', () => {
    expect(translateGameText('Cold Resist +0.5% (Based on Character Level)')).toBe('冰冷抗性 +0.5%（基于角色等级）');
    expect(translateGameText('Lightning Resist +0.5% (Based on Character Level)')).toBe('闪电抗性 +0.5%（基于角色等级）');
    expect(translateGameText('Fire Resist +1% (Based on Character Level)')).toBe('火焰抗性 +1%（基于角色等级）');
    expect(translateGameText('Poison Resist +0.5% (Based on Character Level)')).toBe('毒素抗性 +0.5%（基于角色等级）');
  });

  it('translates remaining example unique and mythical affixes', () => {
    expect(translateGameText('+(1 to 2) to Elemental Skills (Druid Only)')).toBe('+(1 to 2) 元素技能（仅德鲁伊）');
    expect(translateGameText('5% Chance to Cast Level 40 Cyclone Armor when Taking Damage')).toBe(
      '5% 几率在受到伤害时施放等级 40 旋风护甲'
    );
  });

  it('translates common affix forms found by the unique page scan', () => {
    expect(translateGameText('100% Chance to Cast Level 60 Rain of Fire When you Die')).toBe('100% 几率在死亡时施放等级 60 火雨');
    expect(translateGameText('+(2 to 3) to Bow and Crossbow Skills (Amazon Only)')).toBe('+(2 to 3) 弓和弩技能（仅亚马逊）');
    expect(translateGameText('+(1 to 3) to Fire Skills (Sorceress Only)')).toBe('+(1 to 3) 火焰技能（仅女巫）');
    expect(translateGameText('+2% Enhanced Defense (Based on Character Level)')).toBe('+2% 增强防御（基于角色等级）');
    expect(translateGameText('+4 Maximum Stamina (Based on Character Level)')).toBe('+4 最大耐力（基于角色等级）');
    expect(translateGameText('+20 To Random Class Skill (Class Only)')).toBe('+20 随机职业技能（仅职业）');
    expect(translateGameText('+0.5 Absorbs Fire Damage (Based on Character Level)')).toBe('+0.5 火焰伤害吸收（基于角色等级）');
    expect(translateGameText('Adds 100-200 Damage to Attacks')).toBe('攻击附加 100-200 伤害');
  });
});
