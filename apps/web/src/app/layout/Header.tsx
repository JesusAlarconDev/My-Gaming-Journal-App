import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useT } from '@/lib/i18n';
import { Brand } from './Brand';

export function Header() {
  const t = useT();
  const user = useCurrentUser();

  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-cocoa/10 px-6 md:px-10">
      <div className="md:hidden">
        <Brand />
      </div>
      <p className="hidden font-hand text-2xl text-cocoa-soft md:block">{t('app.tagline')}</p>
      {user.status === 'success' && (
        <p className="font-hand text-2xl">{t('app.greeting', { name: user.data.displayName })}</p>
      )}
    </header>
  );
}
