# BlogPost

[Source](../src/layouts/BlogPost.astro). The article layout used by public posts
and unlisted previews. It wraps [BaseLayout](base-layout.md) and supplies the
hero image, title, dates, tags, and article content.

Routes normally pass the blog entry's data and rendered content:

```astro
---
import { render } from 'astro:content';
import BlogPost from '../layouts/BlogPost.astro';

const { post } = Astro.props;
const { Content } = await render(post);
---

<BlogPost {...post.data}>
  <Content />
</BlogPost>
```

Adjust the import path for the route location. No layout import is needed
inside a normal blog MDX post; the blog route already supplies this wrapper.

| Prop | Required | Default or purpose |
| --- | --- | --- |
| `title` | Yes | Article heading and page title. |
| `description` | Yes | Page metadata description. |
| `pubDate` | Yes | JavaScript `Date`, usually coerced from frontmatter. |
| `updatedDate` | No | Date used for an optional last-updated line. |
| `heroImage` | No | Astro image metadata, usually resolved from frontmatter. |
| `tags` | No | String array, default `[]`; creates tag-page links. |
| `tagBasePath` | No | Defaults to `/blog/tags`; story routes use `/stories/tags`. |
| `preview` | No | Boolean, default `false`; forwarded to BaseLayout. |
| `showNewsletter` | No | Boolean, default `false`; adds the signup form after the body when this is not a preview. |
| `showSupport` | No | Boolean, default `false`; adds the Ko-fi button after the body when this is not a preview. |

Props use the article fields from the blog collection schema in
[content.config.ts](../src/content.config.ts), with optional tags, plus `preview`, `showNewsletter`, and `showSupport`.
Stories also use this layout. The `draft` and
`previewToken` fields determine visibility in routing code, not in this layout.
Setting `preview` here does not itself create an unlisted URL.

The default slot contains the article body. The hero uses Astro's `Image`
component with width 1020, height 510, and empty alt text. A divider separates
the heading area from the body. Dates use [FormattedDate](formatted-date.md).

The blog and story routes enable `showNewsletter` to show
[NewsletterSignup](newsletter-signup.md) after the article body. Draft previews
and other pages using this layout omit the signup form by default.
They also enable `showSupport` to place [KoFiButton](ko-fi-button.md) above the
signup form's divider. Draft previews and other pages omit the support button
by default.

Current behavior: the last-updated line only appears when
`updatedDate.getDate() > pubDate.getDate()`. This compares days of the month,
not full dates, so a later update in another month may not appear.

See [draft previews](draft-previews.md) for publishing and sharing rules.
