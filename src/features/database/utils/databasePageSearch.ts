import type { GuidePage } from '@/core/db';
import { buildLocalizedSearchText } from '@/core/i18n';
import { translateGuideText } from '@/core/i18n/guideTranslation';

type GuideTextTranslator = (text: string) => string;

const translatedTextIndexCache = new WeakMap<GuidePage, { readonly sourceText: string; readonly translatedText: string }>();

function shouldSearchTranslatedTextIndex(terms: readonly string[]): boolean {
  return terms.some((term) => /[\u4e00-\u9fff]/u.test(term));
}

function getCachedTranslatedTextIndex(page: GuidePage, translateText: GuideTextTranslator): string {
  const cached = translatedTextIndexCache.get(page);
  if (cached?.sourceText === page.textIndex) return cached.translatedText;

  const translatedText = translateText(page.textIndex);
  translatedTextIndexCache.set(page, { sourceText: page.textIndex, translatedText });
  return translatedText;
}

export function pageMatchesDatabaseSearch(
  page: GuidePage,
  terms: readonly string[],
  translateText: GuideTextTranslator = translateGuideText
): boolean {
  if (terms.length === 0) return true;

  const searchable = buildLocalizedSearchText([
    page.title,
    page.label,
    translateText(page.label),
    page.textIndex,
    shouldSearchTranslatedTextIndex(terms) ? getCachedTranslatedTextIndex(page, translateText) : '',
  ]);

  return terms.every((term) => searchable.includes(term));
}
