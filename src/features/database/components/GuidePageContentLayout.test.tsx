import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { GuidePage } from '@/core/db';
import { GuidePageContent } from './GuidePageContent';

const pageWithoutHeadings: GuidePage = {
  id: 'armors',
  group: 'base',
  label: 'Armor',
  title: '护甲基础资料',
  sourcePath: 'armors.htm',
  sourceUrl: 'https://example.test/armors.htm',
  order: 1,
  textIndex: '',
  blocks: [
    {
      id: 'armor-table',
      kind: 'table',
      caption: 'Armor',
      headers: ['Name', 'Code'],
      rows: [['Quilted Armor', 'qui']],
    },
  ],
};

const pageWithHeadings: GuidePage = {
  ...pageWithoutHeadings,
  blocks: [{ id: 'section', kind: 'heading', level: 2, text: 'Section' }, ...pageWithoutHeadings.blocks],
};

const pageWithTableSectionRows: GuidePage = {
  ...pageWithoutHeadings,
  blocks: [
    {
      id: 'recipe-table',
      kind: 'table',
      caption: 'Rings/Amulets',
      headers: ['Input', 'Output'],
      rows: [
        ['Standard Reroll', ''],
        ['3 Magic Rings', 'Magic Ring'],
      ],
    },
  ],
};

const pageWithDetailedTableSectionRow: GuidePage = {
  ...pageWithoutHeadings,
  blocks: [
    {
      id: 'recipe-table',
      kind: 'table',
      caption: 'Unique Items',
      headers: ['Input', 'Output'],
      rows: [
        [
          'Unique Reroll\nBase upgraded uniques cannot be rerolled.\nItems that had sockets added before reroll will lose their sockets.',
          '',
        ],
        ['3 Unique Rings', 'Unique Ring'],
      ],
    },
  ],
};

const pageWithTableNotes: GuidePage = {
  ...pageWithoutHeadings,
  blocks: [
    {
      id: 'recipe-table',
      kind: 'table',
      caption: 'Rings/Amulets',
      notes: ['First source line\nsecond source line'],
      headers: ['Input', 'Output'],
      rows: [['3 Magic Rings', 'Magic Ring']],
    },
  ],
};

describe('GuidePageContent layout', () => {
  it('does not reserve the table-of-contents column when the page has no headings', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={pageWithoutHeadings} />);

    expect(html).not.toContain('xl:grid-cols-[minmax(0,1fr)_14rem]');
  });

  it('keeps the table-of-contents column when headings exist', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={pageWithHeadings} />);

    expect(html).toContain('xl:grid-cols-[minmax(0,1fr)_14rem]');
  });

  it('renders single-value recipe section rows across the full table width', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={pageWithTableSectionRows} />);

    expect(html).toContain('colSpan="2"');
    expect(html).toContain('标准重置');
  });

  it('renders detailed table section rows as a compact note instead of one paragraph per source line', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={pageWithDetailedTableSectionRow} />);

    expect(html).toContain('暗金重置');
    expect(html).toContain('Base upgraded uniques cannot be rerolled. Items that had sockets added before reroll will lose their sockets.');
    expect(html).not.toContain('Base upgraded uniques cannot be rerolled.</p><p');
  });

  it('renders table notes as compact prose instead of one paragraph per source line', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={pageWithTableNotes} />);

    expect(html).toContain('First source line second source line');
    expect(html).not.toContain('First source line</p><p');
  });
});
