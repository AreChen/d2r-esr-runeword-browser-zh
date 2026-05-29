import { REMOTE_URLS } from './remoteConfig';

export async function fetchUniqueMythicalsHtml(): Promise<string> {
  const response = await fetch(REMOTE_URLS.uniqueMythicals);

  if (!response.ok) {
    throw new Error(`获取 unique_mythicals.htm 失败: ${String(response.status)} ${response.statusText}`);
  }

  return response.text();
}
