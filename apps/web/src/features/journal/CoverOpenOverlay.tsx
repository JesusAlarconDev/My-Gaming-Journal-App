import { useEffect } from 'react';
import { BOOK_ANIMATION_SAFETY_MS, type BookLayout } from '@/lib/book';
import { BookCoverFace } from './BookCover';

interface CoverOpenOverlayProps {
  layout: BookLayout;
  /** `open` swings the cover away; `close` plays the same animation backwards. */
  direction: 'open' | 'close';
  /** Called once when the layer's own animation ends, or after a safety timeout. Must be stable. */
  onDone: () => void;
}

/**
 * Purely visual: the front cover of the book swinging open over the spine (or closing again),
 * drawn over the real book, which is hidden underneath. It is hidden from assistive technology,
 * inert and removes itself. In a spread the cover is one page wide and the book slides to the
 * middle as it opens, and the inside of the cover lies on the left page; in `single` the cover
 * covers the page and swings off to the left.
 */
export function CoverOpenOverlay({ layout, direction, onDone }: CoverOpenOverlayProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, BOOK_ANIMATION_SAFETY_MS);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      aria-hidden="true"
      inert
      data-layout={layout}
      data-direction={direction}
      className="book-turn book-turn--cover"
      // Animations of the children bubble up; only this layer's own fade ends it.
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) onDone();
      }}
    >
      {layout === 'spread' && <div className="book-open__mask" />}
      <div className="book-open__assembly">
        <div className="book-open__stage" />
        <div className="book-open__leaf">
          <div className="book-open__front book-cover">
            <BookCoverFace />
          </div>
          <div className="book-open__back" />
        </div>
      </div>
    </div>
  );
}
