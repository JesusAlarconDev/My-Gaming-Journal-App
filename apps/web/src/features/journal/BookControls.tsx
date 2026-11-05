import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  canGoNext,
  canGoPrevious,
  positionLabel,
  type BookLayout,
  type BookPosition,
} from '@/lib/book';
import { useT } from '@/lib/i18n';
import { BookIconButton } from './BookIconButton';

interface BookControlsProps {
  position: BookPosition;
  layout: BookLayout;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * Previous and next buttons with the position indicator. A step is an entry in `spread` and a page
 * in `single`, and the button names say so. At the ends the buttons stay focusable but inactive.
 */
export function BookControls({ position, layout, total, onPrevious, onNext }: BookControlsProps) {
  const t = useT();
  const unit = layout === 'spread' ? 'Entry' : 'Page';

  return (
    <div
      role="group"
      aria-label={t('book.controlsLabel')}
      className="mt-4 flex items-center justify-center gap-3"
    >
      <BookIconButton
        label={t(`book.previous${unit}`)}
        inactive={!canGoPrevious(position, layout, total)}
        onClick={onPrevious}
      >
        <ChevronLeft aria-hidden="true" size={26} strokeWidth={2.5} className="shrink-0" />
      </BookIconButton>
      <p className="min-w-0 flex-1 text-center text-sm text-cocoa-soft sm:flex-none sm:px-4">
        {positionLabel(position, layout, total)}
      </p>
      <BookIconButton
        label={t(`book.next${unit}`)}
        inactive={!canGoNext(position, layout, total)}
        onClick={onNext}
      >
        <ChevronRight aria-hidden="true" size={26} strokeWidth={2.5} className="shrink-0" />
      </BookIconButton>
    </div>
  );
}
