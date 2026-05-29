import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const CHINESE_FORK_BASE_PATH = '/d2r-esr-runeword-browser-zh/';
const CHINESE_FORK_PUBLIC_URL = 'https://arechen.github.io/d2r-esr-runeword-browser-zh/';
const UPSTREAM_PUBLIC_URL = 'https://istvan-panczel.github.io/d2r-esr-runeword-browser/';

function readProjectFile(path: string): string {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

describe('GitHub Pages routing metadata', () => {
  it('redirects SPA fallback requests to the Chinese fork base path', () => {
    const fallbackHtml = readProjectFile('public/404.html');

    expect(fallbackHtml).toContain(`URL='${CHINESE_FORK_BASE_PATH}'`);
    expect(fallbackHtml).not.toContain(`URL='/d2r-esr-runeword-browser/'`);
  });

  it('uses the Chinese fork URL in public metadata files', () => {
    const metadataFiles = ['index.html', 'public/robots.txt', 'public/sitemap.xml'];

    for (const file of metadataFiles) {
      const content = readProjectFile(file);

      expect(content, file).toContain(CHINESE_FORK_PUBLIC_URL);
      expect(content, file).not.toContain(UPSTREAM_PUBLIC_URL);
    }
  });
});
