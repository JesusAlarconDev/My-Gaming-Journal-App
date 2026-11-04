import { services } from '@/services';
import { useAsync } from './useAsync';

const loadCurrentUser = () => services.users.getCurrentUser();

export function useCurrentUser() {
  return useAsync(loadCurrentUser);
}
