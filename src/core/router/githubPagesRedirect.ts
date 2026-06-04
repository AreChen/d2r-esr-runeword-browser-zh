type RedirectWindow = Pick<Window, 'history' | 'location' | 'sessionStorage'>;

function normalizeBasePath(basePath: string): string {
  const withLeadingSlash = basePath.startsWith('/') ? basePath : `/${basePath}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

function readRedirect(storage: Storage): string | null {
  return storage.getItem('redirect') ?? ((storage as Storage & { readonly redirect?: string }).redirect || null);
}

export function restoreGitHubPagesRedirect(windowLike: RedirectWindow, basePath: string): void {
  const redirect = readRedirect(windowLike.sessionStorage);
  if (!redirect) return;

  windowLike.sessionStorage.removeItem('redirect');

  let redirectUrl: URL;
  try {
    redirectUrl = new URL(redirect, windowLike.location.origin);
  } catch {
    return;
  }

  const normalizedBasePath = normalizeBasePath(basePath);
  if (redirectUrl.origin !== windowLike.location.origin) return;
  if (!redirectUrl.pathname.startsWith(normalizedBasePath)) return;

  const nextUrl = `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`;
  const currentUrl = `${windowLike.location.pathname}${windowLike.location.search}${windowLike.location.hash}`;
  if (nextUrl === currentUrl) return;

  windowLike.history.replaceState(null, '', nextUrl);
}
