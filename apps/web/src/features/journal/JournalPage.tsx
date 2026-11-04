import { BookHeart } from 'lucide-react';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageHeader } from '@/components/ui/PageHeader';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLibrary } from '@/hooks/useLibrary';
import { useT } from '@/lib/i18n';

export function JournalPage() {
  const t = useT();
  const library = useLibrary();
  useDocumentTitle(t('nav.journal'));

  return (
    <>
      <PageHeader title={t('nav.journal')} description={t('journal.description')} />
      {library.status === 'loading' && <LoadingState />}
      {library.status === 'error' && <ErrorState />}
      {library.status === 'success' &&
        (library.data.journal.length === 0 ? (
          <EmptyState
            icon={<BookHeart size={32} />}
            title={t('journal.emptyTitle')}
            description={t('journal.emptyDescription')}
          />
        ) : (
          <ul className="space-y-4">
            {library.data.journal.map((item) => (
              <li key={item.entry.id}>
                <JournalEntryCard item={item} />
              </li>
            ))}
          </ul>
        ))}
    </>
  );
}
