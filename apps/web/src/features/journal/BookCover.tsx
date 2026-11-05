import type { Ref } from 'react';
import { ChevronRight } from 'lucide-react';
import { cx } from '@/lib/cx';
import { useT } from '@/lib/i18n';

interface BookCoverProps {
  onOpen: () => void;
  /** Lets the book return focus to the cover after closing. */
  ref?: Ref<HTMLButtonElement>;
  className?: string;
}

/**
 * The closed book. The whole cover is one button: clicking, tapping, Enter and Space open it.
 * The tab in the bottom-right corner is part of that button, not a second control, so its text
 * is read together with the title.
 */
export function BookCover({ onOpen, ref, className }: BookCoverProps) {
  const t = useT();

  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      className={cx(
        'book-cover transition-transform duration-200 motion-safe:hover:-translate-y-1',
        className,
      )}
    >
      <span aria-hidden="true" className="book-cover__stitch" />
      <span className="book-cover__title">{t('book.cover.title')}</span>
      <span className="book-cover__tab">
        {t('book.cover.open')}
        <ChevronRight aria-hidden="true" size={16} strokeWidth={2.5} />
      </span>
    </button>
  );
}
