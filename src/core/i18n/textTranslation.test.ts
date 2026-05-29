import { describe, expect, it } from 'vitest';
import { createTextTranslator, stripDiabloColorCodes } from './textTranslation';

const translator = createTextTranslator({
  exactTranslations: {
    'El Rune': 'El 符文',
    'Shadow Quartz': '影子石英',
    Sanctuary: '庇护所',
  },
  templateTranslations: [
    ['%+d to Strength', '%+d 力量'],
    ['Fire Resist %+d%%', '火焰抗性 %+d%%'],
    ['Adds %d-%d Fire Damage', '增加 %d-%d 火焰伤害'],
    ['%+d%% Enhanced Damage', '%+d%% 增强伤害'],
    ['Level %d %s Aura When Equipped', '等级 %d %s 灵气赋予'],
    ['Socketed (%i)', '镶孔 (%i)'],
    ['%d to Monster Defense Per Hit', '每次击中怪物防御 %d'],
  ],
  translateCapturedText: (text) => translator.translateText(text),
});

describe('stripDiabloColorCodes', () => {
  it('removes Diablo color markers without touching visible text', () => {
    expect(stripDiabloColorCodes('ÿc9El Runeÿc0')).toBe('El Rune');
  });
});

describe('createTextTranslator', () => {
  it('translates exact entries after color codes are stripped', () => {
    expect(translator.translateText('ÿc9El Rune')).toBe('El 符文');
  });

  it('normalizes whitespace before exact lookup', () => {
    expect(translator.translateText('  Shadow   Quartz  ')).toBe('影子石英');
  });

  it('translates signed numeric templates', () => {
    expect(translator.translateText('+3 to Strength')).toBe('+3 力量');
  });

  it('translates percent templates', () => {
    expect(translator.translateText('Fire Resist +12%')).toBe('火焰抗性 +12%');
  });

  it('translates range templates', () => {
    expect(translator.translateText('Adds 10-20 Fire Damage')).toBe('增加 10-20 火焰伤害');
  });

  it('translates parenthesized numeric ranges used by unique item pages', () => {
    expect(translator.translateText('+(125 to 200)% Enhanced Damage')).toBe('+(125 to 200)% 增强伤害');
  });

  it('translates decimal numeric values used by unique item pages', () => {
    expect(translator.translateText('+0.5 to Strength')).toBe('+0.5 力量');
  });

  it('recursively translates captured text placeholders', () => {
    expect(translator.translateText('Level (5 to 10) Sanctuary Aura When Equipped')).toBe('等级 (5 to 10) 庇护所 灵气赋予');
  });

  it('translates bare ranges inside literal parentheses', () => {
    expect(translator.translateText('Socketed (1 to 3)')).toBe('镶孔 (1 to 3)');
  });

  it('translates negative parenthesized ranges', () => {
    expect(translator.translateText('(-50 to -25) to Monster Defense Per Hit')).toBe('每次击中怪物防御 (-50 to -25)');
  });

  it('falls back to the original visible text when no translation matches', () => {
    expect(translator.translateText('Unknown Property')).toBe('Unknown Property');
  });
});
