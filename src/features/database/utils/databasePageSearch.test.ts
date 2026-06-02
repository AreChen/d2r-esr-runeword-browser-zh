import { describe, expect, it } from 'vitest';
import type { GuidePage } from '@/core/db';
import { pageMatchesDatabaseSearch } from './databasePageSearch';

const guidePage: GuidePage = {
  id: 'cubeRecipes',
  group: 'base',
  label: 'Cube Recipes',
  title: '赫拉迪克方块公式',
  sourcePath: 'cube.html',
  sourceUrl: 'https://example.test/cube.html',
  order: 1,
  textIndex: 'Unique Reroll Base upgraded uniques cannot be rerolled.',
  blocks: [],
};

describe('database page search', () => {
  it('matches Chinese translated page content while caching translated text indexes per page', () => {
    let textIndexTranslationCount = 0;
    const translateText = (text: string): string => {
      if (text === guidePage.textIndex) {
        textIndexTranslationCount += 1;
        return '暗金重置 底材已升级的暗金物品不能重置。';
      }
      return text;
    };

    expect(pageMatchesDatabaseSearch(guidePage, ['暗金重置'], translateText)).toBe(true);
    expect(pageMatchesDatabaseSearch(guidePage, ['不能重置'], translateText)).toBe(true);
    expect(textIndexTranslationCount).toBe(1);
  });

  it('does not translate the large text index for English-only terms', () => {
    let textIndexTranslationCount = 0;
    const translateText = (text: string): string => {
      if (text === guidePage.textIndex) {
        textIndexTranslationCount += 1;
      }
      return text;
    };

    expect(pageMatchesDatabaseSearch(guidePage, ['unique'])).toBe(true);
    expect(pageMatchesDatabaseSearch(guidePage, ['unique'], translateText)).toBe(true);
    expect(textIndexTranslationCount).toBe(0);
  });
});
