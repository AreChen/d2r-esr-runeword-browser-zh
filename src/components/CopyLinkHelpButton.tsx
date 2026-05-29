import { HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

/**
 * A help button that explains what the shareable URL includes
 */
export function CopyLinkHelpButton() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="size-5 text-muted-foreground" aria-label="复制链接帮助">
          <HelpCircle className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="start">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium mb-1">可分享链接</h4>
            <p className="text-sm text-muted-foreground">生成的 URL 会包含当前筛选条件，其他人打开后可看到同样的结果。</p>
          </div>

          <div>
            <h4 className="font-medium mb-1">包含的筛选条件</h4>
            <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-4">
              <li>搜索文本</li>
              <li>孔数</li>
              <li>最高所需等级</li>
              <li>已选物品类型</li>
              <li>已选符文</li>
              <li>阶级点数上限</li>
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
