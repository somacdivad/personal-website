import rss from '@astrojs/rss';
import { getStories } from '../../lib/stories';
import { getFeedItems } from '../../lib/rss';
import { SITE_TITLE } from '../../consts';

export async function GET(context) {
	return rss({
		title: `${SITE_TITLE} — Stories`,
		description: 'Stories by David Amos.',
		site: context.site,
		items: getFeedItems(await getStories()),
	});
}
