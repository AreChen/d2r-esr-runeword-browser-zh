export type LootFilterRgba = readonly [number, number, number, number];
export type LootFilterBorder = readonly [number, number, number, number, number];

export interface LootFilterLocalizedText {
  readonly zhCN?: string;
  readonly enUS?: string;
  readonly fallback?: string;
}

export interface LootFilterMetadata {
  readonly title?: string;
  readonly type?: string;
  readonly description?: string;
  readonly link?: string;
  readonly language?: string;
  readonly audioPlayback?: boolean;
  readonly audioVoice?: number;
  readonly filterLevel?: number;
  readonly filterTitles: readonly string[];
}

export interface LootFilterRule {
  readonly id: string;
  readonly index: number;
  readonly label: string;
  readonly source: string;
  readonly sourceStart: number;
  readonly sourceEnd: number;
  readonly codes: readonly string[];
  readonly locations: readonly string[];
  readonly filterLevels: readonly number[];
  readonly quality?: string;
  readonly rarity?: string;
  readonly notify?: LootFilterLocalizedText;
  readonly prefix?: LootFilterLocalizedText;
  readonly suffix?: LootFilterLocalizedText;
  readonly prefixDesc?: LootFilterLocalizedText;
  readonly suffixDesc?: LootFilterLocalizedText;
  readonly background?: LootFilterRgba;
  readonly border?: LootFilterBorder;
  readonly audio?: string;
  readonly hidden?: boolean;
  readonly style?: string;
  readonly backgroundStyle?: string;
  readonly nameStyle?: string;
}

export interface ParsedLootFilterConfig {
  readonly metadata: LootFilterMetadata;
  readonly rules: readonly LootFilterRule[];
  readonly diagnostics: readonly string[];
}

export interface LootFilterRuleEdit {
  readonly ruleId: string;
  readonly notifyZhCN?: string;
  readonly prefixZhCN?: string;
  readonly suffixZhCN?: string;
  readonly prefixDescZhCN?: string;
  readonly suffixDescZhCN?: string;
  readonly background?: LootFilterRgba;
  readonly border?: LootFilterBorder;
  readonly audio?: string;
  readonly hidden?: boolean;
  readonly filterLevels?: readonly number[];
}

export interface LootFilterPreviewSegment {
  readonly text: string;
  readonly color: string;
  readonly className: string;
}

export interface LootFilterStylePreset {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly notifyZhCN: string;
  readonly background: LootFilterRgba;
  readonly border: LootFilterBorder;
  readonly audio: string;
}
