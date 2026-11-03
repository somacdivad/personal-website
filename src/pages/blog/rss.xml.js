import rss from '@astrojs/rss';
import { getBlogPosts } from '../../lib/blog';
import { getFeedItems } from '../../lib/rss';
import { SITE_TITLE } from '../../consts';

export async function GET(context) {
	return rss({
		title: `${SITE_TITLE} — Blog`,
		description: 'Blog posts by David Amos.',
		site: context.site,
		items: getFeedItems(await getBlogPosts()),
	});
}
