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

  it('keeps release-generated GitHub links on the Chinese fork repository', () => {
    const packageJson = readFileSync(resolve(process.cwd(), 'package.json'), 'utf8');

    expect(packageJson).toContain(`"commitUrlFormat": "${CHINESE_FORK_REPOSITORY_URL}/commit/{{hash}}"`);
    expect(packageJson).toContain(`"compareUrlFormat": "${CHINESE_FORK_REPOSITORY_URL}/compare/{{previousTag}}...{{currentTag}}"`);
    expect(packageJson).toContain(`"issueUrlFormat": "${CHINESE_FORK_REPOSITORY_URL}/issues/{{id}}"`);
    expect(packageJson).not.toContain(UPSTREAM_REPOSITORY_URL);
  });
});
