export const GAME_STATUSES = ['playing', 'completed', 'backlog', 'abandoned', 'on_hold'] as const;

export type GameStatus = (typeof GAME_STATUSES)[number];

export type Rating = 1 | 2 | 3 | 4 | 5;

/** One entry per (userId, gameId). Dates are ISO 8601 strings. */
export interface JournalEntry {
  id: string;
  userId: string;
  gameId: string;
  status: GameStatus;
  rating?: Rating;
  review?: string;
  loggedAt: string;
  startedAt?: string;
  completedAt?: string;
  playtimeMinutes?: number;
  likedAspects: string[];
  dislikedAspects: string[];
  images: string[];
}
