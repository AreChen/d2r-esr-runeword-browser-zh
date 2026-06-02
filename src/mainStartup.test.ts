import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

function readMainSource(): string {
  return readFileSync(resolve(process.cwd(), 'src/main.tsx'), 'utf8');
}

describe('application startup code splitting', () => {
  it('loads the heavy data sync saga dynamically before dispatching startup checks', () => {
    const source = readMainSource();

    expect(source).not.toContain("from '@/features/data-sync'");
    expect(source).toContain("import('@/features/data-sync')");
    expect(source).toContain('registerSaga(dataSyncSaga)');
    expect(source).toContain('runSagas()');
    expect(source).toContain('store.dispatch(startupCheck())');
  });
});
