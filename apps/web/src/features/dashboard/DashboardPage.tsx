import { BookHeart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { StatsGrid } from '@/components/StatsGrid';
import { buttonStyles } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageHeader } from '@/components/ui/PageHeader';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLibrary } from '@/hooks/useLibrary';
import { useT } from '@/lib/i18n';

const RECENT_COUNT = 3;

export function DashboardPage() {
  const t = useT();
  const library = useLibrary();
  useDocumentTitle(t('nav.dashboard'));

  return (
    <>
      <PageHeader title={t('nav.dashboard')} description={t('dashboard.description')} />
      {library.status === 'loading' && <LoadingState />}
      {library.status === 'error' && <ErrorState />}
      {library.status === 'success' && (
        <div className="space-y-10">
          <section aria-labelledby="summary-title">
            <h2 id="summary-title" className="mb-4 font-display text-2xl">
              {t('stats.title')}
            </h2>
            <StatsGrid stats={library.data.stats} />
          </section>
          <section aria-labelledby="recent-title">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 id="recent-title" className="font-display text-2xl">
                {t('dashboard.recentTitle')}
              </h2>
              {library.data.journal.length > 0 && (
                <Link to="/journal" className={buttonStyles('secondary')}>
                  {t('dashboard.viewAll')}
                </Link>
              )}
            </div>
            {library.data.journal.length === 0 ? (
              <EmptyState
                icon={<BookHeart size={32} />}
                title={t('dashboard.emptyTitle')}
                description={t('dashboard.emptyDescription')}
              />
            ) : (
              <ul className="space-y-4">
                {library.data.journal.slice(0, RECENT_COUNT).map((item) => (
                  <li key={item.entry.id}>
                    <JournalEntryCard item={item} titleAs="h3" />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </>
  );
}
