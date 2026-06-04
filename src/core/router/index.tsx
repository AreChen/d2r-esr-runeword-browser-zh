import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/core/layouts/AppLayout';
import { Spinner } from '@/components/ui/spinner';
import { restoreGitHubPagesRedirect } from './githubPagesRedirect';

if (typeof window !== 'undefined') {
  restoreGitHubPagesRedirect(window, import.meta.env.BASE_URL);
}

const RunewordsScreen = lazy(async () => {
  const module = await import('@/features/runewords');
  return { default: module.RunewordsScreen };
});

const GemwordsScreen = lazy(async () => {
  const module = await import('@/features/gemwords');
  return { default: module.GemwordsScreen };
});

const SocketablesScreen = lazy(async () => {
  const module = await import('@/features/socketables');
  return { default: module.SocketablesScreen };
});

const HtmUniqueItemsScreen = lazy(async () => {
  const module = await import('@/features/htm-unique-items');
  return { default: module.HtmUniqueItemsScreen };
});

const MythicalUniquesScreen = lazy(async () => {
  const module = await import('@/features/mythical-uniques');
  return { default: module.MythicalUniquesScreen };
});

const AscendanciesScreen = lazy(async () => {
  const module = await import('@/features/ascendancies');
  return { default: module.AscendanciesScreen };
});

const VesselOfSoulsScreen = lazy(async () => {
  const module = await import('@/features/vessel-of-souls');
  return { default: module.VesselOfSoulsScreen };
});

const LootFilterScreen = lazy(async () => {
  const module = await import('@/features/loot-filter');
  return { default: module.LootFilterScreen };
});

const DatabaseScreen = lazy(async () => {
  const module = await import('@/features/database');
  return { default: module.DatabaseScreen };
});

const routeLoadingFallback = (
  <div className="flex min-h-80 flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
    <Spinner className="size-8" />
    <span>正在加载页面...</span>
  </div>
);

function routeElement(Screen: LazyExoticComponent<ComponentType>) {
  return (
    <Suspense fallback={routeLoadingFallback}>
      <Screen />
    </Suspense>
  );
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { index: true, element: routeElement(RunewordsScreen) },
        { path: 'gemwords', element: routeElement(GemwordsScreen) },
        { path: 'socketables', element: routeElement(SocketablesScreen) },
        { path: 'uniques', element: routeElement(HtmUniqueItemsScreen) },
        { path: 'mythicals', element: routeElement(MythicalUniquesScreen) },
        { path: 'ascendancies', element: routeElement(AscendanciesScreen) },
        { path: 'vessel-of-souls', element: routeElement(VesselOfSoulsScreen) },
        { path: 'loot-filter', element: routeElement(LootFilterScreen) },
        { path: 'database', element: routeElement(DatabaseScreen) },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
