export const INITIAL_CARD_RENDER_COUNT = 48;
export const CARD_RENDER_BATCH_SIZE = 48;

export function getNextVisibleCardCount(totalCount: number, currentVisibleCount: number): number {
  return Math.min(totalCount, currentVisibleCount + CARD_RENDER_BATCH_SIZE);
}
