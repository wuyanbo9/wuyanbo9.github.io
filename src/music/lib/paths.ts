/**
 * The weekly lives under one prefix on the main site. Every internal link in
 * the section goes through here, so the whole thing can be remounted by
 * changing this one constant.
 */
export const MUSIC_BASE = '/music';

export function musicHome(): string {
  return `${MUSIC_BASE}/`;
}

export function issuesUrl(): string {
  return `${MUSIC_BASE}/issues/`;
}

export function issueUrl(slug: string): string {
  return `${MUSIC_BASE}/issues/${slug}/`;
}

export function trackUrl(issueSlug: string, trackSlug: string): string {
  return `${issueUrl(issueSlug)}#${trackSlug}`;
}

export function artistsUrl(): string {
  return `${MUSIC_BASE}/artists/`;
}

export function artistUrl(slug: string): string {
  return `${MUSIC_BASE}/artists/${slug}/`;
}

export function playlistsUrl(): string {
  return `${MUSIC_BASE}/playlists/`;
}
