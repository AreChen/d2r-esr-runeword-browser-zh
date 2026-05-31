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
  const lineBreak = '[[GUIDE_LINE_BREAK]]';
  return html
    .replace(/<br\s*\/?>/gi, lineBreak)
    .replace(/<\/(?:p|div|li)>/gi, lineBreak)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .split(lineBreak)
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

interface ParsedTableRow {
  readonly cells: readonly string[];
  readonly isSingleColspanRow: boolean;
}

function parseCellSpan(cell: Element): number {
  const rawColspan = cell.getAttribute('colspan');
  if (rawColspan === null) return 1;

  const colspan = Number.parseInt(rawColspan, 10);
  return Number.isFinite(colspan) && colspan > 1 ? colspan : 1;
}

function parseRowSpan(cell: Element): number {
  const rawRowspan = cell.getAttribute('rowspan');
  if (rawRowspan === null) return 1;

  const rowspan = Number.parseInt(rawRowspan, 10);
  return Number.isFinite(rowspan) && rowspan > 1 ? rowspan : 1;
}

function consumeActiveRowspanPlaceholders(cells: string[], activeRowspans: number[], startColumnIndex: number): number {
  let columnIndex = startColumnIndex;

  while ((activeRowspans[columnIndex] ?? 0) > 0) {
    cells.push('');
    activeRowspans[columnIndex] -= 1;
    columnIndex += 1;
  }

  return columnIndex;
}

function hasActiveRowspanAtOrAfter(activeRowspans: readonly number[], startColumnIndex: number): boolean {
  return activeRowspans.some((remainingRows, index) => index >= startColumnIndex && remainingRows > 0);
}

function parseTableRow(row: Element, activeRowspans: number[]): ParsedTableRow {
  const cellElements = Array.from(row.querySelectorAll('th,td'));
  const cells: string[] = [];
  let columnIndex = 0;

  for (const cell of cellElements) {
    columnIndex = consumeActiveRowspanPlaceholders(cells, activeRowspans, columnIndex);

    const text = parseTableCell(cell);
    const colspan = parseCellSpan(cell);
    const rowspan = parseRowSpan(cell);

    for (let offset = 0; offset < colspan; offset += 1) {
      cells.push(offset === 0 ? text : '');
      if (rowspan > 1) {
        activeRowspans[columnIndex + offset] = Math.max(activeRowspans[columnIndex + offset] ?? 0, rowspan - 1);
      }
    }

    columnIndex += colspan;
  }

  while (hasActiveRowspanAtOrAfter(activeRowspans, columnIndex)) {
    if ((activeRowspans[columnIndex] ?? 0) > 0) {
      columnIndex = consumeActiveRowspanPlaceholders(cells, activeRowspans, columnIndex);
      continue;
    }

    cells.push('');
    columnIndex += 1;
  }

  return {
    cells,
    isSingleColspanRow: cellElements.length === 1 && parseCellSpan(cellElements[0]) > 1,
  };
}

function padRow(row: readonly string[], width: number): readonly string[] {
  if (row.length >= width) return row;
  return [...row, ...Array<string>(width - row.length).fill('')];
}

function isInputOutputHeaderRow(row: readonly string[]): boolean {
  const input = row[0]?.trim() ?? '';
  const output = row[1]?.trim() ?? '';
  return /^Input(?:\(s\))?$/iu.test(input) && /^Output(?:\(s\))?$/iu.test(output);
}

function looksLikeCubeRecipeNote(text: string): boolean {
  return text.length > 60 || text.includes('\n') || /[.!?]/u.test(text);
}

function splitCubeRecipeCaption(text: string): { readonly caption: string; readonly notes: readonly string[] } {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2 || lines[0].length > 48) {
    return { caption: text, notes: [] };
  }

  const notes = lines.slice(1).join('\n');
  if (!looksLikeCubeRecipeNote(notes)) {
    return { caption: text, notes: [] };
  }

  return {
    caption: lines[0],
    notes: [notes],
  };
}

function normalizeCubeRecipeRow(row: ParsedTableRow, width: number): readonly string[] {
  if (!row.isSingleColspanRow) return padRow(row.cells, width);

  return [row.cells[0] ?? '', ...Array<string>(Math.max(width - 1, 0)).fill('')];
}

function isLikelyTwoColumnCubeRecipeTable(caption: string, rows: readonly ParsedTableRow[], startIndex: number): boolean {
  if (!caption || caption.length > 80 || caption.includes('\n')) return false;

  return rows
    .slice(startIndex)
    .some((row) => !row.isSingleColspanRow && row.cells.length >= 2 && Boolean(row.cells[0]) && Boolean(row.cells[1]));
}

function parseCubeRecipeTable(parsedRows: readonly ParsedTableRow[], id: string): GuideTableBlock | null {
  if (parsedRows.length < 2) return null;

  let caption = '';
  const notes: string[] = [];
  let firstRecipeRowIndex = 0;

  if (parsedRows[0]?.isSingleColspanRow) {
    const splitCaption = splitCubeRecipeCaption(parsedRows[0].cells[0] ?? '');
    caption = splitCaption.caption;
    notes.push(...splitCaption.notes);
    firstRecipeRowIndex = 1;
  }

  const inputOutputHeaderIndex = parsedRows.findIndex((row, index) => index >= firstRecipeRowIndex && isInputOutputHeaderRow(row.cells));
  const tableWidth = Math.max(2, ...parsedRows.slice(firstRecipeRowIndex).map((row) => row.cells.length));

  if (inputOutputHeaderIndex >= 0) {
    const leadingRows: readonly (readonly string[])[] = parsedRows
      .slice(firstRecipeRowIndex, inputOutputHeaderIndex)
      .flatMap((row): readonly (readonly string[])[] => {
        const text = row.cells[0]?.trim() ?? '';
        if (!text) return [];
        if (row.isSingleColspanRow && looksLikeCubeRecipeNote(text)) {
          notes.push(text);
          return [];
        }
        return [normalizeCubeRecipeRow(row, tableWidth)];
      });
    const recipeRows = parsedRows.slice(inputOutputHeaderIndex + 1).map((row) => normalizeCubeRecipeRow(row, tableWidth));

    return {
      id,
      kind: 'table',
      caption,
      ...(notes.length > 0 ? { notes } : {}),
      headers: ['Input', 'Output'],
      rows: [...leadingRows, ...recipeRows],
    };
  }

  if (!isLikelyTwoColumnCubeRecipeTable(caption, parsedRows, firstRecipeRowIndex)) return null;

  return {
    id,
    kind: 'table',
    caption,
    ...(notes.length > 0 ? { notes } : {}),
    headers: ['Input', 'Output'],
    rows: parsedRows.slice(firstRecipeRowIndex).map((row) => normalizeCubeRecipeRow(row, tableWidth)),
  };
}

function parseTable(table: Element, id: string, pageId: string): GuideTableBlock | null {
  if (table.querySelector('table')) return null;

  const rowElements = Array.from(table.querySelectorAll('tr'));
  const activeRowspans: number[] = [];
  const parsedRows = rowElements
    .map((row) => parseTableRow(row, activeRowspans))
    .filter((row) => row.cells.some((cell) => cell.length > 0));
  const rows = parsedRows.map((row) => row.cells);

  if (rows.length < 2) return null;
  if (rows.every((row) => row.length <= 1)) return null;

  if (pageId === 'cubeRecipes') {
    const cubeRecipeTable = parseCubeRecipeTable(parsedRows, id);
    if (cubeRecipeTable) return cubeRecipeTable;
  }

  let caption = '';
  let headers: readonly string[] = [];
  let tableRows: readonly (readonly string[])[] = rows;

  if (parsedRows[0]?.isSingleColspanRow) {
    caption = rows[0]?.[0] ?? '';
    headers = rows[1] ?? [];
    tableRows = rows.slice(2);
  } else {
    headers = rows[0] ?? [];
    tableRows = rows.slice(1);
  }

  if (headers.length === 0 && tableRows.length === 0) return null;
  const tableWidth = Math.max(headers.length, ...tableRows.map((row) => row.length));
  headers = padRow(headers, tableWidth);
  tableRows = tableRows.map((row) => padRow(row, tableWidth));

  return {
    id,
    kind: 'table',
    caption,
    headers,
    rows: tableRows,
  };
}

function buildTextIndex(blocks: readonly GuideContentBlock[]): string {
  const textParts: string[] = [];
  for (const block of blocks) {
    if (block.kind === 'heading' || block.kind === 'paragraph') {
      textParts.push(block.text);
    } else if (block.kind === 'table') {
      textParts.push(block.caption, ...(block.notes ?? []), ...block.headers, ...block.rows.flat());
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
      const table = parseTable(node, nextId('table'), entry.id);
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
