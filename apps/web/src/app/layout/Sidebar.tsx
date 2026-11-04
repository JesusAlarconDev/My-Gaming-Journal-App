import { NavLink } from 'react-router-dom';
import { cx } from '@/lib/cx';
import { useT } from '@/lib/i18n';
import { NAV_ITEMS } from '../navigation';
import { Brand } from './Brand';

/** Desktop navigation (hidden below `md`, where MobileNav takes over). */
export function Sidebar() {
  const t = useT();
  return (
    <div className="sticky top-0 hidden h-screen flex-col gap-8 border-r border-cocoa/10 bg-paper/70 p-6 md:flex">
      <Brand />
      <nav aria-label={t('nav.label')}>
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, labelKey, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cx(
                    'flex min-h-11 items-center gap-3 rounded-full px-4 py-2 transition-colors',
                    isActive
                      ? 'bg-cocoa font-semibold text-paper'
                      : 'text-cocoa-soft hover:bg-cocoa/10 hover:text-cocoa',
                  )
                }
              >
                <Icon size={20} aria-hidden="true" />
                {t(labelKey)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
