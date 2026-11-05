import type { BookLayout, BookPosition } from '@/lib/book';
import { cx } from '@/lib/cx';
import type { JournalItem } from '@/lib/library';
import { EntryFirstPage } from './EntryFirstPage';
import { EntrySecondPage } from './EntrySecondPage';

interface BookSpreadProps {
  item: JournalItem;
  position: BookPosition;
  layout: BookLayout;
  /** Shows the captures one at a time; true when the book is too narrow for three in a row. */
  compactCaptures?: boolean;
  className?: string;
}

/**
 * The open book. In `spread` both pages of the entry are visible; in `single` only the page the
 * position points to, with the game name as a running head on the second one.
 */
export function BookSpread({
  item,
  position,
  layout,
  compactCaptures = false,
  className,
}: BookSpreadProps) {
  const isSpread = layout === 'spread';

  return (
    <div className={cx('book-sheet', isSpread && 'book-sheet--spread', className)}>
      {isSpread ? (
        <>
          <EntryFirstPage key={item.entry.id} item={item} compactCaptures={compactCaptures} />
          <EntrySecondPage item={item} />
          <span aria-hidden="true" className="book-spine" />
        </>
      ) : position.side === 'first' ? (
        <EntryFirstPage key={item.entry.id} item={item} compactCaptures={compactCaptures} />
      ) : (
        <EntrySecondPage item={item} showTitle />
      )}
    </div>
  );
}
