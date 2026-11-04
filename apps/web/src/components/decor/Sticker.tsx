import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

type Tone = 'sage' | 'rose' | 'orange' | 'blue';

const tones: Record<Tone, string> = {
  sage: 'bg-sage/40 text-sage-deep',
  rose: 'bg-rose/40 text-rose-deep',
  orange: 'bg-orange/30 text-orange-deep',
  blue: 'bg-blue/40 text-blue-deep',
};

/** Purely decorative sticker; hidden from assistive technology. */
export function Sticker({
  children,
  tone = 'orange',
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        'inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-paper shadow-paper motion-safe:-rotate-6',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
