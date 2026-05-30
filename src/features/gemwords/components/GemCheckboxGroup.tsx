import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from '@/components/ui/checkbox';
import { useGemGroups } from '../hooks/useGemGroups';
import { toggleGem, toggleGemGroup, selectSelectedGems } from '../store/gemwordsSlice';
import { translateGameText } from '@/core/i18n';
import type { GemGroup } from '../types';

type GroupState = 'all' | 'some' | 'none';

function getGroupState(gemNames: readonly string[], selectedGems: Record<string, boolean>): GroupState {
  const selectedCount = gemNames.filter((gem) => selectedGems[gem] ?? true).length;
  if (selectedCount === 0) return 'none';
  if (selectedCount === gemNames.length) return 'all';
  return 'some';
}

interface GemGroupSectionProps {
  readonly group: GemGroup;
}

function GemGroupSection({ group }: GemGroupSectionProps) {
  const dispatch = useDispatch();
  const selectedGems = useSelector(selectSelectedGems);
  const gemNames = group.gems.map((gem) => gem.name);
  const groupState = getGroupState(gemNames, selectedGems);

  const handleGroupToggle = () => {
    dispatch(toggleGemGroup({ gems: gemNames, selected: groupState !== 'all' }));
  };

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <label className="flex items-center gap-1.5 cursor-pointer shrink-0 md:min-w-24">
        <Checkbox
          checked={groupState === 'all' ? true : groupState === 'some' ? 'indeterminate' : false}
          onCheckedChange={handleGroupToggle}
        />
        <span className="font-medium text-sm text-muted-foreground">{translateGameText(group.type)}:</span>
      </label>

      {group.gems.map((gem) => (
        <label key={gem.name} className="flex items-center gap-1 cursor-pointer md:min-w-24">
          <Checkbox
            checked={selectedGems[gem.name] ?? true}
            onCheckedChange={() => {
              dispatch(toggleGem(gem.name));
            }}
          />
          <span className="text-sm">{translateGameText(gem.name)}</span>
        </label>
      ))}
    </div>
  );
}

export function GemCheckboxGroup() {
  const gemGroups = useGemGroups();

  if (!gemGroups) return null;

  return (
    <div className="space-y-1.5">
      {gemGroups.map((group) => (
        <GemGroupSection key={group.type} group={group} />
      ))}
    </div>
  );
}
