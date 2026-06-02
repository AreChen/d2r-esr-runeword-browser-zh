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

  it('uses the official ESR cube recipes page as the canonical formula source', () => {
    const cubeEntry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'cubeRecipes');

    expect(cubeEntry).toBeDefined();
    expect(GUIDE_PAGE_CATALOG.map((page) => page.id as string)).not.toContain('d2rCubeFormula');
    expect(cubeEntry ? getGuidePageEntrySourceUrl(cubeEntry) : '').toBe(
      'https://easternsunresurrected.com/Eastern%20Sun%20Resurrected%20Cube%20Recipes.html'
    );
  });

  it('uses DPDNS as the canonical source for duplicated base guide pages', () => {
    const replacements = [
      ['weapons', 'd2rWeapons', 'https://d2r.dpdns.org/Weapons.html'],
      ['armors', 'd2rArmors', 'https://d2r.dpdns.org/Armor.html'],
      ['maps', 'd2rMaps', 'https://d2r.dpdns.org/Map.html'],
      ['uniqueMythicals', 'd2rMythicals', 'https://d2r.dpdns.org/Mythicals.html'],
    ] as const;
    const catalogIds = GUIDE_PAGE_CATALOG.map((page) => page.id as string);

    for (const [canonicalId, duplicateId, expectedUrl] of replacements) {
      const entry = GUIDE_PAGE_CATALOG.find((page) => page.id === canonicalId);

      expect(entry, canonicalId).toBeDefined();
      expect(entry?.group, canonicalId).toBe('base');
      expect(entry ? getGuidePageEntrySourceUrl(entry) : '').toBe(expectedUrl);
      expect(catalogIds, duplicateId).not.toContain(duplicateId);
    }
  });

  it('fetches DPDNS-backed canonical base guide pages through the guide page catalog', () => {
    const canonicalDpdnsBaseIds = ['weapons', 'armors', 'maps', 'uniqueMythicals', 'd2rMaterials', 'd2rCharmRings'] as const;
    const skippedCoreIds = new Set<string>(CORE_GUIDE_PAGE_IDS);

    for (const id of canonicalDpdnsBaseIds) {
      expect(skippedCoreIds.has(id), id).toBe(false);
    }
  });

  it('integrates DPDNS material data as a native base page instead of off-site chrome', () => {
    const entry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'd2rMaterials');

    expect(entry).toBeDefined();
    expect(entry?.group).toBe('base');
    expect(entry?.label).toBe('Materials');
    expect(entry?.title).toBe('材料资料');
    expect(entry ? getGuidePageEntrySourceUrl(entry) : '').toBe('https://d2r.dpdns.org/Materials.html');
  });

  it('integrates DPDNS charm, ring, amulet, and jewel data as a native base page', () => {
    const entry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'd2rCharmRings');

    expect(entry).toBeDefined();
    expect(entry?.group).toBe('base');
    expect(entry?.label).toBe('Charm Ring Amulet');
    expect(entry?.title).toBe('咒符饰品资料');
    expect(entry ? getGuidePageEntrySourceUrl(entry) : '').toBe('https://d2r.dpdns.org/CharmRing.html');
  });

  it('parses DPDNS charm, ring, amulet, and jewel data into searchable tables', () => {
    const entry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'd2rCharmRings');
    expect(entry).toBeDefined();
    if (!entry) return;

    const page = parseGuidePage(readGuideFixture(entry), entry);
    const tables = page.blocks.filter((block) => block.kind === 'table');
    const captions = tables.map((table) => table.caption);

    expect(page.sourceUrl).toBe('https://d2r.dpdns.org/CharmRing.html');
    expect(page.textIndex).toContain('黄色果冻');
    expect(page.textIndex).toContain('乔丹之石');
    expect(captions).toContain('大型咒符');
    expect(captions).toContain('小型咒符');
    expect(captions).toContain('戒指');
    expect(captions).toContain('护身符');
    expect(captions).toContain('珠宝');
    expect(tables.length).toBeGreaterThan(10);
    expect(tables.reduce((total, table) => total + table.rows.length, 0)).toBeGreaterThan(80);
  }, 20000);

  it('splits the official D-Stone compound recipe table into searchable subtables', () => {
    const entry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'cubeRecipes');
    expect(entry).toBeDefined();
    if (!entry) return;

    const page = parseGuidePage(readGuideFixture(entry), entry);
    const tables = page.blocks.filter((block) => block.kind === 'table');
    const findTable = (caption: string) => tables.find((table) => table.caption === caption);

    expect(findTable('Dragon Stone Cycling')?.rows).toHaveLength(7);
    expect(findTable('D-Stoning Weapon')?.rows).toHaveLength(20);
    expect(findTable('D-Stoning Torso/Helm/Shield')?.rows).toHaveLength(16);
    expect(findTable('D-Stoning Gloves/Belt/Boots')?.rows).toHaveLength(16);
    expect(findTable('D-Stoning Ring/Amulet')?.rows).toHaveLength(21);
    expect(findTable('Gem Melding')?.rows).toHaveLength(7);
    expect(tables.find((table) => table.caption === 'D-Stoning')).toBeUndefined();
  }, 20000);

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

  it('uses the real Input/Output row as headers for official cube recipe categories', () => {
    const entry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'cubeRecipes');
    expect(entry).toBeDefined();
    if (!entry) return;

    const page = parseGuidePage(readGuideFixture(entry), entry);
    const tables = page.blocks.filter((block) => block.kind === 'table');
    const recipeCaptions = [
      'Special',
      'Uber/Endgame Map Recipes',
      'Legendary Consumables',
      'Misc/Repair',
      'Gems/Crystals',
      'Ancient Relics',
      'Cubing Materials',
      'Normal Items',
      'Magic/Rare Items',
      'Unique Items',
      'Set Items',
      'Rings/Amulets',
      'Charms',
      'Jewels',
      'Arrow/Bolt Quivers',
      'Forging',
      'Dragon Stone Cycling',
      'D-Stoning Weapon',
      'D-Stoning Torso/Helm/Shield',
      'D-Stoning Gloves/Belt/Boots',
      'D-Stoning Ring/Amulet',
      'Gem Melding',
      'Tinkering',
      'Base Upgrades/Changes',
      'Socket Recipes',
      '(Former) Secret Recipes',
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

  it('keeps official cube recipe category notes inside tables instead of loose pre-table paragraphs', () => {
    const entry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'cubeRecipes');
    expect(entry).toBeDefined();
    if (!entry) return;

    const page = parseGuidePage(readGuideFixture(entry), entry);
    const tables = page.blocks.filter((block) => block.kind === 'table');
    const looseParagraphs = page.blocks.filter((block) => block.kind === 'paragraph').map((block) => block.text);
    const uniqueItemsTable = tables.find((block) => block.caption === 'Unique Items');
    const uniqueRerollRow = uniqueItemsTable?.rows.find((row) => row[0]?.includes('Unique Reroll'));

    expect(uniqueItemsTable).toBeDefined();
    expect(uniqueItemsTable?.headers).toEqual(['Input', 'Output']);
    expect(uniqueItemsTable?.rows[0]?.[0]).toContain('Set Weapons/Armor');
    expect(uniqueItemsTable?.rows[0]?.[1]).toContain('Unique Item');
    expect(uniqueRerollRow?.[0]).toContain("Base upgraded uniques can't be rerolled");

    expect(looseParagraphs).not.toContain('Unique Items');
    expect(looseParagraphs).not.toContain('输入 输出');
    expect(looseParagraphs).not.toContain('Input Output');
    expect(looseParagraphs.some((paragraph) => paragraph.includes('Set Weapons/Armor of the Same Base Item'))).toBe(false);
    expect(looseParagraphs.some((paragraph) => paragraph.includes('Unique Reroll'))).toBe(false);
    expect(looseParagraphs.some((paragraph) => paragraph.includes("Base upgraded uniques can't be rerolled"))).toBe(false);
  }, 20000);

  it('keeps official ring and jewel cube recipe preface notes out of table headers', () => {
    const entry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'cubeRecipes');
    expect(entry).toBeDefined();
    if (!entry) return;

    const page = parseGuidePage(readGuideFixture(entry), entry);
    const tables = page.blocks.filter((block) => block.kind === 'table');
    const ringsTable = tables.find((block) => block.caption === 'Rings/Amulets');
    const jewelsTable = tables.find((block) => block.caption === 'Jewels');

    expect(ringsTable).toBeDefined();
    expect(jewelsTable).toBeDefined();
    if (!ringsTable || !jewelsTable) return;

    expect(ringsTable.headers).toEqual(['Input', 'Output']);
    expect(ringsTable.notes?.[0]).toContain('When you reroll multiple Amulets or Rings');
    expect(ringsTable.rows[0]).toEqual(['Standard Reroll', '']);
    expect(ringsTable.rows[1]?.[0]).toContain('3 Magic Rings');
    expect(ringsTable.rows[1]?.[1]).toContain('Magic Ring');

    expect(jewelsTable.headers).toEqual(['Input', 'Output']);
    expect(jewelsTable.notes?.[0]).toContain('Rerolling Orb no longer accepts');
    expect(jewelsTable.rows[0]?.[0]).toContain('Magic Jewel');
    expect(jewelsTable.rows[0]?.[1]).toContain('Magic Jewel');
  }, 20000);

  it('compacts standalone official cube explanation tables into readable paragraphs', () => {
    const entry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'cubeRecipes');
    expect(entry).toBeDefined();
    if (!entry) return;

    const page = parseGuidePage(readGuideFixture(entry), entry);
    const paragraphs = page.blocks.filter((block) => block.kind === 'paragraph').map((block) => block.text);

    expect(paragraphs).toContain(
      "Most, but not all, recipes that reroll the input don't work if the input has a Forging. If you find a recipe doesn't work, please check if the input has a Forging or not."
    );
    expect(paragraphs).toContain('Torso means Body Armor. Armor means all kinds of armor.');
    expect(paragraphs).not.toContain("Most, but not all, recipes that reroll the input don't work if the input has a Forging.");
    expect(paragraphs).not.toContain("If you find a recipe doesn't work, please check if the input has a Forging or not.");
    expect(page.blocks.find((block) => block.kind === 'table' && block.caption.startsWith('Most, but not all, recipes'))).toBeUndefined();
  }, 20000);

  it('parses canonical guide fixtures as searchable guide pages', () => {
    const cubeEntry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'cubeRecipes');
    const amazonEntry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'd2rAmazonGuide');
    const armorEntry = GUIDE_PAGE_CATALOG.find((page) => page.id === 'armors');
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

    expect(cubePage.sourceUrl).toBe('https://easternsunresurrected.com/Eastern%20Sun%20Resurrected%20Cube%20Recipes.html');
    expect(cubePage.textIndex).toContain('D-Stoning Weapon');
    expect(cubeLeadingParagraphs).not.toContain('新手装备 手工装备 镶崁打孔 宝石/水晶 符文');
    expect(
      cubePage.blocks.find((block) => block.kind === 'table' && block.caption.startsWith('Most, but not all, recipes'))
    ).toBeUndefined();
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
