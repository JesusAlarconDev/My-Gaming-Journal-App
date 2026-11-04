import type { Game, JournalEntry } from '@game-journal/contracts';
import type { JournalItem } from '@/lib/library';

/** Builders for journal book tests. They never touch the mock data of the services. */
export function makeItem(entry: Partial<JournalEntry> = {}, game: Partial<Game> = {}): JournalItem {
  return {
    game: { id: 'g1', title: 'Hades', platforms: [], genres: [], ...game },
    entry: {
      id: 'e1',
      userId: 'u1',
      gameId: 'g1',
      status: 'completed',
      loggedAt: '2026-01-01T00:00:00.000Z',
      images: [],
      ...entry,
    },
  };
}

export const COMPLETE_ENTRY: Partial<JournalEntry> = {
  rating: 4,
  review: 'Morir nunca se sintió tan bien.',
  likedText: 'La narrativa y el combate.',
  dislikedText: 'Algunas salas se repiten.',
  categoryRatings: { gameplay: 5, story: 5, music: 4, graphics: 5 },
  suggestedGames: ['Juego de ejemplo A', 'Juego de ejemplo B', 'Juego de ejemplo C'],
};
