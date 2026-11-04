import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { layoutForWidth, type BookLayout } from '@/lib/book';

/**
 * Picks the book layout from the width of the element the ref is attached to, not from the
 * viewport: the sidebar takes space, so a viewport media query would give wrong results.
 * Attach the ref to an element without padding so both width readings agree.
 */
export function useBookLayout<T extends HTMLElement>(): [RefObject<T | null>, BookLayout] {
  const ref = useRef<T | null>(null);
  const [layout, setLayout] = useState<BookLayout>('single');

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    setLayout(layoutForWidth(element.getBoundingClientRect().width));
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width !== undefined) setLayout(layoutForWidth(width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, layout];
}
