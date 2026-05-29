import { REMOTE_URLS } from './remoteConfig';

export async function fetchAscendanciesHtml(): Promise<string> {
  const response = await fetch(REMOTE_URLS.ascendancies);

  if (!response.ok) {
    throw new Error(`获取 ascendancies.htm 失败: ${String(response.status)} ${response.statusText}`);
  }

  return response.text();
}
