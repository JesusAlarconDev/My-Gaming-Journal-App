import { useT } from '@/lib/i18n';

export function LoadingState() {
  const t = useT();
  return (
    <p role="status" className="py-12 text-center font-hand text-2xl text-cocoa-soft">
      {t('common.loading')}
    </p>
  );
}
