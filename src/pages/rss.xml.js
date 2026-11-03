import { getBlogPosts } from '../lib/blog';
import { getStories } from '../lib/stories';
import { getFeedItems } from '../lib/rss';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const [posts, stories] = await Promise.all([getBlogPosts(), getStories()]);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: getFeedItems([...posts, ...stories]),
	});
}
