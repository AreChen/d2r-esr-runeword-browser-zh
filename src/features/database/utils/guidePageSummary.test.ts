import type { GuidePage } from '@/core/db';
import { getGuidePageBlockSummary, getGuidePageHeadings } from './guidePageSummary';

const page: GuidePage = {
  id: 'sample',
  group: 'features',
  label: 'Sample',
  title: '示例',
  sourcePath: 'sample.htm',
  sourceUrl: 'https://easternsunresurrected.com/sample.htm',
  order: 1,
  textIndex: '',
  blocks: [
    { id: 'h1', kind: 'heading', level: 2, text: 'General Recipes' },
    { id: 'p1', kind: 'paragraph', text: 'Intro text' },
    {
      id: 't1',
      kind: 'table',
      caption: 'Recipes',
      headers: ['Input(s)', 'Possible Outcome(s)'],
      rows: [
        ['Rare Weapon\nOrb of Anointment', 'Same Item\nRandom highest tier suffix'],
        ['Unique Charm', 'Same Item'],
      ],
    },
    { id: 'h2', kind: 'heading', level: 3, text: 'Specializations' },
    { id: 'img1', kind: 'image', src: './image.png', alt: 'sample' },
  ],
};

describe('guide page summary helpers', () => {
  it('extracts heading links in source order', () => {
    expect(getGuidePageHeadings(page)).toEqual([
      { id: 'h1', level: 2, text: 'General Recipes' },
      { id: 'h2', level: 3, text: 'Specializations' },
    ]);
  });

  it('counts content blocks and table rows for compact page metadata', () => {
    expect(getGuidePageBlockSummary(page)).toEqual({
      headingCount: 2,
      paragraphCount: 1,
      tableCount: 1,
      tableRowCount: 2,
      imageCount: 1,
    });
  });
});
