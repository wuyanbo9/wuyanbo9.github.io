import type { APIContext } from 'astro';
import { blogFeed } from '../views/rss';

export const GET = (context: APIContext) => blogFeed(context, 'en');
