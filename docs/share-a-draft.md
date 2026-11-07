# How to share a draft

This feature supports blog posts only. Draft text and tokens are public in this repo; unlisted links are not private, and anyone can forward them.

1. Set `draft: true` in the blog post's frontmatter. [Preview locally](preview-locally.md) to check it.
2. From the repository root, run this command, replacing `my-new-post` with the filename relative to `src/content/blog/`, without `.mdx` or `.md`:

   ```sh
   npm run draft:share -- my-new-post
   ```

   The command adds a `previewToken` to the file and prints the production URL. Running it again returns the same link.
3. [Deploy changes](deploy-changes.md), including the edited frontmatter. Open the printed URL on the live site before sending it. The draft stays out of public listings, feeds, and the sitemap.
4. To update the shared text, edit the post and deploy again. To replace the link, run `npm run draft:share -- my-new-post --rotate`, deploy, and check that the new URL works and the old one no longer does.
5. To stop sharing, run `npm run draft:unshare -- my-new-post` and deploy. Check that the old URL no longer works.
6. To publish, set `draft: false` and deploy. Check the normal blog URL; the preview route disappears automatically, so you do not need to unshare first.
