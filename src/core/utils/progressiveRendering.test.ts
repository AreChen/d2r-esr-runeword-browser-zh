import { describe, expect, it } from 'vitest';
import { CARD_RENDER_BATCH_SIZE, INITIAL_CARD_RENDER_COUNT, getNextVisibleCardCount } from './progressiveRendering';

describe('progressive card rendering', () => {
  it('starts below the full runeword and unique-item result counts', () => {
    expect(INITIAL_CARD_RENDER_COUNT).toBeGreaterThan(0);
    expect(INITIAL_CARD_RENDER_COUNT).toBeLessThan(387);
    expect(INITIAL_CARD_RENDER_COUNT).toBeLessThan(1030);
  });

  it('loads another bounded batch without exceeding the total result count', () => {
    expect(getNextVisibleCardCount(1030, INITIAL_CARD_RENDER_COUNT)).toBe(INITIAL_CARD_RENDER_COUNT + CARD_RENDER_BATCH_SIZE);
    expect(getNextVisibleCardCount(75, 48)).toBe(75);
  });
});
