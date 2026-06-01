import { describe, expect, it } from 'vitest';
import type { GuidePage } from '@/core/db';
import {
  filterGuidePageTables,
  getGuideRowMarkerOptions,
  getGuideTableSections,
  isGuideTableFilterState,
  parseGuideRowRequiredLevel,
} from './guideTableFilters';

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
        ['Forged Plate', 'Dragon Stone\nGreen Aura Stone', 'Same Item'],
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
      { key: 'Body Armor', label: 'Body Armor', rowCount: 3 },
      { key: 'Helm', label: 'Helm', rowCount: 1 },
      { key: 'Tier 1', label: 'Tier 1', rowCount: 1 },
    ]);
  });

  it('adds per-section match counts from row filters without applying section selection', () => {
    expect(
      getGuideTableSections(samplePage, {
        searchText: 'Thrown Axe',
        selectedSections: ['Body Armor'],
        favoriteSections: [],
        showFavoritesOnly: false,
        maxReqLevel: null,
        selectedMarkers: [],
      })
    ).toEqual([
      { key: 'Body Armor', label: 'Body Armor', rowCount: 3, matchedRowCount: 0 },
      { key: 'Helm', label: 'Helm', rowCount: 1, matchedRowCount: 0 },
      { key: 'Tier 1', label: 'Tier 1', rowCount: 1, matchedRowCount: 1 },
    ]);
  });

  it('filters rows by section, localized search, and maximum required level', () => {
    const result = filterGuidePageTables(samplePage, {
      searchText: '冰冷抗性',
      selectedSections: ['Body Armor'],
      favoriteSections: [],
      showFavoritesOnly: false,
      maxReqLevel: 10,
      selectedMarkers: [],
    });

    expect(result.totalRowCount).toBe(5);
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

  it('removes loose paragraphs while a table filter is active', () => {
    const result = filterGuidePageTables(samplePage, {
      searchText: '',
      selectedSections: ['Body Armor'],
      favoriteSections: [],
      showFavoritesOnly: false,
      maxReqLevel: null,
      selectedMarkers: [],
    });

    expect(result.page.blocks.some((block) => block.kind === 'paragraph')).toBe(false);
    expect(result.page.blocks.filter((block) => block.kind === 'table').map((block) => block.caption)).toEqual(['Body Armor']);
  });

  it('keeps loose paragraphs when no table filter is active', () => {
    const result = filterGuidePageTables(samplePage, {
      searchText: '',
      selectedSections: [],
      favoriteSections: [],
      showFavoritesOnly: false,
      maxReqLevel: null,
      selectedMarkers: [],
    });

    expect(result.page.blocks.some((block) => block.kind === 'paragraph' && block.text === 'Intro')).toBe(true);
  });

  it('can restrict visible rows to favorite sections only', () => {
    const result = filterGuidePageTables(samplePage, {
      searchText: '',
      selectedSections: [],
      favoriteSections: ['Helm'],
      showFavoritesOnly: true,
      maxReqLevel: null,
      selectedMarkers: [],
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

  it('validates persisted marker filter state while keeping old saved filters compatible', () => {
    const oldSavedState = {
      searchText: '',
      selectedSections: [],
      favoriteSections: [],
      showFavoritesOnly: false,
      maxReqLevel: null,
    };

    expect(isGuideTableFilterState(oldSavedState)).toBe(true);
    expect(isGuideTableFilterState({ ...oldSavedState, selectedMarkers: ['cube', 'affix'] })).toBe(true);
    expect(isGuideTableFilterState({ ...oldSavedState, selectedMarkers: ['not-a-marker'] })).toBe(false);
  });

  it('filters rows by semantic material and affix markers', () => {
    const cubeResult = filterGuidePageTables(samplePage, {
      searchText: '',
      selectedSections: [],
      favoriteSections: [],
      showFavoritesOnly: false,
      maxReqLevel: null,
      selectedMarkers: ['cube'],
    });

    expect(cubeResult.visibleRowCount).toBe(1);
    expect(cubeResult.page.blocks.filter((block) => block.kind === 'table').flatMap((block) => block.rows)).toEqual([
      ['Forged Plate', 'Dragon Stone\nGreen Aura Stone', 'Same Item'],
    ]);

    const affixResult = filterGuidePageTables(samplePage, {
      searchText: '',
      selectedSections: [],
      favoriteSections: [],
      showFavoritesOnly: false,
      maxReqLevel: null,
      selectedMarkers: ['affix'],
    });

    expect(affixResult.visibleRowCount).toBe(4);
    expect(affixResult.page.blocks.filter((block) => block.kind === 'table').flatMap((block) => block.rows)).toEqual([
      ['Zuez Padding Quilted Armor (qui)\nGamble Item: Quilted Armor (qui)', 'Item Level: 9 Required Level: 7', 'Cold Resist +5%'],
      ['Mage Plate Mage Plate (xtp)', 'Item Level: 45 Required Level: 30', '+100 Defense'],
      ['Cap of the Raven Cap (cap)', 'Item Level: 4 Required Level: 4', '+1 to Summoning Skills (Druid Only)'],
      ['Vessel of Souls\n2x Heart\nBrain\nTail\nQuill', 'Same Item\n+5% Chance to Cast Level 15 Thrown Axe on Striking'],
    ]);
  });

  it('builds row marker filter options only for markers found on the current guide page', () => {
    expect(getGuideRowMarkerOptions(samplePage)).toEqual([
      { kind: 'organ', label: '器官', rowCount: 1 },
      { kind: 'cube', label: '方块材料', rowCount: 1 },
      { kind: 'affix', label: '属性词缀', rowCount: 4 },
    ]);
  });
});
