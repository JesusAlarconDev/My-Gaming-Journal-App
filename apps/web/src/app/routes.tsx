import type { RouteObject } from 'react-router-dom';
import { CollectionPage } from '@/features/collection/CollectionPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { JournalPage } from '@/features/journal/JournalPage';
import { ProfilePage } from '@/features/profile/ProfilePage';
import { AppLayout } from './layout/AppLayout';
import { NotFoundPage } from './NotFoundPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'journal', element: <JournalPage /> },
      { path: 'collection', element: <CollectionPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
