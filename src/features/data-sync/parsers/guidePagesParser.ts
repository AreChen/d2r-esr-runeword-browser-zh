import type { GuideContentBlock, GuideImageBlock, GuidePage, GuideParagraphBlock, GuideTableBlock } from '@/core/db';
import { getGuidePageSourceUrl, type GuidePageCatalogEntry } from '@/core/api/guidePageCatalog';
import { decodeHtmlEntities } from './shared/parserUtils';

export interface GuidePageHtmlSource {
  readonly entry: GuidePageCatalogEntry;
  readonly html: string;
}

const SITE_NAV_TEXT = new Set([
  'Base Information',
  'Features',
  '[Changelogs]',
  '[Armor]',
  '[Weapons]',
  '[Prefixes]',
  '[Suffixes]',
  '[Uni Armor]',
  '[Uni Weapons]',
  '[Uni Other]',
  '[Uni Mythicals]',
  '[Sets]',
  '[Gems/Runes]',
  '[Gemwords]',
  '[Runewords]',
  '[Cube Recipes]',
  '[Maps]',
  '[Corruption Outcomes]',
  '[Anointment Outcomes]',
  '[Endgame Maps]',
  '[Vessel of Souls]',
  '[Ascendancies]',
  '[Kill Ledger]',
  '[Mercenary and Oskill Information]',
  '[Weapon Mastery]',
]);

function cleanText(text: string): string {
  return decodeHtmlEntities(text)
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanHtmlLines(html: string): string[] {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|div|li)>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .split(/\n+/)
    .map(cleanText)
    .filter((line) => line.length > 0);
}

function isSiteChromeText(text: string): boolean {
  if (!text) return true;
  if (SITE_NAV_TEXT.has(text)) return true;
  if (/^Eastern Sun Resurrected\s+\d+(?:\.\d+)?$/i.test(text)) return true;
  if (/^(?:\[[^\]]+\]\s*)+$/.test(text)) return true;
  return false;
}

function isNavigationAnchor(element: Element): boolean {
  if (element.tagName !== 'A') return false;
  const text = cleanText(element.textContent);
  return SITE_NAV_TEXT.has(text);
}

function hasStructuredChild(element: Element): boolean {
  return element.querySelector('table,img,h1,h2,h3,h4,h5,h6,nav') !== null;
}

function getHeadingLevel(tagName: string): 2 | 3 {
  return tagName === 'H2' ? 2 : 3;
}

function parseTableCell(cell: Element): string {
  return cleanHtmlLines(cell.innerHTML).join('\n');
}

function parseTable(table: Element, id: string): GuideTableBlock | null {
  if (table.querySelector('table')) return null;

  const rowElements = Array.from(table.querySelectorAll('tr'));
  const parsedRows = rowElements
    .map((row) =>
      Array.from(row.querySelectorAll('th,td'))
        .map(parseTableCell)
        .filter((cell) => cell.length > 0)
    )
    .filter((row) => row.length > 0);

  if (parsedRows.length < 2) return null;
  if (parsedRows.every((row) => row.length <= 1)) return null;

  let caption = '';
  let headers: readonly string[] = [];
  let rows: readonly (readonly string[])[] = parsedRows;

  const firstRowHasSingleColspan = rowElements[0]?.querySelector('td[colspan],th[colspan]') !== null && parsedRows[0]?.length === 1;
  if (firstRowHasSingleColspan) {
    caption = parsedRows[0][0];
    headers = parsedRows[1] ?? [];
    rows = parsedRows.slice(2);
  } else {
    headers = parsedRows[0] ?? [];
    rows = parsedRows.slice(1);
  }

  if (headers.length === 0 && rows.length === 0) return null;

  return {
    id,
    kind: 'table',
    caption,
    headers,
    rows,
  };
}

function buildTextIndex(blocks: readonly GuideContentBlock[]): string {
  const textParts: string[] = [];
  for (const block of blocks) {
    if (block.kind === 'heading' || block.kind === 'paragraph') {
      textParts.push(block.text);
    } else if (block.kind === 'table') {
      textParts.push(block.caption, ...block.headers, ...block.rows.flat());
    } else {
      textParts.push(block.alt);
    }
  }
  return textParts.filter(Boolean).join(' ');
}

export function parseGuidePage(html: string, entry: GuidePageCatalogEntry): GuidePage {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const blocks: GuideContentBlock[] = [];
  let blockCounter = 0;

  function nextId(kind: GuideContentBlock['kind']): string {
    blockCounter += 1;
    return `${entry.id}-${kind}-${String(blockCounter)}`;
  }

  function pushParagraph(text: string): void {
    const normalized = cleanText(text);
    if (isSiteChromeText(normalized)) return;
    const block: GuideParagraphBlock = {
      id: nextId('paragraph'),
      kind: 'paragraph',
      text: normalized,
    };
    blocks.push(block);
  }

  function visit(node: ChildNode): void {
    if (node.nodeType === Node.TEXT_NODE) {
      pushParagraph(node.textContent ?? '');
      return;
    }

    if (!(node instanceof Element)) return;

    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'NAV'].includes(node.tagName)) return;
    if (isNavigationAnchor(node)) return;

    if (/^H[1-6]$/.test(node.tagName)) {
      const text = cleanText(node.textContent);
      if (!isSiteChromeText(text)) {
        blocks.push({
          id: nextId('heading'),
          kind: 'heading',
          level: getHeadingLevel(node.tagName),
          text,
        });
      }
      return;
    }

    if (node.tagName === 'TABLE') {
      const table = parseTable(node, nextId('table'));
      if (table) {
        blocks.push(table);
      } else {
        for (const child of Array.from(node.childNodes)) {
          visit(child);
        }
      }
      return;
    }

    if (node.tagName === 'IMG') {
      const src = node.getAttribute('src') ?? '';
      if (src) {
        const block: GuideImageBlock = {
          id: nextId('image'),
          kind: 'image',
          src,
          alt: cleanText(node.getAttribute('alt') ?? ''),
        };
        blocks.push(block);
      }
      return;
    }

    if (!hasStructuredChild(node)) {
      for (const line of cleanHtmlLines(node.innerHTML)) {
        pushParagraph(line);
      }
      return;
    }

    for (const child of Array.from(node.childNodes)) {
      visit(child);
    }
  }

  for (const node of Array.from(doc.body.childNodes)) {
    visit(node);
  }

  return {
    id: entry.id,
    group: entry.group,
    label: entry.label,
    title: entry.title,
    sourcePath: entry.sourcePath,
    sourceUrl: getGuidePageSourceUrl(entry.sourcePath),
    order: entry.order,
    blocks,
    textIndex: buildTextIndex(blocks),
  };
}

export function parseGuidePages(sources: readonly GuidePageHtmlSource[]): GuidePage[] {
  return sources.map((source) => parseGuidePage(source.html, source.entry)).sort((a, b) => a.order - b.order);
}
