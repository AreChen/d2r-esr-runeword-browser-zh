import type { LootFilterPreviewSegment } from '../types';

const COLOR_CLASS_NAMES: Partial<Record<string, string>> = {
  white: 'text-white',
  red: 'text-red-400',
  green: 'text-emerald-400',
  blue: 'text-sky-400',
  gold: 'text-amber-400',
  gray: 'text-zinc-400',
  grey: 'text-zinc-400',
  black: 'text-zinc-950 dark:text-zinc-900',
  tan: 'text-stone-300',
  orange: 'text-orange-400',
  yellow: 'text-yellow-300',
  purple: 'text-purple-400',
  turquoise: 'text-cyan-300',
  pink: 'text-pink-400',
  lilac: 'text-violet-300',
  'dark green': 'text-green-700 dark:text-green-500',
};

const COLOR_ALIASES: Record<string, string> = {
  grey: 'gray',
};

function normalizeToken(token: string): string {
  return token.trim().toLowerCase();
}

function pushSegment(segments: LootFilterPreviewSegment[], text: string, color: string) {
  if (text.length === 0) return;

  const normalizedColor = COLOR_ALIASES[color] ?? color;
  const className = COLOR_CLASS_NAMES[color] ?? COLOR_CLASS_NAMES[normalizedColor] ?? 'text-white';
  const previous = segments.at(-1);

  if (previous && previous.color === normalizedColor) {
    segments[segments.length - 1] = {
      ...previous,
      text: previous.text + text,
    };
    return;
  }

  segments.push({
    text,
    color: normalizedColor,
    className,
  });
}

export function renderLootFilterMarkup(text: string, placeholders: Record<string, string> = {}): readonly LootFilterPreviewSegment[] {
  const segments: LootFilterPreviewSegment[] = [];
  let currentColor = 'white';
  let cursor = 0;
  const tokenPattern = /\{([^{}]+)\}/g;

  for (const match of text.matchAll(tokenPattern)) {
    const matchIndex = typeof match.index === 'number' ? match.index : 0;
    pushSegment(segments, text.slice(cursor, matchIndex), currentColor);

    const rawToken = match[1];
    const token = normalizeToken(rawToken);
    if (token in COLOR_CLASS_NAMES) {
      currentColor = token;
    } else if (rawToken in placeholders) {
      pushSegment(segments, placeholders[rawToken], currentColor);
    } else {
      pushSegment(segments, match[0], currentColor);
    }

    cursor = matchIndex + match[0].length;
  }

  pushSegment(segments, text.slice(cursor), currentColor);

  return segments;
}
