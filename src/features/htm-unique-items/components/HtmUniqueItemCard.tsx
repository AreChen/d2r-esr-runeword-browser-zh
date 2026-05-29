import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { translateGameText } from '@/core/i18n';
import type { HtmUniqueItem } from '@/core/db';

interface HtmUniqueItemCardProps {
  readonly item: HtmUniqueItem;
}

export function HtmUniqueItemCard({ item }: HtmUniqueItemCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg text-amber-700 dark:text-amber-400">{translateGameText(item.name)}</CardTitle>
          <div className="flex gap-1">
            <Badge variant="secondary">{translateGameText(item.category)}</Badge>
            <Badge variant="outline">等级 {item.reqLevel}</Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {translateGameText(item.baseItem)}
          {item.baseItemCode ? ` (${item.baseItemCode})` : ''}
        </p>
        {item.isAncientCoupon && <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">古代兑换券暗金</p>}
        {item.gambleItem && <p className="text-xs text-muted-foreground">赌博: {translateGameText(item.gambleItem)}</p>}
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Item level - temporarily hidden
        <div className="text-sm">
          <span className="text-muted-foreground">iLvl:</span> {item.itemLevel}
        </div>
        */}

        {/* Properties */}
        {item.properties.length > 0 && (
          <div className="text-center">
            <ul className="space-y-0.5 text-[#8080E6]">
              {item.properties.map((prop, idx) => (
                <li key={`${String(idx)}-${prop}`}>{translateGameText(prop)}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
