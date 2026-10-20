export interface Source {
  title: string;
  publisher?: string | null;
  date?: string | null;
  url: string;
}

export interface IssueTrack {
  slug: string;
  songId: string;
  title: string;
  artistIds: string[];
  album: string;
  releaseDate: string;
  durationMs: number;
  genre?: string;
  sourcePlaylistId: string;
  artwork: string;
  appleMusicUrl: string;
  spotifyUrl?: string | null;
  story: string;
  sources: Source[];
}

export interface Issue {
  number: number;
  slug: string;
  publishedAt: string;
  period?: string | null;
  label?: string | null;
  title: string;
  summary: string;
  intro: string;
  tracks: IssueTrack[];
}

export interface ArtistLinks {
  appleMusic: string;
  spotify?: string | null;
  official?: string | null;
}

export interface Artist {
  slug: string;
  name: string;
  latinName?: string | null;
  nativeName?: string | null;
  role?: string | null;
  origin?: string | null;
  image?: string | null;
  imageCredit?: string | null;
  links: ArtistLinks;
  bio: string;
  sources: Source[];
}

export interface PlaylistConfig {
  id: string;
  name: string;
  region?: string;
  description?: string;
  url: string;
}

export interface PlaylistStatus {
  id: string;
  name: string;
  url: string;
  region?: string | null;
  updatedLabel?: string | null;
  trackCount?: number | null;
}

export interface PlaylistView extends PlaylistConfig {
  trackCount: number | null;
  updatedLabel: string | null;
}

export interface Recommendation {
  issue: Issue;
  track: IssueTrack;
}
