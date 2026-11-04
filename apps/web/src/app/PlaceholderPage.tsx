import { Hammer } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useT } from '@/lib/i18n';

/** Temporary view body used until each feature page is built (block G). */
export function PlaceholderPage({ title }: { title: string }) {
  const t = useT();
  useDocumentTitle(title);
  return (
    <>
      <PageHeader title={title} />
      <EmptyState
        icon={<Hammer size={32} />}
        title={t('placeholder.title')}
        description={t('placeholder.description')}
      />
    </>
  );
}
