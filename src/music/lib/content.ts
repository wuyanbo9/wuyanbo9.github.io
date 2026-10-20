import siteData from '../content/site.json';
import playlistsData from '../../../data/playlists.json';
import playlistStatusData from '../../../data/playlists.status.json';
import type {
  Artist,
  Issue,
  IssueTrack,
  PlaylistStatus,
  PlaylistView,
  Recommendation,
} from './types';
import { humanizePlaylistUpdate } from './format';

const issueModules = import.meta.glob<Issue>('../content/issues/*.json', {
  eager: true,
  import: 'default',
});

const artistModules = import.meta.glob<Artist>('../content/artists/*.json', {
  eager: true,
  import: 'default',
});

export const site = siteData;

export const issues: Issue[] = Object.values(issueModules).sort(
  (a, b) => b.number - a.number,
);

export const artists: Artist[] = Object.values(artistModules).sort((a, b) =>
  a.name.localeCompare(b.name, 'zh-Hans-CN'),
);

export const artistBySlug = new Map(artists.map((artist) => [artist.slug, artist]));

export const playlistById = new Map(
  playlistsData.playlists.map((playlist) => [playlist.id, playlist]),
);

const playlistStatusById = new Map(
  (playlistStatusData.playlists as PlaylistStatus[]).map((playlist) => [
    playlist.id,
    playlist,
  ]),
);

export const playlists: PlaylistView[] = playlistsData.playlists.map(
  (playlist) => {
    const status = playlistStatusById.get(playlist.id);
    return {
      ...playlist,
      trackCount: status?.trackCount ?? null,
      updatedLabel: humanizePlaylistUpdate(status?.updatedLabel),
    };
  },
);

export const lastSyncDate: string =
  (playlistStatusData as { syncedDate?: string }).syncedDate ??
  (playlistStatusData as { syncedAt?: string }).syncedAt?.slice(0, 10) ??
  '';

for (const issue of issues) {
  if (issue.tracks.length > 10) {
    throw new Error(`Issue ${issue.slug} exceeds the 10-track limit`);
  }

  const trackSlugs = new Set<string>();
  for (const track of issue.tracks) {
    if (trackSlugs.has(track.slug)) {
      throw new Error(`Duplicate track slug "${track.slug}" in issue ${issue.slug}`);
    }
    trackSlugs.add(track.slug);

    for (const artistId of track.artistIds) {
      if (!artistBySlug.has(artistId)) {
        throw new Error(
          `Issue ${issue.slug} references missing artist profile "${artistId}"`,
        );
      }
    }

    if (!playlistById.has(track.sourcePlaylistId)) {
      throw new Error(
        `Issue ${issue.slug} references unknown playlist "${track.sourcePlaylistId}"`,
      );
    }
  }
}

export function getIssue(slug: string): Issue {
  const issue = issues.find((item) => item.slug === slug);
  if (!issue) throw new Error(`Issue not found: ${slug}`);
  return issue;
}

export function getArtist(slug: string): Artist {
  const artist = artistBySlug.get(slug);
  if (!artist) throw new Error(`Artist not found: ${slug}`);
  return artist;
}

export function getTrackArtists(track: IssueTrack): Artist[] {
  return track.artistIds.map(getArtist);
}

export function getArtistNames(track: IssueTrack): string {
  return getTrackArtists(track)
    .map((artist) => artist.name)
    .join('、');
}

export function getArtistRecommendations(slug: string): Recommendation[] {
  return issues.flatMap((issue) =>
    issue.tracks
      .filter((track) => track.artistIds.includes(slug))
      .map((track) => ({ issue, track })),
  );
}
