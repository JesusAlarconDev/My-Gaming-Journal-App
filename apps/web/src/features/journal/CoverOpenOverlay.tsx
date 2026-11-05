import { useEffect } from 'react';
import { BOOK_ANIMATION_SAFETY_MS } from '@/lib/book';

/**
 * Purely visual: a leather cover that swings away over the freshly opened book. Like the page
 * turn, it is hidden from assistive technology, inert and removes itself.
 */
export function CoverOpenOverlay({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, BOOK_ANIMATION_SAFETY_MS);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div aria-hidden="true" inert className="book-turn book-turn--cover">
      <div className="book-turn__leather" onAnimationEnd={onDone} />
    </div>
  );
}
