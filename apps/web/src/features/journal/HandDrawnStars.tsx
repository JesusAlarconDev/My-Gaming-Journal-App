import type { Rating } from '@game-journal/contracts';
import { starOffsets } from '@/lib/book';
import { cx } from '@/lib/cx';
import { useT } from '@/lib/i18n';

const STAR_COUNT = 5;
const SPACING = 28;
const CENTER_Y = 20;
const SCALE = 1.3;

/** Slightly irregular five-point star (about 10 units of radius) so it reads as drawn by hand. */
const STAR_PATH =
  'M0.2 -10.2 L2.6 -3.3 L9.7 -3 L4.1 1.5 L6 8.3 L0.1 4.4 L-5.7 8 L-4 1.2 L-9.6 -3.2 L-2.3 -3.5 Z';

/**
 * Read-only rating drawn as five stars zig-zagging up and down. Rated stars are gold and filled,
 * the rest are gray outlines, so the state never depends on color alone.
 */
export function HandDrawnStars({ value, className }: { value?: Rating; className?: string }) {
  const t = useT();
  const filledCount = value ?? 0;
  const label = value ? t('rating.label', { value }) : t('rating.none');

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${STAR_COUNT * SPACING} 40`}
      className={cx('h-9 w-auto', className)}
    >
      {starOffsets.slice(0, STAR_COUNT).map((offset, index) => {
        const filled = index < filledCount;
        return (
          <g
            key={index}
            data-star=""
            data-filled={filled}
            transform={`translate(${SPACING / 2 + index * SPACING} ${CENTER_Y + offset.y}) rotate(${offset.rotate}) scale(${SCALE})`}
          >
            <path
              d={STAR_PATH}
              strokeWidth={1.4}
              strokeLinejoin="round"
              strokeLinecap="round"
              className={filled ? 'fill-gold stroke-gold-deep' : 'fill-none stroke-star-gray'}
            />
          </g>
        );
      })}
    </svg>
  );
}
