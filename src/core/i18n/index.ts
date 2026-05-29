import { exactTranslations, templateTranslations } from './generated/zhCN';
import { createTextTranslator, normalizeTranslationKey } from './textTranslation';

const zhCNTranslator = createTextTranslator({
  exactTranslations,
  templateTranslations,
  translateCapturedText: (text) => translateGameText(text),
});

function isRuneItemName(text: string): boolean {
  return /^[A-Za-z][A-Za-z' -]* Rune$/u.test(normalizeTranslationKey(text));
}

export function translateGameText(text: string): string {
  if (isRuneItemName(text)) return normalizeTranslationKey(text);
  return zhCNTranslator.translateText(text);
}

export function hasGameTextTranslation(text: string): boolean {
  return zhCNTranslator.hasTranslation(text);
}

export function buildLocalizedSearchText(parts: readonly string[]): string {
  const searchParts: string[] = [];

  for (const part of parts) {
    const normalized = normalizeTranslationKey(part);
    if (!normalized) continue;

    searchParts.push(normalized);

    const translated = translateGameText(normalized);
    if (translated !== normalized) {
      searchParts.push(translated);
    }
  }

  return searchParts.join(' ').toLowerCase();
}
