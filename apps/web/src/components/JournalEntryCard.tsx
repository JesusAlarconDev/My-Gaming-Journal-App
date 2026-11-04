import { Card } from '@/components/ui/Card';
import { CoverPlaceholder } from '@/components/ui/CoverPlaceholder';
import { RatingStars } from '@/components/ui/RatingStars';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cx } from '@/lib/cx';
import { formatDate, formatPlaytime } from '@/lib/format';
import { useT } from '@/lib/i18n';
import type { JournalItem } from '@/lib/library';

/** Read-only summary of a journal entry. Long titles and reviews are clamped visually. */
export function JournalEntryCard({
  item,
  titleAs: Title = 'h2',
}: {
  item: JournalItem;
  titleAs?: 'h2' | 'h3';
}) {
  const t = useT();
  const { game, entry } = item;

  return (
    <article>
      <Card className="flex gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-sm bg-cream">
          {game.coverUrl ? (
            <img
              src={game.coverUrl}
              alt={t('game.coverAlt', { title: game.title })}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <CoverPlaceholder title={game.title} />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Title className="line-clamp-2 min-w-0 font-display text-xl leading-snug">
              {game.title}
            </Title>
            <StatusBadge status={entry.status} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-cocoa-soft">
            <RatingStars value={entry.rating} />
            <span>{t('journal.loggedOn', { date: formatDate(entry.loggedAt) })}</span>
            {entry.playtimeMinutes !== undefined && (
              <span>{t('journal.playtime', { time: formatPlaytime(entry.playtimeMinutes) })}</span>
            )}
          </div>
          <p className={cx(entry.review ? 'line-clamp-3' : 'text-cocoa-soft italic')}>
            {entry.review ?? t('journal.noReview')}
          </p>
          <AspectList label={t('journal.liked')} aspects={entry.likedAspects} />
          <AspectList label={t('journal.disliked')} aspects={entry.dislikedAspects} />
        </div>
      </Card>
    </article>
  );
}

function AspectList({ label, aspects }: { label: string; aspects: string[] }) {
  if (aspects.length === 0) return null;
  return (
    <p className="text-sm">
      <span className="font-semibold">{label}</span> {aspects.join(', ')}
    </p>
  );
}
