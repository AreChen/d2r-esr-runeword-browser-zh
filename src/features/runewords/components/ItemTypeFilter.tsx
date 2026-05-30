import { useDispatch, useSelector } from 'react-redux';
import { Star } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { usePersistentState } from '@/core/hooks/usePersistentState';
import { cn } from '@/lib/utils';
import { useAvailableItemTypes } from '../hooks/useAvailableItemTypes';
import {
  toggleItemType,
  toggleItemTypeGroup,
  selectAllItemTypes,
  deselectAllItemTypes,
  selectSelectedItemTypes,
  setAllItemTypes,
} from '../store/runewordsSlice';
import { groupItemTypesByCategory, type GroupedItemTypes } from '../constants/itemTypeCategories';
import { translateGameText } from '@/core/i18n';

type GroupState = 'all' | 'some' | 'none';
const FAVORITE_ITEM_TYPES_STORAGE_KEY = 'd2r-esr.runewords.favoriteItemTypes.v1';

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

function toggleFavoriteItemType(itemType: string, favorites: readonly string[]): readonly string[] {
  if (favorites.includes(itemType)) return favorites.filter((favorite) => favorite !== itemType);
  return [...favorites, itemType];
}

function buildItemTypeSelection(itemTypes: readonly string[], enabledItemTypes: readonly string[]): Record<string, boolean> {
  const enabledSet = new Set(enabledItemTypes);
  const selection: Record<string, boolean> = {};
  for (const itemType of itemTypes) {
    selection[itemType] = enabledSet.has(itemType);
  }
  return selection;
}

function getGroupState(groupItemTypes: readonly string[], selectedItemTypes: Record<string, boolean>): GroupState {
  const selectedCount = groupItemTypes.filter((t) => selectedItemTypes[t] ?? true).length;
  if (selectedCount === 0) return 'none';
  if (selectedCount === groupItemTypes.length) return 'all';
  return 'some';
}

interface ItemGroupSectionProps {
  readonly group: GroupedItemTypes;
  readonly favoriteItemTypes: readonly string[];
  readonly onFavoriteItemTypesChange: (favoriteItemTypes: readonly string[]) => void;
}

function ItemGroupSection({ group, favoriteItemTypes, onFavoriteItemTypesChange }: ItemGroupSectionProps) {
  const dispatch = useDispatch();
  const selectedItemTypes = useSelector(selectSelectedItemTypes);

  const groupState = getGroupState(group.itemTypes, selectedItemTypes);

  const handleGroupToggle = () => {
    const newSelected = groupState !== 'all';
    dispatch(toggleItemTypeGroup({ itemTypes: group.itemTypes, selected: newSelected }));
  };

  return (
    <div className="grid grid-cols-1 items-start gap-x-3 gap-y-1 md:grid-cols-[8rem_1fr]">
      {/* Group header with 3-way checkbox */}
      <label className="flex h-7 cursor-pointer items-center gap-1.5 shrink-0">
        <Checkbox
          checked={groupState === 'all' ? true : groupState === 'some' ? 'indeterminate' : false}
          onCheckedChange={handleGroupToggle}
        />
        <span className="font-bold text-sm text-muted-foreground">{translateGameText(group.label)}:</span>
      </label>

      {/* Individual item type checkboxes */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {group.itemTypes.map((itemType) => {
          const favorite = favoriteItemTypes.includes(itemType);

          return (
            <span key={itemType} className="inline-flex h-7 items-center gap-1 rounded-md border border-transparent px-1">
              <label className="flex cursor-pointer items-center gap-1">
                <Checkbox
                  checked={selectedItemTypes[itemType] ?? true}
                  onCheckedChange={() => {
                    dispatch(toggleItemType(itemType));
                  }}
                />
                <span className="text-sm">{translateGameText(itemType)}</span>
              </label>
              <button
                type="button"
                className="grid size-5 place-items-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={favorite ? `取消常用部件 ${translateGameText(itemType)}` : `设为常用部件 ${translateGameText(itemType)}`}
                title={favorite ? '取消常用部件' : '设为常用部件'}
                onClick={() => {
                  onFavoriteItemTypesChange(toggleFavoriteItemType(itemType, favoriteItemTypes));
                }}
              >
                <Star className={cn('size-3.5', favorite && 'fill-amber-400 text-amber-500')} />
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function ItemTypeFilter() {
  const dispatch = useDispatch();
  const itemTypes = useAvailableItemTypes();
  const selectedItemTypes = useSelector(selectSelectedItemTypes);
  const [favoriteItemTypes, setFavoriteItemTypes] = usePersistentState<readonly string[]>(
    FAVORITE_ITEM_TYPES_STORAGE_KEY,
    [],
    isStringArray
  );

  if (!itemTypes || itemTypes.length === 0) return null;

  const allSelected = itemTypes.every((type) => selectedItemTypes[type]);
  const noneSelected = itemTypes.every((type) => !selectedItemTypes[type]);
  const groups = groupItemTypesByCategory(itemTypes);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm">物品类型:</span>
        <Button variant="outline" size="sm" onClick={() => dispatch(selectAllItemTypes())} disabled={allSelected}>
          全选
        </Button>
        <Button variant="outline" size="sm" onClick={() => dispatch(deselectAllItemTypes())} disabled={noneSelected}>
          全不选
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            dispatch(setAllItemTypes(buildItemTypeSelection(itemTypes, favoriteItemTypes)));
          }}
          disabled={favoriteItemTypes.length === 0}
        >
          <Star className={cn('size-4', favoriteItemTypes.length > 0 && 'fill-amber-400 text-amber-500')} />
          常用部件
        </Button>
      </div>
      <div className="space-y-1.5">
        {groups.map((group) => (
          <ItemGroupSection
            key={group.label}
            group={group}
            favoriteItemTypes={favoriteItemTypes}
            onFavoriteItemTypesChange={setFavoriteItemTypes}
          />
        ))}
      </div>
    </div>
  );
}
