import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { GUIDE_PAGE_CATALOG } from '@/core/api';
import { parseGuidePage, parseGuidePages } from './guidePagesParser';
import type { GuidePageCatalogEntry } from '@/features/database';

const changelogHtml = readFileSync(resolve(__dirname, '../../../../test-fixtures/changelogs.html'), 'utf-8');
const fixtureDir = resolve(__dirname, '../../../../test-fixtures');

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
      html: readFileSync(resolve(fixtureDir, entry.sourcePath), 'utf-8'),
    }));

    const pages = parseGuidePages(sources);

    expect(pages).toHaveLength(23);
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

      const page = parseGuidePage(readFileSync(resolve(fixtureDir, entry.sourcePath), 'utf-8'), entry);
      const tables = page.blocks.filter((block) => block.kind === 'table');
      const tableRows = tables.reduce((total, table) => total + table.rows.length, 0);

      expect(tables.length, id).toBeGreaterThan(0);
      expect(tableRows, id).toBeGreaterThan(10);
    }
  }, 20000);
});
