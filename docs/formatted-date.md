# FormattedDate

[Source](../src/components/FormattedDate.astro). Render a date using the
site's US-English format and a machine-readable `<time>` element.

```astro
---
import FormattedDate from '../components/FormattedDate.astro';
---

<FormattedDate date={new Date('2026-10-31T12:00:00Z')} />
```

| Prop | Required | Value |
| --- | --- | --- |
| `date` | Yes | A valid JavaScript `Date` object, not a string. |

Visible output uses `en-us`, a short month, numeric day, and numeric year
(for example, `Oct 31, 2026`). The `datetime` attribute contains the full ISO
value. There are no slots or format options.

The blog schema converts frontmatter dates into `Date` objects, so callers
can pass `post.data.pubDate` directly. Formatting does not set a timezone;
it uses the build process's timezone, which can affect dates near midnight.

Used in the blog listing, tag pages, and [BlogPost](blog-post.md) layout.
