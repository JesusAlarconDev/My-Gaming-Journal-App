import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { cx } from '@/lib/cx';

interface BookIconButtonProps {
  /** Accessible name; the icon itself is decorative. */
  label: string;
  onClick: () => void;
  /** Dims the button and ignores clicks, but keeps it focusable so keyboard focus is not lost. */
  inactive?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Round icon button for the book: no border, paper shadow, 44px target. `border-0!` and `px-0!`
 * override the `Button` border and horizontal padding, which would squash the icon.
 */
export function BookIconButton({
  label,
  onClick,
  inactive = false,
  className,
  children,
}: BookIconButtonProps) {
  return (
    <Button
      variant="secondary"
      aria-label={label}
      aria-disabled={inactive}
      onClick={() => {
        if (!inactive) onClick();
      }}
      className={cx(
        'w-11 shrink-0 border-0! px-0! shadow-paper aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        className,
      )}
    >
      {children}
    </Button>
  );
}
