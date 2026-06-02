import type { GuideContentBlock, GuidePage, GuideTableBlock } from '@/core/db';
import { buildLocalizedSearchText } from '@/core/i18n';
import { translateGuideText } from '@/core/i18n/guideTranslation';
import { parseSearchTerms } from '@/features/runewords/utils/filteringHelpers';
import {
  GUIDE_ROW_MARKER_KINDS,
  GUIDE_ROW_MARKER_LABELS,
  getGuideCellLineClassification,
  isGuideRowMarkerKind,
  type GuideRowMarkerKind,
} from './guideCellClassification';

export const NO_SECTION_SELECTED = '__none__';

type GuideTextTranslator = (text: string) => string;

export interface GuideTableFilterState {
  readonly searchText: string;
  readonly selectedSections: readonly string[];
  readonly favoriteSections: readonly string[];
  readonly favoriteRows?: readonly string[];
  readonly showFavoritesOnly: boolean;
  readonly maxReqLevel: number | null;
  readonly selectedMarkers?: readonly GuideRowMarkerKind[];
}

export interface GuideTableSection {
  readonly key: string;
  readonly label: string;
  readonly rowCount: number;
  readonly matchedRowCount?: number;
}

export interface GuideRowMarkerOption {
  readonly kind: GuideRowMarkerKind;
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
  favoriteRows: [],
  showFavoritesOnly: false,
  maxReqLevel: null,
  selectedMarkers: [],
};

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

function isGuideRowMarkerArray(value: unknown): value is readonly GuideRowMarkerKind[] {
  return Array.isArray(value) && value.every(isGuideRowMarkerKind);
}

export function isGuideTableFilterState(value: unknown): value is GuideTableFilterState {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<GuideTableFilterState>;

  return (
    typeof candidate.searchText === 'string' &&
    isStringArray(candidate.selectedSections) &&
    isStringArray(candidate.favoriteSections) &&
    (candidate.favoriteRows === undefined || isStringArray(candidate.favoriteRows)) &&
    typeof candidate.showFavoritesOnly === 'boolean' &&
    (candidate.maxReqLevel === null || typeof candidate.maxReqLevel === 'number') &&
    (candidate.selectedMarkers === undefined || isGuideRowMarkerArray(candidate.selectedMarkers))
  );
}

function hashGuideFavoriteId(input: string): string {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = Math.imul(hash, 31) + input.charCodeAt(index);
    hash >>>= 0;
  }
  return hash.toString(36);
}

export function buildGuideTableRowFavoriteId(block: GuideTableBlock, row: readonly string[]): string {
  const sectionKey = getGuideTableSectionKey(block.caption);
  return `${sectionKey}::${hashGuideFavoriteId([sectionKey, ...block.headers, ...row].join('\u001f'))}`;
}

export function toggleGuideTableRowFavoriteId(favoriteId: string, favoriteRows: readonly string[]): readonly string[] {
  if (favoriteRows.includes(favoriteId)) return favoriteRows.filter((entry) => entry !== favoriteId);
  return [...favoriteRows, favoriteId];
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

function sectionHasActiveRowFilters(filters: GuideTableFilterState | undefined, searchTerms: readonly string[]): boolean {
  if (!filters) return false;
  return searchTerms.length > 0 || filters.showFavoritesOnly || filters.maxReqLevel !== null || (filters.selectedMarkers?.length ?? 0) > 0;
}

function getSectionMatchedRowCount(
  block: GuideTableBlock,
  sectionKey: string,
  filters: GuideTableFilterState,
  searchTerms: readonly string[]
): number {
  return block.rows.filter(
    (row) =>
      rowMatchesSearch(row, block, sectionKey, searchTerms) &&
      rowMatchesFavorite(row, block, sectionKey, filters) &&
      rowMatchesRequiredLevel(row, block.headers, filters.maxReqLevel) &&
      rowMatchesMarkers(row, filters.selectedMarkers)
  ).length;
}

export function getGuideTableSections(page: GuidePage, filters?: GuideTableFilterState): readonly GuideTableSection[] {
  const sectionMap = new Map<string, GuideTableSection>();
  const searchTerms = filters ? parseSearchTerms(filters.searchText) : [];
  const includeMatchedCounts = sectionHasActiveRowFilters(filters, searchTerms);

  for (const block of page.blocks) {
    if (block.kind !== 'table') continue;

    const normalizedBlock = normalizeGuideTableBlock(block);
    const key = getGuideTableSectionKey(normalizedBlock.caption);
    const existing = sectionMap.get(key);
    const rowCount = normalizedBlock.rows.length;
    const matchedRowCount =
      includeMatchedCounts && filters ? getSectionMatchedRowCount(normalizedBlock, key, filters, searchTerms) : undefined;
    if (existing) {
      sectionMap.set(key, {
        ...existing,
        rowCount: existing.rowCount + rowCount,
        ...(includeMatchedCounts ? { matchedRowCount: (existing.matchedRowCount ?? 0) + (matchedRowCount ?? 0) } : {}),
      });
      continue;
    }

    sectionMap.set(key, { key, label: key, rowCount, ...(includeMatchedCounts ? { matchedRowCount: matchedRowCount ?? 0 } : {}) });
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

function buildGuideSearchText(parts: readonly string[], translateText: GuideTextTranslator = translateGuideText): string {
  const translatedParts = parts.map((part) => translateText(part));
  return buildLocalizedSearchText([...parts, ...translatedParts]);
}

function rowMatchesSearch(row: readonly string[], block: GuideTableBlock, sectionKey: string, searchTerms: readonly string[]): boolean {
  if (searchTerms.length === 0) return true;
  const searchable = buildGuideSearchText([sectionKey, block.caption, ...(block.notes ?? []), ...block.headers, ...row]);
  return searchTerms.every((term) => searchable.includes(term));
}

function rowMatchesRequiredLevel(row: readonly string[], headers: readonly string[], maxReqLevel: number | null): boolean {
  if (maxReqLevel === null) return true;
  const requiredLevel = parseGuideRowRequiredLevel(row, headers);
  return requiredLevel === null || requiredLevel <= maxReqLevel;
}

function getTranslatedRowLines(row: readonly string[], translateText: GuideTextTranslator): readonly string[] {
  return row.flatMap((cell) =>
    cell
      .split(/\n+/u)
      .map((line) => translateText(line.trim()))
      .filter((line) => line.length > 0)
  );
}

const guideRowMarkerCache = new WeakMap<
  readonly string[],
  {
    readonly rowSignature: string;
    readonly translateText: GuideTextTranslator;
    readonly markers: ReadonlySet<GuideRowMarkerKind>;
  }
>();

function getGuideRowSignature(row: readonly string[]): string {
  return row.join('\u001f');
}

export function getGuideRowMarkers(
  row: readonly string[],
  translateText: GuideTextTranslator = translateGuideText
): ReadonlySet<GuideRowMarkerKind> {
  const rowSignature = getGuideRowSignature(row);
  const cached = guideRowMarkerCache.get(row);
  if (cached?.rowSignature === rowSignature && cached.translateText === translateText) {
    return cached.markers;
  }

  const markers = new Set<GuideRowMarkerKind>();

  for (const line of getTranslatedRowLines(row, translateText)) {
    const classification = getGuideCellLineClassification(line);
    if (classification.kind === 'affix') {
      markers.add('affix');
      if (classification.affixKind !== 'affix') {
        markers.add(classification.affixKind);
      }
      continue;
    }
    if (classification.kind === 'material') {
      markers.add(classification.materialKind);
    }
  }

  guideRowMarkerCache.set(row, { rowSignature, translateText, markers });
  return markers;
}

function rowMatchesMarkerOptionScope(
  row: readonly string[],
  block: GuideTableBlock,
  sectionKey: string,
  filters: GuideTableFilterState | undefined,
  searchTerms: readonly string[]
): boolean {
  if (!filters) return true;
  if (!isSectionSelected(sectionKey, filters.selectedSections)) return false;
  return (
    rowMatchesSearch(row, block, sectionKey, searchTerms) &&
    rowMatchesFavorite(row, block, sectionKey, filters) &&
    rowMatchesRequiredLevel(row, block.headers, filters.maxReqLevel)
  );
}

export function getGuideRowMarkerOptions(page: GuidePage, filters?: GuideTableFilterState): readonly GuideRowMarkerOption[] {
  const rowCounts = new Map<GuideRowMarkerKind, number>();
  const searchTerms = filters ? parseSearchTerms(filters.searchText) : [];

  for (const block of page.blocks) {
    if (block.kind !== 'table') continue;

    const normalizedBlock = normalizeGuideTableBlock(block);
    const sectionKey = getGuideTableSectionKey(normalizedBlock.caption);
    for (const row of normalizedBlock.rows) {
      if (!rowMatchesMarkerOptionScope(row, normalizedBlock, sectionKey, filters, searchTerms)) continue;

      for (const marker of getGuideRowMarkers(row)) {
        rowCounts.set(marker, (rowCounts.get(marker) ?? 0) + 1);
      }
    }
  }

  return GUIDE_ROW_MARKER_KINDS.flatMap((kind) => {
    const rowCount = rowCounts.get(kind) ?? 0;
    if (rowCount === 0) return [];
    return [{ kind, label: GUIDE_ROW_MARKER_LABELS[kind], rowCount }];
  });
}

function rowMatchesMarkers(row: readonly string[], selectedMarkers: readonly GuideRowMarkerKind[] | undefined): boolean {
  if (!selectedMarkers || selectedMarkers.length === 0) return true;
  const rowMarkers = getGuideRowMarkers(row);
  return selectedMarkers.some((marker) => rowMarkers.has(marker));
}

function rowMatchesFavorite(row: readonly string[], block: GuideTableBlock, sectionKey: string, filters: GuideTableFilterState): boolean {
  if (!filters.showFavoritesOnly) return true;
  if (filters.favoriteSections.includes(sectionKey)) return true;
  return (filters.favoriteRows ?? []).includes(buildGuideTableRowFavoriteId(block, row));
}

function hasActiveFilters(filters: GuideTableFilterState, searchTerms: readonly string[]): boolean {
  return (
    searchTerms.length > 0 ||
    filters.selectedSections.length > 0 ||
    filters.showFavoritesOnly ||
    filters.maxReqLevel !== null ||
    (filters.selectedMarkers?.length ?? 0) > 0
  );
}

export function filterGuidePageTables(page: GuidePage, filters: GuideTableFilterState): FilteredGuidePageTables {
  const searchTerms = parseSearchTerms(filters.searchText);
  const isFiltering = hasActiveFilters(filters, searchTerms);
  let totalRowCount = 0;
  let visibleRowCount = 0;
  const filteredBlocks: GuideContentBlock[] = [];

  for (const block of page.blocks) {
    if (block.kind !== 'table') {
      if (!isFiltering) {
        filteredBlocks.push(block);
      }
      continue;
    }

    const normalizedBlock = normalizeGuideTableBlock(block);
    const sectionKey = getGuideTableSectionKey(normalizedBlock.caption);
    totalRowCount += normalizedBlock.rows.length;

    if (!isSectionSelected(sectionKey, filters.selectedSections)) {
      continue;
    }

    const rows = normalizedBlock.rows.filter(
      (row) =>
        rowMatchesSearch(row, normalizedBlock, sectionKey, searchTerms) &&
        rowMatchesFavorite(row, normalizedBlock, sectionKey, filters) &&
        rowMatchesRequiredLevel(row, normalizedBlock.headers, filters.maxReqLevel) &&
        rowMatchesMarkers(row, filters.selectedMarkers)
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
