# HeroWithFigure

[Source](../src/components/HeroWithFigure.astro). The home-page introduction
combines a greeting, portrait, short text, and optional button links.

```astro
---
import HeroWithFigure from '../components/HeroWithFigure.astro';
---

<HeroWithFigure
  greeting="Well, hello."
  figure={{ src: '/images/davidamos.jpg', alt: 'Portrait of David Amos' }}
  links={[{ text: 'Read the blog', href: '/blog', variant: 'secondary' }]}
>
  A short introduction with <em>emphasis</em>.
</HeroWithFigure>
```

| Prop | Required | Value |
| --- | --- | --- |
| `greeting` | Yes | String rendered as the page's `<h1>`. |
| `figure` | Yes | Object with `src` and `alt` strings for a plain `<img>`. |
| `links` | No | Array of objects with `text`, `href`, and optional `variant` strings. |

The default slot sits inside a paragraph, so supply text and inline markup,
not another paragraph or block-level section. `variant` becomes a DaisyUI
`btn-` class and defaults to `secondary`.

The portrait uses a squircle mask and a shadow. The hero stacks on smaller
screens; at the large breakpoint it places the portrait beside the text and
aligns the text to the left. Supply useful alt text and a browser-ready image
URL, such as a file in `public/images/` referenced as `/images/file.jpg`.

Existing use: [index.astro](../src/pages/index.astro).
