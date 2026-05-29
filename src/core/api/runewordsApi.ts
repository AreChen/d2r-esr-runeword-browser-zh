import { REMOTE_URLS } from './remoteConfig';

export async function fetchRunewordsHtml(): Promise<string> {
  const response = await fetch(REMOTE_URLS.runewords);

  if (!response.ok) {
    throw new Error(`获取 runewords.htm 失败: ${String(response.status)} ${response.statusText}`);
  }

  return response.text();
}
