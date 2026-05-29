export interface TranslationData {
  readonly exactTranslations: Readonly<Record<string, string>>;
  readonly templateTranslations: readonly (readonly [string, string])[];
  readonly translateCapturedText?: (text: string) => string;
}

export interface TextTranslator {
  readonly translateText: (text: string) => string;
  readonly hasTranslation: (text: string) => boolean;
}

interface CompiledTemplate {
  readonly regex: RegExp;
  readonly target: string;
  readonly placeholders: readonly string[];
}

const PLACEHOLDER_REGEX = /%%|%\+?[dius]/g;
const SOURCE_PLACEHOLDER_REGEX = /^%\+?[dius]/;

export function stripDiabloColorCodes(text: string): string {
  return text.replace(/ÿc./g, '');
}

export function normalizeTranslationKey(text: string): string {
  return stripDiabloColorCodes(text)
    .replace(/\u00a0/g, ' ')
    .replace(/\bCTC\s+Lvl\b/gi, 'Chance to Cast Level')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[、，,]+$/u, '');
}

export function createTextTranslator(data: TranslationData): TextTranslator {
  const exactTranslations = normalizeExactTranslations(data.exactTranslations);
  const templates = data.templateTranslations.map(([source, target]) => compileTemplate(source, target));

  const translateText = (text: string): string => {
    const { key: normalizedText, suffix } = splitFootnoteSuffix(normalizeTranslationKey(text));
    const exact = exactTranslations[normalizedText];
    if (exact) return `${exact}${suffix}`;

    for (const template of templates) {
      const match = template.regex.exec(normalizedText);
      if (!match) continue;
      const captures = match.slice(1);
      return `${formatTargetTemplate(template.target, captures, template.placeholders, data.translateCapturedText)}${suffix}`;
    }

    return `${normalizedText}${suffix}`;
  };

  return {
    translateText,
    hasTranslation: (text: string) => translateText(text) !== normalizeTranslationKey(text),
  };
}

function splitFootnoteSuffix(text: string): { key: string; suffix: string } {
  const match = /^(.*?)(\s*\*+)$/u.exec(text);
  if (!match) return { key: text, suffix: '' };

  return {
    key: match[1].trimEnd(),
    suffix: match[2].replace(/\s+/g, ''),
  };
}

function normalizeExactTranslations(exactTranslations: Readonly<Record<string, string>>): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const [source, target] of Object.entries(exactTranslations)) {
    const sourceKey = normalizeTranslationKey(source);
    const targetText = normalizeTranslationKey(target);
    if (sourceKey && targetText && sourceKey !== targetText) {
      normalized[sourceKey] = targetText;
    }
  }
  return normalized;
}

function compileTemplate(source: string, target: string): CompiledTemplate {
  const { regexSource, placeholders } = templateToRegexSource(normalizeTranslationKey(source));
  return {
    regex: new RegExp(`^${regexSource}$`, 'i'),
    target: normalizeTranslationKey(target),
    placeholders,
  };
}

function templateToRegexSource(template: string): { regexSource: string; placeholders: readonly string[] } {
  let regex = '';
  let index = 0;
  const placeholders: string[] = [];

  while (index < template.length) {
    const rest = template.slice(index);
    if (rest.startsWith('%%')) {
      regex += '%';
      index += 2;
      continue;
    }

    const placeholderMatch = SOURCE_PLACEHOLDER_REGEX.exec(rest);
    if (placeholderMatch) {
      const placeholder = placeholderMatch[0];
      regex += placeholderToRegex(placeholder);
      placeholders.push(placeholder);
      index += placeholder.length;
      continue;
    }

    const char = template[index];
    if (/\s/.test(char)) {
      regex += '\\s+';
      while (index < template.length && /\s/.test(template[index])) {
        index++;
      }
      continue;
    }

    regex += escapeRegExp(char);
    index++;
  }

  return { regexSource: regex, placeholders };
}

function placeholderToRegex(placeholder: string): string {
  if (placeholder === '%s') return '(.+?)';
  const unsignedNumber = '\\d+(?:\\.\\d+)?';
  const signedNumber = '[+-]?\\d+(?:\\.\\d+)?';
  const unsignedNumberOrRange = `(?:${unsignedNumber}|${unsignedNumber}\\s+to\\s+${unsignedNumber}|\\(${unsignedNumber}\\s+to\\s+${unsignedNumber}\\))`;
  const signedNumberOrRange = `(?:${signedNumber}|${signedNumber}\\s+to\\s+${signedNumber}|[+-]?\\(${signedNumber}\\s+to\\s+${signedNumber}\\))`;
  if (placeholder === '%+d' || placeholder === '%+i' || placeholder === '%+u') return `(${signedNumberOrRange})`;
  return `(${signedNumberOrRange}|${unsignedNumberOrRange})`;
}

function formatTargetTemplate(
  template: string,
  captures: readonly string[],
  placeholders: readonly string[],
  translateCapturedText?: (text: string) => string
): string {
  let captureIndex = 0;
  return template.replace(PLACEHOLDER_REGEX, (token) => {
    if (token === '%%') return '%';
    if (captureIndex >= captures.length) return token;
    const capture = captures[captureIndex];
    const sourcePlaceholder = placeholders[captureIndex];
    captureIndex++;
    if (sourcePlaceholder === '%s' && translateCapturedText) {
      return translateCapturedText(capture);
    }
    return capture;
  });
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
