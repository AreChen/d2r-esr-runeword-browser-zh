import { REMOTE_URLS } from './remoteConfig';

export async function fetchUniqueWeaponsHtml(): Promise<string> {
  const response = await fetch(REMOTE_URLS.uniqueWeapons);

  if (!response.ok) {
    throw new Error(`获取 unique_weapons.htm 失败: ${String(response.status)} ${response.statusText}`);
  }

  return response.text();
}

export async function fetchUniqueArmorsHtml(): Promise<string> {
  const response = await fetch(REMOTE_URLS.uniqueArmors);

  if (!response.ok) {
    throw new Error(`获取 unique_armors.htm 失败: ${String(response.status)} ${response.statusText}`);
  }

  return response.text();
}

export async function fetchUniqueOthersHtml(): Promise<string> {
  const response = await fetch(REMOTE_URLS.uniqueOthers);

  if (!response.ok) {
    throw new Error(`获取 unique_others.htm 失败: ${String(response.status)} ${response.statusText}`);
  }

  return response.text();
}
