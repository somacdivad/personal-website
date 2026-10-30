# Draft previews

Put `draft: true` in a post's frontmatter. Drafts stay off the production blog,
tag pages, RSS feed, and sitemap.

To create an unlisted static preview:

```sh
npm run draft:share -- <file_name>
```

Use the file name relative to `src/content/blog`, without the extension.
The command adds a random `previewToken` to that draft and prints its production
preview URL. Repeating it returns the same link.

> [!WARNING]
> Tokens and draft text are stored publicly in this GitHub repo. This is not, nor
> was it intended to be a secure drafting and sharing sysem. It's just a simple
> way to share a page with someone before I make it public.

To replace or remove the preview link:

```sh
npm run draft:share -- <file_name> --rotate
npm run draft:unshare -- <file_name>
```

Build and deploy after enabling, editing, rotating, or removing a preview. Publishing
a post with `draft: false` removes its preview automatically on the next build, so you
don't need to run `draft:unshare`.

Previews use the same article layout, with `noindex` and no analytics. Anyone
with the link can read or forward it.

Run command tests with `node --test scripts/draft-sharing.test.mjs`.
