import { PlaceholderPage } from '@/app/PlaceholderPage';
import { useT } from '@/lib/i18n';

export function JournalPage() {
  const t = useT();
  return <PlaceholderPage title={t('nav.journal')} />;
}
