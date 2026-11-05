import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useBookLayout } from '@/hooks/useBookLayout';
import {
  START_POSITION,
  announcementLabel,
  clampPosition,
  type BookLayout,
  type BookPosition,
} from '@/lib/book';
import { useT } from '@/lib/i18n';
import type { JournalItem } from '@/lib/library';
import { BookCover } from './BookCover';
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
 * Focus goes to the entry when the book opens and back to the cover when it closes.
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
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) entryRef.current?.focus();
    else if (wasOpen.current) coverRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  const current = clampPosition(position, items.length);
  const item = items[current.entryIndex];

  const openBook = () => {
    setPosition(START_POSITION);
    setOpen(true);
  };

  return (
    <div ref={containerRef}>
      {open ? (
        <div className="relative">
          {item && (
            <div
              ref={entryRef}
              tabIndex={-1}
              role="group"
              aria-label={announcementLabel(current, layout, items.length, item.game.title)}
            >
              <BookSpread
                item={item}
                position={current}
                layout={layout}
                compactCaptures={compactCaptures}
              />
            </div>
          )}
          <BookIconButton
            label={t('book.close')}
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 z-10"
          >
            <X aria-hidden="true" size={22} strokeWidth={2.5} />
          </BookIconButton>
        </div>
      ) : (
        <BookCover ref={coverRef} onOpen={openBook} />
      )}
    </div>
  );
}
