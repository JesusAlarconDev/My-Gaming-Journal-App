import type { ButtonHTMLAttributes } from 'react';
import { cx } from '@/lib/cx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-cocoa text-paper hover:bg-cocoa-soft',
  secondary: 'border border-cocoa bg-paper text-cocoa hover:bg-cream',
  ghost: 'text-cocoa hover:bg-cocoa/10',
};

/** Class names for button styling; also usable on links (`<Link className={buttonStyles()}>`). */
export function buttonStyles(variant: ButtonVariant = 'primary', className?: string): string {
  return cx(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary', type = 'button', className, ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles(variant, className)} {...props} />;
}
