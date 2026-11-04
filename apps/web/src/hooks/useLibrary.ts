import { buildLibrary } from '@/lib/library';
import { services } from '@/services';
import { useAsync } from './useAsync';

async function loadLibrary() {
  const [games, entries] = await Promise.all([
    services.games.listGames(),
    services.journal.listEntries(),
  ]);
  return buildLibrary(games, entries);
}

/** Games, journal entries and derived stats, loaded through the service layer. */
export function useLibrary() {
  return useAsync(loadLibrary);
}
