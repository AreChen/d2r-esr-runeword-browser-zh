import type { GuideHeadingBlock, GuidePage } from '@/core/db';

export interface GuidePageBlockSummary {
  readonly headingCount: number;
  readonly paragraphCount: number;
  readonly tableCount: number;
  readonly tableRowCount: number;
  readonly imageCount: number;
}

export type GuidePageHeadingLink = Pick<GuideHeadingBlock, 'id' | 'level' | 'text'>;

export function getGuidePageHeadings(page: GuidePage): GuidePageHeadingLink[] {
  return page.blocks
    .filter((block): block is GuideHeadingBlock => block.kind === 'heading')
    .map((block) => ({
      id: block.id,
      level: block.level,
      text: block.text,
    }));
}

export function getGuidePageBlockSummary(page: GuidePage): GuidePageBlockSummary {
  const summary: GuidePageBlockSummary = {
    headingCount: 0,
    paragraphCount: 0,
    tableCount: 0,
    tableRowCount: 0,
    imageCount: 0,
  };

  return page.blocks.reduce<GuidePageBlockSummary>((acc, block) => {
    if (block.kind === 'heading') {
      return { ...acc, headingCount: acc.headingCount + 1 };
    }
    if (block.kind === 'paragraph') {
      return { ...acc, paragraphCount: acc.paragraphCount + 1 };
    }
    if (block.kind === 'table') {
      return { ...acc, tableCount: acc.tableCount + 1, tableRowCount: acc.tableRowCount + block.rows.length };
    }
    return { ...acc, imageCount: acc.imageCount + 1 };
  }, summary);
}
