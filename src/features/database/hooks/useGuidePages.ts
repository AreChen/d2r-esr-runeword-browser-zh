import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/db';
import type { GuidePage } from '@/core/db';

export function useGuidePages(): readonly GuidePage[] | undefined {
  return useLiveQuery(() => db.guidePages.orderBy('order').toArray());
}
