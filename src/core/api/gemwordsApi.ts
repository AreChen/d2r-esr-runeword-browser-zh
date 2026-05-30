import { REMOTE_URLS } from './remoteConfig';

export async function fetchGemwordsHtml(): Promise<string> {
  const response = await fetch(REMOTE_URLS.gemwords);

  if (!response.ok) {
    throw new Error(`获取 gemwords.htm 失败: ${String(response.status)} ${response.statusText}`);
  }

  return response.text();
}
