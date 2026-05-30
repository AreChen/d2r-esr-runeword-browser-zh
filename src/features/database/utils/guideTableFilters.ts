import type { GuideContentBlock, GuidePage, GuideTableBlock } from '@/core/db';
import { buildLocalizedSearchText } from '@/core/i18n';
import { translateGuideText } from '@/core/i18n/guideTranslation';
import { parseSearchTerms } from '@/features/runewords/utils/filteringHelpers';

export const NO_SECTION_SELECTED = '__none__';

export interface GuideTableFilterState {
  readonly searchText: string;
  readonly selectedSections: readonly string[];
  readonly favoriteSections: readonly string[];
  readonly showFavoritesOnly: boolean;
  readonly maxReqLevel: number | null;
}

export interface GuideTableSection {
  readonly key: string;
  readonly label: string;
  readonly rowCount: number;
}

export interface FilteredGuidePageTables {
  readonly page: GuidePage;
  readonly totalRowCount: number;
  readonly visibleRowCount: number;
  readonly isFiltering: boolean;
}

export const DEFAULT_GUIDE_TABLE_FILTERS: GuideTableFilterState = {
  searchText: '',
  selectedSections: [],
  favoriteSections: [],
  showFavoritesOnly: false,
  maxReqLevel: null,
};

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

export function isGuideTableFilterState(value: unknown): value is GuideTableFilterState {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<GuideTableFilterState>;

  return (
    typeof candidate.searchText === 'string' &&
    isStringArray(candidate.selectedSections) &&
    isStringArray(candidate.favoriteSections) &&
    typeof candidate.showFavoritesOnly === 'boolean' &&
    (candidate.maxReqLevel === null || typeof candidate.maxReqLevel === 'number')
  );
}

export function getGuideTableSectionKey(caption: string): string {
  const normalized = caption.trim().replace(/\s+/gu, ' ');
  if (!normalized) return '表格';

  const tierMatch = /^Tier\s+(\d+)/iu.exec(normalized);
  if (tierMatch) return `Tier ${tierMatch[1]}`;

  if (/^Completion\b/iu.test(normalized)) return 'Completion';

  return normalized;
}

function hasRecipeDataInHeaders(block: GuideTableBlock): boolean {
  const sectionKey = getGuideTableSectionKey(block.caption);
  if (!sectionKey.startsWith('Tier ') && sectionKey !== 'Completion') return false;
  if (block.headers.length !== 2) return false;

  const headerText = block.headers.join(' ');
  return /\bVessel of Souls\b|\bSame Item\b|souls remaining|Chance to Cast/iu.test(headerText);
}

function normalizeGuideTableBlock(block: GuideTableBlock): GuideTableBlock {
  if (!hasRecipeDataInHeaders(block)) return block;

  return {
    ...block,
    headers: ['Input(s)', 'Possible Outcome(s)'],
    rows: [block.headers, ...block.rows],
  };
}

function getTableRowCount(block: GuideTableBlock): number {
  return normalizeGuideTableBlock(block).rows.length;
}

export function getGuideTableSections(page: GuidePage): readonly GuideTableSection[] {
  const sectionMap = new Map<string, GuideTableSection>();

  for (const block of page.blocks) {
    if (block.kind !== 'table') continue;

    const key = getGuideTableSectionKey(block.caption);
    const existing = sectionMap.get(key);
    const rowCount = getTableRowCount(block);
    if (existing) {
      sectionMap.set(key, { ...existing, rowCount: existing.rowCount + rowCount });
      continue;
    }

    sectionMap.set(key, { key, label: key, rowCount });
  }

  return [...sectionMap.values()];
}

function parseInteger(text: string): number | null {
  const match = /-?\d+/u.exec(text);
  if (!match) return null;
  return Number.parseInt(match[0], 10);
}

export function parseGuideRowRequiredLevel(row: readonly string[], headers: readonly string[] = []): number | null {
  const requiredLevelHeaderIndex = headers.findIndex((header) => /^(Req Lvl|Required Level|需求等级)$/iu.test(header.trim()));
  if (requiredLevelHeaderIndex >= 0) {
    return parseInteger(row[requiredLevelHeaderIndex] ?? '');
  }

  const rowText = row.join(' ');
  const specificMatch = /\bLvl\s+-?\d+\s*\/\s*Req Lvl\s*(-?\d+)/iu.exec(rowText);
  if (specificMatch) return Number.parseInt(specificMatch[1], 10);

  const labelMatch = /\b(?:Required Level|Req Lvl|Level Requirement)\s*:?\s*(-?\d+)/iu.exec(rowText);
  if (labelMatch) return Number.parseInt(labelMatch[1], 10);

  return null;
}

function isSectionSelected(sectionKey: string, selectedSections: readonly string[]): boolean {
  if (selectedSections.includes(NO_SECTION_SELECTED)) return false;
  return selectedSections.length === 0 || selectedSections.includes(sectionKey);
}

export function isGuideTableSectionSelected(sectionKey: string, selectedSections: readonly string[]): boolean {
  return isSectionSelected(sectionKey, selectedSections);
}

function buildGuideSearchText(parts: readonly string[]): string {
  const translatedParts = parts.map((part) => translateGuideText(part));
  return buildLocalizedSearchText([...parts, ...translatedParts]);
}

function rowMatchesSearch(row: readonly string[], block: GuideTableBlock, sectionKey: string, searchTerms: readonly string[]): boolean {
  if (searchTerms.length === 0) return true;
  const searchable = buildGuideSearchText([sectionKey, block.caption, ...block.headers, ...row]);
  return searchTerms.every((term) => searchable.includes(term));
}

function rowMatchesRequiredLevel(row: readonly string[], headers: readonly string[], maxReqLevel: number | null): boolean {
  if (maxReqLevel === null) return true;
  const requiredLevel = parseGuideRowRequiredLevel(row, headers);
  return requiredLevel === null || requiredLevel <= maxReqLevel;
}

function shouldKeepSection(sectionKey: string, filters: GuideTableFilterState): boolean {
  if (!isSectionSelected(sectionKey, filters.selectedSections)) return false;
  if (filters.showFavoritesOnly && !filters.favoriteSections.includes(sectionKey)) return false;
  return true;
}

function hasActiveFilters(filters: GuideTableFilterState, searchTerms: readonly string[]): boolean {
  return searchTerms.length > 0 || filters.selectedSections.length > 0 || filters.showFavoritesOnly || filters.maxReqLevel !== null;
}

export function filterGuidePageTables(page: GuidePage, filters: GuideTableFilterState): FilteredGuidePageTables {
  const searchTerms = parseSearchTerms(filters.searchText);
  const isFiltering = hasActiveFilters(filters, searchTerms);
  let totalRowCount = 0;
  let visibleRowCount = 0;
  const filteredBlocks: GuideContentBlock[] = [];

  for (const block of page.blocks) {
    if (block.kind !== 'table') {
      filteredBlocks.push(block);
      continue;
    }

    const normalizedBlock = normalizeGuideTableBlock(block);
    const sectionKey = getGuideTableSectionKey(normalizedBlock.caption);
    totalRowCount += normalizedBlock.rows.length;

    if (!shouldKeepSection(sectionKey, filters)) {
      continue;
    }

    const rows = normalizedBlock.rows.filter(
      (row) =>
        rowMatchesSearch(row, normalizedBlock, sectionKey, searchTerms) &&
        rowMatchesRequiredLevel(row, normalizedBlock.headers, filters.maxReqLevel)
    );
    visibleRowCount += rows.length;

    if (rows.length > 0 || !isFiltering) {
      filteredBlocks.push({ ...normalizedBlock, rows });
    }
  }

  return {
    page: { ...page, blocks: filteredBlocks },
    totalRowCount,
    visibleRowCount,
    isFiltering,
  };
}
