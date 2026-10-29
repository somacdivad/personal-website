import { getCollection } from 'astro:content';

// Keep drafts available in development, but omit them from production output.
export function getBlogPosts() {
	return getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
}
