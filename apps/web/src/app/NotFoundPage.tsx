import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { buttonStyles } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useT } from '@/lib/i18n';

export function NotFoundPage() {
  const t = useT();
  useDocumentTitle(t('notFound.title'));
  return (
    <>
      <PageHeader title={t('notFound.title')} description={t('notFound.description')} />
      <Link to="/" className={buttonStyles('primary')}>
        {t('notFound.backHome')}
      </Link>
    </>
  );
}
