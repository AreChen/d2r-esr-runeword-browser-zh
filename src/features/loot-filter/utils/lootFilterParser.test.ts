import { describe, expect, test } from 'vitest';
import { exportLootFilterConfig, parseLootFilterConfig } from './lootFilterParser';
import { applyLootFilterPreset, LOOT_FILTER_STYLE_PRESETS } from './lootFilterPresets';
import { renderLootFilterMarkup } from './lootFilterPreview';

const SAMPLE_FILTER = `--- Filter Title: Sully's Quality of Life Filter v0.3.6
--- Filter Type: MultiStrict
--- Filter Description: PoE Themed with custom drop sounds
--- Filter Link: https://example.test/filter.lua
return {
    reload = "{white}Sully's Quality of Life Filter {purple}v0.3.6",
    language = "zhCN",
    filter_titles = { "练级", "严格 - 噩梦", "超严格" },
    audioPlayback = true,
    audioVoice = 1,
    filter_level = 2,
    rules = {
        -- Ancient Decipherer Notification
        {
            code = "ddd",
            notify = {
                enUS = "{red}Crafting Reagent: {gold}Ancient Decipherer",
                zhCN = "{red}锻造材料：{gold}古代解读者",
            },
            filter_levels = "1,2,3",
            background = {0, 0, 0, 255},
            audio = "tink.mp3"
        },
        {
            codes = {"wss", "sdo"},
            location = {"onground", "atvendor"},
            notify = "{gold}{name}",
            suffix = " ({ilvl})",
            hide = false
        },
    }
}`;

describe('parseLootFilterConfig', () => {
  test('parses metadata and user-facing Chinese values from a Lua filter config', () => {
    const parsed = parseLootFilterConfig(SAMPLE_FILTER);

    expect(parsed.metadata.title).toBe("Sully's Quality of Life Filter v0.3.6");
    expect(parsed.metadata.type).toBe('MultiStrict');
    expect(parsed.metadata.language).toBe('zhCN');
    expect(parsed.metadata.audioPlayback).toBe(true);
    expect(parsed.metadata.audioVoice).toBe(1);
    expect(parsed.metadata.filterLevel).toBe(2);
    expect(parsed.metadata.filterTitles).toEqual(['练级', '严格 - 噩梦', '超严格']);

    expect(parsed.rules).toHaveLength(2);
    expect(parsed.rules[0]).toMatchObject({
      index: 0,
      label: 'Ancient Decipherer Notification',
      codes: ['ddd'],
      filterLevels: [1, 2, 3],
      audio: 'tink.mp3',
      background: [0, 0, 0, 255],
    });
    expect(parsed.rules[0].notify?.zhCN).toBe('{red}锻造材料：{gold}古代解读者');
    expect(parsed.rules[1].codes).toEqual(['wss', 'sdo']);
    expect(parsed.rules[1].locations).toEqual(['onground', 'atvendor']);
    expect(parsed.rules[1].notify?.zhCN).toBe('{gold}{name}');
    expect(parsed.rules[1].suffix?.zhCN).toBe(' ({ilvl})');
    expect(parsed.rules[1].hidden).toBe(false);
  });
});

describe('exportLootFilterConfig', () => {
  test('exports standard Lua while preserving unrelated rule content', () => {
    const parsed = parseLootFilterConfig(SAMPLE_FILTER);
    const exported = exportLootFilterConfig(SAMPLE_FILTER, [
      {
        ruleId: parsed.rules[0].id,
        notifyZhCN: '{purple}重要材料：{gold}{name}',
        background: [20, 40, 80, 210],
        border: [255, 165, 0, 255, 2],
        audio: 'gong.mp3',
        hidden: true,
        filterLevels: [2, 3],
      },
    ]);

    expect(exported).toContain('zhCN = "{purple}重要材料：{gold}{name}"');
    expect(exported).toContain('background = {20, 40, 80, 210}');
    expect(exported).toContain('border = {255, 165, 0, 255, 2}');
    expect(exported).toContain('audio = "gong.mp3"');
    expect(exported).toContain('hide = true');
    expect(exported).toContain('filter_levels = "2,3"');
    expect(exported).toContain('suffix = " ({ilvl})"');
  });
});

describe('loot filter preview helpers', () => {
  test('renders D2R color tags and placeholders as preview segments', () => {
    const segments = renderLootFilterMarkup('{red}锻造材料：{gold}{name} {gray}({ilvl})', {
      name: '世界石碎片',
      ilvl: '88',
    });

    expect(segments.map((segment) => segment.text).join('')).toBe('锻造材料：世界石碎片 (88)');
    expect(segments.map((segment) => segment.color)).toEqual(['red', 'gold', 'gray']);
  });

  test('applies a preset as editable rule fields with standard audio filename', () => {
    const parsed = parseLootFilterConfig(SAMPLE_FILTER);
    const draft = applyLootFilterPreset(parsed.rules[1], LOOT_FILTER_STYLE_PRESETS.mythical);

    expect(draft.notifyZhCN).toBe('{purple}神话掉落：{gold}{name}');
    expect(draft.background).toEqual([255, 255, 255, 245]);
    expect(draft.border).toEqual([160, 80, 255, 255, 3]);
    expect(draft.audio).toBe('mythical.mp3');
  });
});
