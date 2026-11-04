import { Star } from 'lucide-react';
import type { Rating } from '@game-journal/contracts';
import { cx } from '@/lib/cx';
import { useT } from '@/lib/i18n';

const STARS = [1, 2, 3, 4, 5] as const;

/** Read-only rating. A missing rating renders empty stars with a "no rating" label. */
export function RatingStars({ value, className }: { value?: Rating; className?: string }) {
  const t = useT();
  const label = value ? t('rating.label', { value }) : t('rating.none');

  return (
    <span role="img" aria-label={label} className={cx('inline-flex gap-0.5', className)}>
      {STARS.map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          size={16}
          className={n <= (value ?? 0) ? 'fill-orange-deep text-orange-deep' : 'text-cocoa/30'}
        />
      ))}
    </span>
  );
}
