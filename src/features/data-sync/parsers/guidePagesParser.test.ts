import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { GUIDE_PAGE_CATALOG } from '@/core/api';
import { parseGuidePage, parseGuidePages } from './guidePagesParser';
import type { GuidePageCatalogEntry } from '@/features/database';

const changelogHtml = readFileSync(resolve(__dirname, '../../../../test-fixtures/changelogs.html'), 'utf-8');

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
        <tr><td>Extra sockets</td><td>10%</td><td>Cannot exceed maximum sockets</td></tr>
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
      rows: [['Extra sockets', '10%', 'Cannot exceed maximum sockets']],
    });
    expect(page.blocks).toContainEqual({
      id: 'sample-image-4',
      kind: 'image',
      src: './images/features/corruption.png',
      alt: 'Corruption altar',
    });
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
      html: readFileSync(resolve(__dirname, '../../../../test-fixtures', entry.sourcePath), 'utf-8'),
    }));

    const pages = parseGuidePages(sources);

    expect(pages).toHaveLength(23);
    for (const page of pages) {
      expect(page.blocks.length, page.id).toBeGreaterThan(0);
      expect(page.textIndex, page.id).not.toContain('Base Information');
      expect(page.textIndex, page.id).not.toContain('[Changelogs]');
    }
  }, 25000);
});
