import { describe, expect, it } from 'vitest';
import { buildRecipeFavoriteId, filterFavoriteRecipes, toggleRecipeFavoriteId } from './recipeFavorites';

interface RecipeLike {
  readonly name: string;
  readonly variant: number;
  readonly allowedItems: readonly string[];
}

const bowRecipe: RecipeLike = {
  name: 'Test Bow Word',
  variant: 1,
  allowedItems: ['Amazon Bow'],
};

const armorRecipe: RecipeLike = {
  name: 'Test Armor Word',
  variant: 1,
  allowedItems: ['Body Armor', 'Any Shield'],
};

describe('recipe favorite helpers', () => {
  it('builds stable ids for concrete recipe entries, including expanded item-type variants', () => {
    expect(buildRecipeFavoriteId('runeword', bowRecipe)).toBe('runeword:Test Bow Word:1:Amazon Bow');
    expect(buildRecipeFavoriteId('runeword', armorRecipe)).toBe('runeword:Test Armor Word:1:Body Armor|Any Shield');
  });

  it('toggles favorite ids without duplicating entries', () => {
    const favoriteId = buildRecipeFavoriteId('gemword', bowRecipe);

    expect(toggleRecipeFavoriteId(favoriteId, [])).toEqual([favoriteId]);
    expect(toggleRecipeFavoriteId(favoriteId, [favoriteId])).toEqual([]);
  });

  it('filters recipe results to favorited concrete entries only', () => {
    const favoriteId = buildRecipeFavoriteId('runeword', armorRecipe);

    expect(filterFavoriteRecipes([bowRecipe, armorRecipe], 'runeword', [favoriteId])).toEqual([armorRecipe]);
  });
});
