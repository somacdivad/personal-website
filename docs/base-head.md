# BaseHead

[Source](../src/components/BaseHead.astro). Add shared metadata inside a page's
`<head>`. Normally [BaseLayout](base-layout.md) calls it for you.

```astro
---
import BaseHead from '../components/BaseHead.astro';
---

<head>
  <BaseHead title="A page title" description="A short page description." />
</head>
```

| Prop | Required | Default or purpose |
| --- | --- | --- |
| `title` | Yes | String used for the document title and title metadata. |
| `description` | Yes | String used for description metadata. |
| `image` | No | Imported Astro `ImageMetadata`; defaults to `src/assets/social-image.png`. |
| `preview` | No | Boolean, default `false`; controls preview metadata and analytics. |
| `noindex` | No | Boolean, default `false`; adds the robots directive used to keep utility pages out of search results. |

This component imports the global custom stylesheet. It includes favicon,
sitemap, RSS, generator, and profile links.
RSS links advertise the combined feed at `/rss.xml`, the blog feed at
`/blog/rss.xml`, and the stories feed at `/stories/rss.xml`.
Normal pages also get a canonical
URL, Open Graph and Twitter metadata, and Vercel Analytics. The canonical URL
uses the current pathname and the configured production `site` URL.

With `noindex={true}`, it adds `noindex, nofollow, noimageindex` robots metadata
while keeping the normal canonical URL, social metadata, and analytics.
This flag does not itself remove a page from the sitemap; configure that in
`astro.config.mjs`.

With `preview={true}`, it omits canonical and social metadata and Analytics,
and adds:

```html
<meta name="robots" content="noindex, nofollow, noimageindex" />
<meta name="referrer" content="no-referrer" />
```

The title and description remain in preview HTML. This flag does not control
route generation or make a page private; see [draft previews](draft-previews.md).
There are no slots. Do not pass a bare image URL as `image`.
