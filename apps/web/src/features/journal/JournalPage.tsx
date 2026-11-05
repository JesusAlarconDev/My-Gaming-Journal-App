import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageHeader } from '@/components/ui/PageHeader';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLibrary } from '@/hooks/useLibrary';
import { useT } from '@/lib/i18n';
import { JournalBook } from './JournalBook';

export function JournalPage() {
  const t = useT();
  const library = useLibrary();
  useDocumentTitle(t('nav.journal'));

  return (
    <>
      <PageHeader title={t('nav.journal')} description={t('journal.description')} />
      {library.status === 'loading' && <LoadingState />}
      {library.status === 'error' && <ErrorState />}
      {library.status === 'success' && <JournalBook items={library.data.journal} />}
    </>
  );
}
