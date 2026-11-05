import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { isCompactWidth, layoutForWidth, type BookLayout } from '@/lib/book';

/**
 * Picks the book layout from the width of the element the ref is attached to, not from the
 * viewport: the sidebar takes space, so a viewport media query would give wrong results.
 * `compact` is true when that width is too small for three captures in a row.
 * Attach the ref to an element without padding so both width readings agree.
 */
export function useBookLayout<T extends HTMLElement>(): [RefObject<T | null>, BookLayout, boolean] {
  const ref = useRef<T | null>(null);
  const [layout, setLayout] = useState<BookLayout>('single');
  const [compact, setCompact] = useState(false);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const apply = (width: number) => {
      setLayout(layoutForWidth(width));
      setCompact(isCompactWidth(width));
    };
    apply(element.getBoundingClientRect().width);
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width !== undefined) apply(width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, layout, compact];
}
