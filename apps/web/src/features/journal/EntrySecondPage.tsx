import { StatusBadge } from '@/components/ui/StatusBadge';
import { cx } from '@/lib/cx';
import { useT } from '@/lib/i18n';
import type { JournalItem } from '@/lib/library';
import { CategoryRatings } from './CategoryRatings';

function TextSection({ title, text }: { title: string; text?: string }) {
  const t = useT();
  return (
    <section className="space-y-1">
      <h3 className="font-display text-lg">{title}</h3>
      {text ? (
        <p className="break-words whitespace-pre-line">{text}</p>
      ) : (
        <p className="text-cocoa-soft italic">{t('book.emptyText')}</p>
      )}
    </section>
  );
}

/**
 * Second page of an entry: what was liked and disliked, category ratings, suggested games and status.
 * Like the first page, it scrolls on its own when the content does not fit.
 */
export function EntrySecondPage({
  item,
  showTitle = false,
  className,
}: {
  item: JournalItem;
  /** Prints the game name as a running head, for when the first page is not on screen. */
  showTitle?: boolean;
  className?: string;
}) {
  const t = useT();
  const { game, entry } = item;
  const suggestions = entry.suggestedGames ?? [];

  return (
    <section
      aria-label={t('book.secondPage', { title: game.title })}
      // Scrollable regions must be focusable so keyboard users can reach the overflowing text.
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      className={cx(
        'book-page book-page--second h-full space-y-5 overflow-y-auto p-5 md:p-7',
        className,
      )}
    >
      {showTitle && (
        <p className="font-display pr-12 text-sm break-words text-cocoa-soft">{game.title}</p>
      )}
      <div>
        <StatusBadge status={entry.status} />
      </div>

      <TextSection title={t('book.liked')} text={entry.likedText} />
      <TextSection title={t('book.disliked')} text={entry.dislikedText} />

      <section className="space-y-2">
        <h3 className="font-display text-lg">{t('book.ratings')}</h3>
        <CategoryRatings ratings={entry.categoryRatings} />
      </section>

      {suggestions.length > 0 && (
        <section className="space-y-1">
          <h3 className="font-display text-lg">{t('book.suggestions')}</h3>
          <ul className="list-inside list-disc">
            {suggestions.map((title) => (
              <li key={title} className="break-words">
                {title}
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
