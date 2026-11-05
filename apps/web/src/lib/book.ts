import { t } from './i18n';

/** `spread` shows both pages of an entry; `single` shows one page at a time. */
export type BookLayout = 'spread' | 'single';

export type BookSide = 'first' | 'second';

export interface BookPosition {
  entryIndex: number;
  /** Only meaningful in the `single` layout; a spread always shows both sides. */
  side: BookSide;
}

/** Minimum width (px) of the book container to show two pages side by side. */
export const BOOK_SPREAD_MIN_WIDTH = 720;

/** Maximum width (px) of the book container for showing one capture at a time. */
export const BOOK_COMPACT_MAX_WIDTH = 550;

/**
 * Longer than any book animation (see `book.css`). Animation layers remove themselves on
 * `animationend`; this timer is the fallback so a missed event can never leave a layer stuck.
 */
export const BOOK_ANIMATION_SAFETY_MS = 1000;

export const CAPTURE_SLOT_COUNT = 3;

export const START_POSITION: BookPosition = { entryIndex: 0, side: 'first' };

export function layoutForWidth(width: number): BookLayout {
  return width >= BOOK_SPREAD_MIN_WIDTH ? 'spread' : 'single';
}

/** Keeps the position inside the book when the number of entries changes. */
export function clampPosition(position: BookPosition, total: number): BookPosition {
  if (total <= 0) return START_POSITION;
  const entryIndex = Math.min(Math.max(position.entryIndex, 0), total - 1);
  return { entryIndex, side: position.side };
}

export function canGoNext(position: BookPosition, layout: BookLayout, total: number): boolean {
  const lastEntry = position.entryIndex < total - 1;
  if (layout === 'spread') return lastEntry;
  return position.side === 'first' ? total > 0 : lastEntry;
}

export function canGoPrevious(position: BookPosition, layout: BookLayout, total: number): boolean {
  if (total <= 0) return false;
  if (layout === 'spread') return position.entryIndex > 0;
  return position.side === 'second' || position.entryIndex > 0;
}

/** A step is one entry in `spread` and one page in `single`. Returns the same position at the end. */
export function nextPosition(
  position: BookPosition,
  layout: BookLayout,
  total: number,
): BookPosition {
  if (!canGoNext(position, layout, total)) return position;
  if (layout === 'single' && position.side === 'first') {
    return { entryIndex: position.entryIndex, side: 'second' };
  }
  return { entryIndex: position.entryIndex + 1, side: 'first' };
}

/** Going back in `single` lands on the second page of the previous entry, as when reading backwards. */
export function previousPosition(
  position: BookPosition,
  layout: BookLayout,
  total: number,
): BookPosition {
  if (!canGoPrevious(position, layout, total)) return position;
  if (layout === 'single' && position.side === 'second') {
    return { entryIndex: position.entryIndex, side: 'first' };
  }
  return { entryIndex: position.entryIndex - 1, side: layout === 'single' ? 'second' : 'first' };
}

/** "Entrada 2 de 6", plus "Página 1 de 2" in the `single` layout. Empty when there are no entries. */
export function positionLabel(position: BookPosition, layout: BookLayout, total: number): string {
  if (total <= 0) return '';
  const entry = t('book.entryPosition', { n: position.entryIndex + 1, total });
  if (layout === 'spread') return entry;
  const page = t('book.pagePosition', { page: position.side === 'first' ? 1 : 2 });
  return t('book.positionWithPage', { entry, page });
}

export type CaptureDirection = 'previous' | 'next';

/** True when the book is too narrow for three captures in a row. */
export function isCompactWidth(width: number): boolean {
  return width <= BOOK_COMPACT_MAX_WIDTH;
}

export function canStepCapture(index: number, direction: CaptureDirection): boolean {
  return direction === 'next' ? index < CAPTURE_SLOT_COUNT - 1 : index > 0;
}

/** Moves to the neighbouring capture; stops at the first and last one instead of wrapping around. */
export function stepCapture(index: number, direction: CaptureDirection): number {
  const clamped = Math.min(Math.max(index, 0), CAPTURE_SLOT_COUNT - 1);
  if (!canStepCapture(clamped, direction)) return clamped;
  return direction === 'next' ? clamped + 1 : clamped - 1;
}

/** Text for screen readers when the entry on show changes: "Entrada 2 de 6: Hades", plus the page in `single`. */
export function announcementLabel(
  position: BookPosition,
  layout: BookLayout,
  total: number,
  title: string,
): string {
  const n = position.entryIndex + 1;
  if (layout === 'spread') return t('book.announceEntry', { n, total, title });
  return t('book.announcePage', { n, total, title, page: position.side === 'first' ? 1 : 2 });
}

/** Always `CAPTURE_SLOT_COUNT` slots: the first images, padded with `undefined` for placeholders. */
export function captureSlots(images: readonly string[]): (string | undefined)[] {
  return Array.from({ length: CAPTURE_SLOT_COUNT }, (_, index) => images[index]);
}

export interface StarOffset {
  /** Vertical shift in SVG units: negative is up, positive is down. */
  y: number;
  /** Tilt in degrees. */
  rotate: number;
}

/**
 * Fixed per-star offsets so the hand-drawn look is stable between renders:
 * the 1st star sits high, the 2nd low, and so on, each with a slightly different tilt.
 */
export const starOffsets: readonly StarOffset[] = [
  { y: -6, rotate: -8 },
  { y: 5, rotate: 5 },
  { y: -4, rotate: -3 },
  { y: 6, rotate: 7 },
  { y: -5, rotate: -6 },
];
