# How to create a post or story

1. Create a `.mdx` file in `src/content/blog/` for a post or `src/content/stories/` for a story. Use a lowercase, hyphenated filename such as `my-new-post.mdx`; it becomes `/blog/my-new-post/` or `/stories/my-new-post/`.
2. Start with this example. The block between `---` lines is frontmatter: the page's settings. Replace the title, description, date, and body with your own.

   ```mdx
   ---
   title: "My new post"
   description: "A short description of the post."
   pubDate: '2026-11-07'
   draft: true
   tags: [writing]
   ---

   Write the opening paragraph here.
   ```

3. Change or remove `tags` as needed. They create topic links automatically. Write below the closing `---`; no layout import is needed.
4. [Preview locally](preview-locally.md) and open the page at its URL. Drafts appear locally but stay out of the deployed site, feeds, and sitemap. To share a blog draft before publishing, see [Share a draft](share-a-draft.md).
5. When ready, set `draft: false` and [deploy changes](deploy-changes.md). Check the live page and its Blog or Stories listing. The date alone does not schedule publication.
