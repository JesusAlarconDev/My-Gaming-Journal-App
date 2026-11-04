import { BookOpen, Home, Library, UserRound, type LucideIcon } from 'lucide-react';
import type { TranslationKey } from '@/lib/i18n';

export interface NavItem {
  to: string;
  labelKey: TranslationKey;
  icon: LucideIcon;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { to: '/', labelKey: 'nav.dashboard', icon: Home },
  { to: '/journal', labelKey: 'nav.journal', icon: BookOpen },
  { to: '/collection', labelKey: 'nav.collection', icon: Library },
  { to: '/profile', labelKey: 'nav.profile', icon: UserRound },
];
