import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ESR_BASE_URL } from '@/core/api';
import type { GuideContentBlock, GuidePage, GuideTableBlock } from '@/core/db';
import { translateGuideText } from '@/core/i18n/guideTranslation';
import { cn } from '@/lib/utils';
import { getGuideCellLineClassification, type GuideMaterialLineKind } from '../utils/guideCellClassification';
import { getGuidePageBlockSummary, getGuidePageHeadings } from '../utils/guidePageSummary';

const INITIAL_GUIDE_TABLE_RENDER_COUNT = 80;
const GUIDE_TABLE_RENDER_INCREMENT = 160;
const INITIAL_GUIDE_TABLE_BLOCK_RENDER_COUNT = 8;
const GUIDE_TABLE_BLOCK_RENDER_INCREMENT = 8;

interface GuidePageContentProps {
  readonly page: GuidePage;
  readonly favoriteRowIds?: readonly string[];
  readonly getRowFavoriteId?: (block: GuideTableBlock, row: readonly string[]) => string;
  readonly onToggleFavoriteRow?: (favoriteId: string) => void;
}

const AFFIX_LINE_CLASS = 'inline rounded-sm border border-sky-400/25 bg-sky-500/10 px-1 py-0.5 font-medium text-sky-700 dark:text-sky-300';

const MATERIAL_LINE_CLASSES: Record<GuideMaterialLineKind, string> = {
  rune: 'inline rounded-sm border border-violet-400/30 bg-violet-500/10 px-1 py-0.5 font-medium text-violet-700 dark:text-violet-300',
  gem: 'inline rounded-sm border border-emerald-400/30 bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-700 dark:text-emerald-300',
  corruption: 'inline rounded-sm border border-rose-400/30 bg-rose-500/10 px-1 py-0.5 font-medium text-rose-700 dark:text-rose-300',
  organ: 'inline rounded-sm border border-red-400/30 bg-red-500/10 px-1 py-0.5 font-medium text-red-700 dark:text-red-300',
  dstone: 'inline rounded-sm border border-orange-400/30 bg-orange-500/10 px-1 py-0.5 font-medium text-orange-800 dark:text-orange-300',
  forging: 'inline rounded-sm border border-stone-400/35 bg-stone-500/15 px-1 py-0.5 font-medium text-stone-800 dark:text-stone-200',
  aura: 'inline rounded-sm border border-fuchsia-400/35 bg-fuchsia-500/10 px-1 py-0.5 font-medium text-fuchsia-800 dark:text-fuchsia-300',
  socket: 'inline rounded-sm border border-cyan-400/35 bg-cyan-500/10 px-1 py-0.5 font-medium text-cyan-800 dark:text-cyan-300',
  map: 'inline rounded-sm border border-indigo-400/35 bg-indigo-500/10 px-1 py-0.5 font-medium text-indigo-800 dark:text-indigo-300',
  cube: 'inline rounded-sm border border-amber-400/30 bg-amber-500/10 px-1 py-0.5 font-medium text-amber-800 dark:text-amber-300',
  consumable: 'inline rounded-sm border border-teal-400/30 bg-teal-500/10 px-1 py-0.5 font-medium text-teal-700 dark:text-teal-300',
  currency: 'inline rounded-sm border border-yellow-400/30 bg-yellow-500/10 px-1 py-0.5 font-medium text-yellow-800 dark:text-yellow-300',
};

function resolveImageUrl(src: string, sourceUrl: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  return new URL(src, sourceUrl || `${ESR_BASE_URL}/`).href;
}

function translated(text: string): string {
  return translateGuideText(text);
}

function getTranslatedLines(text: string): string[] {
  return text
    .split(/\n+/)
    .map((line) => translated(line.trim()))
    .filter((line) => line.length > 0);
}

function renderGuideCellLine(line: string): React.ReactNode {
  const classification = getGuideCellLineClassification(line);
  if (classification.kind === 'plain') return line;

  if (classification.kind === 'affix') {
    return (
      <span data-guide-line-kind="affix" className={cn(AFFIX_LINE_CLASS)}>
        {line}
      </span>
    );
  }

  const materialKind = classification.materialKind;

  return (
    <span data-guide-line-kind="material" data-guide-material-kind={materialKind} className={cn(MATERIAL_LINE_CLASSES[materialKind])}>
      {line}
    </span>
  );
}

function renderMultilineCell(text: string): React.ReactNode {
  const lines = getTranslatedLines(text);
  if (lines.length <= 1) return renderGuideCellLine(lines[0] ?? '');
  return (
    <div className="space-y-1">
      {lines.map((line, index) => (
        <p key={`${line}-${String(index)}`}>{renderGuideCellLine(line)}</p>
      ))}
    </div>
  );
}

function renderCompactNote(text: string): string {
  return getTranslatedLines(text).join(' ');
}

function renderCompactNotes(notes: readonly string[] | undefined): string {
  return (notes ?? [])
    .map(renderCompactNote)
    .filter((note) => note.length > 0)
    .join(' ');
}

function renderTableSectionCell(text: string): React.ReactNode {
  const [title = '', ...details] = getTranslatedLines(text);
  const detail = details.join(' ');
  if (!detail) return <span className="font-semibold text-amber-700 dark:text-amber-400">{title}</span>;

  return (
    <div className="space-y-1">
      <p className="font-semibold text-amber-700 dark:text-amber-400">{title}</p>
      <p className="font-normal text-muted-foreground">{detail}</p>
    </div>
  );
}

function isFullWidthSectionRow(row: readonly string[]): boolean {
  return row.length > 1 && Boolean(row[0]?.trim()) && row.slice(1).every((cell) => cell.trim().length === 0);
}

function countGuideTables(blocks: readonly GuideContentBlock[]): number {
  return blocks.filter((block) => block.kind === 'table').length;
}

function getVisibleGuideBlocks(
  blocks: readonly GuideContentBlock[],
  tableLimit: number
): {
  readonly visibleBlocks: readonly GuideContentBlock[];
  readonly renderedTableCount: number;
  readonly totalTableCount: number;
} {
  const totalTableCount = countGuideTables(blocks);
  if (totalTableCount <= tableLimit) {
    return { visibleBlocks: blocks, renderedTableCount: totalTableCount, totalTableCount };
  }

  const visibleBlocks: GuideContentBlock[] = [];
  let renderedTableCount = 0;

  for (const block of blocks) {
    if (block.kind === 'table') {
      if (renderedTableCount >= tableLimit) break;
      renderedTableCount += 1;
    }

    visibleBlocks.push(block);
  }

  return { visibleBlocks, renderedTableCount, totalTableCount };
}

function GuideTable({
  block,
  favoriteRowIds,
  getRowFavoriteId,
  onToggleFavoriteRow,
}: {
  readonly block: GuideTableBlock;
  readonly favoriteRowIds: readonly string[];
  readonly getRowFavoriteId?: (block: GuideTableBlock, row: readonly string[]) => string;
  readonly onToggleFavoriteRow?: (favoriteId: string) => void;
}) {
  const [visibleRows, setVisibleRows] = useState(INITIAL_GUIDE_TABLE_RENDER_COUNT);
  const renderedRows = block.rows.slice(0, visibleRows);
  const hasMoreRows = renderedRows.length < block.rows.length;
  const compactNotes = renderCompactNotes(block.notes);
  const favoriteRowIdSet = new Set(favoriteRowIds);
  const canFavoriteRows = getRowFavoriteId !== undefined && onToggleFavoriteRow !== undefined;

  return (
    <section id={block.id} className="scroll-mt-20 space-y-2">
      {block.caption && <h3 className="text-base font-semibold text-amber-700 dark:text-amber-400">{translated(block.caption)}</h3>}
      {compactNotes && (
        <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm leading-6 text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">说明：</span> {compactNotes}
          </p>
        </div>
      )}
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full min-w-max border-collapse text-sm">
          {block.headers.length > 0 && (
            <thead className="bg-muted/80">
              <tr>
                {canFavoriteRows && <th className="w-10 border-b px-2 py-2 text-left font-semibold whitespace-nowrap">收藏</th>}
                {block.headers.map((header, index) => (
                  <th key={`${header}-${String(index)}`} className="border-b px-3 py-2 text-left font-semibold whitespace-nowrap">
                    {translated(header)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {renderedRows.map((row, rowIndex) => {
              if (isFullWidthSectionRow(row)) {
                return (
                  <tr key={`row-${String(rowIndex)}`} className="bg-muted/50">
                    <td colSpan={Math.max(block.headers.length, row.length) + (canFavoriteRows ? 1 : 0)} className="border-b px-3 py-2">
                      {renderTableSectionCell(row[0] ?? '')}
                    </td>
                  </tr>
                );
              }

              const favoriteId = canFavoriteRows ? getRowFavoriteId(block, row) : '';
              const isFavorite = favoriteRowIdSet.has(favoriteId);

              return (
                <tr key={`row-${String(rowIndex)}`} className="odd:bg-card even:bg-muted/30">
                  {canFavoriteRows && (
                    <td className="w-10 border-b px-2 py-2 align-top">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="size-7"
                        data-guide-row-favorite={isFavorite ? 'true' : 'false'}
                        aria-label={isFavorite ? '取消收藏公式行' : '收藏公式行'}
                        title={isFavorite ? '取消收藏公式行' : '收藏公式行'}
                        onClick={() => {
                          onToggleFavoriteRow(favoriteId);
                        }}
                      >
                        <Star className={cn('size-4', isFavorite ? 'fill-amber-400 text-amber-500' : 'text-muted-foreground')} />
                      </Button>
                    </td>
                  )}
                  {row.map((cell, cellIndex) => (
                    <td key={`${String(rowIndex)}-${String(cellIndex)}`} className="border-b px-3 py-2 align-top">
                      {renderMultilineCell(cell)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {hasMoreRows && (
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            已显示 {renderedRows.length} / {block.rows.length} 行
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setVisibleRows((current) => current + GUIDE_TABLE_RENDER_INCREMENT);
            }}
          >
            显示更多
          </Button>
        </div>
      )}
    </section>
  );
}

function GuideBlock({
  block,
  sourceUrl,
  favoriteRowIds,
  getRowFavoriteId,
  onToggleFavoriteRow,
}: {
  readonly block: GuideContentBlock;
  readonly sourceUrl: string;
  readonly favoriteRowIds: readonly string[];
  readonly getRowFavoriteId?: (block: GuideTableBlock, row: readonly string[]) => string;
  readonly onToggleFavoriteRow?: (favoriteId: string) => void;
}) {
  if (block.kind === 'heading') {
    return block.level === 2 ? (
      <h2 id={block.id} className="scroll-mt-20 text-xl font-semibold text-foreground">
        {translated(block.text)}
      </h2>
    ) : (
      <h3 id={block.id} className="scroll-mt-20 text-lg font-semibold text-foreground">
        {translated(block.text)}
      </h3>
    );
  }

  if (block.kind === 'paragraph') {
    return <p className="leading-7 text-muted-foreground">{translated(block.text)}</p>;
  }

  if (block.kind === 'image') {
    return (
      <figure className="flex justify-center">
        <img
          src={resolveImageUrl(block.src, sourceUrl)}
          alt={translated(block.alt)}
          className="max-h-96 rounded-md object-contain"
          loading="lazy"
        />
      </figure>
    );
  }

  return (
    <GuideTable
      block={block}
      favoriteRowIds={favoriteRowIds}
      getRowFavoriteId={getRowFavoriteId}
      onToggleFavoriteRow={onToggleFavoriteRow}
    />
  );
}

export function GuidePageContent({ page, favoriteRowIds = [], getRowFavoriteId, onToggleFavoriteRow }: GuidePageContentProps) {
  const groupLabel = page.group === 'base' ? '基础资料' : page.group === 'features' ? '机制说明' : '攻略资料';
  const loadMoreTablesRef = useRef<HTMLDivElement | null>(null);
  const [visibleTableLimit, setVisibleTableLimit] = useState(INITIAL_GUIDE_TABLE_BLOCK_RENDER_COUNT);
  const { visibleBlocks, renderedTableCount, totalTableCount } = getVisibleGuideBlocks(page.blocks, visibleTableLimit);
  const visiblePage = { ...page, blocks: visibleBlocks };
  const headings = getGuidePageHeadings(visiblePage);
  const summary = getGuidePageBlockSummary(page);
  const hasMoreTables = renderedTableCount < totalTableCount;

  useEffect(() => {
    if (!hasMoreTables) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const target = loadMoreTablesRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleTableLimit((current) => current + GUIDE_TABLE_BLOCK_RENDER_INCREMENT);
        }
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasMoreTables]);

  return (
    <article className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{groupLabel}</Badge>
            <Badge variant="outline">{translated(page.label)}</Badge>
          </div>
          <h1 className="text-2xl font-bold">{page.title}</h1>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>{summary.headingCount} 个章节</span>
            <span>{summary.tableCount} 张表格</span>
            <span>{summary.tableRowCount} 行表格数据</span>
            {summary.imageCount > 0 && <span>{summary.imageCount} 张图片</span>}
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={page.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
            来源
            <ExternalLink className="size-4" />
          </a>
        </Button>
      </header>

      <div className={headings.length > 0 ? 'grid gap-6 xl:grid-cols-[minmax(0,1fr)_14rem]' : 'grid gap-6'}>
        <div className="min-w-0 space-y-5">
          {visibleBlocks.map((block) => (
            <GuideBlock
              key={block.id}
              block={block}
              sourceUrl={page.sourceUrl}
              favoriteRowIds={favoriteRowIds}
              getRowFavoriteId={getRowFavoriteId}
              onToggleFavoriteRow={onToggleFavoriteRow}
            />
          ))}
          {hasMoreTables && (
            <div ref={loadMoreTablesRef} className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-muted/20 p-3">
              <span className="text-sm text-muted-foreground">
                已显示 {renderedTableCount} / {totalTableCount} 张表格
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setVisibleTableLimit((current) => current + GUIDE_TABLE_BLOCK_RENDER_INCREMENT);
                }}
              >
                显示更多表格
              </Button>
            </div>
          )}
        </div>

        {headings.length > 0 && (
          <aside className="hidden xl:block">
            <div className="sticky top-20 space-y-2 border-l pl-4">
              <p className="text-sm font-semibold">本页目录</p>
              <nav className="space-y-1">
                {headings.slice(0, 24).map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={`block rounded-sm py-1 text-sm text-muted-foreground hover:text-foreground ${
                      heading.level === 3 ? 'pl-3' : ''
                    }`}
                  >
                    {translated(heading.text)}
                  </a>
                ))}
              </nav>
              {headings.length > 24 && (
                <p className="text-xs text-muted-foreground">另有 {headings.length - 24} 个章节，可继续向下浏览。</p>
              )}
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
