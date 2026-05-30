import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { parseGemsHtml } from './gemsParser';
import { parseGemwordsHtml, calculateGemwordReqLevel } from './gemwordsParser';
import type { GemReqLevelLookup } from './runewordsParser';

const gemwordsHtml = readFileSync(resolve(__dirname, '../../../../test-fixtures/gemwords.htm'), 'utf-8');
const gemsHtml = readFileSync(resolve(__dirname, '../../../../test-fixtures/gems.htm'), 'utf-8');

describe('parseGemwordsHtml', () => {
  const gems = parseGemsHtml(gemsHtml);
  const gemReqLevelLookup: GemReqLevelLookup = new Map(gems.map((gem) => [gem.name, gem.reqLevel]));

  it('parses every official gemword recipe row', () => {
    const gemwords = parseGemwordsHtml(gemwordsHtml, gemReqLevelLookup);

    expect(gemwords).toHaveLength(590);
  });

  it('parses a one-socket Holy gemword with allowed items and per-column bonuses', () => {
    const gemwords = parseGemwordsHtml(gemwordsHtml, gemReqLevelLookup);
    const holy = gemwords.find((gemword) => gemword.name === 'Holy' && gemword.variant === 1);

    expect(holy).toBeDefined();
    expect(holy?.sockets).toBe(1);
    expect(holy?.reqLevel).toBe(1);
    expect(holy?.gems).toEqual(['Chipped Diamond']);
    expect(holy?.ingredients).toEqual(['Chipped Diamond']);
    expect(holy?.allowedItems).toEqual(['Body Armor', 'Any Shield', 'Helm', 'Charm', 'Boots', 'Belt']);
    expect(holy?.columnAffixes.weaponsGloves).toEqual([]);
    expect(holy?.columnAffixes.helmsBoots.map((affix) => affix.rawText)).toContain('5% Chance to Cast Level 5 Magic Surge when Struck');
    expect(holy?.columnAffixes.armorShieldsBelts.map((affix) => affix.rawText)).toContain('Cold Resist +5%');
  });

  it('keeps gemword variants separate by name', () => {
    const gemwords = parseGemwordsHtml(gemwordsHtml, gemReqLevelLookup);
    const holyVariants = gemwords.filter((gemword) => gemword.name === 'Holy');

    expect(holyVariants.length).toBeGreaterThan(20);
    expect(holyVariants.slice(0, 6).map((gemword) => gemword.variant)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('calculates required level from the highest required gem', () => {
    expect(calculateGemwordReqLevel(['Chipped Diamond'], gemReqLevelLookup)).toBe(1);
    expect(calculateGemwordReqLevel(['Perfect Diamond', 'Flawed Diamond'], gemReqLevelLookup)).toBe(35);
  });
});
