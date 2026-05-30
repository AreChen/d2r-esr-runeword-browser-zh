import type {
  LootFilterBorder,
  LootFilterLocalizedText,
  LootFilterMetadata,
  LootFilterRgba,
  LootFilterRule,
  LootFilterRuleEdit,
  ParsedLootFilterConfig,
} from '../types';

interface AssignmentRange {
  readonly assignmentStart: number;
  readonly assignmentEnd: number;
  readonly valueStart: number;
  readonly valueEnd: number;
  readonly indent: string;
}

interface RuleRange {
  readonly source: string;
  readonly sourceStart: number;
  readonly sourceEnd: number;
  readonly label: string;
}

const EMPTY_METADATA: LootFilterMetadata = {
  filterTitles: [],
};

const STRING_PATTERN = /"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'/g;

function isIdentifierStart(char: string): boolean {
  return /[A-Za-z_]/.test(char);
}

function isIdentifierPart(char: string): boolean {
  return /[A-Za-z0-9_]/.test(char);
}

function skipWhitespace(source: string, index: number): number {
  let cursor = index;
  while (cursor < source.length && /\s/.test(source[cursor])) {
    cursor += 1;
  }
  return cursor;
}

function readIdentifier(source: string, index: number): { readonly value: string; readonly end: number } | undefined {
  if (!isIdentifierStart(source[index] ?? '')) return undefined;

  let cursor = index + 1;
  while (cursor < source.length && isIdentifierPart(source[cursor])) {
    cursor += 1;
  }

  return {
    value: source.slice(index, cursor),
    end: cursor,
  };
}

function getLineIndent(source: string, index: number): string {
  const lineStart = source.lastIndexOf('\n', index) + 1;
  const linePrefix = source.slice(lineStart, index);
  const match = /^(\s*)/.exec(linePrefix);
  return match?.[1] ?? '';
}

function findExpressionEnd(
  source: string,
  valueStart: number,
  baseDepth: number
): { readonly valueEnd: number; readonly assignmentEnd: number } {
  let depth = baseDepth;
  let cursor = valueStart;
  let quote: string | undefined;
  let escaping = false;
  let inLineComment = false;

  while (cursor < source.length) {
    const char = source[cursor];
    const next = source[cursor + 1];

    if (inLineComment) {
      if (char === '\n') inLineComment = false;
      cursor += 1;
      continue;
    }

    if (quote) {
      if (escaping) {
        escaping = false;
      } else if (char === '\\') {
        escaping = true;
      } else if (char === quote) {
        quote = undefined;
      }
      cursor += 1;
      continue;
    }

    if (char === '-' && next === '-') {
      inLineComment = true;
      cursor += 2;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      cursor += 1;
      continue;
    }

    if (char === '{' || char === '(' || char === '[') {
      depth += 1;
      cursor += 1;
      continue;
    }

    if (char === '}' || char === ')' || char === ']') {
      if (depth === baseDepth && char === '}') {
        return {
          valueEnd: cursor,
          assignmentEnd: cursor,
        };
      }
      depth -= 1;
      cursor += 1;
      continue;
    }

    if (char === ',' && depth === baseDepth) {
      return {
        valueEnd: cursor,
        assignmentEnd: cursor + 1,
      };
    }

    cursor += 1;
  }

  return {
    valueEnd: source.length,
    assignmentEnd: source.length,
  };
}

function findTopLevelAssignment(tableSource: string, fieldName: string): AssignmentRange | undefined {
  let depth = 0;
  let cursor = 0;
  let quote: string | undefined;
  let escaping = false;
  let inLineComment = false;

  while (cursor < tableSource.length) {
    const char = tableSource[cursor];
    const next = tableSource[cursor + 1];

    if (inLineComment) {
      if (char === '\n') inLineComment = false;
      cursor += 1;
      continue;
    }

    if (quote) {
      if (escaping) {
        escaping = false;
      } else if (char === '\\') {
        escaping = true;
      } else if (char === quote) {
        quote = undefined;
      }
      cursor += 1;
      continue;
    }

    if (char === '-' && next === '-') {
      inLineComment = true;
      cursor += 2;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      cursor += 1;
      continue;
    }

    if (char === '{') {
      depth += 1;
      cursor += 1;
      continue;
    }

    if (char === '}') {
      depth -= 1;
      cursor += 1;
      continue;
    }

    if (depth === 1 && isIdentifierStart(char)) {
      const identifier = readIdentifier(tableSource, cursor);
      if (!identifier) {
        cursor += 1;
        continue;
      }

      const afterIdentifier = skipWhitespace(tableSource, identifier.end);
      if (identifier.value === fieldName && tableSource[afterIdentifier] === '=') {
        const valueStart = skipWhitespace(tableSource, afterIdentifier + 1);
        const end = findExpressionEnd(tableSource, valueStart, 1);
        return {
          assignmentStart: cursor,
          assignmentEnd: end.assignmentEnd,
          valueStart,
          valueEnd: trimRightRange(tableSource, valueStart, end.valueEnd),
          indent: getLineIndent(tableSource, cursor),
        };
      }

      cursor = identifier.end;
      continue;
    }

    cursor += 1;
  }

  return undefined;
}

function findAnyAssignment(source: string, fieldName: string): AssignmentRange | undefined {
  let cursor = 0;
  let quote: string | undefined;
  let escaping = false;
  let inLineComment = false;

  while (cursor < source.length) {
    const char = source[cursor];
    const next = source[cursor + 1];

    if (inLineComment) {
      if (char === '\n') inLineComment = false;
      cursor += 1;
      continue;
    }

    if (quote) {
      if (escaping) {
        escaping = false;
      } else if (char === '\\') {
        escaping = true;
      } else if (char === quote) {
        quote = undefined;
      }
      cursor += 1;
      continue;
    }

    if (char === '-' && next === '-') {
      inLineComment = true;
      cursor += 2;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      cursor += 1;
      continue;
    }

    if (isIdentifierStart(char)) {
      const identifier = readIdentifier(source, cursor);
      if (!identifier) {
        cursor += 1;
        continue;
      }

      const afterIdentifier = skipWhitespace(source, identifier.end);
      if (identifier.value === fieldName && source[afterIdentifier] === '=') {
        const valueStart = skipWhitespace(source, afterIdentifier + 1);
        const end = findExpressionEnd(source, valueStart, 0);
        return {
          assignmentStart: cursor,
          assignmentEnd: end.assignmentEnd,
          valueStart,
          valueEnd: trimRightRange(source, valueStart, end.valueEnd),
          indent: getLineIndent(source, cursor),
        };
      }

      cursor = identifier.end;
      continue;
    }

    cursor += 1;
  }

  return undefined;
}

function trimRightRange(source: string, start: number, end: number): number {
  let cursor = end;
  while (cursor > start && /\s/.test(source[cursor - 1])) {
    cursor -= 1;
  }
  return cursor;
}

function decodeLuaString(raw: string): string {
  return raw.replace(/\\(["'\\nrt])/g, (_match: string, escaped: string) => {
    if (escaped === 'n') return '\n';
    if (escaped === 'r') return '\r';
    if (escaped === 't') return '\t';
    return escaped;
  });
}

function encodeLuaString(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t')}"`;
}

function parseLuaString(expression: string): string | undefined {
  const trimmed = expression.trim();
  const match = /^"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'/.exec(trimmed);
  const rawValue = match?.[1] ?? match?.[2];
  return rawValue === undefined ? undefined : decodeLuaString(rawValue);
}

function parseScalarText(ruleSource: string, fieldName: string): string | undefined {
  const assignment = findTopLevelAssignment(ruleSource, fieldName);
  if (!assignment) return undefined;

  const expression = ruleSource.slice(assignment.valueStart, assignment.valueEnd).trim();
  const stringValue = parseLuaString(expression);
  if (stringValue !== undefined) return stringValue;

  const match = /^-?\d+(?:\.\d+)?-?/.exec(expression);
  return match?.[0];
}

function parseBoolean(ruleSource: string, fieldName: string): boolean | undefined {
  const assignment = findTopLevelAssignment(ruleSource, fieldName);
  if (!assignment) return undefined;

  const expression = ruleSource.slice(assignment.valueStart, assignment.valueEnd).trim().toLowerCase();
  if (expression.startsWith('true')) return true;
  if (expression.startsWith('false')) return false;
  return undefined;
}

function parseNumber(source: string, fieldName: string): number | undefined {
  const assignment = findAnyAssignment(source, fieldName);
  if (!assignment) return undefined;

  const expression = source.slice(assignment.valueStart, assignment.valueEnd).trim();
  const value = Number.parseInt(expression, 10);
  return Number.isNaN(value) ? undefined : value;
}

function parseAnyBoolean(source: string, fieldName: string): boolean | undefined {
  const assignment = findAnyAssignment(source, fieldName);
  if (!assignment) return undefined;

  const expression = source.slice(assignment.valueStart, assignment.valueEnd).trim().toLowerCase();
  if (expression.startsWith('true')) return true;
  if (expression.startsWith('false')) return false;
  return undefined;
}

function parseAnyString(source: string, fieldName: string): string | undefined {
  const assignment = findAnyAssignment(source, fieldName);
  if (!assignment) return undefined;

  return parseLuaString(source.slice(assignment.valueStart, assignment.valueEnd));
}

function parseStringListExpression(expression: string): readonly string[] {
  const stringValue = parseLuaString(expression);
  if (stringValue !== undefined) return [stringValue];

  const values: string[] = [];
  for (const match of expression.matchAll(STRING_PATTERN)) {
    const value = match[1] || match[2] || '';
    values.push(decodeLuaString(value));
  }

  if (values.length > 0) return values;

  const numericValues = expression.match(/-?\d+(?:\.\d+)?/g);
  return numericValues ?? [];
}

function parseTopLevelStringList(ruleSource: string, fieldName: string): readonly string[] {
  const assignment = findTopLevelAssignment(ruleSource, fieldName);
  if (!assignment) return [];

  return parseStringListExpression(ruleSource.slice(assignment.valueStart, assignment.valueEnd));
}

function parseLocalizedText(ruleSource: string, fieldName: string): LootFilterLocalizedText | undefined {
  const assignment = findTopLevelAssignment(ruleSource, fieldName);
  if (!assignment) return undefined;

  const expression = ruleSource.slice(assignment.valueStart, assignment.valueEnd);
  const directValue = parseLuaString(expression);
  if (directValue !== undefined) {
    return {
      zhCN: directValue,
      enUS: directValue,
      fallback: directValue,
    };
  }

  const zhCN = parseNestedLocalizedString(expression, 'zhCN');
  const enUS = parseNestedLocalizedString(expression, 'enUS');
  if (zhCN === undefined && enUS === undefined) return undefined;

  return {
    zhCN: zhCN ?? enUS,
    enUS,
    fallback: zhCN ?? enUS,
  };
}

function parseNestedLocalizedString(expression: string, locale: string): string | undefined {
  const assignment = findTopLevelAssignment(expression, locale);
  if (!assignment) return undefined;

  return parseLuaString(expression.slice(assignment.valueStart, assignment.valueEnd));
}

function parseNumberList(ruleSource: string, fieldName: string): readonly number[] {
  const assignment = findTopLevelAssignment(ruleSource, fieldName);
  if (!assignment) return [];

  const expression = ruleSource.slice(assignment.valueStart, assignment.valueEnd);
  const matches = expression.match(/-?\d+(?:\.\d+)?/g);
  if (!matches) return [];

  return matches.map((value) => Number.parseFloat(value)).filter((value) => Number.isFinite(value));
}

function parseRgba(ruleSource: string, fieldName: string): LootFilterRgba | undefined {
  const values = parseNumberList(ruleSource, fieldName);
  if (values.length < 3) return undefined;

  return [values[0], values[1], values[2], values[3] ?? 255];
}

function parseBorder(ruleSource: string, fieldName: string): LootFilterBorder | undefined {
  const values = parseNumberList(ruleSource, fieldName);
  if (values.length < 4) return undefined;

  return [values[0], values[1], values[2], values[3], values[4] ?? 1];
}

function parseFilterLevels(ruleSource: string): readonly number[] {
  const assignment = findTopLevelAssignment(ruleSource, 'filter_levels');
  if (!assignment) return [];

  const expression = ruleSource.slice(assignment.valueStart, assignment.valueEnd);
  const matches = expression.match(/\d+/g);
  if (!matches) return [];

  return [...new Set(matches.map((value) => Number.parseInt(value, 10)).filter((value) => Number.isFinite(value)))];
}

function parseHeaderMetadata(source: string): LootFilterMetadata {
  const getHeader = (label: string) => {
    const pattern = new RegExp(`^---\\s*${label}:\\s*(.+)$`, 'im');
    const match = pattern.exec(source);
    return match?.[1]?.trim();
  };

  const filterTitlesAssignment = findAnyAssignment(source, 'filter_titles');
  const filterTitles = filterTitlesAssignment
    ? parseStringListExpression(source.slice(filterTitlesAssignment.valueStart, filterTitlesAssignment.valueEnd))
    : [];

  return {
    ...EMPTY_METADATA,
    title: getHeader('Filter Title'),
    type: getHeader('Filter Type'),
    description: getHeader('Filter Description'),
    link: getHeader('Filter Link'),
    language: parseAnyString(source, 'language'),
    audioPlayback: parseAnyBoolean(source, 'audioPlayback'),
    audioVoice: parseNumber(source, 'audioVoice'),
    filterLevel: parseNumber(source, 'filter_level'),
    filterTitles,
  };
}

function findLastCommentLabel(gap: string): string | undefined {
  const lines = gap
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index];
    const match = /^--+\s*(.+)$/.exec(line);
    const label = match?.[1]?.trim();
    if (label) return label;
  }

  return undefined;
}

function splitRuleTables(source: string, rulesAssignment: AssignmentRange): readonly RuleRange[] {
  const rulesTable = source.slice(rulesAssignment.valueStart, rulesAssignment.valueEnd);
  const rulesTableOffset = rulesAssignment.valueStart;
  const ranges: RuleRange[] = [];
  let cursor = 0;
  let depth = 0;
  let ruleStart: number | undefined;
  let previousEnd = 1;
  let quote: string | undefined;
  let escaping = false;
  let inLineComment = false;

  while (cursor < rulesTable.length) {
    const char = rulesTable[cursor];
    const next = rulesTable[cursor + 1];

    if (inLineComment) {
      if (char === '\n') inLineComment = false;
      cursor += 1;
      continue;
    }

    if (quote) {
      if (escaping) {
        escaping = false;
      } else if (char === '\\') {
        escaping = true;
      } else if (char === quote) {
        quote = undefined;
      }
      cursor += 1;
      continue;
    }

    if (char === '-' && next === '-') {
      inLineComment = true;
      cursor += 2;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      cursor += 1;
      continue;
    }

    if (char === '{') {
      if (depth === 1) {
        ruleStart = cursor;
      }
      depth += 1;
      cursor += 1;
      continue;
    }

    if (char === '}') {
      depth -= 1;
      if (depth === 1 && ruleStart !== undefined) {
        const ruleEnd = cursor + 1;
        const label = findLastCommentLabel(rulesTable.slice(previousEnd, ruleStart)) ?? `规则 ${String(ranges.length + 1)}`;
        ranges.push({
          source: rulesTable.slice(ruleStart, ruleEnd),
          sourceStart: rulesTableOffset + ruleStart,
          sourceEnd: rulesTableOffset + ruleEnd,
          label,
        });
        previousEnd = ruleEnd;
        ruleStart = undefined;
      }
      cursor += 1;
      continue;
    }

    cursor += 1;
  }

  return ranges;
}

function buildRule(range: RuleRange, index: number): LootFilterRule {
  const code = parseTopLevelStringList(range.source, 'code');
  const codes = parseTopLevelStringList(range.source, 'codes');
  const allCodes = code.length > 0 ? code : codes;

  return {
    id: `rule-${String(index)}-${String(range.sourceStart)}`,
    index,
    label: range.label,
    source: range.source,
    sourceStart: range.sourceStart,
    sourceEnd: range.sourceEnd,
    codes: allCodes,
    locations: parseTopLevelStringList(range.source, 'location'),
    filterLevels: parseFilterLevels(range.source),
    quality: parseScalarText(range.source, 'quality'),
    rarity: parseScalarText(range.source, 'rarity'),
    notify: parseLocalizedText(range.source, 'notify'),
    prefix: parseLocalizedText(range.source, 'prefix'),
    suffix: parseLocalizedText(range.source, 'suffix'),
    prefixDesc: parseLocalizedText(range.source, 'prefix_desc'),
    suffixDesc: parseLocalizedText(range.source, 'suffix_desc'),
    background: parseRgba(range.source, 'background'),
    border: parseBorder(range.source, 'border'),
    audio: parseScalarText(range.source, 'audio'),
    hidden: parseBoolean(range.source, 'hide'),
    style: parseScalarText(range.source, 'style'),
    backgroundStyle: parseScalarText(range.source, 'background_style'),
    nameStyle: parseScalarText(range.source, 'name_style'),
  };
}

export function parseLootFilterConfig(source: string): ParsedLootFilterConfig {
  const metadata = parseHeaderMetadata(source);
  const rulesAssignment = findAnyAssignment(source, 'rules');
  if (!rulesAssignment) {
    return {
      metadata,
      rules: [],
      diagnostics: ['没有找到 rules 配置块。'],
    };
  }

  const rules = splitRuleTables(source, rulesAssignment).map((range, index) => buildRule(range, index));

  return {
    metadata,
    rules,
    diagnostics: rules.length === 0 ? ['rules 配置块为空，或无法识别规则表。'] : [],
  };
}

function formatNumberList(values: readonly number[]): string {
  return `{${values.map((value) => String(Math.round(value))).join(', ')}}`;
}

function addTopLevelField(ruleSource: string, fieldName: string, valueExpression: string): string {
  const closingIndex = ruleSource.lastIndexOf('}');
  if (closingIndex < 0) return ruleSource;

  const existingField = findTopLevelAssignment(ruleSource, 'code') ?? findTopLevelAssignment(ruleSource, 'codes');
  const indent = existingField?.indent ?? '            ';
  const beforeClose = ruleSource.slice(0, closingIndex);
  const afterClose = ruleSource.slice(closingIndex);
  const trimmedBeforeClose = beforeClose.trimEnd();
  const prefix = trimmedBeforeClose.endsWith('{') || trimmedBeforeClose.endsWith(',') ? '' : ',';

  return `${trimmedBeforeClose}${prefix}\n${indent}${fieldName} = ${valueExpression},\n${afterClose}`;
}

function setTopLevelField(ruleSource: string, fieldName: string, valueExpression: string): string {
  const assignment = findTopLevelAssignment(ruleSource, fieldName);
  if (!assignment) return addTopLevelField(ruleSource, fieldName, valueExpression);

  return `${ruleSource.slice(0, assignment.valueStart)}${valueExpression}${ruleSource.slice(assignment.valueEnd)}`;
}

function formatLocalizedValue(value: string, indent: string): string {
  return `{\n${indent}    zhCN = ${encodeLuaString(value)},\n${indent}}`;
}

function insertNestedLocalizedValue(expression: string, locale: string, value: string): string {
  const closingIndex = expression.lastIndexOf('}');
  if (closingIndex < 0) return expression;

  const nestedAssignment = findTopLevelAssignment(expression, 'enUS') ?? findTopLevelAssignment(expression, 'zhCN');
  const indent = nestedAssignment?.indent ?? '                ';
  const beforeClose = expression.slice(0, closingIndex).trimEnd();
  const afterClose = expression.slice(closingIndex);
  const prefix = beforeClose.endsWith('{') || beforeClose.endsWith(',') ? '' : ',';

  return `${beforeClose}${prefix}\n${indent}${locale} = ${encodeLuaString(value)},\n${afterClose}`;
}

function setLocalizedField(ruleSource: string, fieldName: string, value: string): string {
  const assignment = findTopLevelAssignment(ruleSource, fieldName);
  if (!assignment) {
    const insertIndent =
      findTopLevelAssignment(ruleSource, 'code')?.indent ?? findTopLevelAssignment(ruleSource, 'codes')?.indent ?? '            ';
    return addTopLevelField(ruleSource, fieldName, formatLocalizedValue(value, insertIndent));
  }

  const expression = ruleSource.slice(assignment.valueStart, assignment.valueEnd);
  if (!expression.trimStart().startsWith('{')) {
    return `${ruleSource.slice(0, assignment.valueStart)}${encodeLuaString(value)}${ruleSource.slice(assignment.valueEnd)}`;
  }

  const nestedAssignment = findTopLevelAssignment(expression, 'zhCN');
  if (!nestedAssignment) {
    const updatedExpression = insertNestedLocalizedValue(expression, 'zhCN', value);
    return `${ruleSource.slice(0, assignment.valueStart)}${updatedExpression}${ruleSource.slice(assignment.valueEnd)}`;
  }

  const updatedExpression = `${expression.slice(0, nestedAssignment.valueStart)}${encodeLuaString(value)}${expression.slice(
    nestedAssignment.valueEnd
  )}`;
  return `${ruleSource.slice(0, assignment.valueStart)}${updatedExpression}${ruleSource.slice(assignment.valueEnd)}`;
}

function applyRuleEdit(ruleSource: string, edit: LootFilterRuleEdit): string {
  let updated = ruleSource;

  if (edit.notifyZhCN !== undefined) updated = setLocalizedField(updated, 'notify', edit.notifyZhCN);
  if (edit.prefixZhCN !== undefined) updated = setLocalizedField(updated, 'prefix', edit.prefixZhCN);
  if (edit.suffixZhCN !== undefined) updated = setLocalizedField(updated, 'suffix', edit.suffixZhCN);
  if (edit.prefixDescZhCN !== undefined) updated = setLocalizedField(updated, 'prefix_desc', edit.prefixDescZhCN);
  if (edit.suffixDescZhCN !== undefined) updated = setLocalizedField(updated, 'suffix_desc', edit.suffixDescZhCN);
  if (edit.background !== undefined) updated = setTopLevelField(updated, 'background', formatNumberList(edit.background));
  if (edit.border !== undefined) updated = setTopLevelField(updated, 'border', formatNumberList(edit.border));
  if (edit.audio !== undefined) updated = setTopLevelField(updated, 'audio', encodeLuaString(edit.audio));
  if (edit.hidden !== undefined) updated = setTopLevelField(updated, 'hide', edit.hidden ? 'true' : 'false');
  if (edit.filterLevels !== undefined) {
    updated = setTopLevelField(updated, 'filter_levels', encodeLuaString(edit.filterLevels.join(',')));
  }

  return updated;
}

export function exportLootFilterConfig(source: string, edits: readonly LootFilterRuleEdit[]): string {
  if (edits.length === 0) return source;

  const parsed = parseLootFilterConfig(source);
  const editByRuleId = new Map(edits.map((edit) => [edit.ruleId, edit]));
  const changedRules = parsed.rules
    .map((rule) => ({
      rule,
      edit: editByRuleId.get(rule.id),
    }))
    .filter((entry): entry is { readonly rule: LootFilterRule; readonly edit: LootFilterRuleEdit } => entry.edit !== undefined)
    .sort((left, right) => right.rule.sourceStart - left.rule.sourceStart);

  let exported = source;
  for (const entry of changedRules) {
    const updatedRuleSource = applyRuleEdit(entry.rule.source, entry.edit);
    exported = `${exported.slice(0, entry.rule.sourceStart)}${updatedRuleSource}${exported.slice(entry.rule.sourceEnd)}`;
  }

  return exported;
}
