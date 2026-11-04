import { NavLink } from 'react-router-dom';
import { cx } from '@/lib/cx';
import { useT } from '@/lib/i18n';
import { NAV_ITEMS } from '../navigation';

/** Bottom navigation bar for small screens (hidden from `md` up). */
export function MobileNav() {
  const t = useT();
  return (
    <nav
      aria-label={t('nav.label')}
      className="fixed inset-x-0 bottom-0 z-20 border-t border-cocoa/10 bg-paper pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-4">
        {NAV_ITEMS.map(({ to, labelKey, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cx(
                  'flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-xs',
                  isActive ? 'font-semibold text-cocoa' : 'text-cocoa-soft',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cx(
                      'flex h-7 w-12 items-center justify-center rounded-full transition-colors',
                      isActive && 'bg-orange/30',
                    )}
                  >
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  {t(labelKey)}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
