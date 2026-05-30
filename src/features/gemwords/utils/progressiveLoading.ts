export const INITIAL_GEMWORD_RENDER_COUNT = 48;
export const GEMWORD_RENDER_BATCH_SIZE = 48;

export function getNextVisibleGemwordCount(totalCount: number, currentVisibleCount: number): number {
  return Math.min(totalCount, currentVisibleCount + GEMWORD_RENDER_BATCH_SIZE);
}
