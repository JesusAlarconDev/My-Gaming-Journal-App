export const GAME_STATUSES = ['playing', 'completed', 'backlog', 'abandoned', 'on_hold'] as const;

export type GameStatus = (typeof GAME_STATUSES)[number];

export type Rating = 1 | 2 | 3 | 4 | 5;

export const RATING_CATEGORIES = ['gameplay', 'story', 'music', 'graphics'] as const;

export type RatingCategory = (typeof RATING_CATEGORIES)[number];

/** Each category is optional; a missing one means "not rated". */
export type CategoryRatings = Partial<Record<RatingCategory, Rating>>;

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
  /** Free text: what the player liked. Empty or missing means no text. */
  likedText?: string;
  /** Free text: what the player did not like. Empty or missing means no text. */
  dislikedText?: string;
  categoryRatings?: CategoryRatings;
  /** Titles of games the player might enjoy. Sample data until recommendations exist. */
  suggestedGames?: string[];
  images: string[];
}
