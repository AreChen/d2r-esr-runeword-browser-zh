import { describe, expect, it } from 'vitest';
import type { GuidePage } from '@/core/db';
import { filterGuidePageTables, getGuideTableSections, parseGuideRowRequiredLevel } from './guideTableFilters';

const samplePage: GuidePage = {
  id: 'sample',
  group: 'base',
  label: 'Sample',
  title: '示例资料',
  sourcePath: 'sample.htm',
  sourceUrl: 'https://example.test/sample.htm',
  order: 1,
  textIndex: '',
  blocks: [
    { id: 'intro', kind: 'paragraph', text: 'Intro' },
    {
      id: 'body',
      kind: 'table',
      caption: 'Body Armor',
      headers: ['Name', 'Stats', 'Properties'],
      rows: [
        ['Zuez Padding Quilted Armor (qui)\nGamble Item: Quilted Armor (qui)', 'Item Level: 9 Required Level: 7', 'Cold Resist +5%'],
        ['Mage Plate Mage Plate (xtp)', 'Item Level: 45 Required Level: 30', '+100 Defense'],
      ],
    },
    {
      id: 'helm',
      kind: 'table',
      caption: 'Helm',
      headers: ['Name', 'Stats', 'Properties'],
      rows: [['Cap of the Raven Cap (cap)', 'Item Level: 4 Required Level: 4', '+1 to Summoning Skills (Druid Only)']],
    },
    {
      id: 'tier1',
      kind: 'table',
      caption: 'Tier 1 Each tier 1 recipe consumes 350 souls per use.',
      headers: ['Input(s)', 'Possible Outcome(s)'],
      rows: [['Vessel of Souls\n2x Heart\nBrain\nTail\nQuill', 'Same Item\n+5% Chance to Cast Level 15 Thrown Axe on Striking']],
    },
  ],
};

describe('guide table filtering helpers', () => {
  it('extracts compact section keys from table captions', () => {
    expect(getGuideTableSections(samplePage)).toEqual([
      { key: 'Body Armor', label: 'Body Armor', rowCount: 2 },
      { key: 'Helm', label: 'Helm', rowCount: 1 },
      { key: 'Tier 1', label: 'Tier 1', rowCount: 1 },
    ]);
  });

  it('filters rows by section, localized search, and maximum required level', () => {
    const result = filterGuidePageTables(samplePage, {
      searchText: '冰冷抗性',
      selectedSections: ['Body Armor'],
      favoriteSections: [],
      showFavoritesOnly: false,
      maxReqLevel: 10,
    });

    expect(result.totalRowCount).toBe(4);
    expect(result.visibleRowCount).toBe(1);
    expect(result.page.blocks).toContainEqual({
      id: 'body',
      kind: 'table',
      caption: 'Body Armor',
      headers: ['Name', 'Stats', 'Properties'],
      rows: [['Zuez Padding Quilted Armor (qui)\nGamble Item: Quilted Armor (qui)', 'Item Level: 9 Required Level: 7', 'Cold Resist +5%']],
    });
    expect(result.page.blocks.some((block) => block.kind === 'table' && block.id === 'helm')).toBe(false);
  });

  it('can restrict visible rows to favorite sections only', () => {
    const result = filterGuidePageTables(samplePage, {
      searchText: '',
      selectedSections: [],
      favoriteSections: ['Helm'],
      showFavoritesOnly: true,
      maxReqLevel: null,
    });

    expect(result.visibleRowCount).toBe(1);
    expect(result.page.blocks.filter((block) => block.kind === 'table').map((block) => block.caption)).toEqual(['Helm']);
  });

  it('parses required level from common database row formats', () => {
    expect(parseGuideRowRequiredLevel(['Lvl 5 / Req Lvl 3'])).toBe(3);
    expect(parseGuideRowRequiredLevel(['Item Level: 9 Required Level: 7'])).toBe(7);
    expect(parseGuideRowRequiredLevel(['Quilted Armor', '0'], ['Name', 'Req Lvl'])).toBe(0);
    expect(parseGuideRowRequiredLevel(['No level text'])).toBeNull();
  });
});
