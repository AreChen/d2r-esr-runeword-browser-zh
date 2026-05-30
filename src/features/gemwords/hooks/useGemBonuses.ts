import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/db';
import type { SocketableBonuses } from '@/core/db/models';

export interface AggregatedGemBonuses {
  readonly weaponsGloves: readonly string[];
  readonly helmsBoots: readonly string[];
  readonly armorShieldsBelts: readonly string[];
}

export function useGemBonuses(gems: readonly string[]): AggregatedGemBonuses | undefined {
  return useLiveQuery(async () => {
    const weaponsGloves: string[] = [];
    const helmsBoots: string[] = [];
    const armorShieldsBelts: string[] = [];

    const pushBonuses = (bonuses: SocketableBonuses): void => {
      for (const affix of bonuses.weaponsGloves) {
        weaponsGloves.push(affix.rawText);
      }
      for (const affix of bonuses.helmsBoots) {
        helmsBoots.push(affix.rawText);
      }
      for (const affix of bonuses.armorShieldsBelts) {
        armorShieldsBelts.push(affix.rawText);
      }
    };

    for (const gemName of gems) {
      const gem = await db.gems.get(gemName);
      if (gem) {
        pushBonuses(gem.bonuses);
      }
    }

    return { weaponsGloves, helmsBoots, armorShieldsBelts };
  }, [gems]);
}
