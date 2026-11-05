import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  CAPTURE_SLOT_COUNT,
  canStepCapture,
  captureSlots,
  stepCapture,
  type CaptureDirection,
} from '@/lib/book';
import { useT } from '@/lib/i18n';
import { BookIconButton } from './BookIconButton';
import { CaptureFrame } from './CaptureFrame';

interface CaptureCarouselProps {
  images: readonly string[];
  gameTitle: string;
  /** Index of the capture on show, from 0 to 2. Owned by the parent so it survives layout changes. */
  index: number;
  onIndexChange: (index: number) => void;
}

/**
 * One capture at a time for narrow books. Stops at the first and last capture; the buttons stay
 * focusable there (`aria-disabled`) so keyboard focus is not lost. With no captures at all it
 * shows a single empty frame and no controls.
 */
export function CaptureCarousel({ images, gameTitle, index, onIndexChange }: CaptureCarouselProps) {
  const t = useT();
  const label = t('book.captures');

  if (images.length === 0) {
    return (
      <div role="group" aria-label={label}>
        {/* Spacers as wide as the buttons keep the frame the same size as when the arrows show. */}
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="w-11 shrink-0" />
          <CaptureFrame n={1} gameTitle={gameTitle} className="min-w-0 flex-1" />
          <span aria-hidden="true" className="w-11 shrink-0" />
        </div>
      </div>
    );
  }

  const step = (direction: CaptureDirection) => {
    if (canStepCapture(index, direction)) onIndexChange(stepCapture(index, direction));
  };
  const button = (direction: CaptureDirection) => (
    <BookIconButton
      label={t(direction === 'next' ? 'book.nextCapture' : 'book.previousCapture')}
      inactive={!canStepCapture(index, direction)}
      onClick={() => step(direction)}
    >
      {direction === 'next' ? (
        <ChevronRight aria-hidden="true" size={26} strokeWidth={2.5} className="shrink-0" />
      ) : (
        <ChevronLeft aria-hidden="true" size={26} strokeWidth={2.5} className="shrink-0" />
      )}
    </BookIconButton>
  );

  return (
    <div role="group" aria-label={label} className="space-y-2">
      <div className="flex items-center gap-2">
        {button('previous')}
        <CaptureFrame
          n={index + 1}
          gameTitle={gameTitle}
          src={captureSlots(images)[index]}
          className="min-w-0 flex-1"
        />
        {button('next')}
      </div>
      <p aria-live="polite" className="text-center text-sm text-cocoa-soft">
        {t('book.captureIndicator', { n: index + 1, total: CAPTURE_SLOT_COUNT })}
      </p>
    </div>
  );
}
