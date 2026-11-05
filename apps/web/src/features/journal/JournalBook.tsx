import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useBookLayout } from '@/hooks/useBookLayout';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
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
import { CoverOpenOverlay } from './CoverOpenOverlay';
import { PageTurnOverlay, type TurnDirection } from './PageTurnOverlay';

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
 * Opening, closing and turning pages play visual-only animation layers, skipped when the user asks
 * for reduced motion; presses are ignored while a page is turning.
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
  const reducedMotion = usePrefersReducedMotion();
  const [turn, setTurn] = useState<TurnDirection | null>(null);
  const [opening, setOpening] = useState(false);
  const [closing, setClosing] = useState(false);
  const endTurn = useCallback(() => setTurn(null), []);
  const endOpening = useCallback(() => setOpening(false), []);
  const endClosing = useCallback(() => {
    setClosing(false);
    setOpen(false);
  }, []);

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
    setOpening(!reducedMotion);
    setOpen(true);
  };

  // With motion the book stays rendered while the cover closes over it, and only then unmounts.
  const closeBook = () => {
    if (closing) return;
    setTurn(null);
    setOpening(false);
    if (reducedMotion) setOpen(false);
    else setClosing(true);
  };

  const goTo = (target: BookPosition, direction: TurnDirection) => {
    if (turn || opening || closing) return; // Something is still moving: ignore repeated presses.
    if (target === current) return; // Already at the end: nothing to turn.
    setPosition(target);
    const entry = items[target.entryIndex];
    if (entry) {
      setAnnouncement(announcementLabel(target, layout, items.length, entry.game.title));
    }
    if (!reducedMotion) setTurn(direction);
  };
  const goNext = () => goTo(nextPosition(current, layout, items.length), 'next');
  const goPrevious = () => goTo(previousPosition(current, layout, items.length), 'previous');

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
    // Capped so the pages stay a comfortable reading size on very wide screens.
    <div ref={containerRef} className="mx-auto w-full max-w-5xl">
      {open ? (
        <div ref={bookRef}>
          <div className="relative">
            <div
              ref={entryRef}
              tabIndex={-1}
              role="group"
              className={opening ? 'book-revealing' : closing ? 'book-hiding' : undefined}
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
            {turn && item && <PageTurnOverlay direction={turn} layout={layout} onDone={endTurn} />}
            {(opening || closing) && (
              <CoverOpenOverlay
                layout={layout}
                direction={closing ? 'close' : 'open'}
                onDone={closing ? endClosing : endOpening}
              />
            )}
            {!opening && !closing && (
              <BookIconButton
                label={t('book.close')}
                onClick={closeBook}
                className="absolute top-3 right-3 z-10"
              >
                <X aria-hidden="true" size={22} strokeWidth={2.5} />
              </BookIconButton>
            )}
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
        <BookCover ref={coverRef} onOpen={openBook} layout={layout} />
      )}
    </div>
  );
}
