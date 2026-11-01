# BaseLayout

[Source](../src/layouts/BaseLayout.astro). Wrap an Astro page in the shared HTML
shell, metadata, navigation, and footer.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Example" description="An example page.">
  <main>
    <h1>Example</h1>
    <p>Page content.</p>
  </main>
</BaseLayout>
```

| Prop | Required | Default or purpose |
| --- | --- | --- |
| `title` | No | Adds ` | SITE_TITLE`; when omitted, uses `SITE_TITLE` alone. |
| `description` | No | Falls back to `SITE_DESCRIPTION` when null or undefined. |
| `image` | No | Imported Astro image metadata passed to BaseHead. |
| `preview` | No | Boolean, default `false`, passed to BaseHead. |

The default slot holds page content between [Header](header.md) and
[Footer](footer.md). The layout does not insert a `<main>` around that content.
It sets the document language to English and the base theme to `bumblebee`.
Site title and description defaults live in [consts.ts](../src/consts.ts).
See [BaseHead](base-head.md) for metadata and analytics behavior.

A browser script cycles all `<hr>` elements through divider strokes `01`,
`02`, `03`, `05`, and `18`, in document order. The assets live in
`public/icons/dividers/`. It runs initially and on `astro:page-load`.
The visual divider styling is in `src/styles/custom.css`.
