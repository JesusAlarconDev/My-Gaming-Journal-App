import { useEffect } from 'react';
import { t } from '@/lib/i18n';

/** Sets the browser tab title so route changes are announced to assistive technology. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} · ${t('app.name')}`;
  }, [title]);
}
