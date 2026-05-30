export type RecipeFavoriteKind = 'runeword' | 'gemword';

export interface RecipeFavoriteEntry {
  readonly name: string;
  readonly variant: number;
  readonly allowedItems: readonly string[];
}

export function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

export function buildRecipeFavoriteId(kind: RecipeFavoriteKind, recipe: RecipeFavoriteEntry): string {
  return [kind, recipe.name, String(recipe.variant), recipe.allowedItems.join('|')].join(':');
}

export function toggleRecipeFavoriteId(favoriteId: string, favoriteIds: readonly string[]): readonly string[] {
  if (favoriteIds.includes(favoriteId)) {
    return favoriteIds.filter((entry) => entry !== favoriteId);
  }

  return [...favoriteIds, favoriteId];
}

export function filterFavoriteRecipes<T extends RecipeFavoriteEntry>(
  recipes: readonly T[],
  kind: RecipeFavoriteKind,
  favoriteIds: readonly string[]
): readonly T[] {
  const favoriteIdSet = new Set(favoriteIds);
  return recipes.filter((recipe) => favoriteIdSet.has(buildRecipeFavoriteId(kind, recipe)));
}
