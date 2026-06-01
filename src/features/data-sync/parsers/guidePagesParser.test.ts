import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CORE_GUIDE_PAGE_IDS, GUIDE_PAGE_CATALOG, getGuidePageEntrySourceUrl } from '@/core/api';
import { parseGuidePage, parseGuidePages } from './guidePagesParser';
import type { GuidePageCatalogEntry } from '@/features/database';

const changelogHtml = readFileSync(resolve(__dirname, '../../../../test-fixtures/changelogs.html'), 'utf-8');
const fixtureDir = resolve(__dirname, '../../../../test-fixtures');

function readGuideFixture(entry: GuidePageCatalogEntry): string {
  return readFileSync(resolve(fixtureDir, entry.fixturePath ?? entry.sourcePath), 'utf-8');
}

function isInputOutputLikeRow(row: readonly string[]): boolean {
  const input = row[0]?.trim() ?? '';
  const output = row[1]?.trim() ?? '';
  return /^(?:Input|输入|投入物)$/u.test(input) && /^(?:Output|输出|产物|可能结果)$/u.test(output);
}

const sampleEntry: GuidePageCatalogEntry = {
  id: 'sample',
  group: 'features',
  label: 'Sample Feature',
  title: '示例机制',
  sourcePath: 'sample.htm',
  order: 1,
};

const sampleHtml = `
  <html>
    <body>
      <h1>Eastern Sun Resurrected 3.11</h1>
      <span>Base Information</span>
      <a href="./changelogs.html">[Changelogs]</a>
      <a href="./armors.htm">[Armor]</a>
      <span>Features</span>
      <a href="./corruptions.htm">[Corruption Outcomes]</a>

      <h2>Corruption Outcomes</h2>
      <p>Corrupted items can gain a powerful bonus.</p>
      <table>
        <tr><td colspan="3"><b>Weapon Outcomes</b></td></tr>
        <tr><th>Outcome</th><th>Chance</th><th>Notes</th></tr>
        <tr><td>Same Item<br>+(150 to 200)% Enhanced Damage<br>Corrupted</td><td>10%</td><td>Cannot exceed maximum sockets</td></tr>
      </table>
      <img src="./images/features/corruption.png" alt="Corruption altar">
    </body>
  </html>
`;

describe('guide page parser', () => {
  it('extracts readable content blocks while skipping the official site navigation', () => {
    const page = parseGuidePage(sampleHtml, sampleEntry);

    expect(page.id).toBe('sample');
    expect(page.group).toBe('features');
    expect(page.title).toBe('示例机制');
    expect(page.sourceUrl).toBe('https://easternsunresurrected.com/sample.htm');
    expect(page.textIndex).toContain('Corrupted items can gain a powerful bonus.');
    expect(page.textIndex).not.toContain('Base Information');
    expect(page.textIndex).not.toContain('[Changelogs]');

    expect(page.blocks).toContainEqual({
      id: 'sample-heading-1',
      kind: 'heading',
      level: 2,
      text: 'Corruption Outcomes',
    });
    expect(page.blocks).toContainEqual({
      id: 'sample-paragraph-2',
      kind: 'paragraph',
      text: 'Corrupted items can gain a powerful bonus.',
    });
    expect(page.blocks).toContainEqual({
      id: 'sample-table-3',
      kind: 'table',
      caption: 'Weapon Outcomes',
      headers: ['Outcome', 'Chance', 'Notes'],
      rows: [['Same Item\n+(150 to 200)% Enhanced Damage\nCorrupted', '10%', 'Cannot exceed maximum sockets']],
    });
    expect(page.blocks).toContainEqual({
      id: 'sample-image-4',
      kind: 'image',
      src: './images/features/corruption.png',
      alt: 'Corruption altar',
    });
  });

  it('keeps source-wrapped table text together while preserving real line breaks', () => {
    const page = parseGuidePage(
      `
        <html>
          <body>
            <table>
              <tr><th>Reward</th><th>Notes</th></tr>
              <tr>
                <td>
                  Tier 2 Map (25%
                  chance on average)<br>
                  Random Pandemonium Key (100%
                  chance each on average)
                </td>
                <td>Map rewards</td>
              </tr>
            </table>
          </body>
        </html>
      `,
      sampleEntry
    );

    const table = page.blocks.find((block) => block.kind === 'table');

    expect(table).toBeDefined();
    if (!table || table.kind !== 'table') return;
    expect(table.rows[0]?.[0]).toBe('Tier 2 Map (25% chance on average)\nRandom Pandemonium Key (100% chance each on average)');
  });

  it('preserves empty table cells so later columns stay aligned with headers', () => {
    const page = parseGuidePage(
      `
        <html>
          <body>
            <table>
              <tr><th>Name</th><th>Gem Type</th><th>Automod</th><th>Staffmod</th></tr>
              <tr><td>Precision Bow</td><td></td><td></td><td>+1 Bow Skills</td></tr>
            </table>
          </body>
        </html>
      `,
      sampleEntry
    );

    const table = page.blocks.find((block) => block.kind === 'table');

    expect(table).toBeDefined();
    if (!table || table.kind !== 'table') return;
    expect(table.rows[0]).toEqual(['Precision Bow', '', '', '+1 Bow Skills']);
  });

  it('expands colspan cells so base-data table headers stay aligned with row cells', () => {
    const page = parseGuidePage(
      `
        <html>
          <body>
            <table>
              <tr><td colspan="17"><b>Amazon Bow</b></td></tr>
              <tr>
                <th>Name</th>
                <th colspan="3">Damage</th>
                <th>Dur</th>
                <th>Range</th>
                <th>WSM</th>
                <th>Qlvl</th>
                <th>Req Lvl</th>
                <th>Req Str</th>
                <th>Req Dex</th>
                <th>Str/Dex Bonus</th>
                <th>Soc</th>
                <th>Gem Type</th>
                <th>Automod</th>
                <th>Staffmod</th>
              </tr>
              <tr>
                <td>Precision Bow<br>apb</td>
                <td>2H</td>
                <td>5 to 27</td>
                <td>16.0 Avg</td>
                <td></td>
                <td></td>
                <td></td>
                <td>33</td>
                <td>0</td>
                <td>35</td>
                <td>65</td>
                <td>0/75</td>
                <td>4</td>
                <td>0</td>
                <td>+1 Bow Skills</td>
                <td></td>
              </tr>
            </table>
          </body>
        </html>
      `,
      sampleEntry
    );

    const table = page.blocks.find((block) => block.kind === 'table');

    expect(table).toBeDefined();
    if (!table || table.kind !== 'table') return;
    expect(table.caption).toBe('Amazon Bow');
    expect(table.headers).toHaveLength(16);
    expect(table.headers.slice(0, 7)).toEqual(['Name', 'Damage', '', '', 'Dur', 'Range', 'WSM']);
    expect(table.rows[0]).toHaveLength(table.headers.length);
    expect(table.rows[0]?.[4]).toBe('');
    expect(table.rows[0]?.[6]).toBe('');
    expect(table.rows[0]?.[7]).toBe('33');
    expect(table.rows[0]?.[14]).toBe('+1 Bow Skills');
  });

  it('inserts placeholders for rowspans so continuation rows stay under their original columns', () => {
    const page = parseGuidePage(
      `
        <html>
          <body>
            <table>
              <tr><td colspan="16"><b>Amazon Javelin</b></td></tr>
              <tr>
                <th>Name</th>
                <th colspan="3">Damage</th>
                <th>Dur</th>
                <th>Range</th>
                <th>WSM</th>
                <th>Qlvl</th>
                <th>Req Lvl</th>
                <th>Req Str</th>
                <th>Req Dex</th>
                <th>Str/Dex Bonus</th>
                <th>Soc</th>
                <th>Gem Type</th>
                <th>Automod</th>
                <th>Staffmod</th>
              </tr>
              <tr>
                <td rowspan="2">Maiden Javelin<br>am5</td>
                <td>1H</td>
                <td>6 to 22</td>
                <td>14.0 Avg</td>
                <td rowspan="2">60</td>
                <td rowspan="2">2</td>
                <td rowspan="2">-10</td>
                <td rowspan="2">24</td>
                <td rowspan="2">17</td>
                <td rowspan="2">33</td>
                <td rowspan="2">47</td>
                <td rowspan="2">75/75</td>
                <td rowspan="2">3</td>
                <td rowspan="2">0</td>
                <td rowspan="2">+1 Javelin Skills</td>
                <td rowspan="2"></td>
              </tr>
              <tr>
                <td>Mis</td>
                <td>6 to 22</td>
                <td>14.0 Avg</td>
              </tr>
            </table>
          </body>
        </html>
      `,
      sampleEntry
    );

    const table = page.blocks.find((block) => block.kind === 'table');

    expect(table).toBeDefined();
    if (!table || table.kind !== 'table') return;
    expect(table.headers).toHaveLength(16);
    expect(table.rows[1]).toHaveLength(table.headers.length);
    expect(table.rows[1]?.slice(0, 8)).toEqual(['', 'Mis', '6 to 22', '14.0 Avg', '', '', '', '']);
    expect(table.rows[1]?.[14]).toBe('');
  });

  it('parses the real changelog fixture as a guide page without keeping the nav menu as content', () => {
    const [page] = parseGuidePages([
      {
        entry: {
          id: 'changelogs',
          group: 'base',
          label: 'Changelogs',
          title: '更新日志',
          sourcePath: 'changelogs.html',
          order: 0,
        },
        html: changelogHtml,
      },
    ]);

    expect(page).toBeDefined();
    expect(page.blocks.length).toBeGreaterThan(20);
    expect(page.textIndex).toContain('Eastern Sun Resurrected 3.11');
    expect(page.textIndex).not.toContain('Base Information');
    expect(page.textIndex).not.toContain('[Armor]');
  });

  it('parses all official guide page fixtures into app-owned content blocks', () => {
    const sources = GUIDE_PAGE_CATALOG.map((entry) => ({
      entry,
      html: readGuideFixture(entry),
    }));

    const pages = parseGuidePages(sources);

    expect(pages).toHaveLength(GUIDE_PAGE_CATALOG.length);
    for (const page of pages) {
      expect(page.blocks.length, page.id).toBeGreaterThan(0);
      expect(page.textIndex, page.id).not.toContain('Base Information');
      expect(page.textIndex, page.id).not.toContain('[Changelogs]');
    }
  }, 25000);

  it('keeps equipment and affix base information pages as real tables', () => {
    const tableHeavyPageIds = ['armors', 'weapons', 'prefixes', 'suffixes', 'sets', 'gemwords', 'cubeRecipes', 'maps'] as const;

    for (const id of tableHeavyPageIds) {
      const entry = GUIDE_PAGE_CATALOG.find((page) => page.id === id);
      expect(entry, id).toBeDefined();
      if (!entry) continue;

      const page = parseGuidePage(readGuideFixture(entry), entry);
      const tables = page.blocks.filter((block) => block.kind === 'table');
      const tableRows = tables.reduce((total, table) => total + table.rows.length, 0);

      expect(tables.length, id).toBeGreaterThan(0);
      expect(tableRows, id).toBeGreaterThan(10);
    }
  }, 20000);

  it('uses DPDNS cube formulas as the canonical formula page instead of a duplicate off-site page', () => {
    const cubeEntry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'cubeRecipes');

    expect(cubeEntry).toBeDefined();
    expect(GUIDE_PAGE_CATALOG.map((page) => page.id as string)).not.toContain('d2rCubeFormula');
    expect(cubeEntry ? getGuidePageEntrySourceUrl(cubeEntry) : '').toBe('https://d2r.dpdns.org/CubeFormula.html');
  });

  it('uses DPDNS as the canonical source for duplicated feature guide pages', () => {
    const replacements = [
      ['corruptions', 'd2rCorruption', 'https://d2r.dpdns.org/Corruption.html'],
      ['anointments', 'd2rAnointment', 'https://d2r.dpdns.org/Anointment.html'],
      ['endgameMaps', 'd2rEndMap', 'https://d2r.dpdns.org/EndMap.html'],
      ['vesselOfSouls', 'd2rVesselOfSouls', 'https://d2r.dpdns.org/Vessel_Of_Souls.html'],
      ['ascendancies', 'd2rAscendancies', 'https://d2r.dpdns.org/Ascendancies.html'],
      ['killLedger', 'd2rKillLedger', 'https://d2r.dpdns.org/kill_ledger.html'],
      ['skillInformation', 'd2rSkillInformation', 'https://d2r.dpdns.org/skill_information.html'],
      ['weaponMastery', 'd2rWeaponMastery', 'https://d2r.dpdns.org/weapon_mastery.html'],
    ] as const;
    const catalogIds = GUIDE_PAGE_CATALOG.map((page) => page.id as string);

    for (const [canonicalId, duplicateId, expectedUrl] of replacements) {
      const entry = GUIDE_PAGE_CATALOG.find((page) => page.id === canonicalId);

      expect(entry, canonicalId).toBeDefined();
      expect(entry?.group, canonicalId).toBe('features');
      expect(entry ? getGuidePageEntrySourceUrl(entry) : '').toBe(expectedUrl);
      expect(catalogIds, duplicateId).not.toContain(duplicateId);
    }
  });

  it('fetches DPDNS-backed canonical feature guide pages through the guide page catalog', () => {
    const canonicalDpdnsFeatureIds = [
      'corruptions',
      'anointments',
      'endgameMaps',
      'vesselOfSouls',
      'ascendancies',
      'killLedger',
      'skillInformation',
      'weaponMastery',
    ] as const;
    const skippedCoreIds = new Set<string>(CORE_GUIDE_PAGE_IDS);

    for (const id of canonicalDpdnsFeatureIds) {
      expect(skippedCoreIds.has(id), id).toBe(false);
    }
  });

  it('uses the real Input/Output row as headers for DPDNS cube recipe categories', () => {
    const entry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'cubeRecipes');
    expect(entry).toBeDefined();
    if (!entry) return;

    const page = parseGuidePage(readGuideFixture(entry), entry);
    const tables = page.blocks.filter((block) => block.kind === 'table');
    const recipeCaptions = [
      '任务',
      '超级/终局地图配方',
      '杂项/回复',
      '宝石/水晶',
      '古代优惠券',
      '赫拉迪姆方块-材料',
      '普通物品',
      '魔法/稀有物品',
      '独特物品',
      '套装物品',
      '戒指/护身符',
      '咒符',
      '珠宝',
      '箭矢/弩箭 箭袋',
      '锻造',
      '基础升级/更改',
      '镶崁打孔',
      '(原)秘密配方',
    ];

    for (const caption of recipeCaptions) {
      const table = tables.find((block) => block.caption.startsWith(caption));
      expect(table, caption).toBeDefined();
      if (!table) continue;

      expect(table.headers, caption).toEqual(['Input', 'Output']);
      expect(table.rows[0], caption).not.toEqual(['Input', 'Output']);
      expect(
        table.rows.some((row) => isInputOutputLikeRow(row)),
        caption
      ).toBe(false);
    }
  }, 20000);

  it('keeps DPDNS cube recipe category notes inside tables instead of loose pre-table paragraphs', () => {
    const entry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'cubeRecipes');
    expect(entry).toBeDefined();
    if (!entry) return;

    const page = parseGuidePage(readGuideFixture(entry), entry);
    const tables = page.blocks.filter((block) => block.kind === 'table');
    const looseParagraphs = page.blocks.filter((block) => block.kind === 'paragraph').map((block) => block.text);
    const uniqueItemsTable = tables.find((block) => block.caption === '独特物品');
    const uniqueRerollRow = uniqueItemsTable?.rows.find((row) => row[0]?.includes('独特重铸'));

    expect(uniqueItemsTable).toBeDefined();
    expect(uniqueItemsTable?.headers).toEqual(['Input', 'Output']);
    expect(uniqueItemsTable?.rows[0]?.[0]).toContain('套装');
    expect(uniqueItemsTable?.rows[0]?.[1]).toContain('独特');
    expect(uniqueRerollRow?.[0]).toContain('基础升级的独特物品无法重铸');

    expect(looseParagraphs).not.toContain('独特物品');
    expect(looseParagraphs).not.toContain('输入 输出');
    expect(looseParagraphs).not.toContain('投入物 产物');
    expect(looseParagraphs.some((paragraph) => paragraph.includes('套装武器/护甲同底材'))).toBe(false);
    expect(looseParagraphs.some((paragraph) => paragraph.includes('暗金重置'))).toBe(false);
    expect(looseParagraphs.some((paragraph) => paragraph.includes('基础升级的独特物品无法重铸'))).toBe(false);
  }, 20000);

  it('keeps DPDNS ring and jewel cube recipe preface notes out of table headers', () => {
    const entry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'cubeRecipes');
    expect(entry).toBeDefined();
    if (!entry) return;

    const page = parseGuidePage(readGuideFixture(entry), entry);
    const tables = page.blocks.filter((block) => block.kind === 'table');
    const ringsTable = tables.find((block) => block.caption === '戒指/护身符');
    const jewelsTable = tables.find((block) => block.caption === '珠宝');

    expect(ringsTable).toBeDefined();
    expect(jewelsTable).toBeDefined();
    if (!ringsTable || !jewelsTable) return;

    expect(ringsTable.headers).toEqual(['Input', 'Output']);
    expect(ringsTable.notes?.[0]).toContain('当你重置多个护身符或戒指');
    expect(ringsTable.rows[0]).toEqual(['标准重铸', '']);
    expect(ringsTable.rows[1]?.[0]).toContain('3 魔法戒指');
    expect(ringsTable.rows[1]?.[1]).toContain('魔法戒指');

    expect(jewelsTable.headers).toEqual(['Input', 'Output']);
    expect(jewelsTable.notes?.[0]).toContain('重铸之球不再接受');
    expect(jewelsTable.rows[0]?.[0]).toContain('魔法珠宝');
    expect(jewelsTable.rows[0]?.[1]).toContain('魔法珠宝');
  }, 20000);

  it('parses d2r.dpdns.org guide fixtures as searchable guide pages', () => {
    const cubeEntry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'cubeRecipes');
    const amazonEntry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'd2rAmazonGuide');
    const armorEntry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'd2rArmors');
    const quickGuideEntry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'd2rQuickGuide');
    expect(cubeEntry).toBeDefined();
    expect(amazonEntry).toBeDefined();
    expect(armorEntry).toBeDefined();
    expect(quickGuideEntry).toBeDefined();
    if (!cubeEntry || !amazonEntry || !armorEntry || !quickGuideEntry) return;

    const cubePage = parseGuidePage(readGuideFixture(cubeEntry), cubeEntry);
    const amazonPage = parseGuidePage(readGuideFixture(amazonEntry), amazonEntry);
    const armorPage = parseGuidePage(readGuideFixture(armorEntry), armorEntry);
    const quickGuidePage = parseGuidePage(readGuideFixture(quickGuideEntry), quickGuideEntry);
    const cubeLeadingParagraphs = cubePage.blocks
      .filter((block) => block.kind === 'paragraph')
      .slice(0, 3)
      .map((block) => block.text);

    expect(cubePage.sourceUrl).toBe('https://d2r.dpdns.org/CubeFormula.html');
    expect(cubePage.textIndex).toContain('盒子公式');
    expect(cubeLeadingParagraphs).not.toContain('新手装备 手工装备 镶崁打孔 宝石/水晶 符文');
    expect(cubePage.blocks.find((block) => block.kind === 'table' && block.caption.startsWith('大多数需要重新投入的配方'))).toBeUndefined();
    expect(cubePage.blocks.filter((block) => block.kind === 'table').length).toBeGreaterThan(20);
    expect(amazonPage.textIndex).toContain('亚马逊');
    expect(amazonPage.textIndex).not.toContain('tab2');
    expect(amazonPage.blocks.filter((block) => block.kind === 'heading').length).toBeGreaterThan(5);
    expect(armorPage.textIndex).toContain('防具底材');
    expect(armorPage.blocks.filter((block) => block.kind === 'table').length).toBeGreaterThan(10);
    expect(quickGuidePage.textIndex).toContain('新手');
    expect(quickGuidePage.blocks.filter((block) => block.kind === 'paragraph').length).toBeGreaterThan(10);
  }, 20000);

  it('keeps the first DPDNS formula row when the canonical feature source table has no explicit header row', () => {
    const entry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'vesselOfSouls');
    expect(entry).toBeDefined();
    if (!entry) return;

    const page = parseGuidePage(readGuideFixture(entry), entry);
    const tierOneTable = page.blocks.find((block) => block.kind === 'table' && block.caption.includes('等级 1'));

    expect(tierOneTable).toBeDefined();
    if (!tierOneTable || tierOneTable.kind !== 'table') return;
    expect(tierOneTable.headers).toEqual(['Input', 'Output']);
    expect(tierOneTable.rows[0]?.[0]).toContain('灵魂容器');
    expect(tierOneTable.rows[0]?.[1]).toContain('相同物品');
  }, 20000);
});
