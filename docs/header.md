# Header

[Source](../src/components/Header.astro). Shared site navigation and theme toggle.
[BaseLayout](base-layout.md) includes it automatically.

```astro
---
import Header from '../components/Header.astro';
---

<Header />
```

There are no props or slots.
The brand links home.
Navigation contains Home, About me, Blog, and Stories, in that order.
About me opens two links: My philosophy at `/about/philosophy/` and What I'm reading at `/about/reading/`.
It has no destination page of its own.

The items are defined once in Header and rendered by [HeaderLinks](../src/components/HeaderLinks.astro) for both desktop and mobile.
Desktop uses a horizontal menu.
Mobile uses a hamburger disclosure with a nested About me disclosure.
Both start closed and work without JavaScript.
Click, touch, Enter, or Space toggles a disclosure; hovering does not open one.

A small script closes disclosures on outside clicks or when keyboard focus leaves them.
Escape closes the innermost open disclosure and returns focus to its summary.
Closing the mobile menu also closes About me.
Page loads and changes between mobile and desktop reset the disclosures.

Current links and the active About me group use an underline and stronger text weight.
Exact links have `aria-current="page"`; links to the current section on a descendant page have `aria-current="location"`.
The About me trigger has no `aria-current` because it is not a page.

The checkbox theme controller selects DaisyUI's `dracula` dark theme. When
unchecked, the base layout's `bumblebee` light theme applies. The inline script
stores and restores the checkbox state under the localStorage key
`themeToggleChecked`. Sun and moon icons come from `astro-icon` and the site's
`src/icons/ui/` directory. The component does not expose a theme prop.

Permanent redirects from the old `/philosophy` and `/reading/` URLs are configured in `vercel.json`.
They run on Vercel, not in Astro's local preview.
