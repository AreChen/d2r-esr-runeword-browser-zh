import { describe, expect, it } from 'vitest';
import { DATA_CACHE_VERSION } from './dataCacheVersion';

describe('data cache version', () => {
  it('tracks the DPDNS native sets guide addition', () => {
    expect(DATA_CACHE_VERSION).toContain('sets');
  });
});
