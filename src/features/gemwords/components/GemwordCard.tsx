import { Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GemBadge } from '@/features/runewords/components/GemBadge';
import { useGemBonuses } from '../hooks/useGemBonuses';
import { getRelevantCategories, translateCategoryLabel, type BonusCategory } from '@/features/runewords/utils/itemCategoryMapping';
import { translateGameText } from '@/core/i18n';
import { cn } from '@/lib/utils';
import type { Gemword } from '@/core/db/models';

interface GemwordCardProps {
  readonly gemword: Gemword;
  readonly isFavorite?: boolean;
  readonly onToggleFavorite?: (gemword: Gemword) => void;
}

export function GemwordCard({ gemword, isFavorite = false, onToggleFavorite }: GemwordCardProps) {
  const { name, sockets, reqLevel, gems, allowedItems, affixes } = gemword;
  const gemBonuses = useGemBonuses(gems);
  const relevantCategories = getRelevantCategories(allowedItems);
  const columnAffixes = gemword.columnAffixes;

  const hasColumnDifferences = (() => {
    if (relevantCategories.length <= 1) return false;
    const firstColumn = columnAffixes[relevantCategories[0]];
    return relevantCategories.some((category) => {
      const column = columnAffixes[category];
      if (column.length !== firstColumn.length) return true;
      return column.some((affix, index) => affix.rawText !== firstColumn[index].rawText);
    });
  })();

  const getBonusesForCategory = (category: BonusCategory): readonly string[] => {
    if (!gemBonuses) return [];
    return gemBonuses[category];
  };

  const hasGemBonuses = gemBonuses && relevantCategories.some((category) => gemBonuses[category].length > 0);
  const translatedAllowedItems = allowedItems.map(translateGameText).join(', ');

  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="min-w-0 text-lg text-amber-700 dark:text-amber-400">{translateGameText(name)}</CardTitle>
          <div className="flex shrink-0 items-center gap-1">
            {onToggleFavorite && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-pressed={isFavorite}
                aria-label={isFavorite ? `取消收藏 ${translateGameText(name)}` : `收藏 ${translateGameText(name)}`}
                title={isFavorite ? '取消收藏' : '收藏'}
                onClick={() => {
                  onToggleFavorite(gemword);
                }}
              >
                <Star className={cn('size-4', isFavorite && 'fill-amber-400 text-amber-500')} />
              </Button>
            )}
            <Badge variant="secondary">{sockets} 孔</Badge>
            <Badge variant="outline">等级 {reqLevel}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1">
          {gems.map((gem, index) => (
            <GemBadge key={`${gem}-${String(index)}`} gemName={gem} />
          ))}
        </div>

        <div>
          <p className="font-medium text-muted-foreground mb-1">适用物品:</p>
          <p className="text-sm">{translatedAllowedItems}</p>
        </div>

        {affixes.length > 0 && (
          <div className="text-center">
            <p className="font-medium text-muted-foreground mb-1">宝石之语属性:</p>
            {hasColumnDifferences ? (
              <div className="grid grid-cols-2 gap-3 text-sm">
                {relevantCategories.map((category) => {
                  const column = columnAffixes[category];
                  if (column.length === 0) return null;
                  return (
                    <div key={category}>
                      <p className="font-medium text-muted-foreground text-xs mb-1">{translateCategoryLabel(allowedItems, category)}:</p>
                      <ul className="space-y-0.5 text-[#8080E6] text-xs">
                        {column.map((affix, index) => (
                          <li key={`${String(index)}-${affix.rawText}`}>{translateGameText(affix.rawText)}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            ) : (
              <ul className="space-y-0.5 text-[#8080E6]">
                {affixes.map((affix, index) => (
                  <li key={`${String(index)}-${affix.rawText}`}>{translateGameText(affix.rawText)}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {hasGemBonuses && (
          <div className="border-t pt-3">
            <p className="font-medium text-muted-foreground mb-2 text-center">宝石加成:</p>
            {relevantCategories.length === 1 ? (
              <ul className="space-y-0.5 text-[#8080E6] text-center">
                {getBonusesForCategory(relevantCategories[0]).map((bonus, index) => (
                  <li key={`${String(index)}-${bonus}`}>{translateGameText(bonus)}</li>
                ))}
              </ul>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-sm">
                {relevantCategories.map((category) => {
                  const bonuses = getBonusesForCategory(category);
                  if (bonuses.length === 0) return null;
                  return (
                    <div key={category}>
                      <p className="font-medium text-muted-foreground text-xs mb-1">{translateCategoryLabel(allowedItems, category)}:</p>
                      <ul className="space-y-0.5 text-[#8080E6] text-xs">
                        {bonuses.map((bonus, index) => (
                          <li key={`${String(index)}-${bonus}`}>{translateGameText(bonus)}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
