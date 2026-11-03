# KoFiButton

[Source](../src/components/KoFiButton.astro). A support link for Ko-fi account
`R8L129YVR4`, with the label `Support me on Ko-fi` and Ko-fi's cup icon.

```astro
---
import KoFiButton from '../components/KoFiButton.astro';
---

<KoFiButton />
```

Adjust the import path for the file's location. The component has no props.
Change the label or account URL directly in the component.

The button uses the same fonts, theme colors, dimensions, and button styles as
Subscribe. Its background uses the heading ink color and its text uses the page
background color. Both colors follow light and dark themes through CSS.
The link works without JavaScript.

The component centers the button and adds spacing above it and a visible keyboard
focus outline. It omits the site's automatic external-link icon.

The blog route enables `showSupport` in [BlogPost](blog-post.md), placing this
button after the post body and above the newsletter signup divider. Draft
previews and other pages omit it by default.
