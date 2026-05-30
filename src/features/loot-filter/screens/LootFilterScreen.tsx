import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import {
  Bell,
  Download,
  Eye,
  EyeOff,
  FileCode,
  Palette,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Upload,
  Volume2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { usePersistentState } from '@/core/hooks/usePersistentState';
import { cn } from '@/lib/utils';
import { exportLootFilterConfig, parseLootFilterConfig } from '../utils/lootFilterParser';
import { applyLootFilterPreset, LOOT_FILTER_STYLE_PRESETS } from '../utils/lootFilterPresets';
import { renderLootFilterMarkup } from '../utils/lootFilterPreview';
import type { LootFilterBorder, LootFilterRgba, LootFilterRule, LootFilterRuleEdit } from '../types';

const FILTER_SOURCE_STORAGE_KEY = 'd2r-esr.lootFilter.source.v1';
const FILTER_EDITS_STORAGE_KEY = 'd2r-esr.lootFilter.edits.v1';

const DEFAULT_FILTER_TEMPLATE = `--- Filter Title: D2R ESR 中文过滤器模板
--- Filter Type: MultiStrict
--- Filter Description: 可在网页中上传现有过滤器后继续调整
return {
    language = "zhCN",
    filter_titles = { "练级", "严格", "非常严格", "超严格" },
    audioPlayback = true,
    audioVoice = 0,
    filter_level = 1,
    rules = {
        -- 世界石碎片通知
        {
            code = "wss",
            notify = {
                zhCN = "{red}锻造材料：{gold}{name}",
            },
            filter_levels = "1,2,3,4",
            background = {40, 10, 10, 220},
            border = {255, 70, 70, 255, 2},
            audio = "tink.mp3",
        },
    }
}`;

const QUALITY_LABELS: Record<string, string> = {
  '1': '劣质',
  '2': '普通',
  '3': '超强',
  '4': '魔法',
  '5': '套装',
  '6': '稀有',
  '7': '暗金',
  '8': '手工',
  '9': '淬火',
};

const RARITY_LABELS: Record<string, string> = {
  '0': '普通级',
  '1': '扩展级',
  '2': '精英级',
};

const LOCATION_LABELS: Record<string, string> = {
  onground: '地面',
  onplayer: '背包/角色',
  equipped: '已装备',
  atvendor: '商店',
  dropping: '掉落中',
};

const LABEL_TRANSLATIONS: readonly [RegExp, string][] = [
  [/Ancient Decipherer/gi, '古代解读者'],
  [/Socket Donut/gi, '打孔材料'],
  [/Worldstone Shard/gi, '世界石碎片'],
  [/Normal/gi, '普通'],
  [/Exceptional/gi, '扩展'],
  [/Elite/gi, '精英'],
  [/Unique/gi, '暗金'],
  [/Set Items?/gi, '套装'],
  [/Coupons?/gi, '兑换券'],
  [/Notification/gi, '通知'],
  [/Crafting Reag?ent/gi, '锻造材料'],
  [/Monster Parts?/gi, '怪物材料'],
  [/Perfect Gems?/gi, '完美宝石'],
  [/Superior Item Highlighting/gi, '超强物品高亮'],
  [/Boots?/gi, '鞋子'],
  [/Belts?/gi, '腰带'],
  [/Gloves?/gi, '手套'],
  [/Maps?/gi, '地图'],
  [/Mythical/gi, '神话'],
  [/Rare/gi, '稀有'],
  [/Jewels?/gi, '珠宝'],
  [/Charms?/gi, '护身符'],
  [/Runes?/gi, '符文'],
  [/Tooltip/gi, '提示说明'],
  [/Display/gi, '显示'],
  [/Hide/gi, '隐藏'],
  [/Audio/gi, '音效'],
  [/Style/gi, '样式'],
];

const RGBA_CHANNELS = [
  { key: 'red', label: '红' },
  { key: 'green', label: '绿' },
  { key: 'blue', label: '蓝' },
  { key: 'alpha', label: '透明度' },
] as const;

const BORDER_CHANNELS = [
  { key: 'red', label: '红' },
  { key: 'green', label: '绿' },
  { key: 'blue', label: '蓝' },
  { key: 'alpha', label: '透明度' },
  { key: 'width', label: '宽度' },
] as const;

interface UploadedAudioFile {
  readonly name: string;
  readonly url: string;
}

type RuleViewFilter = 'all' | 'edited' | 'notify' | 'audio' | 'styled' | 'hidden';

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isEditRecord(value: unknown): value is Partial<Record<string, LootFilterRuleEdit>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function translateRuleLabel(label: string): string {
  return LABEL_TRANSLATIONS.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), label);
}

function stripMarkup(text: string): string {
  return renderLootFilterMarkup(text, { name: '{name}', ilvl: '{ilvl}', sockets: '{sockets}' })
    .map((segment) => segment.text)
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

function getLocalizedText(rule: LootFilterRule, field: 'notify' | 'prefix' | 'suffix' | 'prefixDesc' | 'suffixDesc'): string {
  if (field === 'notify') return rule.notify?.zhCN ?? rule.notify?.fallback ?? '';
  if (field === 'prefix') return rule.prefix?.zhCN ?? rule.prefix?.fallback ?? '';
  if (field === 'suffix') return rule.suffix?.zhCN ?? rule.suffix?.fallback ?? '';
  if (field === 'prefixDesc') return rule.prefixDesc?.zhCN ?? rule.prefixDesc?.fallback ?? '';
  return rule.suffixDesc?.zhCN ?? rule.suffixDesc?.fallback ?? '';
}

function getRuleTitle(rule: LootFilterRule): string {
  const notifyText = getLocalizedText(rule, 'notify');
  if (notifyText.length > 0) return stripMarkup(notifyText);

  const translatedLabel = translateRuleLabel(rule.label);
  if (translatedLabel.length > 0) return translatedLabel;

  if (rule.codes.length > 0) return `物品代码 ${rule.codes.join(', ')}`;
  return `规则 ${String(rule.index + 1)}`;
}

function getRuleSearchText(rule: LootFilterRule): string {
  return [
    getRuleTitle(rule),
    translateRuleLabel(rule.label),
    rule.codes.join(' '),
    rule.audio,
    rule.quality ? QUALITY_LABELS[rule.quality] : '',
    rule.rarity ? RARITY_LABELS[rule.rarity] : '',
    getLocalizedText(rule, 'notify'),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function describeQuality(quality?: string): string {
  if (!quality) return '任意品质';
  return QUALITY_LABELS[quality] ?? quality;
}

function describeRarity(rarity?: string): string {
  if (!rarity) return '任意底材等级';
  return RARITY_LABELS[rarity] ?? rarity;
}

function describeLocations(locations: readonly string[]): string {
  if (locations.length === 0) return '默认地面';
  return locations.map((location) => LOCATION_LABELS[location] ?? location).join('、');
}

function formatLevels(levels: readonly number[], filterTitles: readonly string[]): string {
  if (levels.length === 0) return '全部严格度';
  return levels.map((level) => `${String(level)} ${filterTitles[level - 1] ? `(${filterTitles[level - 1]})` : ''}`.trim()).join('、');
}

function toRgbaCss(values: LootFilterRgba | LootFilterBorder | undefined, fallback: string): string {
  if (!values) return fallback;
  const alpha = values[3] <= 1 ? values[3] : values[3] / 255;
  return `rgba(${String(values[0])}, ${String(values[1])}, ${String(values[2])}, ${String(alpha)})`;
}

function getPreviewPlaceholders(rule: LootFilterRule): Record<string, string> {
  const firstCode = rule.codes[0] ?? 'wss';
  return {
    name: firstCode === 'wss' ? '世界石碎片' : `物品 ${firstCode}`,
    ilvl: '88',
    sockets: '3',
    quality: describeQuality(rule.quality),
    rarity: describeRarity(rule.rarity),
  };
}

function getDraftText(
  rule: LootFilterRule,
  edit: LootFilterRuleEdit | undefined,
  field: 'notify' | 'prefix' | 'suffix' | 'prefixDesc' | 'suffixDesc'
): string {
  if (field === 'notify') return edit?.notifyZhCN ?? getLocalizedText(rule, 'notify');
  if (field === 'prefix') return edit?.prefixZhCN ?? getLocalizedText(rule, 'prefix');
  if (field === 'suffix') return edit?.suffixZhCN ?? getLocalizedText(rule, 'suffix');
  if (field === 'prefixDesc') return edit?.prefixDescZhCN ?? getLocalizedText(rule, 'prefixDesc');
  return edit?.suffixDescZhCN ?? getLocalizedText(rule, 'suffixDesc');
}

function getDraftBackground(rule: LootFilterRule, edit: LootFilterRuleEdit | undefined): LootFilterRgba {
  return edit?.background ?? rule.background ?? [0, 0, 0, 190];
}

function getDraftBorder(rule: LootFilterRule, edit: LootFilterRuleEdit | undefined): LootFilterBorder {
  return edit?.border ?? rule.border ?? [120, 120, 120, 220, 1];
}

function getDraftFilterLevels(rule: LootFilterRule, edit: LootFilterRuleEdit | undefined): readonly number[] {
  return edit?.filterLevels ?? rule.filterLevels;
}

function getAudioNames(rules: readonly LootFilterRule[], uploadedAudioFiles: readonly UploadedAudioFile[]): readonly string[] {
  const names = new Set<string>();
  for (const rule of rules) {
    if (rule.audio) names.add(rule.audio);
  }
  for (const file of uploadedAudioFiles) {
    names.add(file.name);
  }
  return [...names].sort((left, right) => left.localeCompare(right));
}

function matchesRuleFilter(
  rule: LootFilterRule,
  query: string,
  viewFilter: RuleViewFilter,
  levelFilter: string,
  edits: Partial<Record<string, LootFilterRuleEdit>>
): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length > 0 && !getRuleSearchText(rule).includes(normalizedQuery)) return false;

  if (levelFilter !== 'all') {
    const level = Number.parseInt(levelFilter, 10);
    if (Number.isFinite(level) && rule.filterLevels.length > 0 && !rule.filterLevels.includes(level)) return false;
  }

  if (viewFilter === 'edited') return rule.id in edits;
  if (viewFilter === 'notify') return Boolean(rule.notify);
  if (viewFilter === 'audio') return Boolean(rule.audio || edits[rule.id]?.audio);
  if (viewFilter === 'styled')
    return Boolean(rule.background || rule.border || rule.style || rule.backgroundStyle || edits[rule.id]?.background);
  if (viewFilter === 'hidden') return Boolean(rule.hidden || edits[rule.id]?.hidden);
  return true;
}

function NumberField({
  label,
  value,
  min = 0,
  max = 255,
  onChange,
}: {
  readonly label: string;
  readonly value: number;
  readonly min?: number;
  readonly max?: number;
  readonly onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-1 text-xs text-muted-foreground">
      {label}
      <Input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          const nextValue = Number.parseInt(event.target.value, 10);
          onChange(Number.isFinite(nextValue) ? nextValue : 0);
        }}
        className="h-8"
      />
    </label>
  );
}

export function LootFilterScreen() {
  const [sourceText, setSourceText] = usePersistentState<string>(FILTER_SOURCE_STORAGE_KEY, DEFAULT_FILTER_TEMPLATE, isString);
  const [ruleEdits, setRuleEdits] = usePersistentState<Partial<Record<string, LootFilterRuleEdit>>>(
    FILTER_EDITS_STORAGE_KEY,
    {},
    isEditRecord
  );
  const [selectedRuleId, setSelectedRuleId] = useState('');
  const [query, setQuery] = useState('');
  const [viewFilter, setViewFilter] = useState<RuleViewFilter>('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [uploadedAudioFiles, setUploadedAudioFiles] = useState<readonly UploadedAudioFile[]>([]);
  const filterFileInputRef = useRef<HTMLInputElement | null>(null);
  const audioFileInputRef = useRef<HTMLInputElement | null>(null);
  const parsed = parseLootFilterConfig(sourceText);
  const firstRule = parsed.rules.length > 0 ? parsed.rules[0] : undefined;
  const selectedRule: LootFilterRule | undefined = parsed.rules.find((rule) => rule.id === selectedRuleId) ?? firstRule;
  const selectedEdit = selectedRule === undefined ? undefined : ruleEdits[selectedRule.id];
  const filteredRules = parsed.rules.filter((rule) => matchesRuleFilter(rule, query, viewFilter, levelFilter, ruleEdits));
  const audioNames = getAudioNames(parsed.rules, uploadedAudioFiles);
  const selectedAudio = selectedRule === undefined ? '' : (selectedEdit?.audio ?? selectedRule.audio ?? '');
  const uploadedSelectedAudio = uploadedAudioFiles.find((file) => file.name === selectedAudio);

  useEffect(() => {
    return () => {
      for (const file of uploadedAudioFiles) {
        URL.revokeObjectURL(file.url);
      }
    };
  }, [uploadedAudioFiles]);

  const updateSelectedEdit = (patch: Omit<Partial<LootFilterRuleEdit>, 'ruleId'>) => {
    if (!selectedRule) return;

    setRuleEdits((current) => ({
      ...current,
      [selectedRule.id]: {
        ...current[selectedRule.id],
        ruleId: selectedRule.id,
        ...patch,
      },
    }));
  };

  const resetSelectedEdit = () => {
    if (!selectedRule) return;

    setRuleEdits((current) => {
      const { [selectedRule.id]: _removed, ...next } = current;
      return next;
    });
  };

  const handleFilterUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const result = reader.result;
      if (typeof result !== 'string') return;

      setSourceText(result);
      setRuleEdits({});
      setSelectedRuleId('');
      setQuery('');
    });
    reader.readAsText(file, 'utf-8');
    event.target.value = '';
  };

  const handleAudioUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    for (const file of uploadedAudioFiles) {
      URL.revokeObjectURL(file.url);
    }

    setUploadedAudioFiles(
      files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }))
    );
    event.target.value = '';
  };

  const handleDownload = () => {
    const exported = exportLootFilterConfig(
      sourceText,
      Object.values(ruleEdits).filter((edit): edit is LootFilterRuleEdit => edit !== undefined)
    );
    const blob = new Blob([exported], { type: 'text/x-lua;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'lootfilter_config.lua';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handlePreviewAudio = () => {
    if (!uploadedSelectedAudio) return;

    const audio = new Audio(uploadedSelectedAudio.url);
    void audio.play();
  };

  const updateRgba = (current: LootFilterRgba, index: number, value: number) => {
    const next: [number, number, number, number] = [current[0], current[1], current[2], current[3]];
    if (index === 0) next[0] = value;
    if (index === 1) next[1] = value;
    if (index === 2) next[2] = value;
    if (index === 3) next[3] = value;
    updateSelectedEdit({ background: next });
  };

  const updateBorder = (current: LootFilterBorder, index: number, value: number) => {
    const next: [number, number, number, number, number] = [current[0], current[1], current[2], current[3], current[4]];
    if (index === 0) next[0] = value;
    if (index === 1) next[1] = value;
    if (index === 2) next[2] = value;
    if (index === 3) next[3] = value;
    if (index === 4) next[4] = value;
    updateSelectedEdit({ border: next });
  };

  const toggleFilterLevel = (level: number) => {
    if (!selectedRule) return;

    const currentLevels = getDraftFilterLevels(selectedRule, selectedEdit);
    const nextLevels = currentLevels.includes(level)
      ? currentLevels.filter((currentLevel) => currentLevel !== level)
      : [...currentLevels, level].sort((left, right) => left - right);
    updateSelectedEdit({ filterLevels: nextLevels });
  };

  const maxFilterLevel = Math.max(4, parsed.metadata.filterTitles.length);

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">过滤器编辑器</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            已解析 {parsed.rules.length} 条规则，已调整 {Object.keys(ruleEdits).length} 条规则。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={filterFileInputRef} type="file" accept=".lua,.txt,text/*" className="hidden" onChange={handleFilterUpload} />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              filterFileInputRef.current?.click();
            }}
          >
            <Upload className="size-4" />
            上传 Lua
          </Button>
          <Button type="button" variant="outline" onClick={handleDownload}>
            <Download className="size-4" />
            下载配置
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={Object.keys(ruleEdits).length === 0}
            onClick={() => {
              setRuleEdits({});
            }}
          >
            <RotateCcw className="size-4" />
            重置调整
          </Button>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-sm text-muted-foreground">过滤器名称</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="truncate font-semibold">{parsed.metadata.title ?? '未命名过滤器'}</p>
            <p className="mt-1 text-xs text-muted-foreground">{parsed.metadata.type ?? '标准 Lua 配置'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-sm text-muted-foreground">当前语言</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{parsed.metadata.language ?? 'zhCN'}</p>
            <p className="mt-1 text-xs text-muted-foreground">页面显示中文，导出保留标准字段。</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-sm text-muted-foreground">严格等级</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{parsed.metadata.filterLevel ?? 1}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{parsed.metadata.filterTitles.join(' / ') || '未设置标题'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-sm text-muted-foreground">音效</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{parsed.metadata.audioPlayback === false ? '关闭' : '开启'}</p>
            <p className="mt-1 text-xs text-muted-foreground">已识别 {audioNames.length} 个音效文件名。</p>
          </CardContent>
        </Card>
      </section>

      {parsed.diagnostics.length > 0 && (
        <Card className="border-destructive/50">
          <CardContent className="pt-5 text-sm text-destructive">{parsed.diagnostics.join(' ')}</CardContent>
        </Card>
      )}

      <section className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card className="xl:sticky xl:top-4 xl:max-h-[calc(100svh-2rem)] xl:overflow-hidden">
          <CardHeader className="space-y-3">
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="size-5" />
              规则筛选
            </CardTitle>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
                placeholder="搜索规则、代码、通知、音效..."
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={viewFilter}
                onChange={(event) => {
                  setViewFilter(event.target.value as RuleViewFilter);
                }}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">全部规则</option>
                <option value="edited">已调整</option>
                <option value="notify">有通知</option>
                <option value="audio">有音效</option>
                <option value="styled">有样式</option>
                <option value="hidden">隐藏规则</option>
              </select>
              <select
                value={levelFilter}
                onChange={(event) => {
                  setLevelFilter(event.target.value);
                }}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">全部等级</option>
                {Array.from({ length: maxFilterLevel }, (_item, index) => index + 1).map((level) => (
                  <option key={level} value={level}>
                    等级 {level} {parsed.metadata.filterTitles[level - 1] ?? ''}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-muted-foreground">
              当前显示 {filteredRules.length} / {parsed.rules.length} 条规则
            </p>
          </CardHeader>
          <CardContent className="max-h-[56svh] space-y-2 overflow-y-auto pr-2 xl:max-h-[calc(100svh-17rem)]">
            {filteredRules.map((rule) => {
              const isSelected = selectedRule?.id === rule.id;
              const hasEdit = rule.id in ruleEdits;

              return (
                <button
                  key={rule.id}
                  type="button"
                  onClick={() => {
                    setSelectedRuleId(rule.id);
                  }}
                  className={cn(
                    'w-full rounded-md border bg-card p-3 text-left transition-colors hover:bg-accent/60',
                    isSelected && 'border-primary bg-accent',
                    hasEdit && 'border-amber-500/70'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 font-medium">{getRuleTitle(rule)}</p>
                    {hasEdit && <Badge className="shrink-0 bg-amber-500 text-black">已调整</Badge>}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {rule.codes.slice(0, 4).map((code) => (
                      <Badge key={code} variant="outline">
                        {code}
                      </Badge>
                    ))}
                    {rule.audio && <Badge variant="secondary">{rule.audio}</Badge>}
                    {rule.hidden && <Badge variant="destructive">隐藏</Badge>}
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {selectedRule ? (
          <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
                  <div>
                    <CardTitle>{getRuleTitle(selectedRule)}</CardTitle>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="secondary">规则 {selectedRule.index + 1}</Badge>
                      <Badge variant="outline">{describeQuality(selectedRule.quality)}</Badge>
                      <Badge variant="outline">{describeRarity(selectedRule.rarity)}</Badge>
                      <Badge variant="outline">{describeLocations(selectedRule.locations)}</Badge>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" disabled={!selectedEdit} onClick={resetSelectedEdit}>
                    <RotateCcw className="size-4" />
                    重置本条
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="grid gap-1 text-sm">
                      中文通知
                      <Textarea
                        value={getDraftText(selectedRule, selectedEdit, 'notify')}
                        onChange={(event) => {
                          updateSelectedEdit({ notifyZhCN: event.target.value });
                        }}
                        placeholder="{gold}{name}"
                        className="min-h-20"
                      />
                    </label>
                    <label className="grid gap-1 text-sm">
                      音效文件
                      <div className="flex gap-2">
                        <Input
                          value={selectedAudio}
                          onChange={(event) => {
                            updateSelectedEdit({ audio: event.target.value });
                          }}
                          placeholder="tink.mp3"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          disabled={!uploadedSelectedAudio}
                          onClick={handlePreviewAudio}
                          title="试听上传的音效"
                        >
                          <Volume2 className="size-4" />
                        </Button>
                      </div>
                      <select
                        value={selectedAudio}
                        onChange={(event) => {
                          updateSelectedEdit({ audio: event.target.value });
                        }}
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                      >
                        <option value="">不设置音效</option>
                        {audioNames.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="grid gap-1 text-sm">
                      名称前缀
                      <Input
                        value={getDraftText(selectedRule, selectedEdit, 'prefix')}
                        onChange={(event) => {
                          updateSelectedEdit({ prefixZhCN: event.target.value });
                        }}
                        placeholder="{red}[高价值] "
                      />
                    </label>
                    <label className="grid gap-1 text-sm">
                      名称后缀
                      <Input
                        value={getDraftText(selectedRule, selectedEdit, 'suffix')}
                        onChange={(event) => {
                          updateSelectedEdit({ suffixZhCN: event.target.value });
                        }}
                        placeholder=" ({ilvl})"
                      />
                    </label>
                    <label className="grid gap-1 text-sm">
                      说明前缀
                      <Textarea
                        value={getDraftText(selectedRule, selectedEdit, 'prefixDesc')}
                        onChange={(event) => {
                          updateSelectedEdit({ prefixDescZhCN: event.target.value });
                        }}
                        className="min-h-16"
                      />
                    </label>
                    <label className="grid gap-1 text-sm">
                      说明后缀
                      <Textarea
                        value={getDraftText(selectedRule, selectedEdit, 'suffixDesc')}
                        onChange={(event) => {
                          updateSelectedEdit({ suffixDescZhCN: event.target.value });
                        }}
                        className="min-h-16"
                      />
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="size-5" />
                    样式预设
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {Object.values(LOOT_FILTER_STYLE_PRESETS).map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        updateSelectedEdit(applyLootFilterPreset(selectedRule, preset));
                      }}
                      className="rounded-md border bg-card p-3 text-left transition-colors hover:bg-accent"
                    >
                      <div
                        className="mb-3 rounded border px-3 py-2 text-sm font-semibold"
                        style={{
                          backgroundColor: toRgbaCss(preset.background, 'rgba(0,0,0,.65)'),
                          borderColor: toRgbaCss(preset.border, 'rgba(255,255,255,.25)'),
                          borderWidth: `${String(preset.border[4])}px`,
                        }}
                      >
                        <span className="text-amber-300">{preset.label}</span>
                      </div>
                      <p className="font-medium">{preset.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{preset.description}</p>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>颜色与严格等级</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-md border p-3">
                      <p className="mb-3 text-sm font-medium">背景 RGBA</p>
                      <div className="grid grid-cols-4 gap-2">
                        {RGBA_CHANNELS.map((channel, index) => (
                          <NumberField
                            key={channel.key}
                            label={channel.label}
                            value={getDraftBackground(selectedRule, selectedEdit)[index]}
                            onChange={(nextValue) => {
                              updateRgba(getDraftBackground(selectedRule, selectedEdit), index, nextValue);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md border p-3">
                      <p className="mb-3 text-sm font-medium">边框 RGBA / 宽度</p>
                      <div className="grid grid-cols-5 gap-2">
                        {BORDER_CHANNELS.map((channel, index) => (
                          <NumberField
                            key={channel.key}
                            label={channel.label}
                            value={getDraftBorder(selectedRule, selectedEdit)[index]}
                            max={index === 4 ? 8 : 255}
                            onChange={(nextValue) => {
                              updateBorder(getDraftBorder(selectedRule, selectedEdit), index, nextValue);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-3">
                    <p className="mb-3 text-sm font-medium">生效严格等级</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: maxFilterLevel }, (_item, index) => index + 1).map((level) => (
                        <label key={level} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                          <Checkbox
                            checked={getDraftFilterLevels(selectedRule, selectedEdit).includes(level)}
                            onCheckedChange={() => {
                              toggleFilterLevel(level);
                            }}
                          />
                          等级 {level}
                          {parsed.metadata.filterTitles[level - 1] && (
                            <span className="text-muted-foreground">{parsed.metadata.filterTitles[level - 1]}</span>
                          )}
                        </label>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      当前：{formatLevels(getDraftFilterLevels(selectedRule, selectedEdit), parsed.metadata.filterTitles)}
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                    <Checkbox
                      checked={selectedEdit?.hidden ?? selectedRule.hidden ?? false}
                      onCheckedChange={(checked) => {
                        updateSelectedEdit({ hidden: checked === true });
                      }}
                    />
                    隐藏匹配物品
                  </label>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4 2xl:sticky 2xl:top-4 2xl:self-start">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="size-5" />
                    实时预览
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className={cn(
                      'rounded-md border p-4 text-center shadow-lg',
                      (selectedEdit?.hidden ?? selectedRule.hidden) && 'opacity-45'
                    )}
                    style={{
                      backgroundColor: toRgbaCss(getDraftBackground(selectedRule, selectedEdit), 'rgba(0,0,0,.75)'),
                      borderColor: toRgbaCss(getDraftBorder(selectedRule, selectedEdit), 'rgba(255,255,255,.25)'),
                      borderWidth: `${String(getDraftBorder(selectedRule, selectedEdit)[4])}px`,
                    }}
                  >
                    <p className="text-xs text-muted-foreground">地面标签</p>
                    <p className="mt-2 text-lg font-bold">
                      {renderLootFilterMarkup(
                        `${getDraftText(selectedRule, selectedEdit, 'prefix')}${getPreviewPlaceholders(selectedRule).name}${getDraftText(
                          selectedRule,
                          selectedEdit,
                          'suffix'
                        )}`,
                        getPreviewPlaceholders(selectedRule)
                      ).map((segment) => (
                        <span key={`${segment.color}-${segment.text}`} className={segment.className}>
                          {segment.text}
                        </span>
                      ))}
                    </p>
                    {(selectedEdit?.hidden ?? selectedRule.hidden) && (
                      <Badge variant="destructive" className="mt-3">
                        <EyeOff className="size-3" />
                        已隐藏
                      </Badge>
                    )}
                  </div>

                  <div className="rounded-md border p-3">
                    <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <Bell className="size-4" />
                      聊天通知
                    </p>
                    <p className="rounded bg-background px-3 py-2 text-sm">
                      {renderLootFilterMarkup(
                        getDraftText(selectedRule, selectedEdit, 'notify') || '{gray}未设置通知',
                        getPreviewPlaceholders(selectedRule)
                      ).map((segment) => (
                        <span key={`${segment.color}-${segment.text}`} className={segment.className}>
                          {segment.text}
                        </span>
                      ))}
                    </p>
                  </div>

                  <div className="rounded-md border p-3">
                    <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <FileCode className="size-4" />
                      匹配条件
                    </p>
                    <dl className="grid gap-2 text-sm">
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">代码</dt>
                        <dd className="text-right">{selectedRule.codes.join(', ') || '未指定'}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">品质</dt>
                        <dd>{describeQuality(selectedRule.quality)}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">底材等级</dt>
                        <dd>{describeRarity(selectedRule.rarity)}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">位置</dt>
                        <dd className="text-right">{describeLocations(selectedRule.locations)}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="rounded-md border p-3">
                    <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <Volume2 className="size-4" />
                      音效文件
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={selectedAudio ? 'secondary' : 'outline'}>{selectedAudio || '未设置'}</Badge>
                      <input
                        ref={audioFileInputRef}
                        type="file"
                        accept="audio/*"
                        multiple
                        className="hidden"
                        onChange={handleAudioUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          audioFileInputRef.current?.click();
                        }}
                      >
                        <Upload className="size-4" />
                        上传试听音频
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="size-5" />
                    导出预览
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="max-h-72 overflow-auto rounded-md bg-background p-3 text-xs">
                    {exportLootFilterConfig(sourceText, selectedEdit ? [selectedEdit] : []).slice(
                      selectedRule.sourceStart,
                      selectedRule.sourceEnd + 600
                    )}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">上传或粘贴包含 rules 的 Lua 过滤器配置。</CardContent>
          </Card>
        )}
      </section>

      <ScrollToTopButton />
    </div>
  );
}
