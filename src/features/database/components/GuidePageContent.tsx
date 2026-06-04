import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ESR_BASE_URL } from '@/core/api';
import type { GuideContentBlock, GuideHeadingBlock, GuidePage, GuideTableBlock } from '@/core/db';
import { usePersistentState } from '@/core/hooks/usePersistentState';
import { translateGuideText } from '@/core/i18n/guideTranslation';
import { cn } from '@/lib/utils';
import { getGuideCellLineClassification, type GuideAffixLineKind, type GuideMaterialLineKind } from '../utils/guideCellClassification';
import { getGuidePageBlockSummary, getGuidePageHeadings } from '../utils/guidePageSummary';

const INITIAL_GUIDE_TABLE_RENDER_COUNT = 80;
const GUIDE_TABLE_RENDER_INCREMENT = 160;
const INITIAL_GUIDE_TABLE_BLOCK_RENDER_COUNT = 8;
const GUIDE_TABLE_BLOCK_RENDER_INCREMENT = 8;
const ENDGAME_REWARD_FILTER_ALL = '__all__';
const ENDGAME_BOSS_BANNER_URLS: Record<string, string> = {
  'img/map-bosses/ancientfallenangel.png': new URL('../../../assets/endgame-boss-banners/ancientfallenangel.webp', import.meta.url).href,
  'img/map-bosses/arbiterofsouls.png': new URL('../../../assets/endgame-boss-banners/arbiterofsouls.webp', import.meta.url).href,
  'img/map-bosses/avatarofthenight.png': new URL('../../../assets/endgame-boss-banners/avatarofthenight.webp', import.meta.url).href,
  'img/map-bosses/baaldisfiguredharbinger.png': new URL(
    '../../../assets/endgame-boss-banners/baaldisfiguredharbinger.webp',
    import.meta.url
  ).href,
  'img/map-bosses/baaltheinvincible.png': new URL('../../../assets/endgame-boss-banners/baaltheinvincible.webp', import.meta.url).href,
  'img/map-bosses/diablohellhound.png': new URL('../../../assets/endgame-boss-banners/diablohellhound.webp', import.meta.url).href,
  'img/map-bosses/diablotheinvincible.png': new URL('../../../assets/endgame-boss-banners/diablotheinvincible.webp', import.meta.url).href,
  'img/map-bosses/doubleboss.png': new URL('../../../assets/endgame-boss-banners/doubleboss.webp', import.meta.url).href,
  'img/map-bosses/glacialbehemoth.png': new URL('../../../assets/endgame-boss-banners/glacialbehemoth.webp', import.meta.url).href,
  'img/map-bosses/guardiansoftime.png': new URL('../../../assets/endgame-boss-banners/guardiansoftime.webp', import.meta.url).href,
  'img/map-bosses/heraldofdoom.png': new URL('../../../assets/endgame-boss-banners/heraldofdoom.webp', import.meta.url).href,
  'img/map-bosses/lucion.png': new URL('../../../assets/endgame-boss-banners/lucion.webp', import.meta.url).href,
  'img/map-bosses/lucionwhisper.png': new URL('../../../assets/endgame-boss-banners/lucionwhisper.webp', import.meta.url).href,
  'img/map-bosses/mephistotheinvincible.png': new URL('../../../assets/endgame-boss-banners/mephistotheinvincible.webp', import.meta.url)
    .href,
  'img/map-bosses/rathma.png': new URL('../../../assets/endgame-boss-banners/rathma.webp', import.meta.url).href,
  'img/map-bosses/terrorintheshadows.png': new URL('../../../assets/endgame-boss-banners/terrorintheshadows.webp', import.meta.url).href,
  'img/map-bosses/thelichking.png': new URL('../../../assets/endgame-boss-banners/thelichking.webp', import.meta.url).href,
  'img/map-bosses/thetaskmaster.png': new URL('../../../assets/endgame-boss-banners/thetaskmaster.webp', import.meta.url).href,
};

interface GuidePageContentProps {
  readonly page: GuidePage;
  readonly favoriteRowIds?: readonly string[];
  readonly getRowFavoriteId?: (block: GuideTableBlock, row: readonly string[]) => string;
  readonly onToggleFavoriteRow?: (favoriteId: string) => void;
}

const AFFIX_LINE_CLASSES: Record<GuideAffixLineKind | 'affix', string> = {
  affix: 'inline rounded-sm border border-sky-400/25 bg-sky-500/10 px-1 py-0.5 font-medium text-sky-700 dark:text-sky-300',
  skillAffix: 'inline rounded-sm border border-blue-400/30 bg-blue-500/10 px-1 py-0.5 font-medium text-blue-700 dark:text-blue-300',
  resistAffix: 'inline rounded-sm border border-lime-400/35 bg-lime-500/10 px-1 py-0.5 font-medium text-lime-800 dark:text-lime-300',
  damageAffix: 'inline rounded-sm border border-rose-400/30 bg-rose-500/10 px-1 py-0.5 font-medium text-rose-700 dark:text-rose-300',
  speedAffix: 'inline rounded-sm border border-cyan-400/35 bg-cyan-500/10 px-1 py-0.5 font-medium text-cyan-800 dark:text-cyan-300',
  triggerAffix:
    'inline rounded-sm border border-purple-400/35 bg-purple-500/10 px-1 py-0.5 font-medium text-purple-800 dark:text-purple-300',
};

const MATERIAL_LINE_CLASSES: Record<GuideMaterialLineKind, string> = {
  rune: 'inline rounded-sm border border-violet-400/30 bg-violet-500/10 px-1 py-0.5 font-medium text-violet-700 dark:text-violet-300',
  gem: 'inline rounded-sm border border-emerald-400/30 bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-700 dark:text-emerald-300',
  corruption: 'inline rounded-sm border border-rose-400/30 bg-rose-500/10 px-1 py-0.5 font-medium text-rose-700 dark:text-rose-300',
  organ: 'inline rounded-sm border border-red-400/30 bg-red-500/10 px-1 py-0.5 font-medium text-red-700 dark:text-red-300',
  dstone: 'inline rounded-sm border border-orange-400/30 bg-orange-500/10 px-1 py-0.5 font-medium text-orange-800 dark:text-orange-300',
  forging: 'inline rounded-sm border border-stone-400/35 bg-stone-500/15 px-1 py-0.5 font-medium text-stone-800 dark:text-stone-200',
  aura: 'inline rounded-sm border border-fuchsia-400/35 bg-fuchsia-500/10 px-1 py-0.5 font-medium text-fuchsia-800 dark:text-fuchsia-300',
  socket: 'inline rounded-sm border border-cyan-400/35 bg-cyan-500/10 px-1 py-0.5 font-medium text-cyan-800 dark:text-cyan-300',
  map: 'inline rounded-sm border border-indigo-400/35 bg-indigo-500/10 px-1 py-0.5 font-medium text-indigo-800 dark:text-indigo-300',
  cube: 'inline rounded-sm border border-amber-400/30 bg-amber-500/10 px-1 py-0.5 font-medium text-amber-800 dark:text-amber-300',
  consumable: 'inline rounded-sm border border-teal-400/30 bg-teal-500/10 px-1 py-0.5 font-medium text-teal-700 dark:text-teal-300',
  currency: 'inline rounded-sm border border-yellow-400/30 bg-yellow-500/10 px-1 py-0.5 font-medium text-yellow-800 dark:text-yellow-300',
};

function resolveImageUrl(src: string, sourceUrl: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  return new URL(src, sourceUrl || `${ESR_BASE_URL}/`).href;
}

function resolveEndgameBossImageUrl(src: string, sourceUrl: string): string {
  const normalizedSrc = src
    .replace(/\\/gu, '/')
    .replace(/^https?:\/\/[^/]+\//iu, '')
    .replace(/^\.?\//u, '');
  return ENDGAME_BOSS_BANNER_URLS[normalizedSrc] ?? resolveImageUrl(src, sourceUrl);
}

function translated(text: string): string {
  return translateGuideText(text);
}

function translatedEndgameText(text: string): string {
  return translated(text)
    .replace(/\bEndgame Bosses\b/giu, '终局首领')
    .replace(/\bLucion Whisper\b/giu, '卢西昂之影')
    .replace(/卢西恩的低语/gu, '卢西昂之影')
    .replace(/\bPit of Anguish\b/giu, '痛苦地窖')
    .replace(/\bEternal Flame\b/giu, '永恒烈焰')
    .replace(/\bReward\b/giu, '奖励')
    .replace(/\bNote\b/giu, '注意')
    .replace(/\bWarning\b/giu, '警告');
}

function getTranslatedLines(text: string): string[] {
  return text
    .split(/\n+/)
    .map((line) => translated(line.trim()))
    .filter((line) => line.length > 0);
}

function renderGuideCellLine(line: string): React.ReactNode {
  const classification = getGuideCellLineClassification(line);
  if (classification.kind === 'plain') return line;

  if (classification.kind === 'affix') {
    return (
      <span
        data-guide-line-kind="affix"
        data-guide-affix-kind={classification.affixKind}
        className={cn(AFFIX_LINE_CLASSES[classification.affixKind])}
      >
        {line}
      </span>
    );
  }

  const materialKind = classification.materialKind;

  return (
    <span data-guide-line-kind="material" data-guide-material-kind={materialKind} className={cn(MATERIAL_LINE_CLASSES[materialKind])}>
      {line}
    </span>
  );
}

function renderMultilineCell(text: string): React.ReactNode {
  const lines = getTranslatedLines(text);
  if (lines.length <= 1) return renderGuideCellLine(lines[0] ?? '');
  return (
    <div className="space-y-1">
      {lines.map((line, index) => (
        <p key={`${line}-${String(index)}`}>{renderGuideCellLine(line)}</p>
      ))}
    </div>
  );
}

function renderCompactNote(text: string): string {
  return getTranslatedLines(text).join(' ');
}

function renderCompactNotes(notes: readonly string[] | undefined): string {
  return (notes ?? [])
    .map(renderCompactNote)
    .filter((note) => note.length > 0)
    .join(' ');
}

function renderTableSectionCell(text: string): React.ReactNode {
  const [title = '', ...details] = getTranslatedLines(text);
  const detail = details.join(' ');
  if (!detail) return <span className="font-semibold text-amber-700 dark:text-amber-400">{title}</span>;

  return (
    <div className="space-y-1">
      <p className="font-semibold text-amber-700 dark:text-amber-400">{title}</p>
      <p className="font-normal text-muted-foreground">{detail}</p>
    </div>
  );
}

function getEndgameSentences(text: string): string[] {
  return translatedEndgameText(text)
    .split(/(?<=[。.!?])\s*/u)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

function getEndgameBriefingLabel(text: string): string {
  if (/警告|困难|survive|生存|抗性|生命/u.test(text)) return '生存门槛';
  if (/进入|地狱第五幕|access|transmut/u.test(text)) return '进入方式';
  if (/阶|tier|地图物品|18/u.test(text)) return '地图阶级';
  if (/掉落|drop|奖励|reward/u.test(text)) return '掉落规则';
  if (/恐怖化|terror/u.test(text)) return '恐怖化';
  if (/护盾|shield|免疫/u.test(text)) return '首领机制';
  return '机制说明';
}

interface EndgameRewardOption {
  readonly label: string;
  readonly count: number;
}

type EndgameParagraphPart =
  | {
      readonly kind: 'text' | 'note';
      readonly line: string;
    }
  | {
      readonly kind: 'reward';
      readonly items: readonly string[];
    };

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function trimEndgamePunctuation(text: string): string {
  return text.replace(/[\s。.;；]+$/u, '').trim();
}

function stripEndgameLabel(text: string): string {
  return text.replace(/^(?:奖励|注意|警告)\s*[-－:：]\s*/iu, '').trim();
}

function isEndgameNoteLine(line: string): boolean {
  return (
    /^(?:注意|警告)\s*[-－:：]/iu.test(line) || /(?:免疫护盾|引擎限制|无法修复|不建议|必须|建议|survive|cannot|recommended)/iu.test(line)
  );
}

function isEndgameRewardLine(line: string): boolean {
  if (/^奖励\s*[-－:：]/iu.test(line)) return true;

  return (
    (/(?:涂抹之球|祝福宝珠|世界石碎片|混沌钥匙|Pandemonium Key|Worldstone Shard|Orb of Anointment)/iu.test(line) ||
      /(?:\d+\s*阶地图|Tier\s+\d+\s+Map)/iu.test(line)) &&
    /(?:平均|几率|chance|掉落|drop|必定|always)/iu.test(line)
  );
}

function getEndgameRewardItemsFromLine(line: string): readonly string[] {
  if (!isEndgameRewardLine(line)) return [];

  const rewardText = trimEndgamePunctuation(stripEndgameLabel(line));
  if (!rewardText) return [];

  return rewardText
    .split(/\s*(?:[；;]|\s+\|\s+)\s*/u)
    .map(trimEndgamePunctuation)
    .filter((item) => item.length > 0);
}

function getEndgameRewardLabel(item: string): string {
  return trimEndgamePunctuation(item)
    .replace(/[（(][^）)]*(?:平均|几率|chance|average)[^）)]*[）)]/giu, '')
    .replace(/\s+/gu, ' ')
    .trim();
}

function getEndgameBlockLines(block: GuideContentBlock): readonly string[] {
  if (block.kind === 'paragraph' || block.kind === 'heading') return getEndgameSentences(block.text);
  if (block.kind !== 'table') return [];

  return [...(block.notes ?? []), ...block.headers, ...block.rows.flat()].flatMap(getTranslatedLines).flatMap(getEndgameSentences);
}

function getEndgameSectionRewardLabels(section: EndgameBossSection): readonly string[] {
  const labels = new Set<string>();

  for (const block of section.blocks) {
    for (const line of getEndgameBlockLines(block)) {
      for (const item of getEndgameRewardItemsFromLine(line)) {
        const label = getEndgameRewardLabel(item);
        if (label) labels.add(label);
      }
    }
  }

  return [...labels];
}

function getEndgameRewardOptions(sections: readonly EndgameBossSection[]): readonly EndgameRewardOption[] {
  const counts = new Map<string, number>();

  for (const section of sections) {
    for (const label of getEndgameSectionRewardLabels(section)) {
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => a.label.localeCompare(b.label, 'zh-Hans-CN', { numeric: true }));
}

function filterEndgameBossSections(sections: readonly EndgameBossSection[], rewardFilter: string): readonly EndgameBossSection[] {
  if (rewardFilter === ENDGAME_REWARD_FILTER_ALL) return sections;

  return sections.filter((section) => getEndgameSectionRewardLabels(section).includes(rewardFilter));
}

function renderEndgameTaggedText(text: string): React.ReactNode {
  const valuePattern =
    /[+-]?\d+(?:\.\d+)?\s*(?:%|秒|阶|级|层|生命|抗性|人难度|hp|HP|k hp|K HP)?(?:\s*(?:-|至|到|~)\s*[+-]?\d+(?:\.\d+)?\s*(?:%|秒|阶|级|层|生命|抗性|hp|HP)?)?/giu;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(valuePattern)) {
    const value = match[0];
    const index = match.index;
    if (!value.trim()) continue;
    if (index > lastIndex) nodes.push(text.slice(lastIndex, index));
    nodes.push(
      <span
        key={`${value}-${String(index)}`}
        data-endgame-value="true"
        className="rounded-sm border border-cyan-400/30 bg-cyan-500/10 px-1 py-0.5 font-semibold text-cyan-800 dark:text-cyan-300"
      >
        {value}
      </span>
    );
    lastIndex = index + value.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes.length > 0 ? nodes : text;
}

function getEndgameParagraphParts(text: string): readonly EndgameParagraphPart[] {
  const parts: EndgameParagraphPart[] = [];
  let pendingRewards: string[] = [];

  function flushRewards(): void {
    if (pendingRewards.length === 0) return;
    parts.push({ kind: 'reward', items: pendingRewards });
    pendingRewards = [];
  }

  for (const line of getTranslatedLines(text).flatMap(getEndgameSentences)) {
    const rewardItems = getEndgameRewardItemsFromLine(line);
    if (rewardItems.length > 0) {
      pendingRewards.push(...rewardItems);
      continue;
    }

    flushRewards();
    parts.push({ kind: isEndgameNoteLine(line) ? 'note' : 'text', line });
  }

  flushRewards();
  return parts;
}

function EndgameRewardSection({ items }: { readonly items: readonly string[] }) {
  return (
    <div data-endgame-reward-section="true" className="rounded-md border border-amber-400/35 bg-amber-500/5 p-3">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-px flex-1 bg-amber-400/30" />
        <span className="rounded-full border border-amber-400/40 bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
          奖励
        </span>
        <span className="h-px flex-1 bg-amber-400/30" />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item, index) => {
          const label = getEndgameRewardLabel(item);
          return (
            <div
              key={`${item}-${String(index)}`}
              data-endgame-reward-item="true"
              className="rounded-md border border-amber-400/25 bg-background/70 px-3 py-2 text-sm leading-6"
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-amber-400" />
                <span className="font-semibold text-amber-800 dark:text-amber-300">{label || '奖励'}</span>
              </div>
              <p className="text-muted-foreground">{renderEndgameTaggedText(item)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EndgameRewardFilter({
  options,
  selectedReward,
  onSelectReward,
}: {
  readonly options: readonly EndgameRewardOption[];
  readonly selectedReward: string;
  readonly onSelectReward: (reward: string) => void;
}) {
  if (options.length === 0) return null;

  return (
    <section data-endgame-reward-filter="true" className="space-y-3 rounded-md border bg-muted/20 p-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="space-y-1">
          <p className="text-sm font-semibold">奖励筛选</p>
          <p className="text-xs text-muted-foreground">按掉落奖励快速定位对应地图首领。</p>
        </div>
        <Button
          type="button"
          variant={selectedReward === ENDGAME_REWARD_FILTER_ALL ? 'default' : 'outline'}
          size="sm"
          data-endgame-reward-chip="true"
          aria-pressed={selectedReward === ENDGAME_REWARD_FILTER_ALL}
          onClick={() => {
            onSelectReward(ENDGAME_REWARD_FILTER_ALL);
          }}
        >
          全部奖励
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = selectedReward === option.label;
          return (
            <Button
              key={option.label}
              type="button"
              variant={selected ? 'default' : 'outline'}
              size="sm"
              data-endgame-reward-chip="true"
              aria-pressed={selected}
              className={cn(
                'h-auto gap-2 rounded-full py-1.5',
                selected
                  ? 'border-amber-500 bg-amber-500 text-amber-950 hover:bg-amber-400'
                  : 'border-amber-400/30 bg-amber-500/5 text-amber-800 hover:bg-amber-500/15 dark:text-amber-300'
              )}
              onClick={() => {
                onSelectReward(option.label);
              }}
            >
              <span>{option.label}</span>
              <span className="rounded-full bg-background/80 px-1.5 py-0.5 text-[11px] text-foreground">{option.count}</span>
            </Button>
          );
        })}
      </div>
    </section>
  );
}

function renderEndgameParagraphLines(text: string): React.ReactNode {
  const parts = getEndgameParagraphParts(text);
  if (parts.length === 0) return null;

  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        if (part.kind === 'reward') {
          return <EndgameRewardSection key={`reward-${String(index)}`} items={part.items} />;
        }

        const line = part.line;
        if (part.kind === 'note') {
          return (
            <p
              key={`${line}-${String(index)}`}
              data-endgame-note="true"
              className="rounded-md border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm leading-6 text-rose-950 dark:text-rose-200"
            >
              <span className="mr-2 rounded-sm border border-rose-400/35 bg-rose-500/15 px-1.5 py-0.5 font-semibold text-rose-800 dark:text-rose-300">
                注意
              </span>
              {renderEndgameTaggedText(stripEndgameLabel(line))}
            </p>
          );
        }

        const separatorMatch = line.match(/^(.{2,32}?)[\s\p{Zs}]*[-－：:][\s\p{Zs}]*(.+)$/u);
        if (!separatorMatch || !isString(separatorMatch[1]) || !isString(separatorMatch[2])) {
          return (
            <p key={`${line}-${String(index)}`} className="leading-7 text-muted-foreground">
              {renderEndgameTaggedText(line)}
            </p>
          );
        }

        return (
          <p key={`${line}-${String(index)}`} className="leading-7 text-muted-foreground">
            <span className="mr-2 rounded-sm border border-amber-400/30 bg-amber-500/10 px-1.5 py-0.5 font-semibold text-amber-800 dark:text-amber-300">
              {separatorMatch[1]}
            </span>
            {renderEndgameTaggedText(separatorMatch[2])}
          </p>
        );
      })}
    </div>
  );
}

interface EndgameBossSection {
  readonly title: string;
  readonly blocks: readonly GuideContentBlock[];
}

function isEndgameBossListHeading(block: GuideContentBlock): boolean {
  return block.kind === 'heading' && /(?:Endgame Bosses|终局\s*(?:BOSS|Boss|首领))/iu.test(block.text);
}

function isEndgameBossTitle(block: GuideContentBlock): block is GuideHeadingBlock {
  return block.kind === 'heading' && (block.level === 3 || /[-－]/u.test(block.text)) && !isEndgameBossListHeading(block);
}

function splitEndgameMapBlocks(blocks: readonly GuideContentBlock[]): {
  readonly briefingBlocks: readonly GuideContentBlock[];
  readonly bossSections: readonly EndgameBossSection[];
  readonly otherBlocks: readonly GuideContentBlock[];
} {
  const briefingBlocks: GuideContentBlock[] = [];
  const bossSections: EndgameBossSection[] = [];
  const otherBlocks: GuideContentBlock[] = [];
  let collectingBosses = false;
  let currentBoss: { title: string; blocks: GuideContentBlock[] } | null = null;

  function flushBoss(): void {
    if (!currentBoss) return;
    bossSections.push({ title: currentBoss.title, blocks: currentBoss.blocks });
    currentBoss = null;
  }

  for (const block of blocks) {
    if (isEndgameBossListHeading(block)) {
      flushBoss();
      collectingBosses = true;
      continue;
    }

    if (collectingBosses && isEndgameBossTitle(block)) {
      flushBoss();
      currentBoss = { title: translatedEndgameText(block.text), blocks: [] };
      continue;
    }

    if (currentBoss) {
      currentBoss.blocks.push(block);
      continue;
    }

    if (!collectingBosses && block.kind === 'paragraph') {
      briefingBlocks.push(block);
      continue;
    }

    otherBlocks.push(block);
  }

  flushBoss();
  return { briefingBlocks, bossSections, otherBlocks };
}

function EndgameBriefing({ blocks }: { readonly blocks: readonly GuideContentBlock[] }) {
  const items = blocks
    .filter((block) => block.kind === 'paragraph')
    .flatMap((block) => getEndgameSentences(block.text))
    .filter((line) => line.length > 0);

  if (items.length === 0) return null;

  return (
    <section className="space-y-3 rounded-md border bg-muted/20 p-4">
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-400">战前简报</p>
        <h2 className="text-xl font-semibold">进入终局地图前先看这些</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <div key={`${item}-${String(index)}`} className="rounded-md border bg-card/70 p-3">
            <p className="mb-1 text-xs font-semibold text-amber-700 dark:text-amber-400">{getEndgameBriefingLabel(item)}</p>
            <p className="text-sm leading-6 text-muted-foreground">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EndgameBossCard({ section, sourceUrl }: { readonly section: EndgameBossSection; readonly sourceUrl: string }) {
  const imageBlock = section.blocks.find((block) => block.kind === 'image');
  const detailBlocks = section.blocks.filter((block) => block !== imageBlock);

  return (
    <section data-endgame-boss-card="true" className="overflow-hidden rounded-md border bg-card/70">
      {imageBlock?.kind === 'image' && (
        <figure data-endgame-boss-banner="true" className="relative h-44 overflow-hidden border-b bg-background sm:h-52 lg:h-56">
          <img
            src={resolveEndgameBossImageUrl(imageBlock.src, sourceUrl)}
            alt={translatedEndgameText(imageBlock.alt)}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent" />
        </figure>
      )}
      <div className="min-w-0 space-y-3 p-4">
        <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400">{section.title}</h3>
        <div className="space-y-3">
          {detailBlocks.map((block) => {
            if (block.kind === 'paragraph') {
              return <div key={block.id}>{renderEndgameParagraphLines(block.text)}</div>;
            }
            if (block.kind === 'table') {
              return (
                <GuideTable key={block.id} block={block} favoriteRowIds={[]} getRowFavoriteId={undefined} onToggleFavoriteRow={undefined} />
              );
            }
            if (block.kind === 'image') return null;
            return (
              <h4 key={block.id} className="text-base font-semibold text-foreground">
                {translatedEndgameText(block.text)}
              </h4>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function isFullWidthSectionRow(row: readonly string[]): boolean {
  return row.length > 1 && Boolean(row[0]?.trim()) && row.slice(1).every((cell) => cell.trim().length === 0);
}

function countGuideTables(blocks: readonly GuideContentBlock[]): number {
  return blocks.filter((block) => block.kind === 'table').length;
}

function getVisibleGuideBlocks(
  blocks: readonly GuideContentBlock[],
  tableLimit: number
): {
  readonly visibleBlocks: readonly GuideContentBlock[];
  readonly renderedTableCount: number;
  readonly totalTableCount: number;
} {
  const totalTableCount = countGuideTables(blocks);
  if (totalTableCount <= tableLimit) {
    return { visibleBlocks: blocks, renderedTableCount: totalTableCount, totalTableCount };
  }

  const visibleBlocks: GuideContentBlock[] = [];
  let renderedTableCount = 0;

  for (const block of blocks) {
    if (block.kind === 'table') {
      if (renderedTableCount >= tableLimit) break;
      renderedTableCount += 1;
    }

    visibleBlocks.push(block);
  }

  return { visibleBlocks, renderedTableCount, totalTableCount };
}

function GuideTable({
  block,
  favoriteRowIds,
  getRowFavoriteId,
  onToggleFavoriteRow,
}: {
  readonly block: GuideTableBlock;
  readonly favoriteRowIds: readonly string[];
  readonly getRowFavoriteId?: (block: GuideTableBlock, row: readonly string[]) => string;
  readonly onToggleFavoriteRow?: (favoriteId: string) => void;
}) {
  const [visibleRows, setVisibleRows] = useState(INITIAL_GUIDE_TABLE_RENDER_COUNT);
  const renderedRows = block.rows.slice(0, visibleRows);
  const hasMoreRows = renderedRows.length < block.rows.length;
  const compactNotes = renderCompactNotes(block.notes);
  const favoriteRowIdSet = new Set(favoriteRowIds);
  const canFavoriteRows = getRowFavoriteId !== undefined && onToggleFavoriteRow !== undefined;

  return (
    <section id={block.id} className="scroll-mt-20 space-y-2">
      {block.caption && <h3 className="text-base font-semibold text-amber-700 dark:text-amber-400">{translated(block.caption)}</h3>}
      {compactNotes && (
        <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm leading-6 text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">说明：</span> {compactNotes}
          </p>
        </div>
      )}
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full min-w-max border-collapse text-sm">
          {block.headers.length > 0 && (
            <thead className="bg-muted/80">
              <tr>
                {canFavoriteRows && <th className="w-10 border-b px-2 py-2 text-left font-semibold whitespace-nowrap">收藏</th>}
                {block.headers.map((header, index) => (
                  <th key={`${header}-${String(index)}`} className="border-b px-3 py-2 text-left font-semibold whitespace-nowrap">
                    {translated(header)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {renderedRows.map((row, rowIndex) => {
              if (isFullWidthSectionRow(row)) {
                return (
                  <tr key={`row-${String(rowIndex)}`} className="bg-muted/50">
                    <td colSpan={Math.max(block.headers.length, row.length) + (canFavoriteRows ? 1 : 0)} className="border-b px-3 py-2">
                      {renderTableSectionCell(row[0] ?? '')}
                    </td>
                  </tr>
                );
              }

              const favoriteId = canFavoriteRows ? getRowFavoriteId(block, row) : '';
              const isFavorite = favoriteRowIdSet.has(favoriteId);

              return (
                <tr key={`row-${String(rowIndex)}`} className="odd:bg-card even:bg-muted/30">
                  {canFavoriteRows && (
                    <td className="w-10 border-b px-2 py-2 align-top">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="size-7"
                        data-guide-row-favorite={isFavorite ? 'true' : 'false'}
                        aria-label={isFavorite ? '取消收藏公式行' : '收藏公式行'}
                        title={isFavorite ? '取消收藏公式行' : '收藏公式行'}
                        onClick={() => {
                          onToggleFavoriteRow(favoriteId);
                        }}
                      >
                        <Star className={cn('size-4', isFavorite ? 'fill-amber-400 text-amber-500' : 'text-muted-foreground')} />
                      </Button>
                    </td>
                  )}
                  {row.map((cell, cellIndex) => (
                    <td key={`${String(rowIndex)}-${String(cellIndex)}`} className="border-b px-3 py-2 align-top">
                      {renderMultilineCell(cell)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {hasMoreRows && (
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            已显示 {renderedRows.length} / {block.rows.length} 行
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setVisibleRows((current) => current + GUIDE_TABLE_RENDER_INCREMENT);
            }}
          >
            显示更多
          </Button>
        </div>
      )}
    </section>
  );
}

function GuideBlock({
  block,
  sourceUrl,
  favoriteRowIds,
  getRowFavoriteId,
  onToggleFavoriteRow,
}: {
  readonly block: GuideContentBlock;
  readonly sourceUrl: string;
  readonly favoriteRowIds: readonly string[];
  readonly getRowFavoriteId?: (block: GuideTableBlock, row: readonly string[]) => string;
  readonly onToggleFavoriteRow?: (favoriteId: string) => void;
}) {
  if (block.kind === 'heading') {
    return block.level === 2 ? (
      <h2 id={block.id} className="scroll-mt-20 text-xl font-semibold text-foreground">
        {translated(block.text)}
      </h2>
    ) : (
      <h3 id={block.id} className="scroll-mt-20 text-lg font-semibold text-foreground">
        {translated(block.text)}
      </h3>
    );
  }

  if (block.kind === 'paragraph') {
    return <p className="leading-7 text-muted-foreground">{translated(block.text)}</p>;
  }

  if (block.kind === 'image') {
    return (
      <figure className="flex justify-center">
        <img
          src={resolveImageUrl(block.src, sourceUrl)}
          alt={translated(block.alt)}
          className="max-h-96 rounded-md object-contain"
          loading="lazy"
        />
      </figure>
    );
  }

  return (
    <GuideTable
      block={block}
      favoriteRowIds={favoriteRowIds}
      getRowFavoriteId={getRowFavoriteId}
      onToggleFavoriteRow={onToggleFavoriteRow}
    />
  );
}

export function GuidePageContent({ page, favoriteRowIds = [], getRowFavoriteId, onToggleFavoriteRow }: GuidePageContentProps) {
  const groupLabel = page.group === 'base' ? '基础资料' : page.group === 'features' ? '机制说明' : '攻略资料';
  const loadMoreTablesRef = useRef<HTMLDivElement | null>(null);
  const [visibleTableLimit, setVisibleTableLimit] = useState(INITIAL_GUIDE_TABLE_BLOCK_RENDER_COUNT);
  const [endgameRewardFilter, setEndgameRewardFilter] = usePersistentState<string>(
    'd2r-esr.database.endgameRewardFilter.v1',
    ENDGAME_REWARD_FILTER_ALL,
    isString
  );
  const { visibleBlocks, renderedTableCount, totalTableCount } = getVisibleGuideBlocks(page.blocks, visibleTableLimit);
  const visiblePage = { ...page, blocks: visibleBlocks };
  const headings = getGuidePageHeadings(visiblePage);
  const summary = getGuidePageBlockSummary(page);
  const hasMoreTables = renderedTableCount < totalTableCount;
  const endgameMapBlocks = page.id === 'endgameMaps' ? splitEndgameMapBlocks(visibleBlocks) : null;
  const endgameRewardOptions = endgameMapBlocks ? getEndgameRewardOptions(endgameMapBlocks.bossSections) : [];
  const selectedEndgameRewardFilter =
    endgameRewardFilter === ENDGAME_REWARD_FILTER_ALL || endgameRewardOptions.some((option) => option.label === endgameRewardFilter)
      ? endgameRewardFilter
      : ENDGAME_REWARD_FILTER_ALL;
  const filteredEndgameBossSections = endgameMapBlocks
    ? filterEndgameBossSections(endgameMapBlocks.bossSections, selectedEndgameRewardFilter)
    : [];

  useEffect(() => {
    if (!hasMoreTables) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const target = loadMoreTablesRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleTableLimit((current) => current + GUIDE_TABLE_BLOCK_RENDER_INCREMENT);
        }
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasMoreTables]);

  return (
    <article className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{groupLabel}</Badge>
            <Badge variant="outline">{translated(page.label)}</Badge>
          </div>
          <h1 className="text-2xl font-bold">{page.title}</h1>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>{summary.headingCount} 个章节</span>
            <span>{summary.tableCount} 张表格</span>
            <span>{summary.tableRowCount} 行表格数据</span>
            {summary.imageCount > 0 && <span>{summary.imageCount} 张图片</span>}
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={page.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
            来源
            <ExternalLink className="size-4" />
          </a>
        </Button>
      </header>

      <div className={headings.length > 0 ? 'grid gap-6 xl:grid-cols-[minmax(0,1fr)_14rem]' : 'grid gap-6'}>
        <div className="min-w-0 space-y-5">
          {endgameMapBlocks ? (
            <div data-endgame-map-layout="true" className="space-y-6">
              <EndgameBriefing blocks={endgameMapBlocks.briefingBlocks} />
              {endgameMapBlocks.otherBlocks.map((block) => (
                <GuideBlock
                  key={block.id}
                  block={block}
                  sourceUrl={page.sourceUrl}
                  favoriteRowIds={favoriteRowIds}
                  getRowFavoriteId={getRowFavoriteId}
                  onToggleFavoriteRow={onToggleFavoriteRow}
                />
              ))}
              <EndgameRewardFilter
                options={endgameRewardOptions}
                selectedReward={selectedEndgameRewardFilter}
                onSelectReward={setEndgameRewardFilter}
              />
              {endgameMapBlocks.bossSections.length > 0 && (
                <section className="space-y-3">
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-400">终局首领</p>
                      <h2 className="text-xl font-semibold">地图首领与关键机制</h2>
                    </div>
                    <Badge variant="outline">
                      {filteredEndgameBossSections.length} / {endgameMapBlocks.bossSections.length} 名首领
                    </Badge>
                  </div>
                  {filteredEndgameBossSections.length > 0 ? (
                    <div className="space-y-4">
                      {filteredEndgameBossSections.map((section) => (
                        <EndgameBossCard key={section.title} section={section} sourceUrl={page.sourceUrl} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                      没有匹配这个奖励的地图首领。
                    </div>
                  )}
                </section>
              )}
            </div>
          ) : (
            visibleBlocks.map((block) => (
              <GuideBlock
                key={block.id}
                block={block}
                sourceUrl={page.sourceUrl}
                favoriteRowIds={favoriteRowIds}
                getRowFavoriteId={getRowFavoriteId}
                onToggleFavoriteRow={onToggleFavoriteRow}
              />
            ))
          )}
          {hasMoreTables && (
            <div ref={loadMoreTablesRef} className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-muted/20 p-3">
              <span className="text-sm text-muted-foreground">
                已显示 {renderedTableCount} / {totalTableCount} 张表格
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setVisibleTableLimit((current) => current + GUIDE_TABLE_BLOCK_RENDER_INCREMENT);
                }}
              >
                显示更多表格
              </Button>
            </div>
          )}
        </div>

        {headings.length > 0 && (
          <aside className="hidden xl:block">
            <div className="sticky top-20 space-y-2 border-l pl-4">
              <p className="text-sm font-semibold">本页目录</p>
              <nav className="space-y-1">
                {headings.slice(0, 24).map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={`block rounded-sm py-1 text-sm text-muted-foreground hover:text-foreground ${
                      heading.level === 3 ? 'pl-3' : ''
                    }`}
                  >
                    {translated(heading.text)}
                  </a>
                ))}
              </nav>
              {headings.length > 24 && (
                <p className="text-xs text-muted-foreground">另有 {headings.length - 24} 个章节，可继续向下浏览。</p>
              )}
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
