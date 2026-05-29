import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const CHINESE_FORK_REPOSITORY_URL = 'https://github.com/AreChen/d2r-esr-runeword-browser-zh';
const UPSTREAM_REPOSITORY_URL = 'https://github.com/istvan-panczel/d2r-esr-runeword-browser';

describe('Header links', () => {
  it('points the GitHub source button to the Chinese fork repository', () => {
    const headerSource = readFileSync(resolve(process.cwd(), 'src/core/components/Header.tsx'), 'utf8');

    expect(headerSource).toContain(`const GITHUB_URL = '${CHINESE_FORK_REPOSITORY_URL}'`);
    expect(headerSource).not.toContain(`const GITHUB_URL = '${UPSTREAM_REPOSITORY_URL}'`);
  });
});
