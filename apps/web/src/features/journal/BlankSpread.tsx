import { BookHeart } from 'lucide-react';
import type { BookLayout } from '@/lib/book';
import { cx } from '@/lib/cx';
import { useT } from '@/lib/i18n';

/** The open book of an empty journal: a blank page with a message, and a blank facing page in a spread. */
export function BlankSpread({ layout }: { layout: BookLayout }) {
  const t = useT();
  const isSpread = layout === 'spread';

  return (
    <div className={cx('book-sheet', isSpread && 'book-sheet--spread')}>
      <div className="book-page book-page--first flex items-center justify-center p-5 text-center md:p-7">
        <div>
          <BookHeart aria-hidden="true" size={32} className="mx-auto mb-3 text-cocoa-soft" />
          <p className="font-display text-xl">{t('book.emptyTitle')}</p>
          <p className="mt-1 text-cocoa-soft">{t('book.emptyDescription')}</p>
        </div>
      </div>
      {isSpread && (
        <>
          <div aria-hidden="true" className="book-page book-page--second" />
          <span aria-hidden="true" className="book-spine" />
        </>
      )}
    </div>
  );
}
