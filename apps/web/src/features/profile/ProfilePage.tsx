import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatsGrid } from '@/components/StatsGrid';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLibrary } from '@/hooks/useLibrary';
import { formatDate } from '@/lib/format';
import { useT } from '@/lib/i18n';

export function ProfilePage() {
  const t = useT();
  const user = useCurrentUser();
  const library = useLibrary();
  useDocumentTitle(t('nav.profile'));

  return (
    <>
      <PageHeader title={t('nav.profile')} description={t('profile.description')} />
      <div className="space-y-10">
        {user.status === 'loading' && <LoadingState />}
        {user.status === 'error' && <ErrorState />}
        {user.status === 'success' && (
          <Card className="flex items-center gap-5">
            <div
              aria-hidden="true"
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-sage/40 font-display text-4xl text-sage-deep"
            >
              {user.data.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="truncate font-display text-2xl">{user.data.displayName}</h2>
              <p className="text-cocoa-soft">
                {t('profile.memberSince', { date: formatDate(user.data.createdAt) })}
              </p>
            </div>
          </Card>
        )}
        <section aria-labelledby="profile-stats-title">
          <h2 id="profile-stats-title" className="mb-4 font-display text-2xl">
            {t('profile.statsTitle')}
          </h2>
          {library.status === 'loading' && <LoadingState />}
          {library.status === 'error' && <ErrorState />}
          {library.status === 'success' && (
            <StatsGrid stats={library.data.stats} includeAverageRating />
          )}
        </section>
      </div>
    </>
  );
}
