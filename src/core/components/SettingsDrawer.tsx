import { useSelector, useDispatch } from 'react-redux';
import { useLiveQuery } from 'dexie-react-hooks';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Spinner } from '@/components/ui/spinner';
import { db } from '@/core/db';
import {
  selectIsDrawerOpen,
  closeDrawer,
  setTheme,
  selectTheme,
  setTextSize,
  selectTextSize,
  setUseDiabloFont,
  selectUseDiabloFont,
  type TextSize,
} from '@/features/settings';
import { initDataLoad, selectIsLoading, selectNetworkWarning, selectIsUsingCachedData } from '@/core/store';
import appVersion from '@/assets/version.json';

const TEXT_SIZE_LABELS = ['小', '标准', '大', '特大'] as const;
const TEXT_SIZE_VALUES: TextSize[] = ['small', 'normal', 'large', 'extralarge'];

function formatLastUpdated(isoString: string | undefined): string {
  if (!isoString) return '从未';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '从未';
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

export function SettingsDrawer() {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsDrawerOpen);
  const theme = useSelector(selectTheme);
  const textSize = useSelector(selectTextSize);
  const useDiabloFont = useSelector(selectUseDiabloFont);
  const isLoading = useSelector(selectIsLoading);
  const networkWarning = useSelector(selectNetworkWarning);
  const isUsingCachedData = useSelector(selectIsUsingCachedData);
  const textSizeIndex = TEXT_SIZE_VALUES.indexOf(textSize);

  // Live query for metadata
  const version = useLiveQuery(async () => {
    const meta = await db.metadata.get('esrVersion');
    return meta?.value ?? '未知';
  });

  const lastUpdated = useLiveQuery(async () => {
    const meta = await db.metadata.get('lastUpdated');
    return formatLastUpdated(meta?.value);
  });

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    dispatch(setTheme(newTheme));
  };

  const handleTextSizeChange = (value: number[]) => {
    dispatch(setTextSize(TEXT_SIZE_VALUES[value[0]]));
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) dispatch(closeDrawer());
      }}
    >
      <SheetContent aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle>设置</SheetTitle>
        </SheetHeader>

        <div className="mt-0 space-y-5 flex-1 overflow-y-auto px-4 pb-2">
          {/* Network Warning */}
          {networkWarning ? (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
              <p className="text-sm text-yellow-500">{networkWarning}</p>
            </div>
          ) : null}

          {/* Theme Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">主题</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  checked={theme === 'dark'}
                  onChange={() => {
                    handleThemeChange('dark');
                  }}
                  className="accent-primary"
                />
                <span>深色（默认）</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  checked={theme === 'light'}
                  onChange={() => {
                    handleThemeChange('light');
                  }}
                  className="accent-primary"
                />
                <span>浅色</span>
              </label>
            </div>
          </div>

          {/* Font Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">字体</Label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useDiabloFont}
                onChange={(e) => {
                  dispatch(setUseDiabloFont(e.target.checked));
                }}
                className="accent-primary"
              />
              <span>使用暗黑 2 风格字体</span>
            </label>
          </div>

          {/* Text Size Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">文字大小</Label>
            <Slider value={[textSizeIndex]} onValueChange={handleTextSizeChange} min={0} max={3} step={1} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">{TEXT_SIZE_LABELS[textSizeIndex]}</p>
          </div>

          {/* Data Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">数据</Label>
            <Button onClick={() => dispatch(initDataLoad({ force: true }))} disabled={isLoading} className="w-full">
              {isLoading ? <Spinner className="mr-2" /> : null}
              {isLoading ? '正在刷新...' : '强制刷新数据'}
            </Button>
            <p className="text-xs text-muted-foreground">从 ESR 文档重新下载全部数据。</p>
          </div>

          {/* Info Section */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>应用版本: {appVersion.version}</p>
            <p>ESR 版本: {version}</p>
            <p>上次更新: {lastUpdated}</p>
            {isUsingCachedData ? <p className="text-yellow-500">正在使用缓存数据</p> : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
