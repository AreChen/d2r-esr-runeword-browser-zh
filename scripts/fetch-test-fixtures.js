#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(__dirname, '..', 'test-fixtures');

const ESR_BASE_URL = 'https://easternsunresurrected.com';

const FILES = [
  { url: `${ESR_BASE_URL}/gems.htm`, name: 'gems.htm' },
  { url: `${ESR_BASE_URL}/runewords.htm`, name: 'runewords.htm' },
  { url: `${ESR_BASE_URL}/changelogs.html`, name: 'changelogs.html' },
  { url: `${ESR_BASE_URL}/armors.htm`, name: 'armors.htm' },
  { url: `${ESR_BASE_URL}/weapons.htm`, name: 'weapons.htm' },
  { url: `${ESR_BASE_URL}/prefixes.htm`, name: 'prefixes.htm' },
  { url: `${ESR_BASE_URL}/suffixes.htm`, name: 'suffixes.htm' },
  { url: `${ESR_BASE_URL}/unique_weapons.htm`, name: 'unique_weapons.htm' },
  { url: `${ESR_BASE_URL}/unique_armors.htm`, name: 'unique_armors.htm' },
  { url: `${ESR_BASE_URL}/unique_others.htm`, name: 'unique_others.htm' },
  { url: `${ESR_BASE_URL}/unique_mythicals.htm`, name: 'unique_mythicals.htm' },
  { url: `${ESR_BASE_URL}/sets.htm`, name: 'sets.htm' },
  { url: `${ESR_BASE_URL}/gemwords.htm`, name: 'gemwords.htm' },
  { url: `${ESR_BASE_URL}/Eastern%20Sun%20Resurrected%20Cube%20Recipes.html`, name: 'Eastern Sun Resurrected Cube Recipes.html' },
  { url: `${ESR_BASE_URL}/Eastern%20Sun%20Resurrected%20Maps.html`, name: 'Eastern Sun Resurrected Maps.html' },
  { url: `${ESR_BASE_URL}/corruptions.htm`, name: 'corruptions.htm' },
  { url: `${ESR_BASE_URL}/anointments.htm`, name: 'anointments.htm' },
  { url: `${ESR_BASE_URL}/endgame_maps.htm`, name: 'endgame_maps.htm' },
  { url: `${ESR_BASE_URL}/vessel_of_souls.htm`, name: 'vessel_of_souls.htm' },
  { url: `${ESR_BASE_URL}/ascendancies.htm`, name: 'ascendancies.htm' },
  { url: `${ESR_BASE_URL}/kill_ledger.htm`, name: 'kill_ledger.htm' },
  { url: `${ESR_BASE_URL}/skill_information.htm`, name: 'skill_information.htm' },
  { url: `${ESR_BASE_URL}/weapon_mastery.html`, name: 'weapon_mastery.html' },
];

async function fetchFile(file) {
  console.log(`Fetching ${file.name}...`);
  const response = await fetch(file.url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${file.name}: ${response.status} ${response.statusText}`);
  }

  const content = await response.text();
  const filePath = join(FIXTURES_DIR, file.name);
  await writeFile(filePath, content, 'utf-8');
  console.log(`  ✓ Saved ${file.name} (${(content.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  console.log('Fetching ESR test fixtures...\n');

  await mkdir(FIXTURES_DIR, { recursive: true });

  const results = await Promise.allSettled(FILES.map(fetchFile));

  const failures = results.filter((r) => r.status === 'rejected');
  if (failures.length > 0) {
    console.error('\nErrors:');
    failures.forEach((f) => console.error(`  ✗ ${f.reason.message}`));
    process.exit(1);
  }

  console.log(`\nDone! Files saved to test-fixtures/`);
}

main();
