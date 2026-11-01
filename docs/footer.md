# Footer

[Source](../src/components/Footer.astro). Shared social links and copyright line.
[BaseLayout](base-layout.md) includes it automatically.

```astro
---
import Footer from '../components/Footer.astro';
---

<Footer />
```

There are no props or slots. Social destinations and icon names come from
`SOCIAL_LINKS` in [consts.ts](../src/consts.ts). Edit that array to update them.
Icons are rendered with `astro-icon`.

The copyright line names David Amos and uses `new Date().getFullYear()`.
Since the site is static, the displayed year changes when the site is rebuilt.

This is the page-wide footer. For attribution inside a quotation, see
[Markdown quote footers](markdown-quote-footers.md).
