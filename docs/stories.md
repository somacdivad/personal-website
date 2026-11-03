# Stories

Add Markdown or MDX files to `src/content/stories/`.
Stories appear at `/stories/`, newest first.
Each file gets a page at `/stories/<file-name>/`, without its extension.

Start with this frontmatter:

```yaml
---
title: "Your story title"
description: "A short description of the story."
pubDate: 2026-11-02
draft: true
---
```

Write the story after the closing `---`.
The route supplies the site's article layout, so no layout import is needed.
Optional fields are `updatedDate` and `heroImage`.
Image paths are relative to the story file, as they are for blog posts.

Add `tags` to show topic filters on the Stories page:

```yaml
tags: [family, parenting]
```

The Stories page supports topic filtering and sorting by newest, oldest, or title.
Filter and sort choices stay in the URL, so you can share a view or use Back
and Forward to restore it.
Each topic also has a page at `/stories/tags/<tag>/`.
The toolbar's RSS link subscribes to the stories feed.

Drafts appear during local development.
Set `draft: false` or remove the field to publish a story on the next build.
Production builds omit drafts from the story list, story pages, RSS feeds, and sitemap.
The combined feed at `/rss.xml` includes blog posts and stories.
Use `/stories/rss.xml` for stories only or `/blog/rss.xml` for blog posts only.
All feeds list the newest items first.
The unlisted draft preview commands cover blog posts only.
