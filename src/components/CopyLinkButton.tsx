import { useState } from 'react';
import { Link, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CopyLinkButtonProps {
  /** Optional function to generate a custom share URL. Falls back to window.location.href */
  getShareUrl?: () => string;
}

export function CopyLinkButton({ getShareUrl }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = getShareUrl ? getShareUrl() : window.location.href;
    navigator.clipboard.writeText(url).then(
      () => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      },
      (err: unknown) => {
        // Fallback for older browsers - silently fail
        console.error('Failed to copy link:', err);
      }
    );
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} aria-label={copied ? '链接已复制' : '复制链接到剪贴板'}>
      {copied ? (
        <>
          <Check className="size-4" />
          已复制
        </>
      ) : (
        <>
          <Link className="size-4" />
          复制链接
        </>
      )}
    </Button>
  );
}
