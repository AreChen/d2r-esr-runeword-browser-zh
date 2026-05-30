export { fetchGemsHtml } from './gemsApi';
export { fetchGemwordsHtml } from './gemwordsApi';
export { fetchRunewordsHtml } from './runewordsApi';
export { fetchUniqueWeaponsHtml, fetchUniqueArmorsHtml, fetchUniqueOthersHtml } from './htmUniqueItemsApi';
export { fetchUniqueMythicalsHtml } from './mythicalUniquesApi';
export { fetchAscendanciesHtml } from './ascendanciesApi';
export { fetchAdditionalGuidePageHtmls, type FetchedGuidePageHtml } from './guidePagesApi';
export { fetchLatestVersion, type ChangelogVersion } from './changelogApi';
export { REMOTE_URLS, ESR_BASE_URL } from './remoteConfig';
export {
  CORE_GUIDE_PAGE_IDS,
  GUIDE_PAGE_CATALOG,
  getGuidePageEntry,
  getGuidePageSourceUrl,
  type GuidePageCatalogEntry,
} from './guidePageCatalog';
