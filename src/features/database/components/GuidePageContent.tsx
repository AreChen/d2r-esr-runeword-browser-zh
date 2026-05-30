import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ESR_BASE_URL } from '@/core/api';
import type { GuideContentBlock, GuidePage, GuideTableBlock } from '@/core/db';
import { translateGuideText } from '@/core/i18n/guideTranslation';
import { getGuidePageBlockSummary, getGuidePageHeadings } from '../utils/guidePageSummary';

const INITIAL_GUIDE_TABLE_RENDER_COUNT = 80;
const GUIDE_TABLE_RENDER_INCREMENT = 160;

interface GuidePageContentProps {
  readonly page: GuidePage;
}

function resolveImageUrl(src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  return `${ESR_BASE_URL}/${src.replace(/^\.\//, '')}`;
}

function translated(text: string): string {
  return translateGuideText(text);
}

function renderMultilineCell(text: string): React.ReactNode {
  const lines = text
    .split(/\n+/)
    .map((line) => translated(line.trim()))
    .filter((line) => line.length > 0);
  if (lines.length <= 1) return lines[0] ?? '';
  return (
    <div className="space-y-1">
      {lines.map((line, index) => (
        <p key={`${line}-${String(index)}`}>{line}</p>
      ))}
    </div>
  );
}

function GuideTable({ block }: { readonly block: GuideTableBlock }) {
  const [visibleRows, setVisibleRows] = useState(INITIAL_GUIDE_TABLE_RENDER_COUNT);
  const renderedRows = block.rows.slice(0, visibleRows);
  const hasMoreRows = renderedRows.length < block.rows.length;

  return (
    <section id={block.id} className="scroll-mt-20 space-y-2">
      {block.caption && <h3 className="text-base font-semibold text-amber-700 dark:text-amber-400">{translated(block.caption)}</h3>}
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
            {renderedRows.map((row, rowIndex) => (
              <tr key={`row-${String(rowIndex)}`} className="odd:bg-card even:bg-muted/30">
                {row.map((cell, cellIndex) => (
                  <td key={`${String(rowIndex)}-${String(cellIndex)}`} className="border-b px-3 py-2 align-top">
                    {renderMultilineCell(cell)}
                  </td>
                ))}
              </tr>
            ))}
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

function GuideBlock({ block }: { readonly block: GuideContentBlock }) {
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
        <img src={resolveImageUrl(block.src)} alt={translated(block.alt)} className="max-h-96 rounded-md object-contain" loading="lazy" />
      </figure>
    );
  }

  return <GuideTable block={block} />;
}

export function GuidePageContent({ page }: GuidePageContentProps) {
  const groupLabel = page.group === 'base' ? '基础资料' : '机制说明';
  const headings = getGuidePageHeadings(page);
  const summary = getGuidePageBlockSummary(page);

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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="min-w-0 space-y-5">
          {page.blocks.map((block) => (
            <GuideBlock key={block.id} block={block} />
          ))}
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
