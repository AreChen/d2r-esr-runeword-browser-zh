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

describe('GuidePageContent layout', () => {
  it('does not reserve the table-of-contents column when the page has no headings', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={pageWithoutHeadings} />);

    expect(html).not.toContain('xl:grid-cols-[minmax(0,1fr)_14rem]');
  });

  it('keeps the table-of-contents column when headings exist', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={pageWithHeadings} />);

    expect(html).toContain('xl:grid-cols-[minmax(0,1fr)_14rem]');
  });
});
