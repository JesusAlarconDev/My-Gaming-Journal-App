export interface Game {
  id: string;
  title: string;
  coverUrl?: string;
  platforms: string[];
  genres: string[];
  releaseYear?: number;
  developer?: string;
  description?: string;
}
