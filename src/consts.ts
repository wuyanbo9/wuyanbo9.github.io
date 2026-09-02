export const SITE_NAME = 'Yanbo Wu';
export const SITE_URL = 'https://wuyb.com';
export const SITE_DESCRIPTION = 'Personal site of Yanbo Wu.';

export const BLOG_TITLE = 'Writing';
export const BLOG_DESCRIPTION = 'Notes, essays, and things worth writing down.';

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
