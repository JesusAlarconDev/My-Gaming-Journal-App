import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-card border-2 border-dashed border-cocoa/20 bg-paper/60 px-6 py-12 text-center">
      {icon && (
        <div aria-hidden="true" className="mb-3 text-cocoa-soft">
          {icon}
        </div>
      )}
      <p className="font-display text-xl">{title}</p>
      {description && <p className="mt-1 max-w-sm text-cocoa-soft">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
