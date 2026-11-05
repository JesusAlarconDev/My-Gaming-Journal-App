import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useBookLayout } from '@/hooks/useBookLayout';
import {
  START_POSITION,
  announcementLabel,
  clampPosition,
  nextPosition,
  previousPosition,
  type BookLayout,
  type BookPosition,
} from '@/lib/book';
import { useT } from '@/lib/i18n';
import type { JournalItem } from '@/lib/library';
import { BlankSpread } from './BlankSpread';
import { BookCover } from './BookCover';
import { BookControls } from './BookControls';
import { BookIconButton } from './BookIconButton';
import { BookSpread } from './BookSpread';

interface JournalBookProps {
  /** Entries newest first, already joined with their game. */
  items: JournalItem[];
  /** Forces the layout instead of measuring the container; meant for tests. */
  layout?: BookLayout;
  /** Forces the narrow-book mode; meant for tests. */
  compactCaptures?: boolean;
}

/**
 * The journal as a book: it always starts closed, opens on the first entry and can be closed again.
 * Focus goes to the entry when the book opens and back to the cover when it closes; it stays on the
 * pressed button when turning pages, and each change is announced through a polite live region.
 */
export function JournalBook({
  items,
  layout: forcedLayout,
  compactCaptures: forcedCompact,
}: JournalBookProps) {
  const t = useT();
  const [containerRef, measuredLayout, measuredCompact] = useBookLayout<HTMLDivElement>();
  const layout = forcedLayout ?? measuredLayout;
  const compactCaptures = forcedCompact ?? measuredCompact;

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<BookPosition>(START_POSITION);
  const coverRef = useRef<HTMLButtonElement>(null);
  const entryRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (open) entryRef.current?.focus();
    else if (wasOpen.current) coverRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  const current = clampPosition(position, items.length);
  const item = items[current.entryIndex];

  const openBook = () => {
    setPosition(START_POSITION);
    setAnnouncement('');
    setOpen(true);
  };

  const goTo = (target: BookPosition) => {
    if (target === current) return; // Already at the end: nothing to turn.
    setPosition(target);
    const entry = items[target.entryIndex];
    if (entry) {
      setAnnouncement(announcementLabel(target, layout, items.length, entry.game.title));
    }
  };
  const goNext = () => goTo(nextPosition(current, layout, items.length));
  const goPrevious = () => goTo(previousPosition(current, layout, items.length));

  // Arrow keys turn the pages anywhere inside the open book. A native listener is used because the
  // book is a group, not an interactive element, and Alt+Arrow (browser history) must be left alone.
  useEffect(() => {
    const element = bookRef.current;
    if (!open || !element) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.shiftKey) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrevious();
      }
    };
    element.addEventListener('keydown', onKeyDown);
    return () => element.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div ref={containerRef}>
      {open ? (
        <div ref={bookRef}>
          <div className="relative">
            <div
              ref={entryRef}
              tabIndex={-1}
              role="group"
              aria-label={
                item
                  ? announcementLabel(current, layout, items.length, item.game.title)
                  : t('book.label')
              }
            >
              {item ? (
                <BookSpread
                  item={item}
                  position={current}
                  layout={layout}
                  compactCaptures={compactCaptures}
                />
              ) : (
                <BlankSpread layout={layout} />
              )}
            </div>
            <BookIconButton
              label={t('book.close')}
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-10"
            >
              <X aria-hidden="true" size={22} strokeWidth={2.5} />
            </BookIconButton>
          </div>
          <BookControls
            position={current}
            layout={layout}
            total={items.length}
            onPrevious={goPrevious}
            onNext={goNext}
          />
          <p aria-live="polite" className="sr-only">
            {announcement}
          </p>
        </div>
      ) : (
        <BookCover ref={coverRef} onOpen={openBook} />
      )}
    </div>
  );
}
