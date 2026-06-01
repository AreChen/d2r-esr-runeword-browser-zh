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

const communityPage: GuidePage = {
  ...pageWithoutHeadings,
  group: 'community',
  label: 'DPDNS Cube Formula',
  title: '盒子公式（DPDNS）',
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

const pageWithMultipleTableNotes: GuidePage = {
  ...pageWithoutHeadings,
  blocks: [
    {
      id: 'recipe-table',
      kind: 'table',
      caption: 'Unique Items',
      notes: ['First source line\nsecond source line', 'Third source line'],
      headers: ['Input', 'Output'],
      rows: [['3 Magic Rings', 'Magic Ring']],
    },
  ],
};

const pageWithHighlightedCellLines: GuidePage = {
  ...pageWithoutHeadings,
  blocks: [
    {
      id: 'recipe-table',
      kind: 'table',
      caption: 'Corruption Outcomes',
      headers: ['Input', 'Output'],
      rows: [['Worldstone Shard\nAncient Decipherer', '+(150 to 200)% Enhanced Damage\n+1 to All Skills']],
    },
  ],
};

const pageWithManyTables: GuidePage = {
  ...pageWithoutHeadings,
  blocks: Array.from({ length: 10 }, (_, index) => ({
    id: `table-${String(index + 1)}`,
    kind: 'table',
    caption: `Extra Table ${String(index + 1)}`,
    headers: ['Input', 'Output'],
    rows: [[`Input ${String(index + 1)}`, `Output ${String(index + 1)}`]],
  })),
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

  it('labels DPDNS guide pages as off-site material in the content header', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={communityPage} />);

    expect(html).toContain('站外资料');
    expect(html).not.toContain('机制说明');
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

  it('renders multiple table notes as one compact explanation above the table', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={pageWithMultipleTableNotes} />);

    expect(html).toContain('First source line second source line Third source line');
    expect(html).not.toContain('second source line</p><p');
  });

  it('adds semantic color markers to material requirements and affix lines', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={pageWithHighlightedCellLines} />);

    expect(html).toContain('data-guide-line-kind="material"');
    expect(html).toContain('data-guide-line-kind="affix"');
    expect(html).toContain('世界石碎片');
    expect(html).toContain('+(150 to 200)% 增强伤害');
    expect(html).toContain('+1 所有技能等级');
  });

  it('renders long guide pages progressively by table count', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={pageWithManyTables} />);

    expect(html).toContain('10 张表格');
    expect(html).toContain('Extra Table 1');
    expect(html).toContain('Extra Table 8');
    expect(html).not.toContain('Extra Table 9');
    expect(html).toContain('已显示 8 / 10 张表格');
    expect(html).toContain('显示更多表格');
  });
});
