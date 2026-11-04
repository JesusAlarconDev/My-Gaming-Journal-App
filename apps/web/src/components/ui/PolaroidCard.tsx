import type { GameStatus, Rating } from '@game-journal/contracts';
import { cx } from '@/lib/cx';
import { useT } from '@/lib/i18n';
import { CoverPlaceholder } from './CoverPlaceholder';
import { RatingStars } from './RatingStars';
import { StatusBadge } from './StatusBadge';

export type Tilt = -2 | -1 | 0 | 1 | 2;

const tilts: Record<Tilt, string> = {
  [-2]: 'motion-safe:-rotate-2',
  [-1]: 'motion-safe:-rotate-1',
  0: '',
  1: 'motion-safe:rotate-1',
  2: 'motion-safe:rotate-2',
};

interface PolaroidCardProps {
  title: string;
  coverUrl?: string;
  subtitle?: string;
  status?: GameStatus;
  rating?: Rating;
  tilt?: Tilt;
  titleAs?: 'h2' | 'h3' | 'h4';
  className?: string;
}

/** Photo-style card for a game. Purely presentational: it receives plain values, never mock data. */
export function PolaroidCard({
  title,
  coverUrl,
  subtitle,
  status,
  rating,
  tilt = 0,
  titleAs: Title = 'h3',
  className,
}: PolaroidCardProps) {
  const t = useT();
  return (
    <article
      className={cx(
        'rounded-sm bg-paper p-3 pb-4 shadow-paper ring-1 ring-cocoa/5 transition-transform duration-200 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-paper-lift',
        tilts[tilt],
        className,
      )}
    >
      <div className="aspect-square overflow-hidden bg-cream">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={t('game.coverAlt', { title })}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <CoverPlaceholder title={title} />
        )}
      </div>
      <div className="mt-3 space-y-1.5 px-1">
        <Title className="line-clamp-2 font-display text-lg leading-snug">{title}</Title>
        {subtitle && <p className="truncate text-sm text-cocoa-soft">{subtitle}</p>}
        {(status || rating !== undefined) && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {status && <StatusBadge status={status} />}
            {rating !== undefined && <RatingStars value={rating} />}
          </div>
        )}
      </div>
    </article>
  );
}
