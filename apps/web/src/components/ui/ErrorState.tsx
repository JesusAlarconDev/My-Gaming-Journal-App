import { TriangleAlert } from 'lucide-react';
import { useT } from '@/lib/i18n';

export function ErrorState() {
  const t = useT();
  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-card bg-rose/25 px-5 py-4 text-rose-deep"
    >
      <TriangleAlert aria-hidden="true" size={20} className="shrink-0" />
      {t('common.error')}
    </div>
  );
}
