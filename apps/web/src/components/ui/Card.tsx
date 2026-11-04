import type { HTMLAttributes } from 'react';
import { cx } from '@/lib/cx';

/** Paper-like surface. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx('rounded-card bg-paper p-5 shadow-paper ring-1 ring-cocoa/5', className)}
      {...props}
    />
  );
}
