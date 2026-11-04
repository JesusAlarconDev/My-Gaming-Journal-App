import { Library } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageHeader } from '@/components/ui/PageHeader';
import { PolaroidCard, type Tilt } from '@/components/ui/PolaroidCard';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLibrary } from '@/hooks/useLibrary';
import { useT } from '@/lib/i18n';

const TILTS: Tilt[] = [-1, 1, 0, 2, -2, 0];

export function CollectionPage() {
  const t = useT();
  const library = useLibrary();
  useDocumentTitle(t('nav.collection'));

  return (
    <>
      <PageHeader title={t('nav.collection')} description={t('collection.description')} />
      {library.status === 'loading' && <LoadingState />}
      {library.status === 'error' && <ErrorState />}
      {library.status === 'success' &&
        (library.data.collection.length === 0 ? (
          <EmptyState
            icon={<Library size={32} />}
            title={t('collection.emptyTitle')}
            description={t('collection.emptyDescription')}
          />
        ) : (
          <ul className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
            {library.data.collection.map(({ game, entry }, index) => (
              <li key={game.id}>
                <PolaroidCard
                  title={game.title}
                  coverUrl={game.coverUrl}
                  subtitle={game.genres.join(' · ')}
                  status={entry?.status}
                  rating={entry?.rating}
                  tilt={TILTS[index % TILTS.length]}
                />
              </li>
            ))}
          </ul>
        ))}
    </>
  );
}
