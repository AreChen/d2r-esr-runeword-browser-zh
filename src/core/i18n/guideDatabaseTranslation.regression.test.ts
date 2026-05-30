import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { GuidePage } from '@/core/db';
import { getGuidePageEntry } from '@/core/api/guidePageCatalog';
import { parseGuidePage } from '@/features/data-sync/parsers';
import { translateGuideText } from './guideTranslation';

function readGuideFixture(id: string): GuidePage {
  const entry = getGuidePageEntry(id);
  const html = readFileSync(resolve(process.cwd(), 'test-fixtures', entry.sourcePath), 'utf-8');
  return parseGuidePage(html, entry);
}

function collectTranslatedGuideText(page: GuidePage): string {
  const parts: string[] = [translateGuideText(page.label), page.title];

  for (const block of page.blocks) {
    if (block.kind === 'heading' || block.kind === 'paragraph') {
      parts.push(translateGuideText(block.text));
    } else if (block.kind === 'table') {
      parts.push(translateGuideText(block.caption), ...block.headers.map(translateGuideText), ...block.rows.flat().map(translateGuideText));
    } else {
      parts.push(translateGuideText(block.alt));
    }
  }

  return parts.filter(Boolean).join('\n');
}

describe('guide database translation regressions', () => {
  it('translates screenshot examples after parsing fresh official guide data', () => {
    const cubeRecipesText = collectTranslatedGuideText(readGuideFixture('cubeRecipes'));
    expect(cubeRecipesText).toContain('多数会重置投入物的公式在投入物带有锻造时不会生效，但并非全部如此。');
    expect(cubeRecipesText).toContain('身体部位表示身体护甲。护甲表示所有类型的护甲。');
    expect(cubeRecipesText).not.toContain('Most, but not all, recipes');
    expect(cubeRecipesText).not.toContain('Torso means Body Armor');

    const setsText = collectTranslatedGuideText(readGuideFixture('sets'));
    expect(setsText).toContain('阿托利库斯的长袍');
    expect(setsText).toContain('赌博物品: 绗缝铠甲 (qui)');
    expect(setsText).toContain('+30 防御');
    expect(setsText).not.toContain("Autolycus' Robes");

    const corruptionsText = collectTranslatedGuideText(readGuideFixture('corruptions'));
    expect(corruptionsText).toContain('腐化是通过将世界石碎片与任意物品合成获得的独特加成。');
    expect(corruptionsText).not.toContain('Corruptions are unique bonuses');
  });
});
