import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/core/layouts/AppLayout';
import { SocketablesScreen } from '@/features/socketables';
import { RunewordsScreen } from '@/features/runewords';
import { GemwordsScreen } from '@/features/gemwords';
import { HtmUniqueItemsScreen } from '@/features/htm-unique-items';
import { MythicalUniquesScreen } from '@/features/mythical-uniques';
import { AscendanciesScreen } from '@/features/ascendancies';
import { VesselOfSoulsScreen } from '@/features/vessel-of-souls';
import { DatabaseScreen } from '@/features/database';
import { LootFilterScreen } from '@/features/loot-filter';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { index: true, element: <RunewordsScreen /> },
        { path: 'gemwords', element: <GemwordsScreen /> },
        { path: 'socketables', element: <SocketablesScreen /> },
        { path: 'uniques', element: <HtmUniqueItemsScreen /> },
        { path: 'mythicals', element: <MythicalUniquesScreen /> },
        { path: 'ascendancies', element: <AscendanciesScreen /> },
        { path: 'vessel-of-souls', element: <VesselOfSoulsScreen /> },
        { path: 'loot-filter', element: <LootFilterScreen /> },
        { path: 'database', element: <DatabaseScreen /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
