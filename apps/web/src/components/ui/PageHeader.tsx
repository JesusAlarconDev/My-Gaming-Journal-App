import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

/** Page title block. Renders the single `h1` of a view. */
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl">{title}</h1>
        {description && <p className="mt-1 font-hand text-2xl text-cocoa-soft">{description}</p>}
      </div>
      {action}
    </div>
  );
}
