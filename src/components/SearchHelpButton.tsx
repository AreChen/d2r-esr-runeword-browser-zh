import { HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface SearchExample {
  readonly query: string;
  readonly description: string;
}

interface SearchHelpButtonProps {
  readonly examples?: readonly SearchExample[];
}

const DEFAULT_EXAMPLES: readonly SearchExample[] = [
  { query: '生命 火焰', description: '同时包含“生命”和“火焰”的物品' },
  { query: '"最大生命"', description: '精确短语“最大生命”' },
  { query: '"击中时"', description: '精确短语' },
  { query: '"灵气" 法力', description: '短语和关键词组合' },
];

/**
 * A help button that shows search syntax explanation in a popover
 */
export function SearchHelpButton({ examples = DEFAULT_EXAMPLES }: SearchHelpButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="size-5 text-muted-foreground" aria-label="搜索帮助">
          <HelpCircle className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium mb-1">搜索方式</h4>
            <p className="text-sm text-muted-foreground">
              输入用空格分隔的关键词来筛选结果。只会显示匹配<strong>全部</strong>关键词的条目。
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-1">精确短语</h4>
            <p className="text-sm text-muted-foreground">
              使用 <code className="bg-muted px-1 rounded">"引号"</code> 搜索精确短语。
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-1">示例</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {examples.map((example) => (
                <li key={example.query}>
                  <code className="bg-muted px-1 rounded">{example.query}</code> - {example.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
