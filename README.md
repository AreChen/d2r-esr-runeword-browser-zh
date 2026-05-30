# D2R ESR 浏览器中文化版

这是 Diablo 2 Resurrected [Eastern Sun Resurrected](https://github.com/CelestialRayOne/Eastern_Sun_Resurrected) MOD 的资料查询页面中文化分支。

上游项目：[istvan-panczel/d2r-esr-runeword-browser](https://github.com/istvan-panczel/d2r-esr-runeword-browser)

在线页面：[https://arechen.github.io/d2r-esr-runeword-browser-zh/](https://arechen.github.io/d2r-esr-runeword-browser-zh/)

## 当前内容

- 符文之语：按属性、孔数、底材、符文、需求等级、Tier 点数等条件筛选。
- 镶嵌物：查询宝石、ESR/LoD/汉字符文、结晶及其加成。
- 暗金物品：查询武器、护甲、首饰等暗金物品，支持类别筛选。
- 神话暗金：查询神话暗金物品、特殊属性和说明文本。
- 升华：查询升华加成、说明和公式文本。
- 资料库：整理官方 Base Information / Features 子页面，包括护甲、武器、前后缀、套装、地图、腐化、涂油、终局地图、灵魂容器、击杀账本、佣兵/Oskill、武器精通等资料。
- 搜索支持中文/英文关键词和精确短语。

## 中文化说明

- 页面 UI、筛选项、物品名、技能名、词缀、神话暗金说明、升华说明已中文化。
- 资料库页面优先复用 MOD 字符串和现有词缀翻译，并对官方机制说明补充中文规则。
- 符文名称保持英文，例如 `El Rune`、`Yu Rune`，不改成中文名。
- 翻译优先参考本地 MOD 字符串：

```text
H:\D2RLAN\D2R\Mods\EasternSunLAN\EasternSunLAN.mpq\data\local\lng\strings
```

- 词典由 `scripts/generate-zh-translations.js` 生成到 `src/core/i18n/generated/zhCN.ts`。
- 如果本地 MOD 路径不同，可以用 `D2R_ESR_STRINGS_DIR` 指定字符串目录。
- 对 MOD 原始字符串的中文修正会同步补到 `zhCN` / `zhTW` 字段。
- 修改 MOD 字符串前的备份统一放到：

```text
H:\D2RLAN\D2R\Mods\EasternSunLAN\localization-work\backups
```

不要把 `*.bak-codex-*` 这类备份文件留在 MOD 的 `strings` 目录里。

## 开发

```bash
npm install
npm run dev
```

## 翻译生成

```bash
npm run translations:generate
```

指定自定义 MOD 字符串目录：

```bash
D2R_ESR_STRINGS_DIR="H:\path\to\strings" npm run translations:generate
```

PowerShell:

```powershell
$env:D2R_ESR_STRINGS_DIR = 'H:\path\to\strings'
npm run translations:generate
```

## 测试和构建

```bash
npm run test:fixtures
npm run lint
npm test
npm run build
```

`npm run test:fixtures` 只需要在首次检出或测试夹具需要刷新时运行。

## 部署

推送到 `master` 后，通过 GitHub Actions 的 `Deploy to GitHub Pages` workflow 发布到：

[https://arechen.github.io/d2r-esr-runeword-browser-zh/](https://arechen.github.io/d2r-esr-runeword-browser-zh/)

## 文档

更多项目结构和技术说明见 [docs/README.md](./docs/README.md)。

## License

MIT
