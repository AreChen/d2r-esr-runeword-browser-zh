import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('database screen copy', () => {
  it('uses Chinese wording for visible guide database section names', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/features/database/screens/DatabaseScreen.tsx'), 'utf8');

    expect(source).toContain('官方基础资料、DPDNS 补全机制与攻略资料的中文整理版。');
    expect(source).toContain('站外资料');
    expect(source).not.toContain('官方 Base Information 与 Features 子页面的中文整理版。');
  });
});
