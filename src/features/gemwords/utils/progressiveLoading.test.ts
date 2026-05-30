import { describe, expect, it } from 'vitest';
import { GEMWORD_RENDER_BATCH_SIZE, INITIAL_GEMWORD_RENDER_COUNT, getNextVisibleGemwordCount } from './progressiveLoading';

describe('gemword progressive loading', () => {
  it('starts with a bounded first render batch', () => {
    expect(INITIAL_GEMWORD_RENDER_COUNT).toBeLessThan(590);
    expect(INITIAL_GEMWORD_RENDER_COUNT).toBeGreaterThan(0);
  });

  it('loads additional batches without exceeding the filtered total', () => {
    expect(getNextVisibleGemwordCount(590, INITIAL_GEMWORD_RENDER_COUNT)).toBe(INITIAL_GEMWORD_RENDER_COUNT + GEMWORD_RENDER_BATCH_SIZE);
    expect(getNextVisibleGemwordCount(75, 48)).toBe(75);
  });
});
