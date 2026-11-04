import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { READING_TITLE, getReadingWorks, getReadingFeedItems } from '../../../lib/reading';
import { SITE_TITLE } from '../../../consts';

export async function GET(context: APIContext) {
  const works = await getReadingWorks();
  return rss({
    title: `${SITE_TITLE} — ${READING_TITLE}`,
    description: 'Reading notes and updates by David Amos.',
    site: context.site!,
    items: getReadingFeedItems(works, context.site!),
  });
}
