import type { CollectionEntry } from 'astro:content';

export function getFeedItems(entries: CollectionEntry<'blog' | 'stories'>[]) {
	return [...entries]
		.sort((a, b) => +b.data.pubDate - +a.data.pubDate)
		.map((entry) => ({
			...entry.data,
			link: `/${entry.collection}/${entry.id}/`,
		}));
}
