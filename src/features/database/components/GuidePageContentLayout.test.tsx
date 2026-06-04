import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { GuidePage } from '@/core/db';
import { GuidePageContent } from './GuidePageContent';

const pageWithoutHeadings: GuidePage = {
  id: 'armors',
  group: 'base',
  label: 'Armor',
  title: '护甲基础资料',
  sourcePath: 'armors.htm',
  sourceUrl: 'https://example.test/armors.htm',
  order: 1,
  textIndex: '',
  blocks: [
    {
      id: 'armor-table',
      kind: 'table',
      caption: 'Armor',
      headers: ['Name', 'Code'],
      rows: [['Quilted Armor', 'qui']],
    },
  ],
};

const pageWithHeadings: GuidePage = {
  ...pageWithoutHeadings,
  blocks: [{ id: 'section', kind: 'heading', level: 2, text: 'Section' }, ...pageWithoutHeadings.blocks],
};

const communityPage: GuidePage = {
  ...pageWithoutHeadings,
  group: 'community',
  label: 'DPDNS Cube Formula',
  title: '盒子公式（DPDNS）',
};

const pageWithTableSectionRows: GuidePage = {
  ...pageWithoutHeadings,
  blocks: [
    {
      id: 'recipe-table',
      kind: 'table',
      caption: 'Rings/Amulets',
      headers: ['Input', 'Output'],
      rows: [
        ['Standard Reroll', ''],
        ['3 Magic Rings', 'Magic Ring'],
      ],
    },
  ],
};

const pageWithDetailedTableSectionRow: GuidePage = {
  ...pageWithoutHeadings,
  blocks: [
    {
      id: 'recipe-table',
      kind: 'table',
      caption: 'Unique Items',
      headers: ['Input', 'Output'],
      rows: [
        [
          'Unique Reroll\nBase upgraded uniques cannot be rerolled.\nItems that had sockets added before reroll will lose their sockets.',
          '',
        ],
        ['3 Unique Rings', 'Unique Ring'],
      ],
    },
  ],
};

const pageWithTableNotes: GuidePage = {
  ...pageWithoutHeadings,
  blocks: [
    {
      id: 'recipe-table',
      kind: 'table',
      caption: 'Rings/Amulets',
      notes: ['First source line\nsecond source line'],
      headers: ['Input', 'Output'],
      rows: [['3 Magic Rings', 'Magic Ring']],
    },
  ],
};

const pageWithMultipleTableNotes: GuidePage = {
  ...pageWithoutHeadings,
  blocks: [
    {
      id: 'recipe-table',
      kind: 'table',
      caption: 'Unique Items',
      notes: ['First source line\nsecond source line', 'Third source line'],
      headers: ['Input', 'Output'],
      rows: [['3 Magic Rings', 'Magic Ring']],
    },
  ],
};

const pageWithHighlightedCellLines: GuidePage = {
  ...pageWithoutHeadings,
  blocks: [
    {
      id: 'recipe-table',
      kind: 'table',
      caption: 'Corruption Outcomes',
      headers: ['Input', 'Output'],
      rows: [
        [
          "El Rune\nPerfect Ruby\nWorldstone Shard\nDiablo's Demonic Horn\nDragon Stone\nGreen Aura Stone\n黑色光环石\nSocket Donut\nForging Hammer\nHoly Symbol\nBlackmoor\nEndgame Map Key\nRandomize Stone\nOre Shard\nUnique Stone\n碎裂甜酸石\nElixir\nAncient Decipherer",
          '+(150 to 200)% Enhanced Damage\n+1 to All Skills\nCold Resist +5%\n5% Faster Cast Rate\n5% Chance to Cast Level 20 Fire Ball on Striking',
        ],
      ],
    },
  ],
};

const pageWithManyTables: GuidePage = {
  ...pageWithoutHeadings,
  blocks: Array.from({ length: 10 }, (_, index) => ({
    id: `table-${String(index + 1)}`,
    kind: 'table',
    caption: `Extra Table ${String(index + 1)}`,
    headers: ['Input', 'Output'],
    rows: [[`Input ${String(index + 1)}`, `Output ${String(index + 1)}`]],
  })),
};

const endgameMapPage: GuidePage = {
  ...pageWithoutHeadings,
  id: 'endgameMaps',
  group: 'features',
  label: 'Endgame Maps',
  title: '终局地图机制',
  sourcePath: 'EndMap.html',
  sourceUrl: 'https://d2r.dpdns.org/EndMap.html',
  blocks: [
    {
      id: 'intro',
      kind: 'paragraph',
      text: 'Warning: endgame map zones are much more difficult than all other content. You can enter endgame map zones by transmuting map items in Act 5 Hell.',
    },
    {
      id: 'boss-title',
      kind: 'heading',
      level: 2,
      text: 'Endgame Bosses',
    },
    {
      id: 'lucion',
      kind: 'heading',
      level: 3,
      text: 'Lucion Whisper - Pit of Anguish',
    },
    {
      id: 'lucion-image',
      kind: 'image',
      src: 'img/map-bosses/lucionwhisper.png',
      alt: 'Lucion Whisper',
    },
    {
      id: 'lucion-lore',
      kind: 'paragraph',
      text: 'Eternal Flame - Lucion can summon flames that deal very high fire damage. Reward: Orb of Anointment (5% chance on average). Tier 2 Map (25% chance on average). Random Pandemonium Key (25% chance each on average). Note: Tier 1-4 bosses have an Immunity Shield that falls off from time to time.',
    },
    {
      id: 'hellhound',
      kind: 'heading',
      level: 3,
      text: "Diablo's Hellhound - Chaos Rift",
    },
    {
      id: 'hellhound-lore',
      kind: 'paragraph',
      text: 'Frenzy - The boss gains 20% attack speed. Reward: Worldstone Shard (100% chance on average).',
    },
  ],
};

describe('GuidePageContent layout', () => {
  it('does not reserve the table-of-contents column when the page has no headings', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={pageWithoutHeadings} />);

    expect(html).not.toContain('xl:grid-cols-[minmax(0,1fr)_14rem]');
  });

  it('keeps the table-of-contents column when headings exist', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={pageWithHeadings} />);

    expect(html).toContain('xl:grid-cols-[minmax(0,1fr)_14rem]');
  });

  it('labels supplemental guide pages as guide material in the content header', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={communityPage} />);

    expect(html).toContain('攻略资料');
    expect(html).not.toContain('机制说明');
  });

  it('renders single-value recipe section rows across the full table width', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={pageWithTableSectionRows} />);

    expect(html).toContain('colSpan="2"');
    expect(html).toContain('标准重置');
  });

  it('renders detailed table section rows as a compact note instead of one paragraph per source line', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={pageWithDetailedTableSectionRow} />);

    expect(html).toContain('暗金重置');
    expect(html).toContain('Base upgraded uniques cannot be rerolled. Items that had sockets added before reroll will lose their sockets.');
    expect(html).not.toContain('Base upgraded uniques cannot be rerolled.</p><p');
  });

  it('renders table notes as compact prose instead of one paragraph per source line', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={pageWithTableNotes} />);

    expect(html).toContain('说明：');
    expect(html).toContain('First source line second source line');
    expect(html).not.toContain('First source line</p><p');
  });

  it('renders multiple table notes as one compact explanation above the table', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={pageWithMultipleTableNotes} />);

    expect(html).toContain('First source line second source line Third source line');
    expect(html).not.toContain('second source line</p><p');
  });

  it('adds semantic color markers to material requirements and affix lines', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={pageWithHighlightedCellLines} />);

    expect(html).toContain('data-guide-line-kind="material"');
    expect(html).toContain('data-guide-line-kind="affix"');
    expect(html).toContain('data-guide-material-kind="rune"');
    expect(html).toContain('data-guide-material-kind="gem"');
    expect(html).toContain('data-guide-material-kind="corruption"');
    expect(html).toContain('data-guide-material-kind="organ"');
    expect(html).toContain('data-guide-material-kind="dstone"');
    expect(html).toContain('data-guide-material-kind="forging"');
    expect(html).toContain('data-guide-material-kind="aura"');
    expect(html).toContain('data-guide-material-kind="socket"');
    expect(html).toContain('data-guide-material-kind="map"');
    expect(html).toContain('data-guide-material-kind="cube"');
    expect(html).toContain('data-guide-material-kind="consumable"');
    expect(html).toContain('data-guide-material-kind="currency"');
    expect(html).toContain('世界石碎片');
    expect(html).toMatch(/data-guide-material-kind="dstone"[^>]*>龙石<\/span>/u);
    expect(html).toMatch(/data-guide-material-kind="aura"[^>]*>绿色光环石<\/span>/u);
    expect(html).toMatch(/data-guide-material-kind="aura"[^>]*>黑色光环石<\/span>/u);
    expect(html).toMatch(/data-guide-material-kind="socket"[^>]*>镶孔甜甜圈<\/span>/u);
    expect(html).toMatch(/data-guide-material-kind="forging"[^>]*>锻造锤<\/span>/u);
    expect(html).toMatch(/data-guide-material-kind="forging"[^>]*>神圣符号<\/span>/u);
    expect(html).toMatch(/data-guide-material-kind="forging"[^>]*>黑沼<\/span>/u);
    expect(html).toMatch(/data-guide-material-kind="map"[^>]*>终局地图钥匙<\/span>/u);
    expect(html).toMatch(/data-guide-material-kind="cube"[^>]*>随机化之石<\/span>/u);
    expect(html).toMatch(/data-guide-material-kind="cube"[^>]*>矿石碎片<\/span>/u);
    expect(html).toMatch(/data-guide-material-kind="cube"[^>]*>暗金石头<\/span>/u);
    expect(html).toMatch(/data-guide-material-kind="gem"[^>]*>碎裂甜酸石<\/span>/u);
    expect(html).toContain('data-guide-affix-kind="damageAffix"');
    expect(html).toContain('data-guide-affix-kind="skillAffix"');
    expect(html).toContain('data-guide-affix-kind="resistAffix"');
    expect(html).toContain('data-guide-affix-kind="speedAffix"');
    expect(html).toContain('data-guide-affix-kind="triggerAffix"');
    expect(html).toContain('+(150 to 200)% 增强伤害');
    expect(html).toContain('+1 所有技能等级');
  });

  it('renders favorite controls for concrete guide table rows when row favorite props are provided', () => {
    const favoriteId = 'Rings/Amulets::3-magic-rings';
    const html = renderToStaticMarkup(
      <GuidePageContent
        page={pageWithTableSectionRows}
        favoriteRowIds={[favoriteId]}
        getRowFavoriteId={() => favoriteId}
        onToggleFavoriteRow={() => {}}
      />
    );

    expect(html).toContain('aria-label="取消收藏公式行"');
    expect(html).toContain('data-guide-row-favorite="true"');
  });

  it('renders long guide pages progressively by table count', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={pageWithManyTables} />);

    expect(html).toContain('10 张表格');
    expect(html).toContain('Extra Table 1');
    expect(html).toContain('Extra Table 8');
    expect(html).not.toContain('Extra Table 9');
    expect(html).toContain('已显示 8 / 10 张表格');
    expect(html).toContain('显示更多表格');
  });

  it('renders the endgame map mechanism page as a curated briefing and boss layout', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={endgameMapPage} />);

    expect(html).toContain('data-endgame-map-layout="true"');
    expect(html).toContain('战前简报');
    expect(html).toContain('终局首领');
    expect(html).toContain('data-endgame-boss-card="true"');
    expect(html).toContain('卢西昂之影 - 痛苦地窖');
    expect(html).toContain('永恒烈焰');
  });

  it('renders endgame boss images as cropped top banners', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={endgameMapPage} />);

    expect(html).toContain('data-endgame-boss-banner="true"');
    expect(html).toContain('lucionwhisper.webp');
    expect(html).not.toContain('img/map-bosses/lucionwhisper.png');
    expect(html).toContain('object-cover');
    expect(html).not.toContain('object-contain');
    expect(html).not.toContain('lg:grid-cols-[18rem_minmax(0,1fr)]');
  });

  it('highlights endgame map rewards, notes, values, and exposes a reward filter', () => {
    const html = renderToStaticMarkup(<GuidePageContent page={endgameMapPage} />);

    expect(html).toContain('data-endgame-reward-filter="true"');
    expect(html).toContain('奖励筛选');
    expect(html).toContain('data-endgame-reward-chip="true"');
    expect(html).toContain('涂抹之球');
    expect(html).toContain('2 阶地图');
    expect(html).toContain('随机混沌钥匙');
    expect(html).toContain('世界石碎片');
    expect(html).toContain('data-endgame-reward-section="true"');
    expect(html).toContain('data-endgame-reward-item="true"');
    expect(html).toContain('data-endgame-value="true"');
    expect(html).toContain('data-endgame-note="true"');
    expect(html).toContain('注意');
  });
});
