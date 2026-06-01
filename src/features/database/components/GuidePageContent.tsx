import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ESR_BASE_URL } from '@/core/api';
import type { GuideContentBlock, GuidePage, GuideTableBlock } from '@/core/db';
import { translateGuideText } from '@/core/i18n/guideTranslation';
import { cn } from '@/lib/utils';
import { getGuidePageBlockSummary, getGuidePageHeadings } from '../utils/guidePageSummary';

const INITIAL_GUIDE_TABLE_RENDER_COUNT = 80;
const GUIDE_TABLE_RENDER_INCREMENT = 160;
const INITIAL_GUIDE_TABLE_BLOCK_RENDER_COUNT = 8;
const GUIDE_TABLE_BLOCK_RENDER_INCREMENT = 8;

interface GuidePageContentProps {
  readonly page: GuidePage;
}

type GuideCellLineKind = 'plain' | 'material' | 'affix';

const GUIDE_CELL_LINE_CLASSES: Record<Exclude<GuideCellLineKind, 'plain'>, string> = {
  material: 'inline rounded-sm border border-amber-400/30 bg-amber-500/10 px-1 py-0.5 font-medium text-amber-800 dark:text-amber-300',
  affix: 'inline rounded-sm border border-sky-400/25 bg-sky-500/10 px-1 py-0.5 font-medium text-sky-700 dark:text-sky-300',
};

const MATERIAL_LINE_PATTERNS = [
  /\b(?:Worldstone Shards?|Ancient Decipherers?|Dragon Stones?|Maple Leaves?|Perfect Gems?|Flawless Gems?)\b/iu,
  /\b(?:Ancient Coupons?|Diablo's Demonic Horn|Baal's Demonic Eye|Mephisto's Demonic Brain|Viper Amulet)\b/iu,
  /\b(?:Heart|Brain|Eye|Horn|Soul|Token|Elixir|Steak)\b/iu,
  /\b[A-Z][a-z]+ Rune\b/u,
  /(?:世界石碎片|古代解读器|古代解密者|古代优惠券|龙石|枫叶|完美宝石|无瑕宝石|碎裂宝石|裂开的宝石)/u,
  /(?:符文|恶魔之角|恶魔之眼|恶魔大脑|蛇护符|心脏|大脑|眼球|灵魂|灵药|牛排)/u,
] as const;

const AFFIX_LINE_PATTERNS = [
  /^[+-](?:\(|\d)/u,
  /\b(?:Enhanced Damage|All Skills|Skill Levels?|Resist|Resistance|Defense|Damage|Chance to Cast|Attack Rating)\b/iu,
  /\b(?:Life|Mana|Faster|Speed|Leech|Sockets?|Corrupted|Anointed|Forging|Crushing Blow|Deadly Strike)\b/iu,
  /(?:增强伤害|所有技能|技能等级|抗性|防御|伤害|几率|攻击准确率|生命|法力|速度|吸取|镶孔|腐化|涂油|锻造)/u,
] as const;

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

function getGuideCellLineKind(line: string): GuideCellLineKind {
  if (AFFIX_LINE_PATTERNS.some((pattern) => pattern.test(line))) return 'affix';
  if (MATERIAL_LINE_PATTERNS.some((pattern) => pattern.test(line))) return 'material';
  return 'plain';
}

function renderGuideCellLine(line: string): React.ReactNode {
  const kind = getGuideCellLineKind(line);
  if (kind === 'plain') return line;

  return (
    <span data-guide-line-kind={kind} className={cn(GUIDE_CELL_LINE_CLASSES[kind])}>
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

function GuideTable({ block }: { readonly block: GuideTableBlock }) {
  const [visibleRows, setVisibleRows] = useState(INITIAL_GUIDE_TABLE_RENDER_COUNT);
  const renderedRows = block.rows.slice(0, visibleRows);
  const hasMoreRows = renderedRows.length < block.rows.length;
  const compactNotes = renderCompactNotes(block.notes);

  return (
    <section id={block.id} className="scroll-mt-20 space-y-2">
      {block.caption && <h3 className="text-base font-semibold text-amber-700 dark:text-amber-400">{translated(block.caption)}</h3>}
      {compactNotes && (
        <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm leading-6 text-muted-foreground">
          <p>{compactNotes}</p>
        </div>
      )}
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full min-w-max border-collapse text-sm">
          {block.headers.length > 0 && (
            <thead className="bg-muted/80">
              <tr>
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
                    <td colSpan={Math.max(block.headers.length, row.length)} className="border-b px-3 py-2">
                      {renderTableSectionCell(row[0] ?? '')}
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={`row-${String(rowIndex)}`} className="odd:bg-card even:bg-muted/30">
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

function GuideBlock({ block, sourceUrl }: { readonly block: GuideContentBlock; readonly sourceUrl: string }) {
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

  return <GuideTable block={block} />;
}

export function GuidePageContent({ page }: GuidePageContentProps) {
  const groupLabel = page.group === 'base' ? '基础资料' : page.group === 'features' ? '机制说明' : '站外资料';
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
            <GuideBlock key={block.id} block={block} sourceUrl={page.sourceUrl} />
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
