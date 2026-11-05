import type { Rating } from '@game-journal/contracts';
import { starOffsets } from '@/lib/book';
import { cx } from '@/lib/cx';
import { useT } from '@/lib/i18n';

const STAR_COUNT = 5;
const SPACING = 32;
const CENTER_Y = 24;
const SCALE = 1.3;
/** Width of the white sticker border, drawn behind the fill so only its outer half shows. */
const BORDER = 5;

/** Slightly irregular five-point star (about 10 units of radius) so it reads as drawn by hand. */
const STAR_PATH =
  'M0.2 -10.2 L2.6 -3.3 L9.7 -3 L4.1 1.5 L6 8.3 L0.1 4.4 L-5.7 8 L-4 1.2 L-9.6 -3.2 L-2.3 -3.5 Z';

/**
 * Read-only rating drawn as five sticker-like stars zig-zagging up and down: solid fill with a
 * soft shadow. Rated stars are gold with a thick white border; the unrated ones are a flat, light
 * gray all over, border included. The state is also announced as text.
 */
export function HandDrawnStars({ value, className }: { value?: Rating; className?: string }) {
  const t = useT();
  const filledCount = value ?? 0;
  const label = value ? t('rating.label', { value }) : t('rating.none');

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${STAR_COUNT * SPACING} 48`}
      className={cx(
        'h-24 w-auto overflow-visible drop-shadow-[0_1.5px_1.5px_rgb(59_35_22/0.35)]',
        className,
      )}
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
              strokeWidth={BORDER / SCALE}
              strokeLinejoin="round"
              strokeLinecap="round"
              paintOrder="stroke"
              className={filled ? 'fill-gold stroke-white' : 'fill-star-off stroke-star-off'}
            />
          </g>
        );
      })}
    </svg>
  );
}
