import { Image } from 'lucide-react';
import { cx } from '@/lib/cx';
import { useT } from '@/lib/i18n';

const TILTS = ['motion-safe:-rotate-2', 'motion-safe:rotate-1', 'motion-safe:-rotate-1'] as const;

interface CaptureFrameProps {
  /** Position among the captures, starting at 1. */
  n: number;
  gameTitle: string;
  /** Screenshot URL; without it the frame shows a decorative placeholder. */
  src?: string;
  className?: string;
}

/** Polaroid-style frame for a screenshot. An empty frame is decorative and hidden from assistive tech. */
export function CaptureFrame({ n, gameTitle, src, className }: CaptureFrameProps) {
  const t = useT();
  return (
    <div
      className={cx(
        'rounded-sm bg-paper p-1.5 pb-4 shadow-paper ring-1 ring-cocoa/5',
        TILTS[(n - 1) % TILTS.length],
        className,
      )}
    >
      <div className="aspect-4/3 overflow-hidden bg-cream">
        {src ? (
          <img
            src={src}
            alt={t('book.captureAlt', { n, title: gameTitle })}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center bg-sage/30 text-sage-deep"
          >
            <Image size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
