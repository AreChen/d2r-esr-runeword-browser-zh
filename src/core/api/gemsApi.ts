import { REMOTE_URLS } from './remoteConfig';

export async function fetchGemsHtml(): Promise<string> {
  const response = await fetch(REMOTE_URLS.gems);

  if (!response.ok) {
    throw new Error(`获取 gems.htm 失败: ${String(response.status)} ${response.statusText}`);
  }

  return response.text();
}
