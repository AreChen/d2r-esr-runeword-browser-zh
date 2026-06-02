import { describe, expect, it } from 'vitest';
import type { GuidePage } from '@/core/db';
import {
  buildGuideTableRowFavoriteId,
  filterGuidePageTables,
  getGuideRowMarkerOptions,
  getGuideRowMarkers,
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
        ['Forged Plate', 'Dragon Stone\nGreen Aura Stone\nSocket Donut', 'Same Item'],
        ['Forging Plate', 'Forging Hammer\nHoly Symbol\nBlackmoor', 'Same Item'],
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

const affixMarkerPage: GuidePage = {
  id: 'affixes',
  group: 'base',
  label: 'Affixes',
  title: '词缀资料',
  sourcePath: 'affixes.htm',
  sourceUrl: 'https://example.test/affixes.htm',
  order: 2,
  textIndex: '',
  blocks: [
    {
      id: 'affix-table',
      kind: 'table',
      caption: 'Affix Outcomes',
      headers: ['Input', 'Output'],
      rows: [
        ['Skill result', '+1 to All Skills'],
        ['Resist result', 'Cold Resist +5%'],
        ['Damage result', '+(150 to 200)% Enhanced Damage'],
        ['Speed result', '5% Faster Cast Rate'],
        ['Trigger result', '5% Chance to Cast Level 20 Fire Ball on Striking'],
        ['General result', '+100 Defense'],
      ],
    },
  ],
};

describe('guide table filtering helpers', () => {
  it('extracts compact section keys from table captions', () => {
    expect(getGuideTableSections(samplePage)).toEqual([
      { key: 'Body Armor', label: 'Body Armor', rowCount: 4 },
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
      { key: 'Body Armor', label: 'Body Armor', rowCount: 4, matchedRowCount: 0 },
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

    expect(result.totalRowCount).toBe(6);
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

  it('can restrict visible rows to favorite concrete recipe rows', () => {
    const bodyTable = samplePage.blocks.find((block) => block.kind === 'table' && block.id === 'body');
    expect(bodyTable?.kind).toBe('table');
    if (!bodyTable || bodyTable.kind !== 'table') return;

    const favoriteRowId = buildGuideTableRowFavoriteId(bodyTable, bodyTable.rows[1] ?? []);
    const result = filterGuidePageTables(samplePage, {
      searchText: '',
      selectedSections: [],
      favoriteSections: [],
      favoriteRows: [favoriteRowId],
      showFavoritesOnly: true,
      maxReqLevel: null,
      selectedMarkers: [],
    });

    expect(result.visibleRowCount).toBe(1);
    expect(result.page.blocks.filter((block) => block.kind === 'table').flatMap((block) => block.rows)).toEqual([
      ['Mage Plate Mage Plate (xtp)', 'Item Level: 45 Required Level: 30', '+100 Defense'],
    ]);
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
    expect(
      isGuideTableFilterState({
        ...oldSavedState,
        favoriteRows: ['Body Armor::abc123'],
        selectedMarkers: ['cube', 'dstone', 'forging', 'aura', 'socket', 'map', 'affix', 'skillAffix', 'resistAffix', 'damageAffix'],
      })
    ).toBe(true);
    expect(isGuideTableFilterState({ ...oldSavedState, selectedMarkers: ['not-a-marker'] })).toBe(false);
  });

  it('filters rows by specific material and affix markers', () => {
    const dstoneResult = filterGuidePageTables(samplePage, {
      searchText: '',
      selectedSections: [],
      favoriteSections: [],
      showFavoritesOnly: false,
      maxReqLevel: null,
      selectedMarkers: ['dstone'],
    });

    expect(dstoneResult.visibleRowCount).toBe(1);
    expect(dstoneResult.page.blocks.filter((block) => block.kind === 'table').flatMap((block) => block.rows)).toEqual([
      ['Forged Plate', 'Dragon Stone\nGreen Aura Stone\nSocket Donut', 'Same Item'],
    ]);

    const forgingResult = filterGuidePageTables(samplePage, {
      searchText: '',
      selectedSections: [],
      favoriteSections: [],
      showFavoritesOnly: false,
      maxReqLevel: null,
      selectedMarkers: ['forging'],
    });

    expect(forgingResult.visibleRowCount).toBe(1);
    expect(forgingResult.page.blocks.filter((block) => block.kind === 'table').flatMap((block) => block.rows)).toEqual([
      ['Forging Plate', 'Forging Hammer\nHoly Symbol\nBlackmoor', 'Same Item'],
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

  it('keeps generic affix filtering while adding specific affix marker filters', () => {
    const genericAffixResult = filterGuidePageTables(affixMarkerPage, {
      searchText: '',
      selectedSections: [],
      favoriteSections: [],
      showFavoritesOnly: false,
      maxReqLevel: null,
      selectedMarkers: ['affix'],
    });
    const skillAffixResult = filterGuidePageTables(affixMarkerPage, {
      searchText: '',
      selectedSections: [],
      favoriteSections: [],
      showFavoritesOnly: false,
      maxReqLevel: null,
      selectedMarkers: ['skillAffix'],
    });
    const triggerAffixResult = filterGuidePageTables(affixMarkerPage, {
      searchText: '',
      selectedSections: [],
      favoriteSections: [],
      showFavoritesOnly: false,
      maxReqLevel: null,
      selectedMarkers: ['triggerAffix'],
    });

    expect(genericAffixResult.visibleRowCount).toBe(6);
    expect(skillAffixResult.page.blocks.filter((block) => block.kind === 'table').flatMap((block) => block.rows)).toEqual([
      ['Skill result', '+1 to All Skills'],
    ]);
    expect(triggerAffixResult.page.blocks.filter((block) => block.kind === 'table').flatMap((block) => block.rows)).toEqual([
      ['Trigger result', '5% Chance to Cast Level 20 Fire Ball on Striking'],
    ]);
  });

  it('builds row marker options for specific affix families', () => {
    expect(getGuideRowMarkerOptions(affixMarkerPage)).toEqual([
      { kind: 'affix', label: '属性词缀', rowCount: 6 },
      { kind: 'skillAffix', label: '技能加成', rowCount: 1 },
      { kind: 'resistAffix', label: '抗性', rowCount: 1 },
      { kind: 'damageAffix', label: '伤害/穿刺', rowCount: 1 },
      { kind: 'speedAffix', label: '速度', rowCount: 1 },
      { kind: 'triggerAffix', label: '触发施法', rowCount: 1 },
    ]);
  });

  it('caches translated row markers for repeated marker filters on the same row', () => {
    const row = ['Dragon Stone', '+1 to All Skills'];
    let translateCount = 0;
    const translateText = (text: string): string => {
      translateCount += 1;
      return text;
    };

    expect([...getGuideRowMarkers(row, translateText)]).toEqual(['dstone', 'affix', 'skillAffix']);
    expect([...getGuideRowMarkers(row, translateText)]).toEqual(['dstone', 'affix', 'skillAffix']);
    expect(translateCount).toBe(2);
  });

  it('builds row marker filter options only for markers found on the current guide page', () => {
    expect(getGuideRowMarkerOptions(samplePage)).toEqual([
      { kind: 'organ', label: '器官', rowCount: 1 },
      { kind: 'dstone', label: 'D-Stoning/龙石', rowCount: 1 },
      { kind: 'forging', label: '锻造材料', rowCount: 1 },
      { kind: 'aura', label: '光环石', rowCount: 1 },
      { kind: 'socket', label: '镶孔材料', rowCount: 1 },
      { kind: 'affix', label: '属性词缀', rowCount: 4 },
      { kind: 'skillAffix', label: '技能加成', rowCount: 1 },
      { kind: 'resistAffix', label: '抗性', rowCount: 1 },
      { kind: 'triggerAffix', label: '触发施法', rowCount: 1 },
    ]);
  });

  it('counts row marker options against search and section filters while ignoring the active marker filter', () => {
    expect(
      getGuideRowMarkerOptions(samplePage, {
        searchText: '',
        selectedSections: ['Body Armor'],
        favoriteSections: [],
        showFavoritesOnly: false,
        maxReqLevel: null,
        selectedMarkers: ['affix'],
      })
    ).toEqual([
      { kind: 'dstone', label: 'D-Stoning/龙石', rowCount: 1 },
      { kind: 'forging', label: '锻造材料', rowCount: 1 },
      { kind: 'aura', label: '光环石', rowCount: 1 },
      { kind: 'socket', label: '镶孔材料', rowCount: 1 },
      { kind: 'affix', label: '属性词缀', rowCount: 2 },
      { kind: 'resistAffix', label: '抗性', rowCount: 1 },
    ]);

    expect(
      getGuideRowMarkerOptions(samplePage, {
        searchText: 'Thrown Axe',
        selectedSections: [],
        favoriteSections: [],
        showFavoritesOnly: false,
        maxReqLevel: null,
        selectedMarkers: ['dstone'],
      })
    ).toEqual([
      { kind: 'organ', label: '器官', rowCount: 1 },
      { kind: 'affix', label: '属性词缀', rowCount: 1 },
      { kind: 'triggerAffix', label: '触发施法', rowCount: 1 },
    ]);
  });
});
