import { getCollection } from 'astro:content';

// Keep drafts available in development, but omit them from production output.
export function getStories() {
	return getCollection('stories', ({ data }) => import.meta.env.DEV || !data.draft);
}
