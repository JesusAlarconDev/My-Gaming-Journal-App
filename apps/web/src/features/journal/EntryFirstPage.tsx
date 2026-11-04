import { CoverPlaceholder } from '@/components/ui/CoverPlaceholder';
import { captureSlots } from '@/lib/book';
import { cx } from '@/lib/cx';
import { useT } from '@/lib/i18n';
import type { JournalItem } from '@/lib/library';
import { CaptureFrame } from './CaptureFrame';
import { HandDrawnStars } from './HandDrawnStars';

/**
 * First page of an entry: game name, cover, three captures, rating and the player's own text.
 * The page scrolls on its own when the content does not fit, and can be focused to do so by keyboard.
 */
export function EntryFirstPage({ item, className }: { item: JournalItem; className?: string }) {
  const t = useT();
  const { game, entry } = item;

  return (
    <section
      aria-label={t('book.firstPage', { title: game.title })}
      // Scrollable regions must be focusable so keyboard users can reach the overflowing text.
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      className={cx(
        'book-page book-page--first h-full space-y-4 overflow-y-auto p-5 md:p-7',
        className,
      )}
    >
      <h2 className="font-display text-2xl leading-snug text-balance break-words">{game.title}</h2>

      <div className="flex items-end gap-4">
        <div className="aspect-3/4 w-24 shrink-0 overflow-hidden rounded-sm bg-cream shadow-paper sm:w-28">
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
        <HandDrawnStars value={entry.rating} className="min-w-0 flex-1" />
      </div>

      <div role="group" aria-label={t('book.captures')} className="grid grid-cols-3 gap-2 sm:gap-3">
        {captureSlots(entry.images).map((src, index) => (
          <CaptureFrame key={index} n={index + 1} gameTitle={game.title} src={src} />
        ))}
      </div>

      {entry.review ? (
        <p className="break-words whitespace-pre-line">{entry.review}</p>
      ) : (
        <p className="text-cocoa-soft italic">{t('journal.noReview')}</p>
      )}
    </section>
  );
}
