import type { APIContext } from 'astro';
import { feedFor } from '../../i18n/feed';

export const GET = (context: APIContext) => feedFor('zh', context);
