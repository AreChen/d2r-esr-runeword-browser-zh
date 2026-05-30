import type { LootFilterRule, LootFilterRuleEdit, LootFilterStylePreset } from '../types';

export const LOOT_FILTER_STYLE_PRESETS = {
  subtle: {
    id: 'subtle',
    label: '低调拾取',
    description: '深色背景和细边框，适合常见但仍需保留的物品。',
    notifyZhCN: '{gray}{name}',
    background: [0, 0, 0, 180],
    border: [120, 120, 120, 220, 1],
    audio: '',
  },
  unique: {
    id: 'unique',
    label: '暗金高亮',
    description: '金色通知、深色底和琥珀边框，适合暗金或高价值装备。',
    notifyZhCN: '{gray}暗金：{gold}{name}',
    background: [20, 14, 0, 220],
    border: [255, 165, 0, 255, 2],
    audio: 'unique.mp3',
  },
  material: {
    id: 'material',
    label: '材料提示',
    description: '红色前缀和明亮边框，适合锻造材料、器官、世界石碎片。',
    notifyZhCN: '{red}锻造材料：{gold}{name}',
    background: [40, 10, 10, 220],
    border: [255, 70, 70, 255, 2],
    audio: 'tink.mp3',
  },
  map: {
    id: 'map',
    label: '地图掉落',
    description: '冷色背景和清晰音效，适合终局地图与钥匙。',
    notifyZhCN: '{turquoise}地图：{gold}{name}',
    background: [0, 18, 32, 230],
    border: [60, 220, 255, 255, 2],
    audio: 'map.mp3',
  },
  mythical: {
    id: 'mythical',
    label: '神话强提示',
    description: '高亮背景、紫色边框和神话音效，适合神话暗金或顶级掉落。',
    notifyZhCN: '{purple}神话掉落：{gold}{name}',
    background: [255, 255, 255, 245],
    border: [160, 80, 255, 255, 3],
    audio: 'mythical.mp3',
  },
} satisfies Record<string, LootFilterStylePreset>;

export function applyLootFilterPreset(rule: LootFilterRule, preset: LootFilterStylePreset): LootFilterRuleEdit {
  return {
    ruleId: rule.id,
    notifyZhCN: preset.notifyZhCN,
    background: preset.background,
    border: preset.border,
    audio: preset.audio,
  };
}
