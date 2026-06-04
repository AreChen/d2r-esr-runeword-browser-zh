import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { restoreGitHubPagesRedirect } from './githubPagesRedirect';

const CHINESE_FORK_BASE_PATH = '/d2r-esr-runeword-browser-zh/';
const CHINESE_FORK_PUBLIC_URL = 'https://arechen.github.io/d2r-esr-runeword-browser-zh/';
const UPSTREAM_PUBLIC_URL = 'https://istvan-panczel.github.io/d2r-esr-runeword-browser/';

function readProjectFile(path: string): string {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

function createRedirectWindow(redirectUrl: string | null): Pick<Window, 'history' | 'location' | 'sessionStorage'> & {
  readonly removedKeys: readonly string[];
  readonly replacedUrls: readonly string[];
} {
  const removedKeys: string[] = [];
  const replacedUrls: string[] = [];

  return {
    location: {
      href: `${CHINESE_FORK_PUBLIC_URL}`,
      origin: 'https://arechen.github.io',
      pathname: CHINESE_FORK_BASE_PATH,
      search: '',
      hash: '',
    } as Location,
    sessionStorage: {
      getItem: (key: string) => (key === 'redirect' ? redirectUrl : null),
      removeItem: (key: string) => {
        removedKeys.push(key);
      },
    } as Storage,
    history: {
      replaceState: (_data: unknown, _unused: string, url?: string | URL | null) => {
        replacedUrls.push(String(url));
      },
    } as History,
    removedKeys,
    replacedUrls,
  };
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

  it('lists the main browser routes in the sitemap', () => {
    const sitemap = readProjectFile('public/sitemap.xml');

    expect(sitemap).toContain(`${CHINESE_FORK_PUBLIC_URL}gemwords`);
    expect(sitemap).toContain(`${CHINESE_FORK_PUBLIC_URL}vessel-of-souls`);
  });

  it('restores the original SPA route after the GitHub Pages 404 redirect', () => {
    const targetUrl = `${CHINESE_FORK_PUBLIC_URL}database?tab=endgame#bosses`;
    const windowLike = createRedirectWindow(targetUrl);

    restoreGitHubPagesRedirect(windowLike, CHINESE_FORK_BASE_PATH);

    expect(windowLike.removedKeys).toEqual(['redirect']);
    expect(windowLike.replacedUrls).toEqual([`${CHINESE_FORK_BASE_PATH}database?tab=endgame#bosses`]);
  });
});
