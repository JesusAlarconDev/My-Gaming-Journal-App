import { useEffect } from 'react';
import { BOOK_ANIMATION_SAFETY_MS, type BookLayout } from '@/lib/book';

export type TurnDirection = 'next' | 'previous';

interface PageTurnOverlayProps {
  direction: TurnDirection;
  layout: BookLayout;
  /** Called once when the leaf stops (`animationend`) or, failing that, after a safety timeout. Must be stable. */
  onDone: () => void;
}

/**
 * Purely visual page turn drawn over the book. The real pages underneath already show the new
 * entry, so this layer is hidden from assistive technology and inert, and it removes itself.
 * In a spread a blank leaf swings over half the book with a blank backing on the other half;
 * in `single` the leaf covers the whole page.
 */
export function PageTurnOverlay({ direction, layout, onDone }: PageTurnOverlayProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, BOOK_ANIMATION_SAFETY_MS);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      aria-hidden="true"
      inert
      data-direction={direction}
      data-layout={layout}
      className="book-turn"
    >
      {layout === 'spread' && <div className="book-turn__backing" />}
      <div className="book-turn__leaf" onAnimationEnd={onDone} />
    </div>
  );
}
