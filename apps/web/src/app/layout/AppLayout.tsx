import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useT } from '@/lib/i18n';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  const t = useT();
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  // Move focus to the content on route change so keyboard and screen reader users land on the new view.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.focus();
  }, [pathname]);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[16rem_1fr]">
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-cocoa px-5 py-2 text-paper focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        {t('app.skipToContent')}
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-col">
        <Header />
        <main
          id="main"
          ref={mainRef}
          tabIndex={-1}
          className="flex-1 p-6 pb-24 outline-none md:p-10 md:pb-10"
        >
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
